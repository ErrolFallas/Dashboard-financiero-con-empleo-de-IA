import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api.js'; 
import toast from 'react-hot-toast'; // Proveedor Global

const Login = () => {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [cargando, setCargando] = useState(false); // Seguro Antibots (Contra Race Conditions de múltiple Click)

  const handleLogin = async (e) => {
    e.preventDefault();
    setCargando(true); // Se baja la barrera. Bloquea dobles envíos.
    
    try {
        const respuesta = await api.post('/autenticacion/login', { correo, contrasena });

        const tokenReal = respuesta.data.token;
        localStorage.setItem('token', tokenReal);
        
        toast.success(`¡Acceso Verificado, ${respuesta.data.usuario.nombre}!`); // UX Saludando Dinámicamente
        
        navigate('/dashboard');
        
    } catch (error) {
        // Delegamos todo el texto del fallo al interceptor 'api.js' en lugar del rudimentario res.status
        toast.error(error.mensajeCustomizado || "Protocolo de red colapsado localmente.");
    } finally {
        setCargando(false); // Sin importar triunfo o derrota, liberamos al botón nuevamente.
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#f8fafc' }}>Acceso Seguro 🔒</h1>

      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input 
            type="email" 
            placeholder="tucorreo@empresa.com" 
            required 
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            style={{ padding: '0.8rem', background: '#1e293b', border: '1px solid #334155', color: '#f8fafc', borderRadius: '8px' }}
            disabled={cargando}
        />
        <input 
            type="password" 
            placeholder="Introduce tu clave secreta" 
            required 
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            style={{ padding: '0.8rem', background: '#1e293b', border: '1px solid #334155', color: '#f8fafc', borderRadius: '8px' }}
            disabled={cargando}
        />
        
        <button 
            type="submit" 
            disabled={cargando}
            style={{ 
                padding: '0.8rem', 
                backgroundColor: cargando ? '#475569' : '#3b82f6', // Transiciones elegantes 
                color: 'white', 
                cursor: cargando ? 'not-allowed' : 'pointer', 
                fontWeight: 'bold',
                transition: 'background 0.2s',
                border: 'none',
                borderRadius: '8px'
            }}
        >
           {cargando ? 'Verificando en MongoDB...' : 'Conectar con Base de Datos'}
        </button>
      </form>
      <p style={{ marginTop: '1rem', textAlign: 'center', color: '#94a3b8' }}>
        ¿Negocio nuevo por aquí? <Link to="/register" style={{ color: '#38bdf8' }}>Lleva tus cuentas gratis</Link>
      </p>
    </div>
  );
};

export default Login;
