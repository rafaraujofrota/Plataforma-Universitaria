import { Request, Response } from "express";
import { dataSource } from "../../../shared/infra/dataSource";
import { Post } from "../entities/Post";
import { User } from "../../users/entities/User";

import AppError from "../../../shared/utils/AppError";

export default class PostsController {
    public async create(request: Request, response: Response): Promise<Response> {
        const postsRepository = dataSource.getRepository(Post);
        const usersRepository = dataSource.getRepository(User)

        const media = request.file?.filename;
        const { content, tags } = request.body;

        if(!response.locals.userId) throw new AppError("Erro ao Processar Requisição", 422)

        const user = await usersRepository.findOne({
            where: { id: response.locals.userId },
        });

        if(!user) throw new AppError("Usuário não encontrado")

        const post = postsRepository.create({
            content,
            media,
            tags: JSON.parse(tags),
            user
        })

        await postsRepository.save(post)

        return response.json({content: post.content, tags: post.tags, media: post.media})
    }

    public async remove(request: Request, response: Response): Promise<Response> {
        const postsRepository = dataSource.getRepository(Post)

        const { id } = request.params

        const post = await postsRepository.findOne({ 
            where: { id },
            relations: { user: true }
        });

        if(!post) throw new AppError("Post não encontrado")

        if(!response.locals.userId) throw new AppError("Erro ao Processar Requisição", 422)

        if(response.locals.userId !== post.user.id) throw new AppError("Sem Permissão", 401)

        await postsRepository.remove(post)

        return response.json({ message: "Post Removido" })
    }

    public async list(request: Request, response: Response): Promise<Response> {
        const postsRepository = dataSource.getRepository(Post)

        if(!response.locals.userId) throw new AppError("Erro ao Processar Requisição", 422)

        const posts = await postsRepository
        .createQueryBuilder("posts")
        .leftJoin("posts.user", "user")
        .where("user.id = :userId", { userId: response.locals.userId })
        .loadRelationCountAndMap("posts.likesCount", "posts.likes")
        .getMany();

        return response.json(posts)
    }

    public async listAll(request: Request, response: Response): Promise<Response> {
        const postsRepository = dataSource.getRepository(Post)

        const posts = await postsRepository
        .createQueryBuilder("posts")
        .loadRelationCountAndMap("posts.likesCount", "posts.likes")
        .getMany();

        return response.json(posts)   
    }
}