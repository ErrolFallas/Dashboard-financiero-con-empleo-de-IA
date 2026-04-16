import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    // Estado crítico: Rastrearemos si existe una explosión fatal en algún hijo de React
    this.state = { hasError: false, errorInfo: null };
  }

  // Si algún componente hijo falla, React automáticamente llama a esta función
  static getDerivedStateFromError(error) {
    // Encendemos la alarma interna del estado
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Aquí puedes mandar el reporte silencioso a un servicio como Datadog o Sentry
    console.error("🛡️ [ErrorBoundary] React previno un pantallazo blanco. Traza:", errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      // 🚨 PANTALLA DE SALVAVIDAS (Frenamos en seco la destrucción de toda la App)
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', padding: '2rem', textAlign: 'center', backgroundColor: '#0b0f19', color: '#f8fafc', fontFamily: 'sans-serif' }}>
          <h1 style={{ color: '#f43f5e', margin: 0, fontSize: '2.5rem' }}>Fallo Crítico Interceptado</h1>
          <p style={{ maxWidth: '500px', color: '#94a3b8', fontSize: '1.2rem', margin: '1rem 0 2rem 0' }}>
            Nuestro escudo visual detectó que uno de los gráficos o estructuras sufrió un error crítico leyendo datos. La aplicación está a salvo y no perdiste información, pero requieres reiniciar la vista.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            style={{ padding: '0.8rem 1.5rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold', transition: 'background 0.2s' }}
            onMouseOver={(e) => e.target.style.background = '#2563eb'}
            onMouseOut={(e) => e.target.style.background = '#3b82f6'}
          >
            Refrescar y Reactivar
          </button>
        </div>
      );
    }

    // Si todo está funcionando como la seda, simplemente renderizamos la App normal
    return this.props.children; 
  }
}

export default ErrorBoundary;
