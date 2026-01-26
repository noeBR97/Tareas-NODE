import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Usuario from '../models/usuario.js';

export const registro = async (req, res) => {
    const {nombre, email, password, apellido1, apellido2, rol} = req.body

    try {
        //Verificar si el usuario ya existe
        const usuarioExistente = await Usuario.findOne({email});
        if (usuarioExistente) {
            return res.status(400).json({mensaje: 'El usuario ya existe'});
        }

        //Verificar si faltan campos obligatorios
        if (!nombre || !email || !password || !apellido1) {
            return res.status(400).json({mensaje: 'Faltan campos obligatorios'});
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const nuevoUsuario = new Usuario({
            nombre,
            apellido1,
            apellido2,
            email,
            password: hashPassword,
            rol: rol
        });
        await nuevoUsuario.save();

        res.status(201).json({mensaje: 'Usuario registrado correctamente', nuevoUsuario});
    } catch (error) {
        res.status(500).json({mensaje: 'Error al registrar el usuario', error});
    }
}

export const login = async (req, res) => {
    try {
        const {email, password} = req.body;

        //comprobar si faltan campos
        if (!email || !password) {
            return res.status(400).json({mensaje: 'Faltan campos obligatorios'});
        }

        const usuario = await Usuario.findOne({email});
        //comprobar si existe el usuario
        if (!usuario) {
            return res.status(400).json({mensaje: 'Credenciales inválidas'});
        }

        const esPasswordValido = await bcrypt.compare(password, usuario.password);
        //comprobar si la contraseña es correcta
        if (!esPasswordValido) {
            return res.status(400).json({mensaje: 'Credenciales inválidas'});
        }

        const token = jwt.sign(
            {id: usuario.id, email: usuario.email, rol: usuario.rol},
            process.env.SECRETORPRIVATEKEY,
            {expiresIn: '2h'}
        )
        res.status(200).json({mensaje: 'Login exitoso', token})
    } catch (error) {
        res.status(500).json({mensaje: 'Error al iniciar sesión', error});
    }
}