import { Request, Response } from "express";

import { Like } from "../entities/Likes";
import { Post } from "../entities/Post";
import { Comment } from "../entities/Comment";

import { Repository } from "typeorm";
import { dataSource } from "../../../shared/infra/dataSource";
import AppError from "../../../shared/utils/AppError";

export default class LikesController {
    protected likesRepository: Repository<Like>
    protected postsRepository: Repository<Post>
    protected commentsRepository: Repository<Comment>

    constructor() {
        this.likesRepository = dataSource.getRepository(Like)
        this.postsRepository = dataSource.getRepository(Post)
        this.commentsRepository = dataSource.getRepository(Comment)
    }

    public async toggleLikeComment(request: Request, response: Response): Promise<Response> {
        if(!response.locals.userId) throw new AppError("Erro ao Processar Requisição", 422)

        const { commentId } = request.params

        const comment = await this.commentsRepository.findOne({
            where: { id: commentId }
        })

        if(!comment) throw new AppError("Comentário não encontrado")

        const like = await this.likesRepository.findOne({
            where: { user: { id: response.locals.userId }, comment: { id: commentId } }
        })

        if(like) {
            await this.likesRepository.remove(like)

            return response.json({ message: "Like Removido"})
        } 

        // Like só guarda ids, então por isso é necessário o Insert invés do Create
        await this.likesRepository.insert({
            user: { id: response.locals.userId }, 
            comment: { id: commentId },
        })
        
        return response.json({ message: "Like Adicionado"}) 
    }

    public async toggleLikePost(request: Request, response: Response): Promise<Response> {
        if(!response.locals.userId) throw new AppError("Erro ao Processar Requisição", 422)

        const { postId } = request.params

        const post = await this.postsRepository.findOne({
            where: { id: postId }
        })

        if(!post) throw new AppError("Post não encontrado")

        const like = await this.likesRepository.findOne({
            where: { user: { id: response.locals.userId }, post: { id: postId } }
        })

        if(like) {
            await this.likesRepository.remove(like)

            return response.json({ message: "Like Removido"})
        } 

        await this.likesRepository.insert({
            user: { id: response.locals.userId }, 
            post: { id: postId }
        })

        return response.json({ message: "Like Adicionado"}) 
    }
}