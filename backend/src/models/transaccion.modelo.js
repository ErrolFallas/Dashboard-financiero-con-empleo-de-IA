import mongoose from 'mongoose';

// Definimos la estructura rígida que tendrán las finanzas en la Base de Datos
const esquemaDeTransaccion = new mongoose.Schema({
    type: { // El tipo debe ser obligatoriamente un Ingreso o un Gasto
        type: String,
        enum: ['income', 'expense'],
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0 // Prevención: Un gasto se define por su 'type', no debe haber montos en negativo
    },
    category: {
        type: String, // Ej: "Alquiler", "Sueldos", "Ventas"
        required: true,
        trim: true
    },
    date: {
        type: Date,
        default: Date.now // Si desde el frontend u operaciòn HTTP no envían fecha, tomará el instante exacto
    },
    userId: {
        // Enlace Fuerte (Referencia). Toda transacción pertenece firmemente y de manera única a un ID de usuario.
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario', 
        required: true
    }
}, {
    timestamps: true
});

export default mongoose.model('Transaccion', esquemaDeTransaccion);
