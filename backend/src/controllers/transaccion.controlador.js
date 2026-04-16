// Importamos toda la lógica destructurada con "*" para mayor elegancia y semántica.
import * as servicioDeTransaccion from '../services/transaccion.servicio.js';

/**
 * [C - Crear] Ingreso o gasto
 */
export const crear = async (req, res) => {
    try {
        // Obtenemos del Intermediario/middleware la verdadera ID validada del JWT.
        // Nunca confiar en "userId" llegado burdamente por el req.body
        const usuarioId = req.usuarioVerificado.id;
        
        const transaccion = await servicioDeTransaccion.crearTransaccion(req.body, usuarioId);
        // Estatus HTTP 201 = Entidad Creada OK.
        res.status(201).json(transaccion);
    } catch (error) {
        res.status(400).json({ error: 'Hubo un error al estructurar o crear la transacción.', detalles: error.message });
    }
};

/**
 * [R - Read/Leer] Obtener el historial completo
 */
export const obtenerTodas = async (req, res) => {
    try {
        // De nueva cuenta, sacamos con bisturí la ID de quien ostenta el Token seguro.
        const usuarioId = req.usuarioVerificado.id;
        
        const listado = await servicioDeTransaccion.obtenerTransaccionesDeUsuario(usuarioId);
        res.status(200).json(listado);
    } catch (error) {
        res.status(500).json({ error: 'Ocurrió un error general recabando su lista de ingresos globales.' });
    }
};

/**
 * [U - Actualizar] Actualización Parcial/Completa de datos
 */
export const actualizar = async (req, res) => {
    try {
        // Captamos el ID de la transacción buscada en la url (ej. /api/transacciones/65f2122...)
        const { id } = req.params;
        const usuarioId = req.usuarioVerificado.id;
        
        // Peticionamos el trabajo pesado al analista (servicio)
        const actualizada = await servicioDeTransaccion.actualizarTransaccion(id, req.body, usuarioId);
        res.status(200).json(actualizada);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

/**
 * [D - Delete/Borrar] Eliminación definitiva
 */
export const eliminar = async (req, res) => {
    try {
        const { id } = req.params;
        const usuarioId = req.usuarioVerificado.id;
        
        await servicioDeTransaccion.eliminarTransaccion(id, usuarioId);
        res.status(200).json({ mensaje: 'Transacción financiera completamente erradicada de los registros.' });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};
