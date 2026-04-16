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
      <h1 style={{ color: '#f8fafc', fontSize: '1.8rem', marginBottom: '0.5rem' }}>Bienvenido de nuevo</h1>
      <p style={{ color: '#94a3b8', marginBottom: '1.5rem', marginTop: 0, fontSize: '0.95rem' }}>Ingresa tus credenciales para continuar.</p>

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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px'}}>
            <input 
                type="password" 
                placeholder="Introduce tu clave secreta" 
                required 
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                style={{ padding: '0.8rem', background: '#1e293b', border: '1px solid #334155', color: '#f8fafc', borderRadius: '8px' }}
                disabled={cargando}
            />
            {/* BOTÓN OLVIDÉ CONTRASEÑA */}
            <div style={{ textAlign: 'right', marginTop: '5px' }}>
                <span 
                    onClick={() => toast("Solicitud enviada (Módulo de Email disponible en V 2.0)", { icon: '📨', style: {background: '#334155', color: '#fff'} })}
                    style={{ color: '#94a3b8', fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline' }}
                >
                    ¿Olvidaste tu contraseña?
                </span>
            </div>
        </div>
        
        <button 
            type="submit" 
            disabled={cargando}
            style={{ 
                marginTop: '0.6rem',
                padding: '0.85rem', 
                backgroundColor: cargando ? '#475569' : '#3b82f6', 
                color: 'white', 
                cursor: cargando ? 'not-allowed' : 'pointer', 
                fontWeight: '600',
                transition: 'background 0.2s',
                border: 'none',
                borderRadius: '8px'
            }}
        >
           {cargando ? 'Autenticando...' : 'Acceder al Panel'}
        </button>
      </form>
      
      
      {/* MEJORA UX CLARA: CALL TO ACTION PARA REGISTRO */}
      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>¿Aún no tienes una cuenta? </span>
          <Link to="/register" style={{ color: '#3b82f6', fontWeight: '600', textDecoration: 'none', fontSize: '0.9rem' }}>Créala gratis aquí</Link>
      </div>
    </div>
  );
};

export default Login;
