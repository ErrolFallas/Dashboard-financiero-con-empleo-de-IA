import { obtenerEstadoDelSistema } from '../services/estado.servicio.js';

/**
 * Función controladora para comprobar que nuestro programa corre adecuadamente.
 * Únicamente se encarga de recibir la petición del cliente y mandar la debida respuesta HTTP.
 */
export const revisarEstado = (req, res) => {
    try {
        // Extraemos los datos haciendo un llamado hacia nuestra lógica pura ubicada en 'services'
        const estado = obtenerEstadoDelSistema();
        
        // Retornamos 200 que significa ÉXITO mandando los datos en formato .json
        res.status(200).json(estado);
    } catch (error) {
        // En caso de fallas regresamos un código de error de Servidor Interno (500)
        res.status(500).json({ error: 'Hubo un inconveniente al comprobar el estado del sistema.' });
    }
};
