import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import toast from 'react-hot-toast'; // Proveedor Global de Notificaciones Premium

const Register = () => {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState(''); // Nuevo input anti-errores
  const [cargando, setCargando] = useState(false); // Seguro Antibots

  const handleRegister = async (e) => { 
      e.preventDefault();
      setCargando(true);
      
      // Bloqueo de Muros Cruzados UX
      if (contrasena !== confirmarContrasena) {
          toast.error("❌ Las contraseñas no coinciden. Inténtalo de nuevo.");
          setCargando(false);
          return;
      }
      
      try {
          const respuesta = await api.post('/autenticacion/registro', {
              nombre, correo, contrasena
          });
          
          toast.success("¡Negocio registrado exitosamente! Ya puedes iniciar sesión.");
          navigate('/login'); // Lo empujamos a la vista de login tras el éxito
      } catch (error) {
          // El interceptor central captura todo. Renderizamos su mensaje humano
          toast.error(error.mensajeCustomizado || "Falló la creación del negocio.");
      } finally {
          setCargando(false);
      }
  };

  return (
    <div style={{ 
        padding: '2.5rem 2rem', 
        maxWidth: '420px', 
        margin: '4rem auto', 
        fontFamily: 'sans-serif',
        background: '#ffffff', 
        borderRadius: '16px',
        boxShadow: '0 12px 35px rgba(0,0,0,0.08)',
        border: '1px solid rgba(0,0,0,0.06)'
    }}>
        <h1 style={{ color: 'var(--text)', fontSize: '1.8rem', margin: '0 0 0.5rem 0' }}>Crea tu Cuenta</h1>
        <p style={{ color: 'var(--text)', opacity: 0.7, marginBottom: '1.5rem', marginTop: 0, fontSize: '0.95rem' }}>Comienza a gestionar tus finanzas hoy mismo.</p>
        
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input 
                type="text" 
                placeholder="Nombre de la Empresa o Emprendedor" 
                required 
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                style={{ padding: '0.8rem', background: '#ffffff', border: '1px solid rgba(0,0,0,0.15)', color: 'var(--text)', borderRadius: '8px' }}
                disabled={cargando}
            />
            <input 
                type="email" 
                placeholder="tucorreo@empresa.com" 
                required 
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                style={{ padding: '0.8rem', background: '#ffffff', border: '1px solid rgba(0,0,0,0.15)', color: 'var(--text)', borderRadius: '8px' }}
                disabled={cargando}
            />
            {/* Agregamos Hint Visual de los 8 caracteres */}
            <input 
                type="password" 
                placeholder="Crea una clave (Mínimo 8 caracteres)" 
                required 
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                style={{ padding: '0.8rem', background: '#ffffff', border: '1px solid rgba(0,0,0,0.15)', color: 'var(--text)', borderRadius: '8px' }}
                disabled={cargando}
            />
            
            {/* Campo Confirmación de Clave */}
            <input 
                type="password" 
                placeholder="Repite tu contraseña para confirmarla" 
                required 
                value={confirmarContrasena}
                onChange={(e) => setConfirmarContrasena(e.target.value)}
                style={{ padding: '0.8rem', background: '#ffffff', border: '1px solid rgba(0,0,0,0.15)', color: 'var(--text)', borderRadius: '8px' }}
                disabled={cargando}
            />
            
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
                {cargando ? 'Procesando...' : 'Registrarme'}
            </button>
        </form>
        
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <span style={{ color: 'var(--text)', opacity: 0.7, fontSize: '0.9rem' }}>¿Ya tienes una cuenta? </span>
          <Link to="/login" style={{ color: 'var(--accent)', fontWeight: '600', textDecoration: 'none', fontSize: '0.9rem' }}>Inicia Sesión</Link>
        </div>
    </div>
  );
};

export default Register;
