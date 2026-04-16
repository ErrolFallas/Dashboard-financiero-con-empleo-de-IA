import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import toast from 'react-hot-toast'; // Proveedor Global de Notificaciones Premium

const Register = () => {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [cargando, setCargando] = useState(false); // Seguro Antibots

  const handleRegister = async (e) => { 
      e.preventDefault();
      setCargando(true);
      
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
    <div style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto', fontFamily: 'sans-serif' }}>
        <h1 style={{ color: '#f8fafc' }}>Nuevo Emprendedor 🚀</h1>
        
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input 
                type="text" 
                placeholder="Nombre de la Empresa o Emprendedor" 
                required 
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                style={{ padding: '0.8rem', background: '#1e293b', border: '1px solid #334155', color: '#f8fafc', borderRadius: '8px' }}
                disabled={cargando}
            />
            <input 
                type="email" 
                placeholder="tucorreo@empresa.com" 
                required 
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                style={{ padding: '0.8rem', background: '#1e293b', border: '1px solid #334155', color: '#f8fafc', borderRadius: '8px' }}
                disabled={cargando}
            />
            {/* Agregamos Hint Visual de los 8 caracteres */}
            <input 
                type="password" 
                placeholder="Crea una clave (Mínimo 8 caracteres)" 
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
                    backgroundColor: cargando ? '#475569' : '#10b981', // Verde éxito para registro
                    color: 'white', 
                    cursor: cargando ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold',
                    transition: 'background 0.2s',
                    border: 'none',
                    borderRadius: '8px'
                }}
            >
                {cargando ? 'Registrando Seguridad...' : 'Construir Negocio'}
            </button>
        </form>
        
        <p style={{ marginTop: '1rem', textAlign: 'center', color: '#94a3b8' }}>
          ¿Ya dominas tus finanzas? <Link to="/login" style={{ color: '#38bdf8' }}>Inicia Sesión aquí</Link>
        </p>
    </div>
  );
};

export default Register;
