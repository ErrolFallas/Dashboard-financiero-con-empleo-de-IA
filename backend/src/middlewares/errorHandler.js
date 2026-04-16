/**
 * Middleware Guardián de Errores Globales
 * Intercepta cualquier falla interna que escape de los controladores o base de datos.
 */
export const errorHandler = (err, req, res, next) => {
    // 1. Determinar el código del fallo HTTP. (Si no trae uno definido, asumimos que es una Explosión Fatal 500)
    const status = err.statusCode || 500;
    
    // 2. Extraer el mensaje del error
    let message = err.message || "Error Interno del Servidor";

    // 3. SEGURIDAD: Ocultamiento militar de errores sensibles
    // Si el servidor explotó genuinamente (500) y estamos en Producción, 
    // JAMÁS dejaremos que el cliente lea detalles (como esquemas rotos de Mongo, trazas SQL, etc.)
    if (status === 500 && process.env.NODE_ENV !== 'development') {
        message = "Ha ocurrido un error técnico inesperado. Nuestros ingenieros ya han sido notificados.";
    }

    // 4. Loggear internamente en la consola (Solo para ti dev, el cliente no ve esto)
    console.error(`❌ [LOG CRÍTICO] Código: ${status} | Causa Original: ${err.message}`);
    // console.error(err.stack); // Si ocupa depuración extrema

    // 5. Retornar siempre la firma exacta que pediste
    res.status(status).json({
        success: false,
        status: status, // El número te ayudará a disparar acciones condicionales en el Frontend
        message: message
    });
};
