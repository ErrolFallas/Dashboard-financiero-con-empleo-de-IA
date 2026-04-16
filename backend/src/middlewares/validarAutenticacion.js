import { check, validationResult } from 'express-validator';

// 1. Escudo para Creación Nueva
export const validadorRegistro = [
    check('nombre')
        .notEmpty().withMessage('Su nombre principal o de empresa es requerido.')
        .trim().escape(), // Limpieza automática del input
    check('correo')
        .notEmpty().withMessage('El correo electrónico no puede venir vacío.')
        .isEmail().withMessage('El formato dictado no corresponde a un Email legal.'),
    check('contrasena')
        .notEmpty().withMessage('Una clave de acceso es estrictamente necesaria.')
        // Regla militar: Mínimo 8 caracteres siempre.
        .isLength({ min: 8 }).withMessage('Por políticas de seguridad, la contraseña debe contener como mínimo 8 caracteres alfanuméricos.'),
    
    // Interceptor Resolutivo
    (req, res, next) => {
        const incidentes = validationResult(req);
        if (!incidentes.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "Incumplimiento de políticas de registro corporativo",
                erroresAdicionales: incidentes.array().map(e => e.msg)
            });
        }
        next();
    }
];

// 2. Escudo para Retorno al Sistema
export const validadorLogin = [
    check('correo')
        .notEmpty().withMessage('Aporta tu correo electrónico para procesar el acceso.')
        .isEmail().withMessage('El texto propuesto es ilegible como Email.'),
    check('contrasena')
        .notEmpty().withMessage('La cerradura requiere llaves de acceso.'),
        
    (req, res, next) => {
        const incidentes = validationResult(req);
        if (!incidentes.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "Intento de intrusión fallido por anomalías de escritura",
                erroresAdicionales: incidentes.array().map(e => e.msg)
            });
        }
        next();
    }
];
