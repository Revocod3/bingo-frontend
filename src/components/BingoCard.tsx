'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useVerifyCardPattern, useClaimBingo } from '@/hooks/api/useCardVerification';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useEventPatterns } from '@/hooks/api/useWinningPatterns';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

// Dynamically import react-confetti to avoid SSR issues
const ReactConfetti = dynamic(() => import('react-confetti'), { ssr: false });

interface BingoCardProps {
  cardId: string;
  numbers: string[][];
  active: boolean;
  eventId?: string | number;
  calledNumbers?: number[];
  autoMarkEnabled?: boolean; // Make this optional with a default value
}

export default function BingoCard({
  cardId,
  numbers,
  active,
  eventId,
  calledNumbers = [],
  autoMarkEnabled = false // Default to false
}: BingoCardProps) {
  const [markedNumbers, setMarkedNumbers] = useState<Set<string>>(new Set());
  const { data: patternVerification } = useVerifyCardPattern(cardId, active);
  const { data: eventPatterns } = useEventPatterns(eventId || '');
  const claimMutation = useClaimBingo();
  const [showConfetti, setShowConfetti] = useState(false);
  const [showBingoText, setShowBingoText] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });

  // Update window size for confetti
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Columnas BINGO
  const columns = ['B', 'I', 'N', 'G', 'O'];

  // Efecto para marcar automáticamente el espacio FREE
  useEffect(() => {
    setMarkedNumbers(prev => {
      const newSet = new Set(prev);
      newSet.add('N0'); // El centro siempre está marcado
      return newSet;
    });
  }, []);

  // Add effect to automatically mark called numbers when autoMarkEnabled is true
  useEffect(() => {
    if (!autoMarkEnabled || !active) return;

    // Only proceed if auto-marking is enabled
    setMarkedNumbers(prev => {
      const newSet = new Set(prev);

      // Always ensure FREE space is marked
      newSet.add('N0');

      // Find all called numbers on this card and mark them
      numbers.flat().forEach(num => {
        if (num !== 'N0') { // Skip FREE space as it's already marked
          const numberPart = parseInt(num.substring(1));

          // If this number has been called, mark it
          if (calledNumbers.includes(numberPart)) {
            newSet.add(num);
          }
        }
      });

      return newSet;
    });
  }, [autoMarkEnabled, calledNumbers, numbers, active]);

  // Marcar un número en el cartón
  const toggleNumber = (num: string) => {
    if (!active || num === 'N0') return; // No se puede desmarcar el FREE o si el cartón no está activo

    setMarkedNumbers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(num)) {
        newSet.delete(num);
      } else {
        // Se permite marcar el número sin verificar llamada
        newSet.add(num);
      }
      return newSet;
    });
  };

  // Manejar reclamo de BINGO
  const handleClaimBingo = async () => {
    try {
      const result = await claimMutation.mutateAsync(cardId);
      if (result.success) {
        toast.success('¡BINGO! Tu victoria ha sido verificada.', {
          duration: 5000,
          style: {
            background: '#7C3AED',
            color: 'white',
            border: '2px solid #6D28D9'
          },
        });

        // Trigger confetti celebration and BINGO text
        setShowConfetti(true);
        setShowBingoText(true);
        setTimeout(() => {
          setShowConfetti(false);
          setShowBingoText(false);
        }, 5000);
      } else {
        toast.error(result.message || 'No se pudo verificar tu victoria');
      }
    } catch (error) {
      toast.error('Error al reclamar el BINGO');
      console.error('Error claiming bingo:', error);
    }
  };

  // Verificar si una posición pertenece a un patrón ganador
  const isPartOfWinningPattern = (position: number): boolean => {
    // Agregar más debugging
    if (!eventPatterns) {
      console.log('eventPatterns no disponible todavía');
      return false;
    }

    if (!patternVerification) {
      console.log('patternVerification no disponible todavía');
      return false;
    }

    if (!patternVerification.is_winner) {
      // No hay ganador todavía
      return false;
    }

    if (!patternVerification.matched_patterns || patternVerification.matched_patterns.length === 0) {
      console.log('No hay matched_patterns en la verificación');
      return false;
    }

    // Buscar en los patrones ganadores
    for (const patternId of patternVerification.matched_patterns) {
      const pattern = eventPatterns.find(p => p.id === patternId);
      if (pattern && pattern.positions.includes(position)) {
        return true;
      }
    }

    return false;
  };

  // Estado de victoria para efectos visuales
  const isWinner = patternVerification?.success || false;

  console.log(isWinner, patternVerification);

  return (
    <div className={cn(
      "rounded-lg overflow-hidden border bg-white shadow-sm transition-all text-gray-800 relative",
      active ? "cursor-pointer" : "opacity-90",
      isWinner && "border-2 border-[#7C3AED]"
    )}>
      {/* Confetti effect when winning */}
      {showConfetti && (
        <ReactConfetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.3}
          colors={['#7C3AED', '#6D28D9', '#DDD6FE', '#4C1D95', '#FBBF24']}
        />
      )}

      {/* BINGO text animation */}
      {showBingoText && (
        <motion.div
          className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1.2, 1.2, 0.5] }}
          transition={{
            duration: 4,
            times: [0, 0.2, 0.8, 1],
            ease: "easeInOut"
          }}
        >
          <div className="text-[#7C3AED] font-extrabold text-5xl md:text-7xl drop-shadow-lg">
            ¡BINGO!
          </div>
        </motion.div>
      )}

      {/* Encabezado del cartón */}
      <div className="grid grid-cols-5 bg-[#7C3AED] text-white">
        {columns.map((letter, idx) => (
          <div key={idx} className="text-center font-bold py-2 text-sm sm:text-base">
            {letter}
          </div>
        ))}
      </div>

      {/* Números del cartón */}
      <div className="grid grid-cols-5 gap-1 p-2 bg-gray-50">
        {numbers.map((row, rowIdx) => (
          row.map((num, colIdx) => {
            const position = rowIdx * 5 + colIdx;
            const isFree = num === 'N0';
            const isMarked = markedNumbers.has(num);
            const isWinningPosition = isPartOfWinningPattern(position);

            return (
              <div
                key={`${rowIdx}-${colIdx}`}
                className={cn(
                  "aspect-square flex items-center justify-center rounded-md text-xs sm:text-sm font-medium transition-all",
                  isMarked && "bg-[#DDD6FE] text-[#7C3AED]",
                  isFree && "bg-green-100 text-green-800", // Cambio de color para el FREE
                  isWinningPosition && "bg-green-100 text-green-800 ring-2 ring-green-500",
                  active && !isFree && "hover:bg-gray-200",
                  !isMarked && !isFree && "bg-white"
                )}
                onClick={() => toggleNumber(num)}
              >
                {isFree ? 'FREE' : num.substring(1)}

              </div>
            );
          })
        ))}
      </div>

      {/* Botón de BINGO */}
      {active && (
        <div className="p-2">
          <Button
            onClick={handleClaimBingo}
            className={cn(
              "w-full",
              patternVerification?.is_winner
                ? "bg-green-500 hover:bg-green-600"
                : "bg-[#7C3AED] hover:bg-[#6D28D9]"
            )}
          >
            {claimMutation.isPending ? '¡Verificando...' : '¡BINGO!'}
          </Button>
        </div>
      )}
    </div>
  );
}