import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const usuarioSchema = new mongoose.Schema({
    id: {
        type: String,
        default: uuidv4()},
    nombre: {type: String, required: true},
    apellido1: {type: String, required: true},
    apellido2: {type: String},
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    rol: {type: String, enum: ['admin', 'usuario'], default: 'usuario'}
}, { collection: 'usuarios', versionKey: false, strict: false });

const Usuario = mongoose.model('Usuario', usuarioSchema);

export default Usuario;