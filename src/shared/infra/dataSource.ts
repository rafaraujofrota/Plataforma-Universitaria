import "reflect-metadata";
import "dotenv/config"
import { DataSource, DataSourceOptions } from "typeorm";

let data: DataSourceOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER, 
    password: process.env.DB_PASS, 
    database: process.env.DB_NAME,   
    synchronize: true, // # Cria tabela automáticamente ( Pode dar problema mas vai facilitar )
    logging: true,
    entities: [
        process.env.NODE_ENV === 'production'
      ? './dist/modules/**/entities/*.js'
      : './src/modules/**/entities/*.ts',
    ],
};

// Ativar na Produção ( Criptografia )
if (process.env.DB_SSL === 'true') {
    data = {
        ...data,
        ssl: true,
        extra: {
          ssl: {
            rejectUnauthorized: false,
          },
        },
    };
}

export const dataSource = new DataSource(data)