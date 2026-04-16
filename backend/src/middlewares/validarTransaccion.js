import { check, param, validationResult } from 'express-validator';

export const validadorTransaccion = [
    // ===============================================
    // 1. EL POLICÍA DE DATOS (Mapeo Quirúrgico de la Petición)
    // ===============================================
    check('type')
        .notEmpty().withMessage('El tipo de transacción es estrictamente obligatorio.')
        .isIn(['income', 'expense']).withMessage('El tipo debe limitarse al catálogo: "income" o "expense".'),
        
    check('amount')
        .notEmpty().withMessage('El monto contable no puede estar vacío.')
        .isNumeric().withMessage('El monto contable debe de ser un número limpio válido.')
        // Validamos la regla del core business pidiendo montos mayores a cero.
        .isFloat({ gt: 0 }).withMessage('Atención: El monto debe ser matemáticamente mayor a 0.'),

    check('category')
        .notEmpty().withMessage('La clasificación contable no puede venir nula.')
        .isIn(['Comida', 'Transporte', 'Alquiler', 'Servicios', 'Entretenimiento', 'Sueldos', 'Insumos', 'Otros', 'Ventas de mostrador', 'Ventas Online', 'Servicios Profesionales', 'Inversiones'])
        .withMessage('Rechazado: La categoría proporcionada se encuentra fuera del catálogo autorizado.'),
        
    check('date')
        .notEmpty().withMessage('La fecha calendario es un requisito inamovible.')
        .isISO8601().withMessage('Formato temporal erróneo. Se exige timestamp ISO 8601.'),

    // ===============================================
    // 2. INTERCEPTOR ESTÁNDAR DE ERROR (Pre-Controller)
    // ===============================================
    (req, res, next) => {
        // Express-Validator nos indica mediante un arreglo si la carga rompió algún filtro
        const incidentes = validationResult(req);
        
        // ¡Se activan las alertas! Cortamos el tráfico inmediatamente regresando el estatus 400.
        if (!incidentes.isEmpty()) {
            // Se le retorna obligatoriamente a Postman o Vite la respuesta Estandarizada que pediste
            return res.status(400).json({
                success: false,
                message: "Error de validación",
                
                // Mapeamos un detalle puro opcional para que el Frontend o cliente sepa por qué se le bloqueó
                erroresAdicionales: incidentes.array().map(e => e.msg)
            });
        }
        
        // Si todo está inmaculado y pasaste la aduana, permitimos continuar el flujo al Controller.
        next();
    }
];

// ===============================================
// 3. SELLO ANTIBOMBAS DE PARÁMETROS URI (MONGO_ID)
// ===============================================
// Intercepta peticiones del tipo /transacciones/123 y las bloquea porque Mongo usa 24 chars Hex.
export const validadorIdTransaccion = [
    param('id')
        .isMongoId().withMessage('Rechazo automático: El ID de transacción proveído no pertenece a un objeto hexadecimal válido.'),
        
    (req, res, next) => {
        const fallos = validationResult(req);
        if(!fallos.isEmpty()){
            return res.status(400).json({
                success: false,
                message: "Estructura de petición asíncrona corrupta",
                erroresAdicionales: fallos.array().map(e => e.msg)
            });
        }
        next();
    }
];
