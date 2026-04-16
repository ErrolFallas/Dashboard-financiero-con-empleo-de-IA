import { Router } from 'express';
// Cargas completas de nuestra central controladora del HTTP.
import { crear, obtenerTodas, actualizar, eliminar } from '../controllers/transaccion.controlador.js';
// Importación clave: Nuestro escudo o aduana fronteriza (Middleware verficador).
import { verificarToken } from '../middlewares/verificarToken.js';
import { validadorTransaccion } from '../middlewares/validarTransaccion.js';

const enrutador = Router();

// ==========================================
// CAPA PROTECTORA OBLIGATORIA DE IDENTIDAD
// ==========================================
enrutador.use(verificarToken);

// [Crear]: Endpoint -> POST /api/transacciones/
// Aquí ocurren 2 escudos: JWT -> Filtro de Cantidades Validadas -> Y al final Crear en BD.
enrutador.post('/', validadorTransaccion, crear);

// [Leer Todss]: Endpoint -> GET /api/transacciones/
enrutador.get('/', obtenerTodas);

// [Actualizar por ID Mongo]: Endpoint -> PUT /api/transacciones/:id
// También forzamos la misma validación robusta para impedir corromper los datos previamente buenos.
enrutador.put('/:id', validadorTransaccion, actualizar);

// [Borrado por ID Mongo]: Endpoint -> DELETE /api/transacciones/:id
enrutador.delete('/:id', eliminar);

export default enrutador;
