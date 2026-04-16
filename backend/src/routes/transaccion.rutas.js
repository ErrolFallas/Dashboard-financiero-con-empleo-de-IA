import { Router } from 'express';
// Cargas completas de nuestra central controladora del HTTP.
import { crear, obtenerTodas, actualizar, eliminar } from '../controllers/transaccion.controlador.js';
// Importación clave: Nuestro escudo o aduana fronteriza (Middleware verficador).
import { verificarToken } from '../middlewares/verificarToken.js';

const enrutador = Router();

// ==========================================
// CAPA PROTECTORA OBLIGATORIA
// Aplicamos el middleware "verificarToken" globalmente a todo el enrutador.
// Así, de esta línea para abajo NINGUNA ruta puede si quiera ejecutarse si no entra JWT sano en los Headers.
// ==========================================
enrutador.use(verificarToken);

// [Crear]: Endpoint -> POST /api/transacciones/
enrutador.post('/', crear);

// [Leer Todss]: Endpoint -> GET /api/transacciones/
enrutador.get('/', obtenerTodas);

// [Actualizar por ID Mongo]: Endpoint -> PUT /api/transacciones/:id
enrutador.put('/:id', actualizar);

// [Borrado por ID Mongo]: Endpoint -> DELETE /api/transacciones/:id
enrutador.delete('/:id', eliminar);

export default enrutador;
