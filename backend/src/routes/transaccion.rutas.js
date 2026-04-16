import { Router } from 'express';
// Cargas completas de nuestra central controladora del HTTP.
import { crear, obtenerTodas, actualizar, eliminar } from '../controllers/transaccion.controlador.js';
// Importación clave: Nuestro escudo o aduana fronteriza (Middleware verficador).
import { verificarToken } from '../middlewares/verificarToken.js';
import { validadorTransaccion, validadorIdTransaccion } from '../middlewares/validarTransaccion.js';

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
// Aquí intervienen TRES escudos: Tienes Token? -> Es un HashID Valido? -> Trae números limpios la edicion? -> ¡ACTUALIZA BDD!
enrutador.put('/:id', validadorIdTransaccion, validadorTransaccion, actualizar);

// [Borrado por ID Mongo]: Endpoint -> DELETE /api/transacciones/:id
enrutador.delete('/:id', validadorIdTransaccion, eliminar);

export default enrutador;
