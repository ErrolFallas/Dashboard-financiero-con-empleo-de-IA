import express from 'express';
import cors from 'cors'; 
import helmet from 'helmet'; // [NUEVA SEGURIDAD] Protector Universal Header Shield
// Importamos módulos de enrutadores locales
import rutasDeEstado from './routes/estado.rutas.js';
import rutasAutenticacion from './routes/autenticacion.rutas.js';
import rutasTransaccion from './routes/transaccion.rutas.js';
import rutasIA from './routes/ia.rutas.js'; 

// Importación Clave: Gestor Mudo de Errores
import { errorHandler } from './middlewares/errorHandler.js';

const aplicacion = express();

// --- ZONA DE INTERMEDIARIOS GLOBALES ---
// 1. HELMET: Sella el backend ocultando firmas, metadata X-Powered-By y sumando protecciones XSS nativas sobre cabeceras.
aplicacion.use(helmet());

// 2. CORS RESTRINGIDO: Cortamos el acceso abierto de Internet a nuestra API de datos. Solo el Frontend Vite está autorizado.
const dominiosBloqueados = ['http://localhost:5173']; 
aplicacion.use(cors({
    origin: function(origin, callback) {
        // En entorno local de equipo (Postman) a veces no se emite origin HTTP. Lo toleramos.
        // Mientras que llamadas cruzadas tipo script deben coincidir con la lista blanca.
        if (!origin || dominiosBloqueados.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Acceso bloqueado: Violación a política corporativa CORS.'));
        }
    },
    credentials: true // Permite intercambio de credenciales protegidas
}));

aplicacion.use(express.json());

// --- ZONA DE ENRUTAMIENTO PRINCIPAL ---
aplicacion.use('/api', rutasDeEstado);
aplicacion.use('/api/autenticacion', rutasAutenticacion);
aplicacion.use('/api/transacciones', rutasTransaccion);
aplicacion.use('/api/analisis', rutasIA);

// =========================================
// MURO FINAL: CAPTURADOR GLOBAL DE ERRORES
// =========================================
// Este middleware DEBE conectarse obligatoriamente hasta el FINAL, debajo de *todas* las demás rutas.
aplicacion.use(errorHandler);

export default aplicacion;
