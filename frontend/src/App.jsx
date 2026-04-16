import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // Instanciador global de burbujas flotantes

// Importamos nuestra Barrera de Seguridad FrontEnd
import PrivateRoute from './router/PrivateRoute.jsx';

// Páginas de Vistas
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';

function App() {
  return (
    <>
      {/* 
         El TAG TOASTER escucha de forma global. Solo se declara 1 vez en toda la App.
         Todos los estilos que definamos aquí los heredarán las burbujitas. 
       */}
      <Toaster 
         position="bottom-right" 
         toastOptions={{
           style: {
             background: '#1e293b', // Estilo oscuro premium igual que las gráficas
             color: '#f8fafc', 
             border: '1px solid #334155',
             fontWeight: '500',
             boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
             padding: '16px'
           },
           success: {
             iconTheme: { primary: '#10b981', secondary: '#fff' }, // Ícono verde éxito
           },
           error: {
             iconTheme: { primary: '#f43f5e', secondary: '#fff' }, // Ícono rojo peligro
           }
         }} 
      />

      <Router>
        <Routes>
          {/* RUTAS PÚBLICAS (No verifican Token) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* RUTAS PRIVADAS */}
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                 <Dashboard />
              </PrivateRoute>
            } 
          />
          
          {/* Fallback de error (Cualquier ruta inventada aterriza en Login) */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
