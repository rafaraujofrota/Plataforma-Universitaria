import 'dotenv/config';

import express, { Request, Response, NextFunction } from 'express';
import { dataSource } from './infra/dataSource';

import cors from 'cors';
import routes from './routes/routes';
import errorHandler from './middlewares/errorHandler';

import { uploadsDirPath } from '../config/upload';

const PORT = process.env.PORT || 3333;

function startServer() {
    const app = express();

    app.use(cors());
    app.use(express.json());
    app.use('/files', express.static(uploadsDirPath));
    
    app.use(routes)

    app.use(errorHandler);

    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}!`);
    });
}

dataSource.initialize()
.then(() => startServer())
.catch((err => console.log("Error during DB initialize", err)))
