import mongoose from 'mongoose';

/**
 * Función encargada de establecer la conexión con la base de datos de MongoDB.
 */
export const conectarBD = async () => {
    try {
        // En producción procesaremos una URI remota y segura (ej. Mongo Atlas)
        const url = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/dashboard_financiero';
        await mongoose.connect(url);
        console.log('✅ Base de datos MongoDB conectada con éxito.');
    } catch (error) {
        console.error('❌ Error al conectar a MongoDB:', error.message);
        process.exit(1); // Detiene la app si la base de datos no es accesible
    }
};
