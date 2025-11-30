import { Request, Response } from "express";
import { dataSource } from "../../../shared/infra/dataSource";
import { User } from "../entities/User";
import { VerificationToken } from "../entities/VerificationToken";

import AppError from "../../../shared/utils/AppError";
import { hash } from "bcryptjs"
import { randomUUID } from "crypto";

import { sendVerificationEmail } from "../../../shared/utils/sendEmail";

export default class UsersController {
    public async list(request: Request, response: Response): Promise<Response> {
        const usersRepository = dataSource.getRepository(User);
        const users = await usersRepository.find();

        return response.json(users.map(
            ({ password, id, ...others }) => others)
        );
    }

    public async show(request: Request, response: Response): Promise<Response> {
        const usersRepository = dataSource.getRepository(User);

        const { id } = request.params

        const user = await usersRepository.findOne({ 
            where: { id },
            relations: { profile: true }
        });

        if(!user) throw new AppError("Usuário não encontrado")

        const { password:_ , id:__ , ...userSafeData } = user

        return response.json(userSafeData);
    }

    public async sendEmail(request: Request, response: Response): Promise<Response> {
        const usersRepository = dataSource.getRepository(User);
        const tokenRepository = dataSource.getRepository(VerificationToken);

        const { email } = request.body

        const user = await usersRepository.findOne({ 
            where: { email }
        });

        if(!user) throw new AppError("Usuário não encontrado")

        if(user.verified) throw new AppError("Usuário já verificado")

        let token = await tokenRepository.findOne({
            where: { user: { id: user.id } }
        })

        if(!token) {
            token = tokenRepository.create({
                user,
                token: randomUUID(),
                expires_at: new Date(Date.now() + 30 * 60 * 1000), // 30 minutos
            });

            await tokenRepository.save(token)
        } else {
            token.token = randomUUID()
            token.expires_at = new Date(Date.now() + 30 * 60 * 1000)

            await tokenRepository.save(token)
        }

        try {
            await sendVerificationEmail({ to: user.email, code: token.token })
        } catch(err) {
            throw new AppError("Problemas ao enviar email", 500)
        }

        return response.json({ message: "Email Enviado"});
    }

    public async verify(request: Request, response: Response): Promise<Response> {
        const usersRepository = dataSource.getRepository(User);
        const tokenRepository = dataSource.getRepository(VerificationToken);

        const { token } = request.params

        const foundToken = await tokenRepository.findOne({ 
            where: { token },
            relations: { user: true }
        });

        if(!foundToken) throw new AppError("Token não encontrado", 404)

        if(!foundToken.user) {
            await tokenRepository.remove(foundToken)
            throw new AppError("Token Inválido")
        }

        if(foundToken.expires_at.getTime() < Date.now()) {
            await tokenRepository.remove(foundToken)
            throw new AppError("Token Expirado", 410)
        }

        if(foundToken.user.verified) {
            await tokenRepository.remove(foundToken)
            throw new AppError("Usuário já verificado")
        }

        foundToken.user.verified = true

        await usersRepository.save(foundToken.user)

        await tokenRepository.remove(foundToken)

        return response.json({ message: "Usuário Verificado"});
    }

    public async create(request: Request, response: Response): Promise<Response> {
        const { name, email, password } = request.body;

        const usersRepository = dataSource.getRepository(User);
        const tokenRepository = dataSource.getRepository(VerificationToken);

        const checkUserExists = await usersRepository.findOne({
            where: { email }
        });

        if (checkUserExists) throw new AppError('Email já está sendo usado.');

        const hashedPassword = await hash(password, 10);

        const user = usersRepository.create({
            name,
            email,
            password: hashedPassword,
            profile: {}
        });

        await usersRepository.save(user)

        const token = tokenRepository.create({
            user,
            token: randomUUID(),
            expires_at: new Date(Date.now() + 30 * 60 * 1000), // 30 minutos
        });

        await tokenRepository.save(token)

        const { password:_ , id:__ , ...userSafeData } = user

        try {
            await sendVerificationEmail({ code: token.token, to: user.email })
        } catch(err) {
            return response.status(202).json(userSafeData)
        }

        return response.json(userSafeData);
    }
}