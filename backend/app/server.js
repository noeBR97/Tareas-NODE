import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config()
import {router as authRoutes} from '../routes/authRoutes.js';
import {router as tareaRoutes} from '../routes/tareaRoutes.js';
import {router as userRoutes} from '../routes/userRoutes.js';
import kleur from 'kleur';
import mongoose from "mongoose";
mongoose.set('strictQuery', false);


class Server {

    constructor() {
        this.app = express();
        this.usuariosPath = '/api/usuarios';
        this.tareasPath = '/api/tareas'
        this.authPath = '/api';

        //Middlewares
        this.middlewares();

        this.conectarMongoose();

        this.routes();
        
    }

    conectarMongoose() {
        //Para local o remoto (Atlas) comentar / descomentar en .env.
        mongoose.connect(process.env.DB_URL, {
            dbName: process.env.DB_DATABASE, //Especificar la base de datos
            //maxPoolSize: 10, //Define el número máximo de conexiones en el pool. Por defecto es 100.
        });
        /*
        Cuando llamas a mongoose.connect(), Mongoose crea una única conexión a MongoDB 
        que actúa como un pool de conexiones interno. Este pool maneja múltiples 
        operaciones simultáneamente sin necesidad de que crees nuevas conexiones manualmente.
        */

        this.db = mongoose.connection;
        this.db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
        this.db.once('open', () => {console.log(kleur.blue().bold('🔵 Conexión exitosa a MongoDB'));});
    }

    middlewares() {
        this.app.use(cors());
        this.app.use(express.json());
    }

    routes(){
        this.app.use(this.authPath , authRoutes);
        this.app.use(this.usuariosPath , userRoutes);
        this.app.use(this.tareasPath , tareaRoutes);
    }

    listen() {
        this.app.listen(process.env.PORT, () => {
            console.log(kleur.green().bold(`🟢 Servidor API escuchando en: ${process.env.PORT}`));
        })
        console.log(kleur.blue().bold(`🔵 Mongo: ${process.env.DB_PORT}  /  Datos de conexión: ${process.env.DB_DATABASE} ${process.env.DB_URL}. Conectando...`));
    }
}

export {Server};