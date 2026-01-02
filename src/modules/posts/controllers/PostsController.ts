import { Request, Response } from "express";
import { Post } from "../entities/Post";
import { User } from "../../users/entities/User";

import AppError from "../../../shared/utils/AppError";

import { Repository } from "typeorm";
import { dataSource } from "../../../shared/infra/dataSource";

interface PostData extends Post {
    liked: boolean;
}

export default class PostsController {
    protected postsRepository: Repository<Post>
    protected usersRepository: Repository<User>

    constructor() {
        this.postsRepository = dataSource.getRepository(Post);
        this.usersRepository = dataSource.getRepository(User);
    }

    public async create(request: Request, response: Response): Promise<Response> {
        const media = request.file?.filename;
        const { content, tags } = request.body;

        if(!response.locals.userId) throw new AppError("Erro ao Processar Requisição", 422)

        const user = await this.usersRepository.findOne({
            where: { id: response.locals.userId },
        });

        if(!user) throw new AppError("Usuário não encontrado")

        const post = this.postsRepository.create({
            content,
            media,
            tags: JSON.parse(tags),
            author: user
        })

        await this.postsRepository.save(post)

        return response.json({content: post.content, tags: post.tags, media: post.media})
    }

    public async remove(request: Request, response: Response): Promise<Response> {
        const { id } = request.params

        const post = await this.postsRepository.findOne({ 
            where: { id },
            relations: { author: true }
        });

        if(!post) throw new AppError("Post não encontrado")

        if(!response.locals.userId) throw new AppError("Erro ao Processar Requisição", 422)

        if(response.locals.userId !== post.author.id) throw new AppError("Sem Permissão", 403)

        await this.postsRepository.remove(post)

        return response.json({ message: "Post Removido" })
    }

    public async list(request: Request, response: Response): Promise<Response> {
        if(!response.locals.userId) throw new AppError("Erro ao Processar Requisição", 422)

        const postsQuery = this.postsRepository.createQueryBuilder("posts")
        .leftJoin("posts.author", "author")
        .where("author.id = :userId", { userId: response.locals.userId })
        .loadRelationCountAndMap("posts.likesCount", "posts.likes")
        .addSelect(subQuery => (
            subQuery.select("COUNT(like.id) > 0")
            .from("likes", "like")
            .where("like.postId = posts.id")
            .andWhere("like.userId = :userId", { userId: response.locals.userId })
        ), "liked")

        const { raw, entities } = await postsQuery.getRawAndEntities(); 

        const posts = entities.map((p, i): PostData => ({ liked: raw[i].liked, ...p }))

        return response.json(posts)
    }

    public async listAll(request: Request, response: Response): Promise<Response> {
        if(!response.locals.userId) throw new AppError("Erro ao Processar Requisição", 422)
    
        const postsQuery = this.postsRepository.createQueryBuilder("posts")
        /// Pegar dados do usuário
        .leftJoin("posts.author", "author")
        .leftJoin("author.profile", "profile")
        .addSelect([
            "author.id",
            "author.name",
            "profile.avatar",
        ])
        /// Pegar quantidade de Likes
        .loadRelationCountAndMap("posts.likesCount", "posts.likes")
        /// Ver se usuário logado curtiu
        .addSelect(subQuery => (
            subQuery.select("COUNT(like.id) > 0")
            .from("likes", "like")
            .where("like.postId = posts.id")
            .andWhere("like.userId = :userId", { userId: response.locals.userId })
        ), "liked")

        const { raw, entities } = await postsQuery.getRawAndEntities(); 

        const posts = entities.map((p, i): PostData => ({ liked: raw[i].liked, ...p }))

        return response.json(posts)   
    }
}