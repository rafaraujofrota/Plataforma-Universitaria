import { NextFunction, Request, Response } from "express";

import AppError from "../utils/AppError";
import deleteFile from "../utils/deleteFile";
import { MulterError } from "multer";

import { fileLimitMB } from "../../config/upload";

function errorHandler(err: Error, request: Request, response: Response, _: NextFunction) {
    const file = request.file?.filename
    
    if (file) deleteFile(file)

    if (err instanceof AppError) {
        return response.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        });
    }

    if (err instanceof MulterError) {
        let message = "Problemas com o Processamento de Arquivos"

        if(err.code == "LIMIT_UNEXPECTED_FILE") message = "Tipo de Arquivo Inválido"
        if(err.code == "LIMIT_FILE_SIZE") message = `Arquivo muito grande ( Max ${fileLimitMB} MB )` 

        return response.status(400).json({
            status: "error",
            message,
        });
    }

    console.log(err)
        
    return response.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
    });
}

export default errorHandler