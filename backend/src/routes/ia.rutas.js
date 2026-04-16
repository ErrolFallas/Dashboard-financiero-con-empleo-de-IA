import { Router } from 'express';
import { analizarEstadosHTTP } from '../controllers/ia.controlador.js';
import { verificarToken } from '../middlewares/verificarToken.js';

const enrutador = Router();

// Blindaje fundamental
enrutador.use(verificarToken);

// [Analizar]: Endpoint -> POST /api/analisis
enrutador.post('/', analizarEstadosHTTP);

export default enrutador;
