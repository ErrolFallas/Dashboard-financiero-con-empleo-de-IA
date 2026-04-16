/**
 * MOTOR LÓGICO DE IA SIMULADA.
 * Toma un conjunto de transacciones financieras y devuelve métricas e insights procesados mediante reglas puras.
 */
export const obtenerAnalisisFinanciero = (transacciones) => {
    let ingresosTotales = 0;
    let gastosTotales = 0;
    const agrupadoPorCategoria = {};

    // 1. Recorrer transacciones para poblar los agrupadores y hacer la métrica de balance
    transacciones.forEach(transaccion => {
        if (transaccion.type === 'income') {
            ingresosTotales += transaccion.amount;
        } else if (transaccion.type === 'expense') {
            gastosTotales += transaccion.amount;

            // Poblamos el diccionario por categoría dinámicamente si no existe
            if (!agrupadoPorCategoria[transaccion.category]) {
                agrupadoPorCategoria[transaccion.category] = 0;
            }
            agrupadoPorCategoria[transaccion.category] += transaccion.amount;
        }
    });

    const balance = ingresosTotales - gastosTotales;

    // 2. Extraer la categoría con mayor fuga de dinero
    let mayorGasto = { categoria: 'Ninguna', cantidad: 0 };
    for (const [categoria, cantidad] of Object.entries(agrupadoPorCategoria)) {
        if (cantidad > mayorGasto.cantidad) {
            mayorGasto = { categoria, cantidad };
        }
    }

    // 3. Generación de Insights (IA basada en Reglas Condicionales)
    const recomendaciones = [];

    // Lógica básica del balance
    if (balance < 0) {
        recomendaciones.push("🚨 ¡Alerta crítica! Estás gastando más dinero del que ganas. Tu negocio presenta pérdidas.");
    } else if (balance === 0 && transacciones.length > 0) {
        recomendaciones.push("⚠️ Tu cuenta está en cero cerrado. Tus ingresos alcanzan al límite exacto de tus gastos de operación, precaución.");
    } else if (balance > 0) {
        recomendaciones.push("✅ Tienes un balance positivo; estás reteniendo e ingresando capital con éxito.");
    }

    // Lógica sobre el volumen del gasto
    if (ingresosTotales > 0) {
        const porcentajeGasto = gastosTotales / ingresosTotales;
        if (porcentajeGasto > 0.8 && porcentajeGasto <= 1) {
            recomendaciones.push(`👀 Cuidado: Tus operaciones se están comiendo el ${(porcentajeGasto * 100).toFixed(1)}% de todos tus lucros.`);
        }
    }

    // Lógica puntual sobre fugas de capital
    if (mayorGasto.cantidad > 0) {
        recomendaciones.push(`🔍 Tu mayor debilidad o gasto actual recae rotundamente en la categoría '${mayorGasto.categoria}', llevándose un total enorme de $${mayorGasto.cantidad.toFixed(2)}.`);
        
        // Sub-regla de proporción
        if (ingresosTotales > 0 && mayorGasto.cantidad > ingresosTotales * 0.5) {
             recomendaciones.push(`⚠️ ¡Precaución alta! Solamente los gastos de '${mayorGasto.categoria}' absorben más la mitad absoluta de todos tus ingresos del mes.`);
        }
    }

    // Si todo va excelente pero no hay mucho
    if (recomendaciones.length === 0 && transacciones.length > 0) {
        recomendaciones.push("Tus finanzas no tienen anomalías graves. Mantén el ritmo controlado.");
    }

    // 4. Retorno del empaquetado final
    return {
        resumen: {
            ingresosTotales,
            gastosTotales,
            balance
        },
        gastosPorCategoria: agrupadoPorCategoria,
        categoriaMayorGasto: mayorGasto,
        insights: recomendaciones
    };
};
