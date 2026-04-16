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
    <div style={{ 
        padding: '2.5rem 2rem', 
        maxWidth: '420px', 
        margin: '5rem auto', // Empuja la tarjeta hacia el centro de la pantalla
        fontFamily: 'sans-serif',
        background: '#ffffff', // Fondo sólido diferenciador
        borderRadius: '16px',
        boxShadow: '0 12px 35px rgba(0,0,0,0.08)', // Sombra elevada Premium
        border: '1px solid rgba(0,0,0,0.06)'
    }}>
      <h1 style={{ color: 'var(--text)', fontSize: '1.8rem', margin: '0 0 0.5rem 0' }}>Bienvenido de nuevo</h1>
      <p style={{ color: 'var(--text)', opacity: 0.7, marginBottom: '1.5rem', marginTop: 0, fontSize: '0.95rem' }}>Ingresa tus credenciales para continuar.</p>

      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input 
                type="email" 
                placeholder="tucorreo@empresa.com" 
                required 
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                style={{ padding: '0.8rem', background: '#ffffff', border: '1px solid rgba(0,0,0,0.15)', color: 'var(--text)', borderRadius: '8px' }}
                disabled={cargando}
            />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px'}}>
            <input 
                type="password" 
                placeholder="Introduce tu clave secreta" 
                required 
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                style={{ padding: '0.8rem', background: '#ffffff', border: '1px solid rgba(0,0,0,0.15)', color: 'var(--text)', borderRadius: '8px' }}
                disabled={cargando}
            />
            {/* BOTÓN OLVIDÉ CONTRASEÑA */}
            <div style={{ textAlign: 'right', marginTop: '5px' }}>
                <span 
                    onClick={() => toast("Solicitud enviada (Módulo de Email disponible en V 2.0)", { icon: '📨', style: {background: 'var(--secondary)', color: '#fff'} })}
                    style={{ color: 'var(--text)', opacity: 0.7, fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline' }}
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
                backgroundColor: cargando ? '#d1d5db' : 'var(--accent)', 
                color: 'white', 
                cursor: cargando ? 'not-allowed' : 'pointer', 
                fontWeight: '600',
                transition: 'opacity 0.2s',
                border: 'none',
                borderRadius: '8px'
            }}
        >
           {cargando ? 'Autenticando...' : 'Acceder al Panel'}
        </button>
      </form>
      
      {/* MEJORA UX CLARA: CALL TO ACTION PARA REGISTRO */}
      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <span style={{ color: 'var(--text)', opacity: 0.7, fontSize: '0.9rem' }}>¿Aún no tienes una cuenta? </span>
          <Link to="/register" style={{ color: 'var(--accent)', fontWeight: '600', textDecoration: 'none', fontSize: '0.9rem' }}>Créala gratis aquí</Link>
      </div>
    </div>
  );
};

export default Login;
