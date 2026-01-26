import Tarea from "../models/tarea.js";
import Usuario from '../models/usuario.js'
import casual from 'casual'
import { redisClient } from '../config/redis.js';

const controlador = {
    getAllTareas: async (req, res) => {
        try {
            const tareas = await Tarea.find().lean()
            const tareasCached = await redisClient.get('tareas')

            if(tareasCached) {
                console.log((`🟢 Cache de tareas usado`));
                return res.status(200).json(JSON.parse(tareasCached));
            }

            if(tareas.length > 0) {
                await redisClient.setEx('tareas',60, JSON.stringify(tareas))
                console.log('🔵 Listado correcto!');
                res.status(200).json(tareas);
            } else {
                console.log('‼️ No hay registros!');
                res.status(200).json({ 'msg': 'No se han encontrado registros' });
            }
        } catch(error) {
            console.error('❌ Error al obtener tareas:', error);
            res.status(500).json({ 'msg': 'Error al obtener tareas' });
        }
    },

    getTareaById: async (req, res) => {
        try {
            const tarea = await Tarea.findOne({idTarea: req.params.id})
            const tareaCached = await redisClient.get(`tarea:${tarea}`)

            if (tareaCached) {
                console.log(`🟢 Cache de tarea usada`);
                return res.status(200).json(JSON.parse(tareaCached));
            }

            if(!tarea) {
                console.log('‼️ Tarea no encontrada!');
                res.status(404).json({ 'msg': 'Tarea no encontrada' });
            } else {
                await redisClient.setEx(`tarea:${tarea}`, 60, JSON.stringify(tarea))
                console.log('🔵 Tarea encontrada correctamente!');
                res.status(200).json(tarea);
            }
        } catch(error) {
            console.error('❌ Error al obtener la tarea:', error);
            res.status(500).json({ 'msg': 'Error al obtener la tarea' });
        }
        
    },

    addTarea: async (req, res) => {
        try{
            const { descripcion, duracion, dificultad } = req.body;
            
            if(!descripcion || descripcion.trim() === '') {
                return res.status(400).json({msg: 'La descripción no puede estar vacía'})
            }

            if(!dificultad) {
                return res.status(400).json({msg: 'La dificultad es un campo obligatorio.'})
            }

            const nuevaTarea = new Tarea({
                descripcion: descripcion,
                duracion: duracion,
                dificultad: dificultad
            })
            //el estado lo ponemos por defecto a por hacer, que se especifica en el modelo tarea

            await nuevaTarea.save()
            res.status(201).json({msg: 'tarea creada correctamente', tarea: nuevaTarea})
        } catch(error) {
            res.status(500).json({ msg: "Error al crear la tarea" });
        }
    },

    updateTarea: async (req, res) => {
        try {
            const tareaActualizada = await Tarea.findOneAndUpdate({_id: req.params.id}, req.body, { new: true })

            if(tareaActualizada) {
                console.log('🔵 Tarea actualizada correctamente!');
                res.status(200).json(tareaActualizada);
            } else {
                console.log('‼️ Tarea no encontrada!');
                res.status(404).json({ 'msg': 'Tarea no encontrada' });
            }
        } catch (error) {
            console.error('❌ Error al actualizar la tarea:', error);
            res.status(500).json({ 'msg': 'Error al actualizar la tarea' });
        }
    },

    deleteTarea: async (req, res) => {
        try {
            const tareaEliminada = await Tarea.deleteOne({_id:req.params.id});
            if (tareaEliminada.deletedCount > 0) {
                console.log('🔵 Tarea eliminada correctamente!');
                res.status(200).json(tareaEliminada);
            } else {
                console.log('‼️ Tarea no encontrada!');
                res.status(404).json({ 'msg': 'Tarea no encontrada' });
            }
        } catch (error) {
            console.error('❌ Error al eliminar la tarea:', error);
            res.status(500).json({ 'msg': 'Error al eliminar la tarea' });
        }
    },

    asignarTarea: async (req, res) => {
        try {
            const {idTarea, idUsuario} = req.params
            const usuario = await Usuario.findOne({id: idUsuario})
            const tarea = await Tarea.findOne({_id: idTarea})

            if(!usuario) {
                console.log('‼️ Usuario no encontrado');
                return res.status(404).json({ 'msg': 'Usuario no encontrado' });
            }

            if(!tarea) {
                console.log('‼️ Tarea no encontrada!');
                return res.status(404).json({ 'msg': 'Tarea no encontrada' });
            }

            tarea.idU = idUsuario
            tarea.estado = 'haciendo'

            await tarea.save()

            console.log('🔵 Tarea asignada correctamente!');
            res.status(200).json(tarea);
        } catch (error) {
            console.error('❌ Error al asignar la tarea:', error);
            res.status(500).json({ 'msg': 'Error al asignar la tarea' });
        }
    },

    llenarSistema: async (req, res) => {
        try {
            const numUsuarios = parseInt(req.params.numUsarios, 10)

            if(numUsuarios <= 0) {
                return res.status(400).json({msg: 'El número de usuarios debe ser mayor de 0.'})
            }
            
            const usuarios = []
        
            for (let i = 0; i < numUsuarios; i++) {
                usuarios.push({
                    nombre: casual.first_name,
                    apellido1: casual.last_name,
                    email: `${casual.email}_${i}`, //se evitan duplicados
                    password: 'user1234',
                    rol: 'usuario'
                })
            }
            await Usuario.insertMany(usuarios)

            console.log('🔵 Usuarios creados correctamente.')
            res.status(201).json({msg: 'usuarios creados correctamente', creados: usuarios.length, total})
        } catch(error) {
            console.error('❌ Error al crear usuarios:', error);
            res.status(500).json({ 'msg': 'Error al crear usuarios' });
        }
    },

    //tareas generales por hacer, pero que no esten asignadas a nadie
    getTareasPorHacer: async(req, res) => {
        try {
            const tareas = await Tarea.find({estado: 'por hacer'})

            if(!tareas) {
                console.log('‼️ Tareas no encontradas!');
                return res.status(404).json({ 'msg': 'Tareas no encontradas' });
            }

            if(tareas.length === 0) {
                console.log('No hay tareas por hacer');
                return res.status(404).json({ 'msg': 'No hay tareas por hacer' });
            }

            console.log('🔵 Tareas encontradas correctamente!');
            res.status(200).json(tareas);
        } catch(error) {
            console.error('❌ Error al obtener las tareas:', error);
            res.status(500).json({ 'msg': 'Error al obtener las tareas' });
        }
    },

    getTareasAsignadas: async(req, res) => {
        try {
            const idUsuario = req.usuario.id
            const tareas = await Tarea.find({idU: idUsuario}).lean()

            if(tareas.length === 0) {
                return res.status(404).json({msg: 'No se han encontrado tareas asignadas.'})
            }

            console.log('🔵 Tareas encontradas correctamente!');
            res.status(200).json(tareas);
        } catch(error) {
            console.error('❌ Error al obtener las tareas:', error);
            res.status(500).json({ 'msg': 'Error al obtener las tareas' });
        }
    },

    asignarTareaPropia: async(req, res) => {
        try {
            const idUsuario = req.usuario.id
            const idTarea = req.params.idTarea
            const tarea = await Tarea.findById(idTarea)

            if(!tarea) {
                console.log('‼️ Tarea no encontrada!');
                return res.status(404).json({ 'msg': 'Tarea no encontrada' });
            }

            if(tarea.idU !== null) {
                console.log('‼️ Tarea ya asignada');
                return res.status(404).json({msg: 'Esta tarea ya está asignada'})
            }

            tarea.idU = idUsuario
            tarea.estado = 'haciendo'

            await tarea.save()

            console.log('🔵 Tarea asignada correctamente!');
            res.status(200).json(tarea);
        } catch(error) {
            console.error('❌ Error al asignar la tarea:', error);
            res.status(500).json({ 'msg': 'Error al asignar la tarea' });
        }
    },

    desasignarTareaPropia: async(req, res) => {
        try {
            const idUsuario = req.usuario.id
            const idTarea = req.params.idTarea
            const tarea = await Tarea.findById(idTarea)

            if(!tarea) {
                console.log('‼️ Tarea no encontrada!');
                return res.status(404).json({ 'msg': 'Tarea no encontrada' });
            }

            if(tarea.idU === idUsuario) {
                tarea.idU = null
                tarea.estado = 'por hacer'

                await tarea.save()

                console.log('🔵 Tarea desasignada correctamente!');
                return res.status(200).json(tarea);
            } else {
                console.log('La tarea no está asignada a este usuario.');
                return res.status(200).json({msg: 'La tarea no está asignada a este usuario.'});
            }
        } catch(error) {
            console.error('❌ Error al asignar la tarea:', error);
            res.status(500).json({ 'msg': 'Error al asignar la tarea' });
        }
    },

    cambiarEstado: async(req, res) => {
        try {
            const idUsuario = req.usuario.id
            const idTarea = req.params.idTarea
            const tarea = await Tarea.findById(idTarea)
            const {estado} = req.body

            if(!estado || estado.trim() === '') {
                return res.status(400).json({msg: 'El estado no puede estar vacío'})
            }

            if(!tarea) {
                return res.status(400).json({msg: 'No se ha encontrado la tarea'})
            }

            if(tarea.idU !== idUsuario) {
                console.log('La tarea no está asignada a este usuario.');
                return res.status(200).json({msg: 'La tarea no está asignada a este usuario.'});
            }

            tarea.estado = estado
            await tarea.save()

            res.status(201).json({msg: 'Cambio de estado realizado correctamente'})
        } catch(error) {
            console.error('❌ Error al cambiar el estado:', error);
            res.status(500).json({ 'msg': 'Error al cambiar el estado' });
        }
    },

    getTareaByDificultad: async(req, res) => {
        try {
            const dificultad = req.params.dificultad
            const tareas = (await Tarea.find()).filter(t => t.dificultad === dificultad)

            if(!tareas) {
                console.log('‼️ tareas no encontradas!');
                res.status(404).json({ 'msg': 'Tareas no encontradas' });
            } else {
                console.log('🔵 Tareas encontrada correctamente!');
                res.status(200).json(tareas);
            }
        } catch(error) {
            console.error('❌ Error al obtener las tareas:', error);
            res.status(500).json({ 'msg': 'Error al obtener las tareas' });
        }
    },

    getTareasByUsuario: async(req, res) => {
        try {
            const usuario = req.usuario.id
            const tareas = await Tarea.find({idU: usuario}).lean()

            if(tareas.length === 0) {
                console.log('‼️ Tareas no encontradas!');
                return res.status(404).json({ 'msg': 'Tareas no encontradas' });
            } else {
                console.log('🔵 Tareas encontradas correctamente!');
                return res.status(200).json(tareas);
            }
        } catch(error) {
            console.error('❌ Error al obtener las tareas:', error);
            res.status(500).json({ 'msg': 'Error al obtener las tareas' });
        }
    },

    getTareasPorRango: async(req, res) => {
        try {
            const {min, max} = req.params
            const niveles = ['XS', 'S', 'M', 'L', 'XL']

            const minIndex = niveles.indexOf(min)
            const maxIndex = niveles.indexOf(max)

            if(minIndex > maxIndex) {
                return res.status(400).json({msg: 'El rango de dificultad no es válido.'})
            }

            const rango = niveles.slice(minIndex, maxIndex + 1)
            const tareas = await Tarea.find({
                dificultad: {$in: rango}
            })

            res.status(200).json(tareas)
        } catch(error) {
            console.error('❌ Error al obtener tareas por rango:', error);
            res.status(500).json({msg: 'Error al obtener tareas por rango'});
        }
    },

    getTareasXL: async(req, res) => {
        try {
            const tareasXL = (await Tarea.find()).filter(t=> t.dificultad === 'XL').lean()

            if(tareasXL.length === 0) {
                return res.status(400).json({msg: 'No hay tareas de esa dificultad.'})
            }

            res.status(200).json(tareasXL)
        } catch(error) {
            console.error('❌ Error al obtener tareas de esa dificultad:', error);
            res.status(500).json({msg: 'Error al obtener tareas de esa dificultad'});
        }
    }
}

export default controlador