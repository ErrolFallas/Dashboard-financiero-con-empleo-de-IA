import { Link } from 'react-router-dom';

const Register = () => {
  // Lógica de registro inactiva momentáneamente en esta fase Frontend inicial
  const handleRegister = (e) => { e.preventDefault(); };

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto', fontFamily: 'sans-serif' }}>
        <h1>Nuevo Emprendedor 🚀</h1>
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input type="text" placeholder="Empresa SA" required style={{ padding: '0.8rem' }}/>
            <input type="email" placeholder="Correo" required style={{ padding: '0.8rem' }}/>
            <input type="password" placeholder="Clave" required style={{ padding: '0.8rem' }}/>
            <button type="submit" style={{ padding: '0.8rem', backgroundColor: '#3b82f6', color: 'white', cursor: 'pointer' }}>Crear Negocio</button>
        </form>
        <p style={{ marginTop: '1rem', textAlign: 'center' }}>
          <Link to="/login">Volver a Login</Link>
        </p>
    </div>
  );
};

export default Register;
