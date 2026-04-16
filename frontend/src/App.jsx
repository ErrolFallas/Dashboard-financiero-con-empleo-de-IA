import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importamos nuestra Barrera de Seguridad FrontEnd
import PrivateRoute from './router/PrivateRoute.jsx';

// Páginas de Vistas
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';

function App() {
  return (
    <Router>
      <Routes>
        {/* ========================================= */}
        {/* RUTAS PÚBLICAS (No verifican Token)       */}
        {/* ========================================= */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* ========================================= */}
        {/* RUTAS PRIVADAS                            */}
        {/* ========================================= */}
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
               {/* Dashboard jamás se renderiza a menos que PrivateRoute diga "OK" */}
               <Dashboard />
            </PrivateRoute>
          } 
        />
        
        {/* Fallback de error (Cualquier ruta inventada aterriza en Login) */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
