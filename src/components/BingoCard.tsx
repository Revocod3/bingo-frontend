'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { useVerifyCardPattern, useClaimBingo } from '@/hooks/api/useCardVerification';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useEventPatterns } from '@/hooks/api/useWinningPatterns';
import { motion } from 'framer-motion';

interface BingoCardProps {
  cardId: string;
  numbers: string[][];
  active: boolean;
  eventId?: string | number;
  calledNumbers?: number[];
}

export default function BingoCard({ cardId, numbers, active, eventId, calledNumbers = [] }: BingoCardProps) {
  const [markedNumbers, setMarkedNumbers] = useState<Set<string>>(new Set());
  const { data: patternVerification, isLoading: verificationLoading } = useVerifyCardPattern(cardId, active);
  const { data: eventPatterns } = useEventPatterns(eventId || '');
  const claimMutation = useClaimBingo();

  // Columnas BINGO
  const columns = ['B', 'I', 'N', 'G', 'O'];

  // Mapa de posiciones a índices lineales (0-24)
  const positionMap = useMemo(() => {
    const map = new Map<string, number>();
    numbers.flat().forEach((num, index) => {
      // Si es el espacio libre (N0), no lo incluimos en el mapa
      if (num !== 'N0') {
        map.set(num, index);
      }
    });
    return map;
  }, [numbers]);

  // Efecto para marcar automáticamente el espacio FREE
  useEffect(() => {
    setMarkedNumbers(prev => {
      const newSet = new Set(prev);
      newSet.add('N0'); // El centro siempre está marcado
      return newSet;
    });
  }, []);

  // Marcar un número en el cartón
  const toggleNumber = (num: string) => {
    if (!active || num === 'N0') return; // No se puede desmarcar el FREE o si el cartón no está activo

    setMarkedNumbers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(num)) {
        newSet.delete(num);
      } else if (calledNumbers.length === 0 || (num.length > 1 && calledNumbers.includes(parseInt(num.substring(1))))) {
        // Solo permitir marcar si no hay números llamados o si el número está en la lista de llamados
        newSet.add(num);
      }
      return newSet;
    });
  };

  // Verificar si el número ha sido llamado
  const isNumberCalled = (num: string) => {
    if (num === 'N0') return true; // FREE siempre es "llamado"
    if (calledNumbers.length === 0) return false; // Si no hay números llamados, devolver false

    const numValue = parseInt(num.substring(1));
    return calledNumbers.includes(numValue);
  };

  // Manejar reclamo de BINGO
  const handleClaimBingo = async () => {
    if (!patternVerification?.is_winner) {
      toast.error('Todavía no has completado un patrón ganador');
      return;
    }

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
    if (!patternVerification?.is_winner || !patternVerification.matched_patterns || !eventPatterns) return false;

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
  const isWinner = patternVerification?.is_winner || false;

  return (
    <div className={cn(
      "rounded-lg overflow-hidden border bg-white shadow-sm transition-all",
      active ? "cursor-pointer" : "opacity-90",
      isWinner && "border-2 border-[#7C3AED]"
    )}>
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
            const isCalled = isNumberCalled(num);
            const isWinningPosition = isPartOfWinningPattern(position);

            return (
              <div
                key={`${rowIdx}-${colIdx}`}
                className={cn(
                  "aspect-square flex items-center justify-center rounded-md text-xs sm:text-sm font-medium transition-all",
                  isMarked && "bg-[#DDD6FE] text-[#7C3AED]",
                  isFree && "bg-amber-100 text-amber-800",
                  isWinningPosition && "bg-green-100 text-green-800 ring-2 ring-green-500",
                  active && !isFree && "hover:bg-gray-200",
                  !isMarked && !isFree && "bg-white"
                )}
                onClick={() => toggleNumber(num)}
              >
                {isFree ? 'FREE' : num.substring(1)}

                {/* Indicador de número llamado */}
                {isMarked && isCalled && !isFree && (
                  <div className="absolute h-2 w-2 rounded-full bg-[#7C3AED]" />
                )}
              </div>
            );
          })
        ))}
      </div>

      {/* Botón de BINGO */}
      {active && (
        <div className="p-2 bg-gray-100">
          <Button
            onClick={handleClaimBingo}
            className={cn(
              "w-full",
              patternVerification?.is_winner
                ? "bg-[#7C3AED] hover:bg-[#6D28D9]"
                : "bg-gray-400 hover:bg-gray-500"
            )}
            disabled={!patternVerification?.is_winner || claimMutation.isPending}
          >
            {claimMutation.isPending ? '¡Verificando...' : '¡BINGO!'}
          </Button>
        </div>
      )}

      {/* Efecto de ganador */}
      {isWinner && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.3, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <div className="h-full w-full bg-green-300 rounded-lg" />
        </motion.div>
      )}
    </div>
  );
}