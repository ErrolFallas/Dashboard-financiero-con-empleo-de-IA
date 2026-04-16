import express from 'express';
import cors from 'cors'; // Librería fundamental para permitir la unión Frontend react-vite (5173) y Backend node (3000)

// Importamos módulos de enrutadores locales
import rutasDeEstado from './routes/estado.rutas.js';
import rutasAutenticacion from './routes/autenticacion.rutas.js';
import rutasTransaccion from './routes/transaccion.rutas.js';
import rutasIA from './routes/ia.rutas.js'; 

const aplicacion = express();

// --- ZONA DE INTERMEDIARIOS GLOBALES ---
// Inyectamos CORS primero para que el navegador de React no bloquee nuestras respuestas API
aplicacion.use(cors());
aplicacion.use(express.json());

// --- ZONA DE ENRUTAMIENTO PRINCIPAL ---
aplicacion.use('/api', rutasDeEstado);
aplicacion.use('/api/autenticacion', rutasAutenticacion);
aplicacion.use('/api/transacciones', rutasTransaccion);
aplicacion.use('/api/analisis', rutasIA);

export default aplicacion;
