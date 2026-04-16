// Importamos toda la lógica destructurada con "*" para mayor elegancia y semántica.
import * as servicioDeTransaccion from '../services/transaccion.servicio.js';

/**
 * [C - Crear] Ingreso o gasto
 */
export const crear = async (req, res, next) => {
    try {
        const usuarioId = req.usuarioVerificado.id;
        const transaccion = await servicioDeTransaccion.crearTransaccion(req.body, usuarioId);
        res.status(201).json(transaccion);
    } catch (error) {
        error.statusCode = 400;
        next(error); // Delega la carga al Muro Final de Errores
    }
};

/**
 * [R - Read/Leer] Obtener el historial completo
 */
export const obtenerTodas = async (req, res, next) => {
    try {
        const usuarioId = req.usuarioVerificado.id;
        const listado = await servicioDeTransaccion.obtenerTransaccionesDeUsuario(usuarioId);
        res.status(200).json(listado);
    } catch (error) {
        error.statusCode = 500;
        next(error);
    }
};

/**
 * [U - Actualizar] Actualización Parcial/Completa de datos
 */
export const actualizar = async (req, res, next) => {
    try {
        const { id } = req.params;
        const usuarioId = req.usuarioVerificado.id;
        
        const actualizada = await servicioDeTransaccion.actualizarTransaccion(id, req.body, usuarioId);
        res.status(200).json(actualizada);
    } catch (error) {
        error.statusCode = 404; // No encontrado
        next(error);
    }
};

/**
 * [D - Delete/Borrar] Eliminación definitiva
 */
export const eliminar = async (req, res, next) => {
    try {
        const { id } = req.params;
        const usuarioId = req.usuarioVerificado.id;
        
        await servicioDeTransaccion.eliminarTransaccion(id, usuarioId);
        res.status(200).json({ mensaje: 'Transacción financiera completamente erradicada de los registros.' });
    } catch (error) {
        error.statusCode = 404;
        next(error);
    }
};
