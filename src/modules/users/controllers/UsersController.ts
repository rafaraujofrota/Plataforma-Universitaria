import { Request, Response } from "express";
import { dataSource } from "../../../shared/infra/dataSource";
import { User } from "../entities/User";

import AppError from "../../../shared/utils/AppError";
import { hash } from "bcryptjs"

export default class UsersController {
    public async list(request: Request, response: Response): Promise<Response> {
        const usersRepository = dataSource.getRepository(User);
        const users = await usersRepository.find();

        return response.json(users.map(
            ({ password, id, ...others }) => others)
        );
    }

    public async create(request: Request, response: Response): Promise<Response> {
        const { name, email, password } = request.body;

        const usersRepository = dataSource.getRepository(User);
        const checkUserExists = await usersRepository.findOne({
            where: { email }
        });

        if (checkUserExists) throw new AppError('Email já está sendo usado.');

        const hashedPassword = await hash(password, 10);

        const user = usersRepository.create({
            name,
            email,
            password: hashedPassword,
        });

        await usersRepository.save(user)

        const { password:_ , id:__ , ...userSafeData } = user

        return response.json(userSafeData);
    }
}