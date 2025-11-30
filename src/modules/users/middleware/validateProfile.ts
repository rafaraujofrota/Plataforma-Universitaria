import { Request, Response, NextFunction } from "express";
import AppError from "../../../shared/utils/AppError";

import { profileTypes } from "../entities/Profile";

export function validateProfile(req: Request, res: Response, next: NextFunction) {
    if (!req.body) throw new AppError("Body Inválido") 

    const { name, bio, course, registration, type  } = req.body;

    if(type) {
        if(type == "admin" || !profileTypes.includes(type)) throw new AppError("Tipo Inválido")
    }

    if (name && (typeof name !== "string" || name.trim().length < 3)) 
        throw new AppError("Nome Inválido ou Curto")

    if (bio && typeof bio !== "string")
        throw new AppError("Bio Inválida")

    if (course && typeof course !== "string")
        throw new AppError("Curso Inválida")

    if(registration) {
        const isNumber = /^\d+$/.test(registration) 
        if (!isNumber || registration.length != 6)
            throw new AppError("Matrícula Inválida")
    }

    next();
}