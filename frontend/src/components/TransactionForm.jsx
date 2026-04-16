import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// ==============================================================
// 1. ZOD SCHEMA: El policía estricto de las reglas validaciones
// ==============================================================
const esquemaTransaccion = z.object({
    type: z.enum(['expense', 'income'], { required_error: 'Debe elegir un tipo de operación.' }),
    
    // ".coerce" fuerza a que lo que escriba el usuario en el input sea atrapado nativamente como un Número Real en vez de String
    amount: z.coerce.number({ invalid_type_error: 'Debes digitar una cantidad numérica válida sin letras.' })
             .positive('⚠️ Matemáticamente imposible: El monto debe ser arriba de $0.00'),
             
    category: z.string().min(1, '⚠️ Por favor despliega esto y elige una categoría válida.'),
    
    date: z.string().min(1, '⚠️ Selecciona el día en el calendario.')
});

const TransactionForm = ({ onSubmit }) => {
    
    // ==============================================================
    // 2. HOOK FORM: Conectamos ZOD al motor Reactivo de Formularios
    // ==============================================================
    const { 
        register, 
        handleSubmit, 
        watch, 
        setValue,
        formState: { errors, touchedFields } 
    } = useForm({
        resolver: zodResolver(esquemaTransaccion),
        mode: 'onChange', // UX Premium: Validará instantáneamente conforme el usuario teclea (Tiempo Real)
        defaultValues: {
            type: 'expense',
            amount: '',
            category: '',
            date: new Date().toISOString().split('T')[0]
        }
    });

    // Vigilamos quirúrgicamente solo el campo 'type' para re-dibujar la lista inferior
    const tipoSeleccionado = watch('type');

    // Listas selectivas
    const categoriasGasto = ['Comida', 'Transporte', 'Alquiler', 'Servicios', 'Entretenimiento', 'Sueldos', 'Insumos', 'Otros'];
    const categoriasIngreso = ['Ventas de mostrador', 'Ventas Online', 'Servicios Profesionales', 'Inversiones', 'Otros'];
    const categoriasDisponibles = tipoSeleccionado === 'expense' ? categoriasGasto : categoriasIngreso;

    // Efecto UX: Obligar limpieza reactiva de 'category' engañando al usuario por su seguridad al brincar entre Gasto a Ingreso
    useEffect(() => {
        setValue('category', '');
    }, [tipoSeleccionado, setValue]);

    // ==============================================================
    // 3. EMISIÓN LIMPIA E IMPENETRABLE AL DASHBOARD
    // ==============================================================
    const procesarEnvioValidado = (dataZodLimpios) => {
        // En este punto, estamos 100% seguros de que los datos son inmaculados gracias a Zod.
        // Mapeamos a ISO 8601 exigido por backend para la hora antes de emitir:
        const paqueteFinanciero = {
            ...dataZodLimpios,
            date: new Date(dataZodLimpios.date).toISOString()
        };
        
        // ¡Empezamos el viaje ascendente a `Dashboard.jsx`!
        onSubmit(paqueteFinanciero);
    };

    // Función auxiliar visual para pintar bordes rojos ardientes si ZOD detecta error y el usuario ya tocó el campo
    const getEstiloInput = (nombreCampo) => ({
        padding: '0.8rem', borderRadius: '8px', 
        border: errors[nombreCampo] ? '2px solid #f43f5e' : '1px solid #334155', // Transición semántica a Rojo
        background: '#0b0f19', color: '#f8fafc', outline: 'none', colorScheme: 'dark',
        transition: 'border 0.2sease-in-out'
    });

    return (
        // handleSubmit es la barricada primaria de seguridad de Hook-Form. Si Zod reprueba el examen, NUNCA llega a procesarEnvioValidado.
        <form onSubmit={handleSubmit(procesarEnvioValidado)} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            
            {/* INPUT TIPO */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ color: '#94a3b8', fontSize: '0.90rem', fontWeight: 500 }}>Operación Contable</label>
                <select {...register('type')} style={getEstiloInput('type')}>
                    <option value="expense">📉 Gasto Operativo (Salida)</option>
                    <option value="income">📈 Capital Generado (Ingreso)</option>
                </select>
                {/* Micro-letra Roja Predictiva de Zod */}
                {errors.type && <span style={{ color: '#f43f5e', fontSize: '0.8rem', fontStyle: 'italic' }}>{errors.type.message}</span>}
            </div>

            {/* INPUT MONTO */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ color: '#94a3b8', fontSize: '0.90rem', fontWeight: 500 }}>Importe o Cantidad Absoluta ($)</label>
                <input 
                    type="number" 
                    min="0" step="0.01"
                    placeholder="Ej. 1500.00"
                    {...register('amount')}
                    style={getEstiloInput('amount')}
                />
                {errors.amount && <span style={{ color: '#f43f5e', fontSize: '0.8rem', fontStyle: 'italic' }}>{errors.amount.message}</span>}
            </div>

            {/* INPUT CATEGORIA */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ color: '#94a3b8', fontSize: '0.90rem', fontWeight: 500 }}>Clasificación del Movimiento</label>
                <select {...register('category')} style={getEstiloInput('category')}>
                    <option value="" disabled>-- Escoge una categoría obligatoria --</option>
                    {categoriasDisponibles.map((cats, index) => (
                        <option key={index} value={cats}>{cats}</option>
                    ))}
                </select>
                {errors.category && <span style={{ color: '#f43f5e', fontSize: '0.8rem', fontStyle: 'italic' }}>{errors.category.message}</span>}
            </div>

            {/* INPUT FECHA */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ color: '#94a3b8', fontSize: '0.90rem', fontWeight: 500 }}>Fecha de la Transacción</label>
                <input 
                    type="date" 
                    {...register('date')}
                    style={getEstiloInput('date')}
                />
                {errors.date && <span style={{ color: '#f43f5e', fontSize: '0.8rem', fontStyle: 'italic' }}>{errors.date.message}</span>}
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #334155', margin: '0.5rem 0' }} />

            {/* SUBMIT BUTTON */}
            <button 
                type="submit" 
                style={{ 
                    marginTop: '0.5rem', padding: '1rem', borderRadius: '8px', 
                    background: '#3b82f6', color: 'white', fontWeight: 'bold', 
                    cursor: 'pointer', border: 'none', transition: 'background 0.2s',
                    fontSize: '1rem'
                }}
                onMouseOver={(e) => e.target.style.background = '#2563eb'}
                onMouseOut={(e) => e.target.style.background = '#3b82f6'}
            >
                Validar y Registrar Formulario
            </button>
        </form>
    );
};

export default TransactionForm;
