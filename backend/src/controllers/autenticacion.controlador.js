import { registrarUsuario, iniciarSesionUsuario } from '../services/autenticacion.servicio.js';

/**
 * Controlador de Registro.
 * Recibe datos, llama al analizador del negocio y retorna los estados HTML Correctos.
 */
export const registrar = async (req, res) => {
    try {
        const { nombre, correo, contrasena } = req.body;
        
        // Escudo Controlador: Verificamos si la solicitud del cliente tiene lo mínimo requerido
        if(!nombre || !correo || !contrasena) {
            return res.status(400).json({ error: 'Todos los campos (nombre, correo, contrasena) son obligatorios.' });
        }

        const usuario = await registrarUsuario(nombre, correo, contrasena);
        
        // 201 Significa un recurso "Creado Exitosamente"
        res.status(201).json({ mensaje: 'Usuario registrado exitosamente', usuario });
    } catch (error) {
        // En caso del Error lanzado por Duplicidad o servidor interno
        res.status(400).json({ error: error.message });
    }
};

/**
 * Controlador de Iniciar Sesión
 */
export const iniciarSesion = async (req, res) => {
    try {
        const { correo, contrasena } = req.body;

        if(!correo || !contrasena) {
            return res.status(400).json({ error: 'Correo y contraseña son obligatorios.' });
        }

        const resultado = await iniciarSesionUsuario(correo, contrasena);
        
        // 200 Significa "Solicitud exitosa - Operación completada"
        res.status(200).json(resultado);
    } catch (error) {
        // En caso de las credenciales no válidas devolvemos mensaje HTML de acceso de "No Autorizado" (401)
        res.status(401).json({ error: error.message });
    }
};
