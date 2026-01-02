import { NextFunction, Request, Response } from "express";
import AppError from "../utils/AppError";

import { User } from "../../modules/users/entities/User";
import { dataSource } from "../infra/dataSource";

import { PERMISSIONS } from "../utils/Permissions";

function checkPermission(Permission: PERMISSIONS) {
    return async (request: Request, response: Response, next: NextFunction) => {
        if(!response.locals.userId) throw new AppError("Erro ao Processar Requisição", 422)

        const userRepository = dataSource.getRepository(User)
        const user = await userRepository.findOne({ where: { id: response.locals.userId }})

        if(!user) throw new AppError("Usuário não encontrado")
        
        const permList = user.permissions
        const hasPermission = permList.includes(Permission) || permList.includes(PERMISSIONS.ALL)

        if(!hasPermission) throw new AppError("Sem permissão", 403)

        next()
    }
}

export default checkPermission