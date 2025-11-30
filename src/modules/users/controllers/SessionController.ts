import { Request, Response } from "express";
import { dataSource } from "../../../shared/infra/dataSource";
import { User } from "../entities/User";

import { compare } from "bcryptjs"
import { sign } from 'jsonwebtoken';

import AppError from "../../../shared/utils/AppError";
import authConfig from "../../../config/auth";

export default class SessionController {
    public async create(request: Request, response: Response): Promise<Response> {
        const { email, password } = request.body;

        const usersRepository = dataSource.getRepository(User);
        const foundUser = await usersRepository.findOne({
            where: { email }
        });

        if (!foundUser) throw new AppError("Email ou senha incorretos.", 401);

        if (!foundUser.verified) throw new AppError("Usuário não verificado", 403)

        const dataMatch = await compare(password, foundUser.password)

        if (!dataMatch) throw new AppError("Email ou senha incorretos.", 401)

        const { secret, expiresIn } = authConfig.jwt;

        const token = sign({}, secret, {
            subject: foundUser.id,
            expiresIn,
        });

        return response.json({
            token,
            expiresIn,
        });
    }
}