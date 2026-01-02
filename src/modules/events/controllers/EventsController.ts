import { Request, Response } from "express";

import { Repository } from "typeorm";
import { dataSource } from "../../../shared/infra/dataSource";

import { Event } from "../entities/Event";
import { User } from "../../users/entities/User";

import AppError from "../../../shared/utils/AppError";

export default class EventsController {
    protected eventsRepository: Repository<Event>
    protected usersRepository: Repository<User>

    constructor() {
        this.eventsRepository = dataSource.getRepository(Event)
        this.usersRepository = dataSource.getRepository(User)
    }

    public async create(request: Request, response: Response): Promise<Response> {
        const { location, name, description } = request.body;
        const { accountable, duration, start } = request.body;

        if(!response.locals.userId) throw new AppError("Erro ao Processar Requisição", 422)

        const user = await this.usersRepository.findOne({
            where: { id: response.locals.userId },
        });

        if(!user) throw new AppError("Usuário não encontrado")

        const event = this.eventsRepository.create({
            location,
            name,
            description,
            accountable,
            duration_minutes: duration,
            start,
            user: { id: user.id },
        })

        await this.eventsRepository.save(event)

        return response.json(event)
    }

    public async update(request: Request, response: Response): Promise<Response> {
        if(!response.locals.userId) throw new AppError("Erro ao Processar Requisição", 422)

        const { id } = request.params
            
        const event = await this.eventsRepository.findOne({
            where: { id },
            relations: { user: true }
        });

        if(!event) throw new AppError("Evento não encontrado!", 404) 
        if(event.user.id != response.locals.userId) throw new AppError("Sem permissão", 403)

        const { location, description } = request.body;
        const { accountable, duration, start } = request.body;

        if (location) event.location = location;
        if (description) event.description = description;
        if (accountable) event.accountable = accountable;
        if (duration) event.duration_minutes = duration;
        if (start) event.start = start;

        await this.eventsRepository.save(event);

        const { user, ...eventData } = event

        return response.json(eventData);
    }

    public async delete(request: Request, response: Response): Promise<Response> {
        const { id } = request.params

        if(!response.locals.userId) throw new AppError("Erro ao Processar Requisição", 422)

        const event = await this.eventsRepository.findOne({ 
            where: { id },
            relations: { user: true }
        });

        if(!event) throw new AppError("Evento não encontrado")

        if(response.locals.userId !== event.user.id) throw new AppError("Sem Permissão", 403)

        await this.eventsRepository.remove(event)

        return response.json({ message: "Evento Removido" })
    }

    public async show(request: Request, response: Response): Promise<Response> {
        if(!response.locals.userId) throw new AppError("Erro ao Processar Requisição", 422)

        const events = await this.eventsRepository.find({
            where: { user: { id: response.locals.userId } }
        })

        return response.json(events)
    }

    public async get(request: Request, response: Response): Promise<Response> {
        const events = await this.eventsRepository.find()

        return response.json(events)
    }
}