import { Request, Response, NextFunction } from "express";
import AppError from "../../../shared/utils/AppError";

import { announcementsTypes } from "../entities/Announcements";

export function validateAnnouncementsCreate(req: Request, res: Response, next: NextFunction) {
    if (!req.body) throw new AppError("Body Inválido") 

    const { name, type, description, link, start, end } = req.body;

    if (typeof name !== "string" || name.trim().length < 3) 
        throw new AppError("Nome Inválido ou Curto")

    if(!announcementsTypes.includes(type)) throw new AppError("Tipo Inválido")

    if (typeof description !== "string" || description.trim().length < 3) 
        throw new AppError("Descrição Inválida ou Curta")

    if (link) {
        if(typeof link !== "string" || link.trim().length < 3) 
            throw new AppError("Link Inválido")

        try {
            new URL(link)
        } catch(e) {
            throw new AppError("Link Inválido")
        }
    }

    if(start) {
        const startDate = new Date(start)
    
        if(isNaN(startDate.getTime())) throw new AppError("Data Inicial Inválida")
    
        if(end) {
            const endDate = new Date(end)
    
            if(isNaN(endDate.getTime())) throw new AppError("Data Final Inválida")

            if(startDate.getTime() >= endDate.getTime()) {
                throw new AppError("Data Inicial Inválida")
            }
        }    
    } else if(end) throw new AppError("Data Final exige uma Data Inicial")

    next();
}

export function validateAnnouncementsUpdate(req: Request, res: Response, next: NextFunction) {
    if (!req.body) throw new AppError("Body Inválido") 

    const { description, link, start, end } = req.body;

    if (description && (typeof description !== "string" || description.trim().length < 3)) 
        throw new AppError("Descrição Inválida ou Curta")

    if (link) {
        if(typeof link !== "string" || link.trim().length < 3) 
            throw new AppError("Link Inválido")

        try {
            new URL(link)
        } catch(e) {
            throw new AppError("Link Inválido")
        }
    }

    if(start) {
        const startDate = new Date(start)
    
        if(isNaN(startDate.getTime())) throw new AppError("Data Inicial Inválida")
    
        if(end) {
            const endDate = new Date(end)
    
            if(isNaN(endDate.getTime())) throw new AppError("Data Final Inválida")

            if(startDate.getTime() >= endDate.getTime()) {
                throw new AppError("Data Inicial Inválida")
            }
        }    
    } else if(end) throw new AppError("Data Final exige uma Data Inicial")

    next();
}
