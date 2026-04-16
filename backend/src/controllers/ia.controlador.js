import { obtenerAnalisisFinanciero } from '../services/ia.servicio.js';
import { obtenerTransaccionesDeUsuario } from '../services/transaccion.servicio.js';

/**
 * Controlador de Análisis Inteligente.
 * Extrae y pasa los datos en bruto al Motor y responde con el cálculo estructurado.
 */
export const analizarEstadosHTTP = async (req, res) => {
    try {
        const usuarioId = req.usuarioVerificado.id;
        
        // Doble funcionalidad de POST: 
        // 1. Si el cliente quiere ver el cálculo sobre ciertos datos que pasan en el Frontend (Drafting / Sandbox) ->
        let transaccionesData = req.body.transactions || req.body.transacciones;

        // 2. Si el cliente no pasa datos y solo pide "Analízame", extraemos con seguridad su Data Base en MongoDB ->
        if (!transaccionesData || !Array.isArray(transaccionesData) || transaccionesData.length === 0) {
            transaccionesData = await obtenerTransaccionesDeUsuario(usuarioId);
        }

        // Excepción por si el usuario está sumamente en ceros o cuenta nueva.
        if(!transaccionesData || transaccionesData.length === 0){
             return res.status(200).json({ 
                 mensaje: "El motor de IA requiere tener mínimo una transacción para analizar comportamiento.", 
                 resumen: { ingresosTotales: 0, gastosTotales: 0, balance: 0 },
                 gastosPorCategoria: {},
                 categoriaMayorGasto: { categoria: 'N/A', cantidad: 0 },
                 insights: ["Agrega gastos e ingresos y vuelve aquí para obtener recomendaciones completas."]
             });
        }

        // Llamamos al cerebro principal y guardamos los resultados
        const resultadoIA = obtenerAnalisisFinanciero(transaccionesData);

        // Devolvemos el veredicto generado
        res.status(200).json(resultadoIA);

    } catch (error) {
        res.status(500).json({ error: 'Hubo un traspié al intentar ejecutar el procesamiento en el IA motor.', detalles: error.message });
    }
};
