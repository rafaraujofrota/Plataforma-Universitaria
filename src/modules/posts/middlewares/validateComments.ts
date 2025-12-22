import { NextFunction, Request, Response } from "express";
import AppError from "../../../shared/utils/AppError";

export function validateComment(req: Request, res: Response, next: NextFunction) {
    if (!req.body) throw new AppError("Body Inválido") 

    const { content } = req.body;

    if (typeof content !== "string" || content.length < 2 || content.length > 1000) 
        throw new AppError("Conteúdo com tipo ou tamanho inválido")

    next();
}