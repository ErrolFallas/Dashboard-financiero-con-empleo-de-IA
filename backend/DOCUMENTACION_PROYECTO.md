# 📊 Proyecto: Mini Dashboard Financiero con IA Simulada

## 🎯 Objetivo Arquitectónico Principal
Diseñar y modelar una robusta aplicación web orientada a pequeñas empresas que permita llevar el control de los ingresos y gastos financieros. Las acciones financieras alimentan a un motor de reglas lógicas ("IA simulada") que devuelve proyecciones monetarias y analíticas condicionales para informar al usuario de fugas o buenos hábitos.

---

## ✅ Hitos Completados (Estado Actual de Producción Local)

Todo el mapa de ruta teórico ha sido superado y construido con éxito. 

### 1️⃣ Backend (Capa Lógica y Modelo de Datos)
- **Tecnologías:** Node.js, Express, MongoDB (vía Mongoose).
- **Arquitectura Pura:** Patrón escalado por capas (`Rutas` -> `Controladores` -> `Servicios`). Estandarización de nombramientos lógicos en español dentro de directorios de estándar inglés.
- **Módulos Desarrollados:**
  - **Estado General (`estado`):** Comprobación local para validar la salud HTTP.
  - **Autenticación:** Flujo funcional de registro de usuarios y login, asegurado con `bcryptjs` (saltos y encripción algorítmica) y emisión segura de pasaportes temporales (JSON Web Tokens).
  - **Control Transaccional (Ingresos/Gastos):** Operaciones C.R.U.D íntegras conectadas con colecciones de MongoDB y blindadas para prohibir visualizaciones de terceros cruzando las validaciones del Token JWT con las sub-identidades de la DB.
  - **Analítica (El Motor de Reglas - IA Simulada):** Generador asíncrono que barre el historial general en búsqueda de fugas, consolida el Balance absoluto, y retorna Array dinámico de texterías (Insights) basado en alertas porcentuales y de sobrecostos operativos.
  
- **Seguridad & Middlewares:** Emplazamiento del guardián virtual `verificarToken.js` e Implementación de permisos `CORS` para tolerar cruces Frontend-Backend.

### 2️⃣ Frontend (Capa de Presentación Web)
- **Tecnologías:** Vite con React, gestor de APIs de Axios, gráficas nativas con Recharts y biblioteca tipográfica de Google y Lucide-React.
- **Routing:** Componente maestro `PrivateRoute.jsx`; escudo virtual reactivo que destierra usuarios al Login si carecen de token de `localStorage`.
- **Ecosistema Visual (UI):**
  - Modelos estéticos de "Modo Oscuro" usando herramientas como el *Glassmorphismo* para un estilo tecnológico/premium de alta calidad.
  - Tarjetería Visual de Resúmenes Matemáticos.
  - Gráfica `<PieChart>` interactiva sobre la clasificación categorizada.
  - Listado transaccional consumido en asincronía (`useEffect`).

---

## 🗺️ Mapa de Ruta para Futuras Versiones (Sugerencias UX/UI)

Para poder llevar este Dashboard a un estatus y nivel digno de despliegue a clientes reales en SaaS, queda pendiente la optimización:

1. **Modal Creador:** Implementar cajas de formulario interactivas sobre el Dashboard para que el usuario escriba gastos in-site de forma ágil sin Postman.
2. **Selectores Estandarizados:** Usar desplegables para forzar ciertas categorías contables (`<option value='Alimentación'>`).
3. **Optimización Visual de Carga:** Remplazar los textos asíncronos "Cargando..." por Loading Skeletons (marcos luminosos paralelos).
4. **Acotamiento Temporal:** Ligas HTTP que habiliten filtros por 'Este Mes' frente a 'Mensualidades Pasadas'.
5. **Manejo Integral de Caídas Globales (Toaster & Bounding):** Si un servidor Node.js cayera, el usuario debería presenciar un pequeño aviso flotante indicando "Error de red" sin romper el sistema de React entero.
