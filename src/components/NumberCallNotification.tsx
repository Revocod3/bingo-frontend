import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface NumberCallNotificationProps {
  number: number | null;
  previousNumber: number | null;
}

export function NumberCallNotification({ number, previousNumber }: NumberCallNotificationProps) {
  const [showAnimation, setShowAnimation] = useState(false);
  
  useEffect(() => {
    // Solo mostrar animación cuando cambia el número y no es la carga inicial
    if (number && previousNumber !== number) {
      setShowAnimation(true);
      
      // Ocultar la animación después de 3 segundos
      const timer = setTimeout(() => {
        setShowAnimation(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [number, previousNumber]);
  
  if (!showAnimation || !number) return null;
  
  return (
    <motion.div 
      className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-purple-600 text-white py-4 px-6 rounded-lg shadow-lg"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
    >
      <p className="text-xl font-bold">¡Nuevo número llamado!</p>
      <div className="text-4xl font-bold text-center mt-2">{number}</div>
    </motion.div>
  );
}
