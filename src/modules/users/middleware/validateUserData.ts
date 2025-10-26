import { Request, Response, NextFunction } from "express";
import AppError from "../../../shared/utils/AppError";

export default function validateUserData(req: Request, res: Response, next: NextFunction) {
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