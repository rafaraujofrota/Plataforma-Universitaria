import { Request, Response } from "express";

import { Post } from "../entities/Post";
import { User } from "../../users/entities/User";
import { Comment } from "../entities/Comment";

import AppError from "../../../shared/utils/AppError";
import buildTree from "../../../shared/utils/buildTree";

import { Repository } from "typeorm";
import { dataSource } from "../../../shared/infra/dataSource";

interface CommentData extends Comment {
    liked: true
}

export default class CommentsController {
    protected postsRepository: Repository<Post>
    protected usersRepository: Repository<User>
    protected commentsRepository: Repository<Comment>

    constructor() {
        this.postsRepository = dataSource.getRepository(Post)
        this.usersRepository = dataSource.getRepository(User)
        this.commentsRepository = dataSource.getRepository(Comment);
    }

    public async createForPost(request: Request, response: Response): Promise<Response> {
        const { postId } = request.params
        const { content } = request.body
        const media = request.file?.filename;

        const post = await this.postsRepository.findOne({ where: { id: postId } })
        if(!post) throw new AppError("Post não encontrado")

        if(!response.locals.userId) throw new AppError("Erro ao Processar Requisição", 422)

        const user = await this.usersRepository.findOne({
            where: { id: response.locals.userId },
        });

        if(!user) throw new AppError("Usuário não encontrado")

        const comment = this.commentsRepository.create({
            content,
            media,
            author: user,
            post
        })

        await this.commentsRepository.save(comment)

        return response.json({ content, media, id: comment.id })
    }

    public async createReply(request: Request, response: Response): Promise<Response> {
        const { commentId } = request.params
        const { content } = request.body
        const media = request.file?.filename;

        const comment = await this.commentsRepository.findOne({ 
            where: { id: commentId },
            relations: { post: true }
        })
        if(!comment) throw new AppError("Comentário não encontrado")

        if(!response.locals.userId) throw new AppError("Erro ao Processar Requisição", 422)

        const user = await this.usersRepository.findOne({
            where: { id: response.locals.userId },
        });

        if(!user) throw new AppError("Usuário não encontrado")

        const reply = this.commentsRepository.create({
            content,
            media,
            author: user,
            post: comment.post,
            parent: comment
        })

        await this.commentsRepository.save(reply)

        return response.json({ content, media, id: reply.id })
    }

    public async show(request: Request, response: Response): Promise<Response> {
        const { postId } = request.params

        const commentsQuery = this.commentsRepository.createQueryBuilder("comments")
        .where("comments.postId = :postId", { postId })
        /// Pegar dados do Usuário
        .leftJoin("comments.author", "author")
        .leftJoin("author.profile", "profile")
        .addSelect([
            "author.id",
            "author.name",
            "profile.avatar",
        ])
        /// Pegar quantidades de Likes
        .loadRelationCountAndMap("comments.likeCount", "comments.likes")
        /// Ver se o usuário logado curtiu
        .addSelect(subQuery => (
            subQuery.select("COUNT(like.id) > 0")
            .from("likes", "like")
            .where("like.commentId = comments.id")
            .andWhere("like.userId = :userId", { userId: response.locals.userId })
        ), "liked")

        const { raw, entities } = await commentsQuery.getRawAndEntities(); 

        const comments = entities.map((c, i): CommentData => ({ liked: raw[i].liked, ...c }))

        return response.json(buildTree(comments))
    }
    
    public async remove(request: Request, response: Response): Promise<Response> {
        const { commentId } = request.params

        const comment = await this.commentsRepository.findOne({ 
            where: { id: commentId },
            relations: { author: true }
        });

        if(!comment) throw new AppError("Post não encontrado")

        if(!response.locals.userId) throw new AppError("Erro ao Processar Requisição", 422)

        if(response.locals.userId !== comment.author.id) throw new AppError("Sem Permissão", 401)

        await this.commentsRepository.remove(comment)

        return response.json({ message: "Comentário Removido" })
    }
}