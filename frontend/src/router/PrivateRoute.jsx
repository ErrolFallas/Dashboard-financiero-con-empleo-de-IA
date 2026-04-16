import { Navigate } from 'react-router-dom';

/**
 * Componente "Escudo" o Envoltura Privada.
 * Actúa exactamente igual que el middleware de Node.js, pero en el lado visual del cliente.
 */
const PrivateRoute = ({ children }) => {
    // 1. Intentamos leer la bóveda local del navegador buscando la credencial
    const token = localStorage.getItem('token');

    // 2. Si el token es Nulo (es decir, el usuario no ha hecho el proceso de Login)
    if (!token) {
        // Lo re-dirigimos forzosamente ("patada") hacia el inicio, bloqueando el acceso al contenido interno.
        return <Navigate to="/login" replace />;
    }

    // 3. Si existe el JWT (pasó el filtro), le permitimos ver el componente interno (ej. Dashboard)
    return children;
};

export default PrivateRoute;
