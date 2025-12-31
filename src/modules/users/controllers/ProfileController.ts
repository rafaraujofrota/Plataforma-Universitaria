import { Request, Response } from "express";
import { User } from "../entities/User";

import AppError from "../../../shared/utils/AppError";
import deleteFile from "../../../shared/utils/deleteFile";

import { dataSource } from "../../../shared/infra/dataSource";
import { Repository } from "typeorm";

export default class ProfileController {
    protected usersRepository: Repository<User>

    constructor() {
        this.usersRepository = dataSource.getRepository(User)
    }

    public async show(request: Request, response: Response): Promise<Response> {
        const user = await this.usersRepository.findOne({
            where: { id: response.locals.userId },
            relations: { profile: true }
        });

        if(!user) throw new AppError("Usuário não encontrado!", 404) 

        const { password:_ , id:__ , ...userSafeData } = user

        return response.json(userSafeData);
    }

    public async update(request: Request, response: Response): Promise<Response> {
        // Só cai aqui se alguém modificar o UserRoutes e mover o CheckAuthentication
        if(!response.locals.userId) throw new AppError("Erro ao Processar Requisição", 422)

        const user = await this.usersRepository.findOne({
            where: { id: response.locals.userId },
            relations: { profile: true }
        });

        if(!user) throw new AppError("Usuário não encontrado!", 404) 

        const { name, bio, course, type, registration, organization } = request.body;
        const avatar = request.file?.filename;

        if (name) user.name = name;
        if (bio) user.profile.bio = bio;
        if (course) user.profile.course = course;
        if (registration) user.profile.registration = registration
        if (type) user.profile.type = type
        if (organization) user.profile.organization = organization

        if (avatar) {
            if(user.profile.avatar) await deleteFile(user.profile.avatar)
            user.profile.avatar = avatar;
        }

        await this.usersRepository.save(user);

        const { password:_ , id:__ , ...userSafeData } = user

        return response.json(userSafeData);
    }
}