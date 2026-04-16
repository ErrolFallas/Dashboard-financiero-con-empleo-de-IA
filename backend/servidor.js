// Implementamos la capacidad de leer archivos de entorno base '.env' de manera rápida si existiera uno
import 'dotenv/config'; 
import http from 'http';
import aplicacion from './src/aplicacion.js';
import { conectarBD } from './src/config/baseDatos.js';

const PUERTO = process.env.PORT || 3000;

// Primero, inicializamos la conexión garantizada desde Mongo
conectarBD().then(() => {
    // Si la BD de Mongo arranca viva y bien conectada, solo entonces le montamos encíma nuestro módulo de escucha HTTP 
    const servidor = http.createServer(aplicacion);

    // Ponemos al servidor a escuchar
    servidor.listen(PUERTO, () => {
        console.log(`🚀 Servidor backend corriendo exitosamente en http://localhost:${PUERTO}`);
    });
});
