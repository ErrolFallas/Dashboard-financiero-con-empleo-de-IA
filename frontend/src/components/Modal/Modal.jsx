import React, { useEffect, useRef } from 'react';
import './Modal.css'; // Anexamos la clase estética nativa e independiente

/**
 * Componente Genérico Modal
 * @param {boolean} isOpen - Lógica que arranca el renderizado
 * @param {function} onClose - Controla la caída desde el Padre
 * @param {string} titulo - Label cabecero dinámico
 * @param {ReactNode} children - El interior completo. Lo vuelve un "wrapper" perfecto.
 */
const Modal = ({ isOpen, onClose, titulo, children }) => {
  // Referencia inalienable que mapea la "caja física" interna del modal 
  const contentRef = useRef(null);

  // Hook del Ciclo de Vida: Cerrar ágilmente usando tecla universal 'Esc' y matar el scroll
  useEffect(() => {
    const handleEsq = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsq);
      document.body.style.overflow = 'hidden'; // Detiene la ruleta del ratón en la página inferior
    }

    // Efecto de Limpieza al destruir el componente para evitar Memory Leaks
    return () => {
      document.removeEventListener('keydown', handleEsq);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Retorno temprano agresivo. Si no hay estado true, literalmente en DOM devuelve vacío, garantizando eficiencia y coste cero.
  if (!isOpen) return null;

  // Lógica de "Click Outside" (Click fuera de la caja)
  const handleClickOverlay = (e) => {
    // Si el Mouse cliquea afuera del 'contentRef' (la tarjeta per se), ejecutamos apagado
    if (contentRef.current && !contentRef.current.contains(e.target)) {
      onClose();
    }
  };

  return (
    // CUBIERTA FLOTANTE GRIS/BORROSA
    <div className="modal-overlay" onClick={handleClickOverlay}>
      
      {/* TARJETA VISIBLE CENTRAL */}
      <div className="modal-content" ref={contentRef}>
        
        {/* Cabecera Intercambiable */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text)', fontWeight: 600 }}>
            {titulo}
          </h2>
          
          <button onClick={onClose} className="modal-close-btn" aria-label="Cerrar modal">
            &times;
          </button>
        </div>

        {/* Zona Dinámica Reutilizable (Donde caerá en el futuro cualquier Formulario) */}
        <div className="modal-body">
          {children}
        </div>
        
      </div>
    </div>
  );
};

export default Modal;
