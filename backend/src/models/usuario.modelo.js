import mongoose from 'mongoose';

// Planteamos las reglas estrictas de estructura de nuestro Usuario en Base de Datos
const esquemaDeUsuario = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true // Quita espacios vacíos a los lados
    },
    correo: {
        type: String,
        required: true,
        unique: true, // No permitimos correos duplicados
        trim: true,
        lowercase: true
    },
    contrasena: {
        type: String,
        required: true
    }
}, {
    timestamps: true // Función mágica de mongoose que añade las fechas 'createdAt' y 'updatedAt' solo
});

export default mongoose.model('Usuario', esquemaDeUsuario);
