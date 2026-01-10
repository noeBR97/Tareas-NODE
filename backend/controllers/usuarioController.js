import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Usuario from '../models/usuario.js';

const controlador = {
    registro : async (req, res) => {
        const {nombre, email, password} = req.body

        try {
            //Verificar si el usuario ya existe
            const usuarioExistente = await Usuario.findOne({email});
            if (usuarioExistente) {
                return res.status(400).json({mensaje: 'El usuario ya existe'});
            }

            //Verificar si faltan campos obligatorios
            if (!nombre || !email || !password) {
                return res.status(400).json({mensaje: 'Faltan campos obligatorios'});
            }

            const hashPassword = await bcrypt.hash(password, 10);

            const nuevoUsuario = new Usuario({
                nombre,
                email,
                password: hashPassword
            });
            await nuevoUsuario.save();

            res.status(201).json({mensaje: 'Usuario registrado correctamente', nuevoUsuario});
        } catch (error) {
            res.status(500).json({mensaje: 'Error al registrar el usuario', error});
        }
    }
}