import { Router } from 'express';
import { registrar, iniciarSesion } from '../controllers/autenticacion.controlador.js';

const enrutador = Router();

// Definimos ruta POST para registrar. Quedará publicamente como /api/autenticacion/registro
enrutador.post('/registro', registrar);

// Definimos ruta POST para entrar. Quedará publicamente como /api/autenticacion/login
enrutador.post('/login', iniciarSesion);

export default enrutador;
