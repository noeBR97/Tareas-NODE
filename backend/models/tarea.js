import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const tareaSchema = new mongoose.Schema({
    idU: {
        type: String,
        default: null},
    descripcion: {type: String, required: true},
    duracion: {type: Number},
    dificultad: {type: String, enum: ['XS', 'S', 'M', 'L', 'XL'], required: true},
    estado: {type: String, enum: ['por hacer', 'haciendo', 'hecha'], default: 'por hacer'}
}, { collection: 'tareas', versionKey: false, strict: false });

const Tarea = mongoose.model('Tarea', tareaSchema);

export default Tarea;