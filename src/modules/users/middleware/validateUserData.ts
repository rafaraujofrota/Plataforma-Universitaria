import { Request, Response, NextFunction } from "express";
import AppError from "../../../shared/utils/AppError";

export function validateUserData(req: Request, res: Response, next: NextFunction) {
    if (!req.body) throw new AppError("Body Inválido") 

    const { name, email, password } = req.body;

    if (typeof name !== "string" || name.trim().length < 3) 
        throw new AppError("Nome Inválido ou Curto")

    const emailRegex = /^[^@]+@[^@]+\.[^@]+$/;
    if (typeof email !== "string" || !emailRegex.test(email)) 
        throw new AppError("Email Inválido")

    if (typeof password !== "string" || password.length < 6) 
        throw new AppError("Senha Inválida ou Curto")

    next();
}

export function validateSession(req: Request, res: Response, next: NextFunction) {
    if (!req.body) throw new AppError("Body Inválido") 

    const { email, password } = req.body;

    if (!email || typeof email !== "string") 
        throw new AppError("Nome Inválido")

    if (!password || typeof password !== "string") 
        throw new AppError("Senha Inválida")

    next();
}

export function validateProfile(req: Request, res: Response, next: NextFunction) {
    if (!req.body) throw new AppError("Body Inválido") 

    const { name } = req.body;

    if (typeof name !== "string" || name.trim().length < 3) 
        throw new AppError("Nome Inválido ou Curto")

    next();
}