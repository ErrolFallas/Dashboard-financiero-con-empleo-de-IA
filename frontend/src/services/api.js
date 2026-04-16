import axios from 'axios';

// Creamos un núcleo base (Instancia) para no tener que escribir localhost:3000/api cada vez en los componentes.
const api = axios.create({
    baseURL: 'http://localhost:3000/api'
});

// ============================================
// INTERCEPTOR MÁGICO DE PETICIONES (Middleware Cliente)
// ============================================
// Todo api.get() o api.post() será atrapado por esta función oculta ANTES de dispararse.
api.interceptors.request.use((config) => {
    // 1. Buscamos furtivamente el JWT en la bóveda del navegador local
    const token = localStorage.getItem('token');
    
    // 2. Si el Token nos acompaña, lo atamos a las cabeceras bajo el estándar "Bearer"
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    // 3. Dejamos que la petición continúe orgánicamente su ruta hacia Node.js
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
