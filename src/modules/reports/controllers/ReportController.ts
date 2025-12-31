import { Request, Response } from "express";

import { Repository } from "typeorm";
import { dataSource } from "../../../shared/infra/dataSource";

import { Report } from "../entities/Report";
import { User } from "../../users/entities/User";

import AppError from "../../../shared/utils/AppError";

export default class ReportsController {
    protected reportsRepository: Repository<Report>
    protected usersRepository: Repository<User>

    constructor() {
        this.reportsRepository = dataSource.getRepository(Report)
        this.usersRepository = dataSource.getRepository(User)
    }

    public async create(request: Request, response: Response): Promise<Response> {
        const { name, type, description, link, start, end } = request.body;

        if(!response.locals.userId) throw new AppError("Erro ao Processar Requisição", 422)

        const user = await this.usersRepository.findOne({
            where: { id: response.locals.userId },
        });

        if(!user) throw new AppError("Usuário não encontrado")

        const report = this.reportsRepository.create({
            name,
            link,
            type,
            description,
            start,
            end,
            user: { id: user.id },
        })

        await this.reportsRepository.save(report)

        return response.json(report)
    }

    public async update(request: Request, response: Response): Promise<Response> {
        if(!response.locals.userId) throw new AppError("Erro ao Processar Requisição", 422)

        const { id } = request.params
            
        const report = await this.reportsRepository.findOne({
            where: { id },
            relations: { user: true }
        });

        if(!report) throw new AppError("Informe não encontrado!", 404) 
        if(report.user.id != response.locals.userId) throw new AppError("Sem permissão", 401)

        const { description, link, start, end } = request.body;

        if (description) report.description = description;
        if (link) report.link = link;
        if (start) report.start = start;
        if (end) report.end = end;

        await this.reportsRepository.save(report);

        const { user, ...reportData } = report

        return response.json(reportData);
    }

    public async delete(request: Request, response: Response): Promise<Response> {
        const { id } = request.params

        if(!response.locals.userId) throw new AppError("Erro ao Processar Requisição", 422)

        const report = await this.reportsRepository.findOne({ 
            where: { id },
            relations: { user: true }
        });

        if(!report) throw new AppError("Informe não encontrado")

        if(response.locals.userId !== report.user.id) throw new AppError("Sem Permissão", 401)

        await this.reportsRepository.remove(report)

        return response.json({ message: "Informe Removido" })
    }

    public async show(request: Request, response: Response): Promise<Response> {
        if(!response.locals.userId) throw new AppError("Erro ao Processar Requisição", 422)

        const reports = await this.reportsRepository.find({
            where: { user: { id: response.locals.userId } },
            relations: { user: true }
        })

        const completeReport = reports.map((r) => {
            const { user, ...rData } = r
            return { creator: user.name, contact: user.email, ...rData }
        })

        return response.json(completeReport)
    }

    public async get(request: Request, response: Response): Promise<Response> {
        const reports = await this.reportsRepository.find({ relations: { user: true } })

        const completeReport = reports.map((r) => {
            const { user, ...rData } = r
            return { creator: user.name, contact: user.email, ...rData }
        })

        return response.json(completeReport)
    }
}