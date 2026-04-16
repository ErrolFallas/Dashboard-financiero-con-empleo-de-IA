import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Wallet, BrainCircuit } from 'lucide-react';

const Dashboard = () => {
    const navigate = useNavigate();
    const [transacciones, setTransacciones] = useState([]);
    const [analisis, setAnalisis] = useState(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        cargarDatosGlobales();
    }, []);

    const cargarDatosGlobales = async () => {
        try {
            // Paralelizamos las peticiones: Buscamos Historial visual, y llamamos explícitamente al End-point POST de la IA local.
            const [resTransacciones, resAnalisis] = await Promise.all([
                api.get('/transacciones'),
                api.post('/analisis', {}) // Pasamos objeto vacío; la IA sabrá autocompletar leyendo Node.JS
            ]);
            
            setTransacciones(resTransacciones.data);
            setAnalisis(resAnalisis.data);
        } catch (error) {
            console.error("Fallo de red al armar Dashboard Complejo:", error);
            if(error.response?.status === 401 || error.response?.status === 403) {
                 handleCerrarSesion();
            }
        } finally {
            setCargando(false);
        }
    };

    const handleCerrarSesion = () => {
      localStorage.removeItem('token');
      navigate('/login');
    };

    // Preparamos la limpieza y re-estructuración de datos para inyectarlos en Recharts
    const dataGrafico = analisis?.gastosPorCategoria 
        ? Object.keys(analisis.gastosPorCategoria).map(key => ({
            name: key,
            value: analisis.gastosPorCategoria[key]
          }))
        : [];

    const COLORES_GRAFICO = ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

    if (cargando) {
        return <div style={{display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center'}}>
            <h2 className="text-neutral">Iniciando conexiones biométricas seguras...</h2>
        </div>;
    }

    // Desestructuramos para acortar código abajo
    const { resumen, insights } = analisis || {};

    return (
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* ENCABEZADO GLORIOSO */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Wallet className="text-neutral" size={32}/> Control Maestro Financiero
            </h1>
            <p className="metric-title" style={{ marginTop: '8px' }}>Resumen Ejecutivo en Tiempo Real impulsado por Lógica Pura</p>
          </div>
          <button onClick={handleCerrarSesion} className="btn-danger">
            Desconectar y Salir
          </button>
        </header>
        
        {/* TOP ROW: KPIs ESTRATÉGICOS (MÉTRICAS CLAVE) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            
            <div className="glass-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p className="metric-title">Ingresos Brutos Absolutos</p>
                    <ArrowUpRight className="text-success" />
                </div>
                {/* Con .toFixed(2) garantizamos un formato elegante de moneda */}
                <p className="metric-value text-success">${resumen?.ingresosTotales?.toFixed(2) || '0.00'}</p>
            </div>

            <div className="glass-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p className="metric-title">Gastos Contables</p>
                    <ArrowDownRight className="text-danger" />
                </div>
                <p className="metric-value text-danger">${resumen?.gastosTotales?.toFixed(2) || '0.00'}</p>
            </div>

            <div className="glass-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p className="metric-title">Balance Neto Resultante</p>
                    <Wallet className="text-neutral" />
                </div>
                <p className={`metric-value ${resumen?.balance >= 0 ? 'text-success' : 'text-danger'}`}>
                    ${resumen?.balance?.toFixed(2) || '0.00'}
                </p>
            </div>
            
        </div>

        {/* MIDDLE ROW: CONTENIDO PRINCIPAL Y CEREBRO ARTIFICIAL */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 1fr', gap: '1.5rem', alignItems: 'start' }}>
            
            {/* LADO IZQUIERDO: Analítica e Inteligencia Artificial */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* MOTOR IA CAJA DE TEXTOS */}
                <div className="glass-card" style={{ borderLeft: '4px solid #8b5cf6' }}>
                    <h3 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#a78bfa', fontSize: '1.2rem' }}>
                        <BrainCircuit size={28}/> Motor de IA Analítico
                    </h3>
                    <p style={{color: '#94a3b8', fontSize: '13px', marginBottom: '1.5rem'}}>Comentarios generados en base al comportamiento matemático que detectamos entre tus números y rutinas.</p>
                    
                    {insights?.length > 0 ? (
                        insights.map((msg, i) => (
                            <div key={i} className="insight-box">
                                {msg}
                            </div>
                        ))
                    ) : (
                        <p style={{ color: 'gray', fontStyle: 'italic' }}>El motor está esperando mayor volumen de datos para extraer una conclusión acertada...</p>
                    )}
                </div>

                {/* GRÁFICO RECHARTS DE TORTA (PIE) */}
                <div className="glass-card" style={{ height: '380px', display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ marginTop: 0, marginBottom: '0.2rem', color: '#f8fafc' }}>
                        Nicho de Gastos y Fugas
                    </h3>
                    <p className="metric-title" style={{marginBottom: '1rem'}}>¿A qué se está yendo tu dinero?</p>
                    
                    {dataGrafico.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            { /* Gráfica tipo Donut moderna apoyada en nuestra data transformada y renderizada vía SVG*/ }
                            <PieChart>
                                <Pie
                                    data={dataGrafico}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {dataGrafico.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORES_GRAFICO[index % COLORES_GRAFICO.length]} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Legend wrapperStyle={{ paddingTop: '20px' }}/>
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <p style={{ margin: 'auto', color: 'gray' }}>Aún hay muy pocos egresos detectados en sistema para poder trazar un mapa o gráfica funcional.</p>
                    )}
                </div>

            </div>

            {/* LADO DERECHO: HISTORIAL TRANSACCIONAL CRUDO */}
            <div className="glass-card" style={{ height: '100%', minHeight: '500px' }}>
                <h3 style={{ marginTop: 0, color: '#f8fafc' }}>Registro Histórico Contable</h3>
                <p className="metric-title" style={{marginBottom: '1.5rem'}}>Listado de todos tus movimientos (ordenados por el más reciente)</p>
                
                <div style={{ maxHeight: '600px', overflowY: 'auto', paddingRight: '10px' }}>
                    {transacciones.length > 0 ? (
                        transacciones.map(t => (
                            <div key={t._id} className="transaction-item">
                                <div>
                                    <p style={{ margin: 0, fontWeight: '600', fontSize: '1.1rem', color: '#e2e8f0' }}>{t.category}</p>
                                    <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>
                                        {/* Parseo de Fecha Internacional a Lectura Humana */}
                                        {new Date(t.date).toLocaleDateString('es-ES', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })}
                                    </p>
                                </div>
                                
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold', fontSize: '1.1rem' }}>
                                    {t.type === 'income' ? <ArrowUpRight className="text-success" size={22}/> : <ArrowDownRight className="text-danger" size={22}/>}
                                    <span className={t.type === 'income' ? 'text-success' : 'text-danger'}>
                                        ${t.amount.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p style={{ color: 'gray' }}>No tienes movimientos aún, o tu cuenta es muy joven.</p>
                    )}
                </div>
            </div>

        </div>
      </div>
    );
};

export default Dashboard;
