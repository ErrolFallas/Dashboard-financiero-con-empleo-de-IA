import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Wallet, BrainCircuit, PlusCircle } from 'lucide-react';
import toast from 'react-hot-toast'; // Importamos el gatillo de notificaciones

// IMPORTAMOS NUESTROS COMPONENTES ESTRUCTURALES
import Modal from '../components/Modal/Modal.jsx';
import TransactionForm from '../components/TransactionForm.jsx';

const Dashboard = () => {
    const navigate = useNavigate();
    const [transacciones, setTransacciones] = useState([]);
    const [analisis, setAnalisis] = useState(null);
    const [cargando, setCargando] = useState(true);

    // NUEVO ESTADO: Controlador universal para apagar o encender nuestra ventana flotante (Modal)
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Envolvemos el cierre absoluto con constricción para el efecto
    const handleCerrarSesion = useCallback(() => {
      localStorage.removeItem('token');
      navigate('/login');
    }, [navigate]);

    // PREVENCIÓN DE FUGAS DE MEMORIA Y RE-RENDERS (Performance Pro)
    const cargarDatosGlobales = useCallback(async () => {
        try {
            const [resTransacciones, resAnalisis] = await Promise.all([
                api.get('/transacciones'),
                api.post('/analisis', {})
            ]);
            
            setTransacciones(resTransacciones.data);
            setAnalisis(resAnalisis.data);
        } catch (error) {
            console.error(error);
            // El API Interceptor ya hace lo suyo, solo validamos la patada visual al usuario si caducó
            if(error.response?.status === 401 || error.response?.status === 403) {
                 handleCerrarSesion();
            }
        } finally {
            setCargando(false);
        }
    }, [handleCerrarSesion]);

    useEffect(() => {
        cargarDatosGlobales();
    }, [cargarDatosGlobales]);

    // ============================================
    // FLAP COMUNICADOR: HIJO (Form) -> PADRE (Dash)
    // ============================================
    const manejarNuevaTransaccion = async (paqueteFinanciero) => {
        try {
            // [ZONA DE VERDAD - CONTACTANDO AL BACKEND MONGODB]
            
            // 1. Usamos nuestra instancia Axios "api.js". Hacemos un hit POST a tu ruta.
            // Recuerda: No necesitas escribir 'Headers: Bearer' aquí porque 
            // nuestro Interceptor ya lo empacó silenciosamente bajo el telón.
            await api.post('/transacciones', paqueteFinanciero);
            
            // 2. Si Mongo devolvió código 201 (Created), Ocultamos el componente cristal de fondo inmediatamente
            setIsModalOpen(false);
            
            // 3. (ESTRATEGIA REACTIVA) 
            // Invocamos la orden de Refresco Maestro en el Dashboard. 
            // Esto llamará de regreso a /transacciones y /analisis permitiendo a React
            // actualizar mágicamente la interfaz gráfica (Historial y la IA Analítica),
            // ¡Todo bajo el tapete sin usar molestos window.location.reload()!
            cargarDatosGlobales();
            
            // 4. EL PODER DE LA UX (TOAST)
            toast.success("¡Operación registrada con éxito en tu bóveda!");

        } catch (error) {
            console.error("Fallo durante guardado contable:", error);
            // Destruimos el "alert()" intrusivo nativo del navegador, por la burbuja suave flotante.
            toast.error("Datos denegados. Tu conexión falló o tu sesión caducó.");
        }
    };

    const dataGrafico = analisis?.gastosPorCategoria 
        ? Object.keys(analisis.gastosPorCategoria).map(key => ({
            name: key,
            value: analisis.gastosPorCategoria[key]
          }))
        : [];

    const COLORES_GRAFICO = ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

    if (cargando) {
        // [MEJORA UX] - Loading Skeletons en lugar de Texto Crudo
        return (
            <div className="animate-fade-in" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
                {/* Cabecera Fake */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
                    <div className="skeleton-box skeleton-title" style={{ width: '300px' }}></div>
                    <div className="skeleton-box" style={{ width: '150px', height: '40px' }}></div>
                </div>

                {/* KPIs Skeletons */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                    {[1, 2, 3].map(i => (
                        <div key={i} className="glass-card">
                            <div className="skeleton-box skeleton-text" style={{ width: '60%' }}></div>
                            <div className="skeleton-box" style={{ width: '80%', height: '45px', marginTop: '10px' }}></div>
                        </div>
                    ))}
                </div>

                {/* Skeletons Principales (IA, Grafo, Tabla) */}
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 1fr', gap: '1.5rem', alignItems: 'start' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div className="glass-card" style={{ height: '220px' }}>
                             <div className="skeleton-box skeleton-title" style={{ width: '60%' }}></div>
                             <div className="skeleton-box skeleton-text"></div>
                             <div className="skeleton-box skeleton-text" style={{ width: '80%' }}></div>
                        </div>
                        <div className="glass-card" style={{ height: '380px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                             <div className="skeleton-box skeleton-circle"></div>
                        </div>
                    </div>
                    
                    <div className="glass-card" style={{ height: '640px' }}>
                        <div className="skeleton-box skeleton-title" style={{ width: '50%' }}></div>
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px', marginTop: '15px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '50%' }}>
                                    <div className="skeleton-box skeleton-text" style={{ margin: 0 }}></div>
                                    <div className="skeleton-box skeleton-text" style={{ width: '60%', height: '14px', margin: 0 }}></div>
                                </div>
                                <div className="skeleton-box" style={{ width: '90px', height: '30px' }}></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const { resumen, insights } = analisis || {};

    return (
      <div className="animate-fade-in" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Wallet className="text-neutral" size={32}/> Control Céntrico
            </h1>
            <p className="metric-title" style={{ marginTop: '8px' }}>Visualización General Integral de Movimientos</p>
          </div>
          
          <div style={{ display: 'flex', gap: '10px' }}>
              {/* BOTÓN DISPARADOR: Al clickearlo sube la variable 'isModalOpen' a TRUE forzando el montaje del componente Modal */}
              <button 
                  onClick={() => setIsModalOpen(true)}
                  style={{ background: 'var(--accent)', color: 'white', border: 'none', padding: '0.8rem 1rem', borderRadius: '8px', display: 'flex', gap: '8px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                  <PlusCircle size={20} /> Nueva Transacción
              </button>
              
              <button onClick={handleCerrarSesion} className="btn-danger">
                Salir del Sistema
              </button>
          </div>
        </header>

        {/* ... BLOQUE DE KPIs ... */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div className="glass-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p className="metric-title">Ingresos Brutos Absolutos</p>
                    <ArrowUpRight className="text-success" />
                </div>
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

        {/* ... BLOQUE DE GRÁFICA Y LISTADO ... */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 1fr', gap: '1.5rem', alignItems: 'start' }}>
            
            {/* LADO IZQ: IA Y DOUGHNUT */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="glass-card" style={{ borderLeft: '4px solid var(--secondary)' }}>
                    <h3 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--secondary)', fontSize: '1.2rem' }}>
                        <BrainCircuit size={28}/> Motor de IA Analítico
                    </h3>
                    <p style={{color: 'var(--text)', opacity: 0.7, fontSize: '13px', marginBottom: '1.5rem'}}>Reporte transaccional actual.</p>
                    {insights?.length > 0 ? (
                        insights.map((msg, i) => <div key={i} className="insight-box">{msg}</div>)
                    ) : (
                        <div style={{ background: 'rgba(0,0,0,0.02)', padding: '1rem', borderRadius: '8px' }}>
                            <p style={{ margin: 0, color: 'var(--text)', fontWeight: 600, fontSize: '0.90rem' }}>¿Qué hace este cuadro?</p>
                            <p style={{ color: 'var(--text)', opacity: 0.8, fontSize: '0.85rem', lineHeight: 1.5, marginTop: '8px' }}>
                                Nuestra Inteligencia Artificial analiza tus gastos y te dará alertas o recomendaciones automáticas. <b>Agrega tus primeros gastos</b> para que el motor empiece a trabajar.
                            </p>
                        </div>
                    )}
                </div>

                <div className="glass-card" style={{ height: '380px', display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ marginTop: 0, marginBottom: '0.2rem', color: 'var(--text)' }}>
                        Nicho de Fugas Mapeado
                    </h3>
                    {dataGrafico.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={dataGrafico} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value" stroke="none">
                                    {dataGrafico.map((entry, index) => <Cell key={index} fill={COLORES_GRAFICO[index % COLORES_GRAFICO.length]} />)}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: 'var(--background)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', color: 'var(--text)' }} itemStyle={{ color: 'var(--text)' }} />
                                <Legend wrapperStyle={{ paddingTop: '20px' }}/>
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div style={{ margin: 'auto', textAlign: 'center', padding: '1.5rem', background: 'rgba(0,0,0,0.02)', borderRadius: '8px', maxWidth: '80%' }}>
                            <p style={{ margin: 0, color: 'var(--text)', fontWeight: 600, fontSize: '0.90rem' }}>Fugas de Capital</p>
                            <p style={{ color: 'var(--text)', opacity: 0.8, fontSize: '0.85rem', lineHeight: 1.5, marginTop: '8px' }}>
                                Aquí se construirá una dona visual interactiva (Doughnut Chart) separada por colores para ver fácilmente a dónde se va tu dinero. Registra ingresos y egresos para iniciar.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* LADO DER: HISTORIAL CRUDO */}
            <div className="glass-card" style={{ height: '100%', minHeight: '500px' }}>
                <h3 style={{ marginTop: 0, color: 'var(--text)' }}>Registro Histórico de la Entidad</h3>
                <p className="metric-title" style={{marginBottom: '1.5rem'}}>Aterrizaje contable más reciente.</p>
                
                <div style={{ maxHeight: '600px', overflowY: 'auto', paddingRight: '10px' }}>
                    {transacciones.length > 0 ? (
                        transacciones.map(t => (
                            <div key={t._id} className="transaction-item">
                                <div>
                                    <p style={{ margin: 0, fontWeight: '600', fontSize: '1.1rem', color: 'var(--text)' }}>{t.category}</p>
                                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--text)', opacity: 0.8 }}>
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
                        <div style={{ textAlign: 'center', padding: '3rem 1.5rem', background: 'rgba(0,0,0,0.02)', borderRadius: '12px', border: '1px dashed rgba(0,0,0,0.15)' }}>
                            <p style={{ margin: 0, fontWeight: 'bold', color: 'var(--text)', fontSize: '1.1rem' }}>No hay transacciones aún 📝</p>
                            <p style={{ fontSize: '0.95rem', color: 'var(--text)', opacity: 0.8, lineHeight: 1.6, marginTop: '12px' }}>
                                Este es tu historial principal. Tus movimientos organizados por fecha aparecerán aquí.<br/><br/>
                                👉 Toca el botón <b>"+ Nueva Transacción"</b> en la parte superior para ingresar tu primer capital.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* ========================================================= */}
        {/*           INFRAESTRUCTURA INVISIBLE DEL MODAL             */}
        {/* ========================================================= */}
        <Modal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)}
            titulo="Reportar Nueva Operación Local"
        >
            <TransactionForm onSubmit={manejarNuevaTransaccion} />
        </Modal>

      </div>
    );
};

export default Dashboard;
