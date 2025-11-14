import { Request, Response } from "express";
import { dataSource } from "../../../shared/infra/dataSource";
import { User } from "../entities/User";

import AppError from "../../../shared/utils/AppError";
import deleteFile from "../../../shared/utils/deleteFile";

export default class ProfileController {
    public async show(request: Request, response: Response): Promise<Response> {
        const usersRepository = dataSource.getRepository(User);

        const user = await usersRepository.findOne({
            where: { id: response.locals.userId }
        });

        if(!user) throw new AppError("Usuário não encontrado!", 404) 

        const { password:_ , id:__ , ...userSafeData } = user

        return response.json(userSafeData);
    }

    public async update(request: Request, response: Response): Promise<Response> {
        const usersRepository = dataSource.getRepository(User);

        // Só cai aqui se alguém modificar o UserRoutes e mover o CheckAuthentication
        if(!response.locals.userId) throw new AppError("Erro ao Processar Requisição", 422)

        const user = await usersRepository.findOne({
            where: { id: response.locals.userId }
        });

        if(!user) throw new AppError("Usuário não encontrado!", 404) 

        const { name } = request.body;
        const avatar = request.file?.filename;

        
        if (name) user.name = name;
        if (avatar) {
            if(user.avatar) await deleteFile(user.avatar)
            user.avatar = avatar;
        }

        await usersRepository.save(user);

        const { password:_ , id:__ , ...userSafeData } = user

        return response.json(userSafeData);
    }
}