import { Request, Response } from "express";
import { dataSource } from "../../../shared/infra/dataSource";

import { Post } from "../entities/Post";
import { User } from "../../users/entities/User";
import { Comment } from "../entities/Comment";

import AppError from "../../../shared/utils/AppError";
import buildTree from "../../../shared/utils/buildTree";

export default class CommentsController {
    public async createForPost(request: Request, response: Response): Promise<Response> {
        const postsRepository = dataSource.getRepository(Post);
        const usersRepository = dataSource.getRepository(User)
        const commentsRepository = dataSource.getRepository(Comment);

        const { postId } = request.params
        const { content } = request.body
        const media = request.file?.filename;

        const post = await postsRepository.findOne({ where: { id: postId } })
        if(!post) throw new AppError("Post não encontrado")

        if(!response.locals.userId) throw new AppError("Erro ao Processar Requisição", 422)

        const user = await usersRepository.findOne({
            where: { id: response.locals.userId },
        });

        if(!user) throw new AppError("Usuário não encontrado")

        const comment = commentsRepository.create({
            content,
            media,
            author: user,
            post
        })

        await commentsRepository.save(comment)

        return response.json({ content, media, id: comment.id })
    }

    public async createReply(request: Request, response: Response): Promise<Response> {
        const usersRepository = dataSource.getRepository(User)
        const commentsRepository = dataSource.getRepository(Comment);

        const { commentId } = request.params
        const { content } = request.body
        const media = request.file?.filename;

        const comment = await commentsRepository.findOne({ 
            where: { id: commentId },
            relations: { post: true }
        })
        if(!comment) throw new AppError("Comentário não encontrado")

        if(!response.locals.userId) throw new AppError("Erro ao Processar Requisição", 422)

        const user = await usersRepository.findOne({
            where: { id: response.locals.userId },
        });

        if(!user) throw new AppError("Usuário não encontrado")

        const reply = commentsRepository.create({
            content,
            media,
            author: user,
            post: comment.post,
            parent: comment
        })

        await commentsRepository.save(reply)

        return response.json({ content, media, id: reply.id })
    }

    public async show(request: Request, response: Response): Promise<Response> {
        const commentsRepository = dataSource.getRepository(Comment);

        const { postId } = request.params

        const comments = await commentsRepository
        .createQueryBuilder("comment")
        .where("comment.postId = :postId", { postId })
        .loadRelationCountAndMap("comment.likeCount", "comment.likes")
        .getMany()

        return response.json(buildTree(comments))
    }
    
    public async remove(request: Request, response: Response): Promise<Response> {
        const commentsRepository = dataSource.getRepository(Comment)

        const { commentId } = request.params

        const comment = await commentsRepository.findOne({ 
            where: { id: commentId },
            relations: { author: true }
        });

        if(!comment) throw new AppError("Post não encontrado")

        if(!response.locals.userId) throw new AppError("Erro ao Processar Requisição", 422)

        if(response.locals.userId !== comment.author.id) throw new AppError("Sem Permissão", 401)

        await commentsRepository.remove(comment)

        return response.json({ message: "Comentário Removido" })
    }
}