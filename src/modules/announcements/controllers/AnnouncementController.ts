import { Request, Response } from "express";

import { Repository } from "typeorm";
import { dataSource } from "../../../shared/infra/dataSource";

import { Announcements } from "../entities/Announcements";
import { User } from "../../users/entities/User";

import AppError from "../../../shared/utils/AppError";

export default class AnnouncementsController {
    protected announcementsRepository: Repository<Announcements>
    protected usersRepository: Repository<User>

    constructor() {
        this.announcementsRepository = dataSource.getRepository(Announcements)
        this.usersRepository = dataSource.getRepository(User)
    }

    public async create(request: Request, response: Response): Promise<Response> {
        const { name, type, description, link, start, end } = request.body;

        if(!response.locals.userId) throw new AppError("Erro ao Processar Requisição", 422)

        const user = await this.usersRepository.findOne({
            where: { id: response.locals.userId },
        });

        if(!user) throw new AppError("Usuário não encontrado")

        const announcement = this.announcementsRepository.create({
            name,
            link,
            type,
            description,
            start,
            end,
            user: { id: user.id },
        })

        await this.announcementsRepository.save(announcement)

        return response.json(announcement)
    }

    public async update(request: Request, response: Response): Promise<Response> {
        if(!response.locals.userId) throw new AppError("Erro ao Processar Requisição", 422)

        const { id } = request.params
            
        const announcement = await this.announcementsRepository.findOne({
            where: { id },
            relations: { user: true }
        });

        if(!announcement) throw new AppError("Informe não encontrado!", 404) 
        if(announcement.user.id != response.locals.userId) {
            throw new AppError("Sem permissão", 401)
        }

        const { description, link, start, end } = request.body;

        if (description) announcement.description = description;
        if (link) announcement.link = link;
        if (start) announcement.start = start;
        if (end) announcement.end = end;

        await this.announcementsRepository.save(announcement);

        const { user, ...announcementData } = announcement

        return response.json(announcementData);
    }

    public async delete(request: Request, response: Response): Promise<Response> {
        const { id } = request.params

        if(!response.locals.userId) throw new AppError("Erro ao Processar Requisição", 422)

        const announcement = await this.announcementsRepository.findOne({ 
            where: { id },
            relations: { user: true }
        });

        if(!announcement) throw new AppError("Informe não encontrado")

        if(response.locals.userId !== announcement.user.id) {
            throw new AppError("Sem Permissão", 401)
        }

        await this.announcementsRepository.remove(announcement)

        return response.json({ message: "Informe Removido" })
    }

    public async show(request: Request, response: Response): Promise<Response> {
        if(!response.locals.userId) throw new AppError("Erro ao Processar Requisição", 422)

        const announcements = await this.announcementsRepository.find({
            where: { user: { id: response.locals.userId } },
            relations: { user: true }
        })

        const completeAnnouncement = announcements.map((r) => {
            const { user, ...rData } = r
            return { creator: user.name, contact: user.email, ...rData }
        })

        return response.json(completeAnnouncement)
    }

    public async get(request: Request, response: Response): Promise<Response> {
        const announcements = await this.announcementsRepository.find(
            { relations: { user: true } }
        )

        const completeAnnouncement = announcements.map((r) => {
            const { user, ...rData } = r
            return { creator: user.name, contact: user.email, ...rData }
        })

        return response.json(completeAnnouncement)
    }
}