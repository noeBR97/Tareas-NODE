import Tarea from "../models/tarea.js";

const controlador = {
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
            console.error('❌ Error al eliminar la area:', error);
            res.status(500).json({ 'msg': 'Error al eliminar la tarea' });
        }
    }
}

export default controlador