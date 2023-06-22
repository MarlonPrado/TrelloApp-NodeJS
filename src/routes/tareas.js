const express = require('express');
const router = express.Router();
const pool = require('../database.js');
const schemaTarea = require('../lib/validator/tareas.js');

router.post('/agregarTarea', async (req, res) => {
    try {
        const {descripcion, nombre, prioridad, entrega, idEstado, idMateria} = req.body;
        console.log(nombre);
        const validacion = await schemaTarea.validateAsync(req.body);
        if (validacion.error) {
            return res.status(400).json({
                error: validacion.error.details[0].message
            });
        } else {
            const tarea = {
                nombre: nombre,
                descripcion: descripcion,
                prioridad: prioridad,
                entrega: entrega,
                idEstado: idEstado
            };
            const resultado = await pool.query('INSERT INTO tarea SET?', tarea);
            const tareaid = resultado.insertId
            
            materiaasociada={
                idMateria: idMateria,
                idTarea: tareaid
            }
            const materiaTarea = await pool.query('INSERT INTO materia_tarea SET?', materiaasociada)
            return res.status(200).json({
                message: 'Tarea agregada'
            });
        }
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
});

router.get('/tareas', async (req, res) => {
    try {
        const tareas = await pool.query('SELECT * FROM tarea');
        return res.status(200).send({
            tareas
        });
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
})

router.put('/actualizarTarea/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const {descripcion, nombre, prioridad, entrega, idEstado, idMateria} = req.body;
        const validacion = await schemaTarea.validateAsync(req.body);
        if (validacion.error) {
            return res.status(400).json({
                error: validacion.error.details[0].message
            });
        } else {
            const tarea = {
                nombre: nombre,
                descripcion: descripcion,
                prioridad: prioridad,
                entrega: entrega,
                idEstado: idEstado
            };
            await pool.query('UPDATE tarea SET ? WHERE idTarea = ?', [tarea, id]);
            materiaasociada={
                idMateria: idMateria,
                idTarea: id
            }
            const materiaTarea = await pool.query('UPDATE materia_tarea SET ? WHERE idTarea = ? AND idMateria = ?', [materiaasociada, id, idMateria]);
            return res.status(200).json({
                message: 'Tarea actualizada'
            });
        }
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
});


module.exports = router;