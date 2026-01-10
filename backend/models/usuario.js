import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const usuarioSchema = new mongoose.Schema({
    id: uuidv4(),
    nombre: {type: String, required: true},
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
}, { collection: 'usuarios', versionKey: false, strict: false });

const Usuario = mongoose.model('Usuario', usuarioSchema);

export default Usuario;