import { Navigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

/**
 * Muro Defensivo Privado de React.
 */
const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');

    // Nivel 1: Verificación de Presencia
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Nivel 2: Verificación de Integridad Matemática Pura de JWT
    try {
        // Extraemos matemáticamente la data pública del token de Node
        const payload = jwtDecode(token);
        
        // Tiempo en formato unix puro a segundos
        const momentoActualSegundos = Date.now() / 1000;
        
        // Si el tiempo actual universal superó a la variable interna pre-grabada de .exp
        if (payload.exp < momentoActualSegundos) {
            console.warn("🛡️ Firewall Frontend: Bloqueando la ruta. La sesión de este Token ha caducado oficialmente.");
            localStorage.removeItem('token'); // Limpieza pura
            return <Navigate to="/login" replace />;
        }
        
    } catch (error) {
        // Nivel 3: Detención de Inyecciones
        // Si alguien insertó en consola: localStorage.setItem('token', 'falso_pirata')
        // La librería jwt-decode explotará, cayendo el código aquí, delatándolo y regresándolo a Login.
        console.error("⛔ Firewall Frontend: Excepción crítica. Cadena irreconocible detectada en la Bóveda del Token.");
        localStorage.removeItem('token');
        return <Navigate to="/login" replace />;
    }

    // Nivel 4: Token intacto y vigente, el acceso a la App procede normalmente.
    return children;
};

export default PrivateRoute;
