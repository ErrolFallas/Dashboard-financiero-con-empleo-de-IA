import Usuario from '../models/usuario.modelo.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/**
 * Servicio puro encargado de Registrar a los Usuarios
 */
export const registrarUsuario = async (nombre, correo, contrasenaPlana) => {
    // 1. Verificamos primeramente si el correo ya existe dentro de la colección
    const usuarioExistente = await Usuario.findOne({ correo });
    if (usuarioExistente) {
        throw new Error('El correo ingresado ya se encuentra registrado.');
    }

    // 2. Hasheado de Seguridad. Encriptamos la contraseña para jamás guardarla plana
    const rondasDeSal = await bcrypt.genSalt(10);
    const contrasenaHasheada = await bcrypt.hash(contrasenaPlana, rondasDeSal);

    // 3. Crear el molde virtual de nuestro nuevo usuario
    const nuevoUsuario = new Usuario({
        nombre,
        correo,
        contrasena: contrasenaHasheada
    });

    // 4. Guardarlo de verdad en MongoDB
    await nuevoUsuario.save();

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
    // 1. Validamos que el correo exista
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
        throw new Error('Credenciales inválidas.');
    }

    // 2. Comparamos su contraseña con la de la Base de Datos con el encriptador bcrypt
    const esContrasenaCorrecta = await bcrypt.compare(contrasenaPlana, usuario.contrasena);
    if (!esContrasenaCorrecta) {
        throw new Error('Credenciales inválidas.');
    }

    // 3. Todo está en orden. Procedemos a firmar el token JWT de acceso.
    const llaveSecreta = process.env.JWT_SECRET || 'llave_super_secreta_desarrollo';
    const token = jwt.sign(
        { id: usuario._id, correo: usuario.correo }, // Esto es el 'Payload' de nuestro token (datos públicos)
        llaveSecreta,
        { expiresIn: '1d' } // Configuramos a que el token expire en 24 Horas
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
