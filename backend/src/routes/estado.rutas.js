import { Router } from 'express';
// Importamos la función controladora específica desde la carpeta 'controllers'
import { revisarEstado } from '../controllers/estado.controlador.js';

const enrutador = Router();

// Definimos que al realizar una petición GET a "/estado", se accione el controlador "revisarEstado"
enrutador.get('/estado', revisarEstado);

export default enrutador;
