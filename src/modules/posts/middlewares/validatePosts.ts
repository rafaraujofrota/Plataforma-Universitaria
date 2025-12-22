import { NextFunction, Request, Response } from "express";
import AppError from "../../../shared/utils/AppError";

export function validatePost(req: Request, res: Response, next: NextFunction) {
    if (!req.body) throw new AppError("Body Inválido") 

    const { tags, content } = req.body;

    if (tags) {
        let tagArray

        try {
            tagArray = JSON.parse(tags)
        } catch(err) {
            throw new AppError("Erro ao processar Tags")
        }

        if (!Array.isArray(tagArray)) throw new AppError("Tags inválida")
        if (tagArray.length > 10) throw new AppError("Máximo de 10 Tags por Post")
        for (const item of tagArray) {
            if(typeof item !== "string") throw new AppError("Tags possuem dados inválidos")
        }
    }

    if (typeof content !== "string" || content.length < 2 || content.length > 1000) 
        throw new AppError("Conteúdo com tipo ou tamanho inválido")

    next();
}