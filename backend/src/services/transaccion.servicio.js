import Transaccion from '../models/transaccion.modelo.js';

/**
 * Servicio Integrador de Creación
 */
export const crearTransaccion = async (datosTransaccion, usuarioId) => {
    // Fusionamos e inyectamos forzosamente el usuarioId del solicitante a la transacción para asegurar propiedad.
    const nuevaTransaccion = new Transaccion({ 
        ...datosTransaccion, 
        userId: usuarioId 
    });
    return await nuevaTransaccion.save();
};

/**
 * Servicio Lector Aislado
 */
export const obtenerTransaccionesDeUsuario = async (usuarioId) => {
    // Interrogamos a MongoDB pidiendo rigurosamente únicamente las del userId
    // ".sort({ date: -1 })" ordena cronológicamente de la más reciente a la más vieja
    return await Transaccion.find({ userId: usuarioId }).sort({ date: -1 });
};

/**
 * Servicio Analítico de Modificación 
 */
export const actualizarTransaccion = async (transaccionId, datosNuevos, usuarioId) => {
    // findOneAndUpdate buscará por AMBOS criterios: Que el registro exista, Y que el usuario que peticiona sea el verdadero dueño
    const transaccionActualizada = await Transaccion.findOneAndUpdate(
        { _id: transaccionId, userId: usuarioId },
        datosNuevos,
        { new: true, runValidators: true } // 'new' le avisa a mongoose que sobreescriba y devuelva la versión fresca al cliente
    );

    if (!transaccionActualizada) {
        throw new Error('Lo sentimos, esa transacción no fue encontrada o le pertenece a otro negocio.');
    }

    return transaccionActualizada;
};

/**
 * Servicio Destructor
 */
export const eliminarTransaccion = async (transaccionId, usuarioId) => {
    // Al igual que actualización, destruye SOLO si cruzan ambos datos (ID del Gasto y quien manda la solicitud es el dueño)
    const transaccionEliminada = await Transaccion.findOneAndDelete({ 
        _id: transaccionId, 
        userId: usuarioId 
    });
    
    if (!transaccionEliminada) {
        throw new Error('Lo sentimos, esa transacción no fue encontrada o le pertenece a otro negocio.');
    }

    return transaccionEliminada;
};
