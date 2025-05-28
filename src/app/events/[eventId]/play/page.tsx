'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useEvent } from '@/hooks/api/useEvents';
import { useBingoCards } from '@/hooks/api/useBingoCards';
import { useNumbersByEvent, useLastCalledNumber } from '@/hooks/api/useNumbers';
import { useBingoStore } from '@/lib/stores/bingo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FaArrowLeft } from 'react-icons/fa';
import BingoPatternsDisplay from '@/src/components/BingoPatternsDisplay';
import BingoCard from '@/components/BingoCard';
import { getCardNumbers } from '@/src/lib/utils';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

// Define interfaces for type safety
interface CalledNumberData {
  value?: number;
  number?: number;
  called_at?: string;
  created_at?: string;
}
export default function GamePlayPage() {
  const params = useParams<{ eventId: string }>();
  const eventId = params?.eventId || '';
  const { data: event, isLoading: eventLoading } = useEvent(eventId);
  const { data: cards, isLoading: cardsLoading } = useBingoCards();

  // Obtenemos todos los números llamados con un intervalo de refresco reducido
  const { data: calledNumbersData, isLoading: numbersLoading } = useNumbersByEvent(eventId);

  // Nuevo hook específico para el último número - se refresca cada 2 segundos
  const { data: lastNumberData } = useLastCalledNumber(eventId);

  // State for tracking last number for notifications
  const [lastCalledNumber, setLastCalledNumber] = useState<number | null>(null);
  const [previousNumber, setPreviousNumber] = useState<number | null>(null);
  // Add animation state
  const [isAnimating, setIsAnimating] = useState(false);
  // Auto-marking toggle state - default to false
  const [autoMarkEnabled, setAutoMarkEnabled] = useState(false);

  // Track if new numbers have been added since last poll
  const lastNumbersCountRef = useRef<number>(0);

  // Initialize auto-mark preference from localStorage
  useEffect(() => {
    const savedPreference = localStorage.getItem('bingoAutoMarkPreference');
    if (savedPreference !== null) {
      setAutoMarkEnabled(savedPreference === 'true');
    }
  }, []);

  // Handle toggle change
  const handleAutoMarkToggle = (enabled: boolean) => {
    setAutoMarkEnabled(enabled);
    localStorage.setItem('bingoAutoMarkPreference', enabled.toString());
  };

  const { calledNumbers, initializeGame, addCalledNumber } = useBingoStore();

  // Update lastNumbersCountRef when calledNumbers changes
  useEffect(() => {
    lastNumbersCountRef.current = calledNumbers.length;
  }, [calledNumbers.length]);

  // Changed default tab to 'cards' to show cartones first
  const [activeTab, setActiveTab] = useState<'info' | 'cards'>('cards');

  // Filter cards for the current event
  const eventCards = cards?.filter((card) => card.event === eventId) || [];

  // Check if the game is live
  const isLive = event?.is_live;

  // Process called numbers from API to ensure proper synchronization
  useEffect(() => {
    if (!calledNumbersData || !calledNumbersData.length) return;

    // Extract the values of numbers from API response
    const apiNumbers = calledNumbersData.map((num: CalledNumberData) => num.value || num.number);

    // Initialize game with all numbers from API
    // This replaces the previous less reliable approach
    if (apiNumbers.length > 0) {
      // First initialize with an empty array (reset)
      initializeGame([]);

      // Then add each number to the store with proper timestamps
      calledNumbersData.forEach((numData: CalledNumberData) => {
        const numValue = numData.value || numData.number;
        const calledAt = numData.called_at || numData.created_at || new Date().toISOString();
        if (numValue) {
          addCalledNumber(numValue, calledAt);
        }
      });
    }
  }, [calledNumbersData, initializeGame, addCalledNumber]);

  // Nueva implementación para el último número llamado - se actualiza más rápido
  useEffect(() => {
    if (!lastNumberData) return;

    const newLastCalledNumber = lastNumberData.value;

    // Solo actualizar si es un número nuevo
    if (newLastCalledNumber !== undefined && newLastCalledNumber !== lastCalledNumber) {
      setPreviousNumber(lastCalledNumber);
      setLastCalledNumber(newLastCalledNumber);
      // Iniciar animación
      setIsAnimating(true);
    }
  }, [lastNumberData, lastCalledNumber]);

  // Add animation effect when lastCalledNumber changes
  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 2000); // Animation duration
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  if (eventLoading || cardsLoading || numbersLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#7C3AED]"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Evento no encontrado 😢</h2>
          <p className="text-gray-500">El evento que buscas no existe o ha sido eliminado.</p>
        </div>
      </div>
    );
  }

  if (!eventCards.length) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">{event.name}</h1>
        <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg text-center">
          <p className="text-xl font-medium mb-4 text-gray-700">
            No tienes cartones para este evento
          </p>
          <p className="text-gray-500">Debes comprar cartones para participar en el juego</p>
          <Button
            className="mt-4 bg-[#7C3AED] hover:bg-[#6D28D9]"
            onClick={() => window.history.back()}
          >
            Volver al evento
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-2 md:px-8 lg:px-12 xl:px-16">
      {/* Remove NumberCallNotification component */}

      <div className="flex flex-row justify-between items-start sm:items-center my-6 gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold">{event.name}</h1>
        <div className="flex flex-wrap gap-2 text-gray-500">
          <Link href="/dashboard" passHref>
            <Button variant="ghost" className="hover:text-accent-foreground">
              <FaArrowLeft className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
        </div>
      </div>

      {/* Estado y último número prominentes */}
      <div className="rounded-2xl overflow-hidden backdrop-blur-md bg-black/30 border border-white/10 shadow-[0_0_15px_rgba(123,58,237,0.2)] mb-5 relative">
        {/* Decorative elements for glassmorphism effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-indigo-900/20 z-0"></div>

        {/* Encabezado con gradiente similar a BingoCard */}
        <div className="w-full relative z-10 bg-gradient-to-r from-purple-700 to-indigo-700 shadow-md">
          <div className="text-center font-bold py-2 text-sm sm:text-base text-white">
            <span className="inline-block bg-gradient-to-b from-white to-purple-200 bg-clip-text text-transparent drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]">
              Estado del Juego
            </span>
          </div>
        </div>

        {/* Contenido del estado del juego */}
        <div className="w-full p-4 bg-black/20 backdrop-blur-sm relative z-10">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Estado del juego */}
            <div className="flex flex-row items-center gap-3 relative z-10">
              <p className="text-xs sm:text-sm text-gray-300 font-medium">Estado:</p>
              <div className="flex items-center gap-2">
                <span
                  className={`font-semibold text-sm sm:text-lg ${isLive ? 'text-purple-300' : 'text-red-400'
                    }`}
                >
                  {isLive ? 'En vivo' : 'Desconectado'}
                </span>
                <div
                  className={`h-3 w-3 rounded-full ${isLive
                    ? 'bg-gradient-to-r from-purple-500 to-green-400 animate-pulse shadow-[0_0_8px_rgba(167,139,250,0.6)]'
                    : 'bg-gradient-to-r from-red-500 to-orange-400 shadow-md'
                    }`}
                ></div>
              </div>
            </div>

            {/* Último número llamado */}
            <div className="flex flex-row items-center gap-3 relative z-10">
              <p className="text-xs sm:text-sm text-gray-300 font-medium">Último número:</p>
              {lastCalledNumber ? (
                <div className="relative">
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full 
                      bg-gradient-to-r from-purple-600 to-indigo-600 
                      shadow-[0_0_15px_rgba(139,92,246,0.4)] flex items-center justify-center
                      ${isAnimating ? 'animate-pulse ring-4 ring-yellow-400 scale-110' : ''}
                      transition-all duration-300`}
                  >
                    <span className="text-white text-2xl sm:text-3xl font-bold">
                      {lastCalledNumber}
                    </span>
                  </div>
                  {isAnimating && previousNumber && (
                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center opacity-0 animate-fade-out">
                      <span className="text-yellow-500 text-3xl font-bold absolute -top-6 -right-6 bg-white/10 backdrop-blur-sm rounded-full px-2 py-1 border border-yellow-400/50 shadow-[0_0_10px_rgba(251,191,36,0.5)]">
                        {previousNumber}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <span className="text-xs font-medium text-gray-400">Ninguno aún</span>
              )}
            </div>

            {/* Números cantados counter */}
            <div className="flex flex-row items-center gap-3 relative z-10">
              <p className="text-xs sm:text-sm text-gray-300 font-medium">Cantados:</p>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm sm:text-lg text-purple-300">
                  {calledNumbers.length}/75
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Lista de números cantados en versión compacta */}
      <div className="mt-6 sm:mt-8 rounded-2xl overflow-hidden backdrop-blur-md bg-black/30 border border-white/10 shadow-[0_0_15px_rgba(123,58,237,0.2)] relative">
        {/* Decorative elements for glassmorphism effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-indigo-900/20 z-0"></div>

        {/* Encabezado con gradiente similar a BingoCard */}
        <div className="grid grid-cols-1 relative z-10 bg-gradient-to-r from-purple-700 to-indigo-700 shadow-md">
          <div className="text-center font-bold py-3 text-sm sm:text-base text-white">
            <span className="inline-block bg-gradient-to-b from-white to-purple-200 bg-clip-text text-transparent drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]">
              Números Cantados
            </span>
          </div>
        </div>

        {/* Contenido de números */}
        <div className="p-4 bg-black/20 backdrop-blur-sm relative z-10">
          <div className="flex flex-wrap justify-start gap-1.5 sm:gap-2 relative z-10">
            {calledNumbers.length > 0 ? (
              calledNumbers.map((num, index) => (
                <div
                  key={index}
                  className="aspect-square min-w-[32px] h-8 flex items-center justify-center rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 backdrop-blur-sm shadow-sm border border-white/5 bg-purple-500/30 text-white border-purple-500/30 shadow-[0_0_10px_rgba(139,92,246,0.3)]"
                >
                  {num}
                </div>
              ))
            ) : (
              <span className="text-gray-300 italic text-xs sm:text-sm">
                Aún no se han llamado números
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Tab header - Cambiado el orden para que "Tus Cartones" sea primero */}
      <div className="flex border-b mb-4 mt-2 overflow-x-auto">
        <button
          className={`px-3 sm:px-4 py-2 cursor-pointer whitespace-nowrap ${activeTab === 'cards'
            ? 'border-b-2 border-purple-600 font-bold text-purple-700'
            : 'text-gray-500'
            }`}
          onClick={() => setActiveTab('cards')}
        >
          Tus Cartones
        </button>
        <button
          className={`px-3 sm:px-4 py-2 cursor-pointer whitespace-nowrap ${activeTab === 'info'
            ? 'border-b-2 border-purple-600 font-bold text-purple-700'
            : 'text-gray-500'
            }`}
          onClick={() => setActiveTab('info')}
        >
          ¿Cómo ganar?
        </button>
      </div>

      {activeTab === 'info' && (
        <>
          {/* Bingo Patterns Display con estilo glassmorphism */}
          <div className="rounded-2xl overflow-hidden backdrop-blur-md bg-black/30 border border-white/10 shadow-[0_0_15px_rgba(123,58,237,0.2)] mb-5 relative">
            {/* Decorative elements for glassmorphism effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-indigo-900/20 z-0"></div>

            {/* Encabezado con gradiente similar a BingoCard */}
            <div className="w-full relative z-10 bg-gradient-to-r from-purple-700 to-indigo-700 shadow-md">
              <div className="text-center font-bold py-2 text-sm sm:text-base text-white">
                <span className="inline-block bg-gradient-to-b from-white to-purple-200 bg-clip-text text-transparent drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]">
                  Patrones Ganadores
                </span>
              </div>
            </div>

            {/* Contenido de patrones ganadores */}
            <div className="w-full p-4 bg-black/20 backdrop-blur-sm relative z-10">
              <BingoPatternsDisplay eventId={eventId} />
            </div>
          </div>
        </>
      )}

      {activeTab === 'cards' && (
        <div>
          {/* Auto-mark toggle */}
          <div className="mb-4 flex flex-row items-center justify-between gap-2">
            <h2 className="text-xl sm:text-2xl font-bold">Cartones</h2>
            <div className="flex items-center space-x-2 sm:self-auto">
              <Label
                htmlFor="auto-mark"
                className="text-xs sm:text-sm font-thin max-w-[150px] sm:max-w-none"
              >
                <span className="hidden sm:inline">Marcar números automáticamente</span>
                <span className="inline sm:hidden">Auto-marcar</span>
              </Label>
              <Switch
                id="auto-mark"
                checked={autoMarkEnabled}
                onCheckedChange={handleAutoMarkToggle}
              />
            </div>
          </div>

          {/* Botón de CANTAR BINGO más prominente */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {eventCards.map((card) => (

              <div className="transform scale-[0.95] sm:scale-100" key={card.id}>
                <BingoCard
                  cardId={card.correlative_id ? String(card.correlative_id) : String(card.id)} // Use correlative_id if available
                  numbers={getCardNumbers(card)} // Asegurar que esta función devuelve string[][]
                  active={true} // Changed from false to true to enable marking
                  eventId={eventId}
                  calledNumbers={calledNumbers}
                  autoMarkEnabled={autoMarkEnabled} // Add this prop
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
