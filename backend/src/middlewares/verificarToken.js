import jwt from 'jsonwebtoken';

/**
 * Intermediario (Middleware) Guardían del Panel Administrativo de Usuarios
 * Se encarga de verificar que el Head "Authorization" traiga una cinta de seguridad que podamos interpretar.
 */
export const verificarToken = (req, res, next) => {
    const cabeceraAutorizacion = req.headers['authorization'];

    // Validamos que el esquema esperado sea "Bearer <token>" en lugar de mandar basura
    if (!cabeceraAutorizacion || !cabeceraAutorizacion.startsWith('Bearer ')) {
        return res.status(403).json({ error: 'Acceso bloqueado. El JWT en sus headers de acceso no fue detectado o su formato es irreconocible.' });
    }

    const token = cabeceraAutorizacion.split(' ')[1]; // Cortamos la palabra Bearer y nos quedamos con el cifrado puro

    try {
        const llaveSecreta = process.env.JWT_SECRET;
        
        // Bloque de Choque Frontal en caso de subir Backend sin Variables de Entorno Seguras
        if (!llaveSecreta && process.env.NODE_ENV !== 'development') {
            throw new Error("INCIDENTE CIBERNÉTICO: Se intentó procesar un Token en un Servidor en Nube sin Llave Secreta.");
        }
        
        const secretoFinal = llaveSecreta || 'llave_super_secreta_desarrollo';
        
        // jwt.verify lanzará un error forzoso si el token ha sido manipulado a la fuerza o si expiró
        const payloadVerificado = jwt.verify(token, secretoFinal);
        
        // Si el cliente aprueba la evaluación técnica, inyectamos sus datos descifrados
        req.usuarioVerificado = payloadVerificado;
        
        // Y por fin dejamos continuar al ciclo interno de express  
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Tu sesión actual no es válida o su plazo de actividad ha finalizado por seguridad. Vuelve a hacer login.' });
    }
};
