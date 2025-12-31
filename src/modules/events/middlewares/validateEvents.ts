import { Request, Response, NextFunction } from "express";
import AppError from "../../../shared/utils/AppError";

export function validateEventCreate(req: Request, res: Response, next: NextFunction) {
    if (!req.body) throw new AppError("Body Inválido") 

    const { location, name, description } = req.body;
    const { accountable, duration, start } = req.body;

    if (typeof name !== "string" || name.trim().length < 3) 
        throw new AppError("Nome Inválido ou Curto")

    if (typeof location !== "string" || location.trim().length < 3) 
        throw new AppError("Localização Inválida ou Curta")

    if (typeof description !== "string" || description.trim().length < 3) 
        throw new AppError("Descrição Inválida ou Curta")

    if (typeof accountable !== "string" || accountable.trim().length < 3) 
        throw new AppError("Nome do Responsável Inválido ou Curto")

    const startDate = new Date(start)

    if(isNaN(startDate.getTime())) throw new AppError("Data Inválida")

    if(startDate.getTime() <= Date.now()) throw new AppError("Data Inválida")

    if(!duration) throw new AppError("Duração Inválida")

    const isNumRegex = /^\d+$/

    if(!isNumRegex.test(duration)) throw new AppError("Duração Inválida")

    if(Number(duration) < 5) throw new AppError("Duração Muito Baixa")

    next();
}

export function validateEventUpdate(req: Request, res: Response, next: NextFunction) {
    if (!req.body) throw new AppError("Body Inválido") 

    const { location, description, accountable, duration, start } = req.body;

    if (location && (typeof location !== "string" || location.trim().length < 3)) 
        throw new AppError("Localização Inválida ou Curta")

    if (description && (typeof description !== "string" || description.trim().length < 3)) 
        throw new AppError("Descrição Inválida ou Curta")

    if (accountable && (typeof accountable !== "string" || accountable.trim().length < 3)) 
        throw new AppError("Nome do Responsável Inválido ou Curto")

    if(start) {
        const startDate = new Date(start)
    
        if(isNaN(startDate.getTime())) throw new AppError("Data Inválida")
    
        if(startDate.getTime() <= Date.now()) throw new AppError("Data Inválida")
    }

    if(duration) {
        const isNumRegex = /^\d+$/
    
        if(!isNumRegex.test(duration)) throw new AppError("Duração Inválida")
    
        if(Number(duration) < 5) throw new AppError("Duração Muito Baixa")
    }

    next();
}
