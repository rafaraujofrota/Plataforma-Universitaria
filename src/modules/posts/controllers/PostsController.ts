import { Request, Response } from "express";
import { Post } from "../entities/Post";
import { User } from "../../users/entities/User";

import AppError from "../../../shared/utils/AppError";

import { Repository } from "typeorm";
import { dataSource } from "../../../shared/infra/dataSource";

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
            user
        })

        await this.postsRepository.save(post)

        return response.json({content: post.content, tags: post.tags, media: post.media})
    }

    public async remove(request: Request, response: Response): Promise<Response> {
        const { id } = request.params

        const post = await this.postsRepository.findOne({ 
            where: { id },
            relations: { user: true }
        });

        if(!post) throw new AppError("Post não encontrado")

        if(!response.locals.userId) throw new AppError("Erro ao Processar Requisição", 422)

        if(response.locals.userId !== post.user.id) throw new AppError("Sem Permissão", 401)

        await this.postsRepository.remove(post)

        return response.json({ message: "Post Removido" })
    }

    public async list(request: Request, response: Response): Promise<Response> {
        if(!response.locals.userId) throw new AppError("Erro ao Processar Requisição", 422)

        const posts = await this.postsRepository
        .createQueryBuilder("posts")
        .leftJoin("posts.user", "user")
        .where("user.id = :userId", { userId: response.locals.userId })
        .loadRelationCountAndMap("posts.likesCount", "posts.likes")
        .getMany();

        return response.json(posts)
    }

    public async listAll(request: Request, response: Response): Promise<Response> {
        const posts = await this.postsRepository
        .createQueryBuilder("posts")
        .loadRelationCountAndMap("posts.likesCount", "posts.likes")
        .getMany();

        return response.json(posts)   
    }
}