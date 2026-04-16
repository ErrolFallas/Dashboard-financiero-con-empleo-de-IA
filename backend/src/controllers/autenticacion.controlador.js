import { registrarUsuario, iniciarSesionUsuario } from '../services/autenticacion.servicio.js';

/**
 * Controlador de Registro. Purificación completada al borrar validadores manuales.
 */
export const registrar = async (req, res, next) => {
    try {
        const { nombre, correo, contrasena } = req.body;
        
        // La validación cruda se fue. Si llega hasta aquí, express-validator ya certificó que es Data Perfecta.
        const usuario = await registrarUsuario(nombre, correo, contrasena);
        res.status(201).json({ mensaje: 'Usuario registrado exitosamente', usuario });
    } catch (error) {
        // Enlaza el probable error E11000 al Handler
        error.statusCode = 400;
        next(error);
    }
};

/**
 * Controlador de Iniciar Sesión. 
 */
export const iniciarSesion = async (req, res, next) => {
    try {
        const { correo, contrasena } = req.body;
        
        // De nuevo, data pre-limpia. El servicio realiza el trabajo.
        const resultado = await iniciarSesionUsuario(correo, contrasena);
        res.status(200).json(resultado);
    } catch (error) {
        // Hint del estatus 401 (Denegado) para que el front no intente cachearlo
        error.statusCode = 401; 
        next(error);
    }
};
