import { Router } from 'express';
import { registrar, iniciarSesion } from '../controllers/autenticacion.controlador.js';

// Aduanas de Seguridad Frontend
import { validadorRegistro, validadorLogin } from '../middlewares/validarAutenticacion.js';

const enrutador = Router();

// Endpoint -> /api/autenticacion/registro
enrutador.post('/registro', validadorRegistro, registrar);

// Endpoint -> /api/autenticacion/login
enrutador.post('/login', validadorLogin, iniciarSesion);

export default enrutador;
