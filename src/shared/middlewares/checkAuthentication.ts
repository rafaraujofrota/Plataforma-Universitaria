import { NextFunction, Request, Response } from "express";
import AppError from "../utils/AppError";

import authConfig from "../../config/auth";
import { verify } from "jsonwebtoken";

function checkAuthentication(request: Request, response: Response, next: NextFunction) {
    const authHeader = request.headers.authorization;

	if (!authHeader) throw new AppError("Token JWT faltando", 401);

	const [, token] = authHeader.split(" ");

	try {
		const decoded = verify(token, authConfig.jwt.secret);

		const { sub } = decoded;

		response.locals.userId = sub

		return next();
	} catch (err)  {
		throw new AppError('Token JWT inválido', 401);
	}
}

export default checkAuthentication