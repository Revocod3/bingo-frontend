'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { useVerifyCardPattern, useClaimBingo } from '@/hooks/api/useCardVerification';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useEventPatterns } from '@/hooks/api/useWinningPatterns';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

const ReactConfetti = dynamic(() => import('react-confetti'), { ssr: false });

interface BingoCardProps {
  cardId: string;
  numbers: string[][];
  active: boolean;
  eventId?: string | number;
  calledNumbers?: number[];
  autoMarkEnabled?: boolean;
  correlativeId?: string;
}

export default function BingoCard({
  cardId,
  numbers,
  active,
  eventId,
  calledNumbers = [],
  autoMarkEnabled = false,
}: BingoCardProps) {
  // Estado para marcar manualmente. Iniciamos con FREE marcado.
  const [manualMarkedNumbers, setManualMarkedNumbers] = useState<Set<string>>(new Set(['N0']));

  const { data: patternVerification, refetch: verifyPattern } = useVerifyCardPattern(cardId, false);
  const { data: eventPatterns } = useEventPatterns(eventId || '');
  const claimMutation = useClaimBingo();
  const [showConfetti, setShowConfetti] = useState(false);
  const [showBingoText, setShowBingoText] = useState(false);
  const [isWinner, setIsWinner] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });


  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-marca: se calcula a partir de los números llamados.
  const autoMarkedNumbers = useMemo(() => {
    if (!autoMarkEnabled) return new Set<string>();
    const set = new Set<string>();
    set.add('N0'); // FREE siempre marcado
    numbers.flat().forEach(num => {
      if (num !== 'N0') {
        const numberPart = parseInt(num.substring(1));
        if (calledNumbers.includes(numberPart)) {
          set.add(num);
        }
      }
    });
    return set;
  }, [autoMarkEnabled, calledNumbers, numbers]);

  // Combinamos el marcado automático y el manual.
  const markedNumbers = useMemo(() => {
    if (autoMarkEnabled) {
      // Si el número está en llamados, se marca automáticamente (se ignora el toggle manual)
      const unionSet = new Set<string>(autoMarkedNumbers);
      // Se agregan marcas manuales para casos en que el usuario desee marcar algún número no llamado (si lo permite la lógica)
      manualMarkedNumbers.forEach(num => {
        // Sólo se agregan si no están ya en autoMarkedNumbers
        if (!autoMarkedNumbers.has(num)) unionSet.add(num);
      });
      return unionSet;
    }
    return manualMarkedNumbers;
  }, [autoMarkEnabled, autoMarkedNumbers, manualMarkedNumbers]);

  // Togglear marca manual. Si autoMarkEnabled está activo y el número fue llamado, se ignora.
  const toggleNumber = (num: string) => {
    if (!active || num === 'N0') return;
    const numberPart = parseInt(num.substring(1));
    if (autoMarkEnabled && calledNumbers.includes(numberPart)) return;
    setManualMarkedNumbers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(num)) {
        newSet.delete(num);
      } else {
        newSet.add(num);
      }
      return newSet;
    });
  };

  // Resto de la lógica de reclamo de BINGO y verificación se mantiene igual.
  const handleClaimBingo = async () => {
    try {
      const verificationResult = await verifyPattern();
      if (verificationResult.data?.is_winner) {
        const result = await claimMutation.mutateAsync({ cardId });
        if (result.data.success) {
          toast.success('¡BINGO! Tu victoria ha sido verificada.', {
            duration: 5000,
            style: { background: '#7C3AED', color: 'white', border: '2px solid #6D28D9' },
          });
          setShowConfetti(true);
          setShowBingoText(true);
          setIsWinner(true);
          setTimeout(() => {
            setShowConfetti(false);
            setShowBingoText(false);
          }, 5000);
        } else {
          toast.error(result.data.message || 'No se pudo verificar tu victoria');
        }
      } else {
        toast.error('No tienes un patrón ganador en este cartón');
      }
    } catch (error) {
      toast.error('Error al verificar/reclamar el BINGO');
      console.error('Error claiming bingo:', error);
    }
  };

  // Función para determinar si una posición forma parte de un patrón ganador.
  const isPartOfWinningPattern = (position: number): boolean => {
    if (!eventPatterns || !patternVerification || !patternVerification.is_winner || !patternVerification.matched_patterns?.length) {
      return false;
    }
    for (const patternId of patternVerification.matched_patterns) {
      const pattern = eventPatterns.find(p => p.id === patternId);
      if (pattern && pattern.positions.includes(position)) {
        return true;
      }
    }
    return false;
  };

  const columns = ['B', 'I', 'N', 'G', 'O'];

  return (
    <div className={cn(
      "rounded-lg overflow-hidden border bg-white shadow-sm transition-all text-gray-800 relative",
      "cursor-pointer",
      isWinner && "border-2 border-[#7C3AED]"
    )}>
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
      {showBingoText && (
        <motion.div
          className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1.2, 1.2, 0.5] }}
          transition={{ duration: 4, times: [0, 0.2, 0.8, 1], ease: "easeInOut" }}
        >
          <div className="text-[#7C3AED] font-extrabold text-5xl md:text-7xl drop-shadow-lg">
            ¡BINGO!
          </div>
        </motion.div>
      )}
      <div className="grid grid-cols-5 bg-[#7C3AED] text-white">
        {columns.map((letter, idx) => (
          <div key={idx} className="text-center font-bold py-2 text-sm sm:text-base">
            {letter}
          </div>
        ))}
      </div>
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
                  isFree && "bg-green-100 text-green-800",
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
      <div className="p-2">
        <Button
          onClick={handleClaimBingo}
          className={cn(
            "w-full",
            isWinner ? "bg-green-500 hover:bg-green-600" : "bg-[#7C3AED] hover:bg-[#6D28D9]"
          )}
        >
          {claimMutation.isPending ? '¡Verificando...' : '¡BINGO!'}
        </Button>
      </div>
    </div>
  );
}
