import { Router } from 'express';
import { validarJWT } from '../middlewares/validarJWT.js';
import { esAdmin, esUsuario } from '../middlewares/validarRoles.js';
import controlador from '../controllers/tareaController.js'
export const router = Router();

//middleware que se aplica a todas las rutas
router.use(validarJWT)

//admin
router.post('/', esAdmin, controlador.addTarea)
router.put('/:id', esAdmin, controlador.updateTarea)
router.delete('/:id', esAdmin, controlador.deleteTarea)
router.put('/asignar/:idTarea/:idUsuario', esAdmin, controlador.asignarTarea)
// //tareas por realizar
// router.get('/por-hacer', obtenerTareasPorHacer) 

// //tareas asignadas
// router.get('/asignadas', obtenerTareasAsignadas)

// //asignar tarea
// router.post('/asignar', asignarTarea)

// //desasignar tarea
// router.post('/desasignar', desasignarTarea)

// //cambiar estado de tarea
// router.post('/cambiar-estado', cambiarEstadoTarea)
