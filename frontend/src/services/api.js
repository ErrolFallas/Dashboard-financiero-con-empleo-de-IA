import axios from 'axios';

// Creamos un núcleo base (Instancia) para no tener que escribir localhost:3000/api cada vez en los componentes.
const api = axios.create({
    baseURL: 'http://localhost:3000/api'
});

// ============================================
// INTERCEPTOR MÁGICO DE PETICIONES (SALIDA)
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// ============================================
// INTERCEPTOR GLOBAL DE RESPUESTAS (ENTRADA HACIA REACT)
// ============================================
api.interceptors.response.use(
  (response) => {
    // Si la respuesta viaja sana por HTTP 200/201, déjala pasar intacta
    return response;
  },
  (error) => {
    // 1. FORMATEO UNIVERSAL DE ERRORES AL CLIENTE
    let mensajeAmigable = "Se perdió temporalmente el contacto con el Servidor.";

    if (error.response) {
      // El backend de NODE sí nos contestó y escupió su "status 400 o 500".
      // Extrayemos ese json de ErrorHandler Específico que programamos en pasos previos.
      mensajeAmigable = error.response.data?.message || "La base de datos denegó tus credenciales.";
    } else if (error.request) {
      // Grave: El servidor de NODE.JS está totalmente apagado físicamente.
      mensajeAmigable = "Fallo fatal de red. No pudimos contactar a la central.";
    }

    // 2. Empacamos este string masticado dentro del error para que React (Login.jsx o Dashboard.jsx) lo use en los *toasts* sin quebrarse la cabeza
    error.mensajeCustomizado = mensajeAmigable;
    
    // Devolvemos la promesa abortándola pacíficamente
    return Promise.reject(error);
  }
);

export default api;
