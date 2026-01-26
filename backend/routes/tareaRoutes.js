import { Router } from 'express';
import { validarJWT } from '../middlewares/validarJWT.js';
import { esAdmin, esUsuario } from '../middlewares/validarRoles.js';
import controlador from '../controllers/tareaController.js'
export const router = Router();

//middleware que se aplica a todas las rutas
router.use(validarJWT)

//rutas de usuario
router.get('/por-hacer', esUsuario, controlador.getTareasPorHacer) 
router.get('/asignadas', esUsuario, controlador.getTareasAsignadas)
router.put('/asignar-propia/:idTarea', esUsuario, controlador.asignarTareaPropia)
router.put('/desasignar-propia/:idTarea', esUsuario, controlador.desasignarTareaPropia)
router.put('/cambiar-estado/:idTarea', esUsuario, controlador.cambiarEstado)
router.get('/:dificultad', esUsuario, controlador.getTareaByDificultad)
router.get('/:min/:max', esUsuario, controlador.getTareasPorRango)
router.get('/dificultad-xl', esUsuario, controlador.getTareasXL)
router.get('/:idUsuario', esUsuario, controlador.getTareasByUsuario)

//rutas de admin
router.get('/', esAdmin, controlador.getAllTareas)
router.get('/:idTarea', esAdmin, controlador.getTareaById)
router.post('/', esAdmin, controlador.addTarea)
router.put('/:id', esAdmin, controlador.updateTarea)
router.delete('/:id', esAdmin, controlador.deleteTarea)
router.put('/asignar/:idTarea/:idUsuario', esAdmin, controlador.asignarTarea)
router.post('/llenar/:numUsarios', esAdmin, controlador.llenarSistema)