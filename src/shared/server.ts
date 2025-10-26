import 'dotenv/config';

import express, { Request, Response, NextFunction } from 'express';
import { dataSource } from './infra/dataSource';

import cors from 'cors';
import AppError from './utils/AppError';
import routes from './routes/routes';

const PORT = process.env.PORT || 3333;

function startServer() {
    const app = express();

    app.use(cors());
    app.use(express.json());
    app.use(routes)

    app.use(
        (err: Error, request: Request, response: Response, _: NextFunction) => {
            if (err instanceof AppError) {
                return response.status(err.statusCode).json({
                    status: 'error',
                    message: err.message,
                });
            }

            console.log(err)
            
            return response.status(500).json({
                status: 'error',
                message: 'Internal Server Error',
            });
        },
    );

    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}!`);
    });
}

dataSource.initialize()
.then(() => startServer())
.catch((err => console.log("Error during DB initialize", err)))
