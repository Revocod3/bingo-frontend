'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { useVerifyCardPattern, useClaimBingo } from '@/hooks/api/useCardVerification';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useEventPatterns } from '@/hooks/api/useWinningPatterns';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { FaStar } from 'react-icons/fa';


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
  // Nuevo estado para controlar la animación de intento fallido
  const [showFailedAttempt, setShowFailedAttempt] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
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
    numbers.flat().forEach((num) => {
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
      manualMarkedNumbers.forEach((num) => {
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
    setManualMarkedNumbers((prev) => {
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
          // Mostrar animación de intento fallido
          setShowFailedAttempt(true);
          setTimeout(() => {
            setShowFailedAttempt(false);
          }, 3000);
        }
      } else {
        toast.error('No tienes un patrón ganador en este cartón');
        // Mostrar animación de intento fallido
        setShowFailedAttempt(true);
        setTimeout(() => {
          setShowFailedAttempt(false);
        }, 3000);
      }
    } catch (error) {
      toast.error('Error al verificar/reclamar el BINGO');
      console.error('Error claiming bingo:', error);
      // Mostrar animación de intento fallido también en caso de error
      setShowFailedAttempt(true);
      setTimeout(() => {
        setShowFailedAttempt(false);
      }, 3000);
    }
  };

  // Función para determinar si una posición forma parte de un patrón ganador.
  const isPartOfWinningPattern = (position: number): boolean => {
    if (
      !eventPatterns ||
      !patternVerification ||
      !patternVerification.is_winner ||
      !patternVerification.matched_patterns?.length
    ) {
      return false;
    }
    for (const patternId of patternVerification.matched_patterns) {
      const pattern = eventPatterns.find((p) => p.id === patternId);
      if (pattern && pattern.positions.includes(position)) {
        return true;
      }
    }
    return false;
  };

  const columns = ['B', 'I', 'N', 'G', 'O'];

  return (
    <div
      className={cn(
        'rounded-2xl overflow-hidden transition-all relative',
        'backdrop-blur-md bg-black/30 border border-white/10',
        'shadow-[0_0_15px_rgba(123,58,237,0.2)]',
        isWinner && 'shadow-[0_0_30px_rgba(123,58,237,0.6)] border-purple-500/50'
      )}
    >
      {/* Background glow effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-indigo-900/20 z-0"></div>
      <div className={cn(
        'absolute -inset-[100px] bg-purple-600/10 rounded-full blur-3xl z-0 transition-opacity duration-1000',
        isWinner ? 'opacity-70' : 'opacity-0'
      )}></div>

      {/* Confetti effect for winners */}
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

      {/* BINGO text animation for winners */}
      {showBingoText && (
        <motion.div
          className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1.2, 1.2, 0.5] }}
          transition={{ duration: 4, times: [0, 0.2, 0.8, 1], ease: 'easeInOut' }}
        >
          <div className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 font-extrabold text-5xl md:text-7xl drop-shadow-[0_0_8px_rgba(124,58,237,0.8)]">
            ¡BINGO!
          </div>
        </motion.div>
      )}

      {/* Failed attempt animation */}
      {showFailedAttempt && (
        <motion.div
          className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ duration: 3, times: [0, 0.2, 0.8, 1], ease: 'easeInOut' }}
        >
          <motion.div
            className="bg-black/40 backdrop-blur-md rounded-xl p-4 shadow-lg max-w-[90%] text-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <div className="text-red-400 font-bold text-xl mb-2">AÚN NO TIENES BINGO</div>
            <p className="text-gray-300">Este cartón todavía no tiene un patrón ganador.</p>
          </motion.div>
        </motion.div>
      )}

      {/* Card header with column letters */}
      <div className="grid grid-cols-5 relative z-10 bg-gradient-to-r from-purple-700 to-indigo-700 shadow-md">
        {columns.map((letter, idx) => (
          <div
            key={idx}
            className="text-center font-bold py-3 text-sm sm:text-base text-white"
          >
            <span className="inline-block bg-gradient-to-b from-white to-purple-200 bg-clip-text text-transparent drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]">
              {letter}
            </span>
          </div>
        ))}
      </div>

      {/* Card grid with numbers */}
      <div className="grid grid-cols-5 gap-2 p-3 bg-black/20 backdrop-blur-sm relative z-10">
        {numbers.map((row, rowIdx) =>
          row.map((num, colIdx) => {
            const position = rowIdx * 5 + colIdx;
            const isFree = num === 'N0';
            const isMarked = markedNumbers.has(num);
            const isWinningPosition = isPartOfWinningPattern(position);

            return (
              <motion.div
                key={`${rowIdx}-${colIdx}`}
                className={cn(
                  'aspect-square flex items-center justify-center rounded-lg text-xs sm:text-sm font-medium',
                  'transition-all duration-200 backdrop-blur-sm shadow-sm',
                  'border border-white/5',
                  isMarked && !isWinningPosition && 'bg-purple-500/30 text-white border-purple-500/30 shadow-[0_0_10px_rgba(139,92,246,0.3)]',
                  isFree && 'bg-gradient-to-br from-green-400/30 to-emerald-500/30 text-emerald-300 border-emerald-400/20',
                  isWinningPosition && 'bg-gradient-to-br from-amber-400/40 to-orange-500/40 text-amber-200 border-amber-500/40 shadow-[0_0_15px_rgba(251,191,36,0.4)]',
                  active && !isFree && 'cursor-pointer hover:scale-105 hover:shadow-md hover:z-10',
                  !isMarked && !isFree && 'bg-white/10 text-gray-200 hover:bg-white/20'
                )}
                onClick={() => toggleNumber(num)}
                whileHover={active && !isFree ? { scale: 1.05 } : {}}
                whileTap={active && !isFree ? { scale: 0.98 } : {}}
                animate={isMarked ? {
                  scale: [1, 1.1, 1],
                  transition: { duration: 0.3 }
                } : {}}
              >
                {isFree ? <FaStar /> : num.substring(1)}
              </motion.div>
            );
          })
        )}
      </div>

      {/* Bingo button */}
      <div className="px-3 pb-3 bg-black/10 backdrop-blur-sm relative z-10">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={handleClaimBingo}
            className={cn(
              'w-full py-4 relative overflow-hidden group font-bold text-base',
              'border border-white/10 shadow-[0_4px_12px_rgba(123,58,237,0.5)]',
              'bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700',
              'hover:shadow-[0_4px_20px_rgba(123,58,237,0.7)]',
              isWinner ? 'from-green-600 to-emerald-700' : ''
            )}
          >
            <span className="relative z-10">
              {claimMutation.isPending ? '¡Verificando...' : '¡BINGO!'}
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-300/30 to-purple-600/0 translate-x-[-100%] group-hover:animate-shimmer"></span>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
