import Usuario from '../models/usuario.modelo.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/**
 * Servicio puro encargado de Registrar a los Usuarios
 */
export const registrarUsuario = async (nombre, correo, contrasenaPlana) => {
    // 1. ELIMINADA Condición de Carrera (Usuario.findOne). Delegado al esquema estático Unique.

    // 2. Hasheado de Seguridad. Encriptamos la contraseña para jamás guardarla plana
    const rondasDeSal = await bcrypt.genSalt(10);
    const contrasenaHasheada = await bcrypt.hash(contrasenaPlana, rondasDeSal);

    // 3. Crear el molde virtual de nuestro nuevo usuario
    const nuevoUsuario = new Usuario({
        nombre,
        correo,
        contrasena: contrasenaHasheada
    });

    try {
        // 4. Guardarlo de verdad en MongoDB
        await nuevoUsuario.save();
    } catch (error) {
        // Interceptamos la explosión E11000 del driver C++ de Mongo DB para formatear lindo al usuario
        if (error.code === 11000) {
            throw new Error('Ese correo corporativo ya se encuentra vinculado a un negocio en la plataforma.');
        }
        throw error;
    }

    // 5. Devolvemos el "recibo" o copia al cliente pero le borramos el hash de la contraseña por seguridad
    const usuarioRetornado = {
        id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        correo: nuevoUsuario.correo
    };

    return usuarioRetornado;
};

/**
 * Servicio puro encargado de Revisar Sesión y Firmar el JWT
 */
export const iniciarSesionUsuario = async (correo, contrasenaPlana) => {
    // 1. Validamos que el correo exista usando un mensaje inespecífico protector
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
        throw new Error('Credenciales corporativas inválidas.');
    }

    // 2. Comparamos su contraseña con la de la Base de Datos usando bcrypt
    const esContrasenaCorrecta = await bcrypt.compare(contrasenaPlana, usuario.contrasena);
    if (!esContrasenaCorrecta) {
        throw new Error('Credenciales corporativas inválidas.');
    }

    // 3. Procedemos a firmar el token JWT de acceso blindando el entorno.
    const llaveSecreta = process.env.JWT_SECRET;
    
    if (!llaveSecreta && process.env.NODE_ENV !== 'development') {
        throw new Error("FALLO FATAL CIBERNÉTICO: Aplicación Producción carece de firma ENV JWT_SECRET segura.");
    }
    
    // Fallback permitido solo para tu máquina local en desarrollo.
    const secretoFinalSeguro = llaveSecreta || 'llave_super_secreta_desarrollo';

    const token = jwt.sign(
        { id: usuario._id, correo: usuario.correo, nombre: usuario.nombre }, // Mejoramos inyectando el 'nombre'
        secretoFinalSeguro,
        { expiresIn: '1d' } 
    );

    return {
        token,
        usuario: {
            id: usuario._id,
            nombre: usuario.nombre,
            correo: usuario.correo
        }
    };
};
