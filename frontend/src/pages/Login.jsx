import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api.js'; // Nuestra arma cargada con axios

const Login = () => {
  const navigate = useNavigate();
  // Enganchamos el HTML y React con control de estados
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [errorBackend, setErrorBackend] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorBackend(null); // Limpiamos errores previos al presionar submit
    
    try {
        /*
          [LLAMADA REAL AL BACKEND]
          El .post() ataca automáticamente la URL base: "http://localhost:3000/api" + "/autenticacion/login"
        */
        const respuesta = await api.post('/autenticacion/login', {
            correo,
            contrasena
        });

        // Extraemos nuestro "Pasaporte Sellado" desde la entraña del JSON
        const tokenRealDelServidor = respuesta.data.token;
        
        // Lo atornillamos a la Memoria Local
        localStorage.setItem('token', tokenRealDelServidor);
        
        console.log("¡Logueo real concretado con éxito contra Mongo BD!");
        
        // Empujamos confiadamente al usuario hacia las entrañas privadas de la web
        navigate('/dashboard');
        
    } catch (error) {
        // En caso de Contraseña equivocada (401), o caída del puerto 3000
        setErrorBackend(error.response?.data?.error || "Servidor temporalmente inalcanzable.");
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1>Acceso Seguro 🔒</h1>
      
      {/* Zona de Render Condicional para Desastres o Fallos */}
      {errorBackend && (
          <div style={{ color: 'white', backgroundColor: '#e74c3c', padding: '10px', borderRadius: '5px', marginBottom: '15px' }}>
              Error: {errorBackend}
          </div>
      )}

      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input 
            type="email" 
            placeholder="tucorreo@empresa.com" 
            required 
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            style={{ padding: '0.8rem' }}
        />
        <input 
            type="password" 
            placeholder="Introduce tu clave secreta" 
            required 
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            style={{ padding: '0.8rem' }}
        />
        
        <button type="submit" style={{ padding: '0.8rem', backgroundColor: '#333', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}>
           Conectar con Base de Datos
        </button>
      </form>
      <p style={{ marginTop: '1rem', textAlign: 'center' }}>
        ¿Negocio nuevo por aquí? <Link to="/register">Lleva tus cuentas gratis</Link>
      </p>
    </div>
  );
};

export default Login;
