'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useEvent } from '@/hooks/api/useEvents';
import { useBingoCards } from '@/hooks/api/useBingoCards';
import { useNumbersByEvent } from '@/hooks/api/useNumbers';
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
  const { data: calledNumbersData, isLoading: numbersLoading } = useNumbersByEvent(eventId);

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

  const {
    calledNumbers,
    initializeGame,
    addCalledNumber
  } = useBingoStore();

  // Update lastNumbersCountRef when calledNumbers changes
  useEffect(() => {
    lastNumbersCountRef.current = calledNumbers.length;
  }, [calledNumbers.length]);

  // Changed default tab to 'cards' to show cartones first
  const [activeTab, setActiveTab] = useState<'info' | 'cards'>('cards');

  // Filter cards for the current event
  const eventCards = cards?.filter(card => card.event === eventId) || [];

  // Check if the game is live
  const isLive = event?.is_live;

  // Process called numbers from API to ensure proper synchronization
  useEffect(() => {
    if (!calledNumbersData || !calledNumbersData.length) return;

    // Extract the values of numbers from API response
    const apiNumbers = calledNumbersData.map((num: CalledNumberData) => num.value || num.number);

    // Sort called numbers by timestamp if available
    const sortedCalledNumbers = [...calledNumbersData].sort((a: CalledNumberData, b: CalledNumberData) => {
      // Try to sort by called_at timestamp or creation timestamp
      const aTime = a.called_at || a.created_at || 0;
      const bTime = b.called_at || b.created_at || 0;

      if (aTime && bTime) {
        return new Date(bTime).getTime() - new Date(aTime).getTime();
      }
      return 0;
    });

    // Get the most recent number
    if (sortedCalledNumbers.length > 0) {
      const firstNumber = sortedCalledNumbers[0];
      const newLastCalledNumber = firstNumber?.value ?? null;

      // Only update if it's a new number
      if (newLastCalledNumber !== null && newLastCalledNumber !== lastCalledNumber) {
        setPreviousNumber(lastCalledNumber);
        setLastCalledNumber(newLastCalledNumber);
      }
    }

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
  }, [calledNumbersData, initializeGame, addCalledNumber, lastCalledNumber]);

  // Add animation effect when lastCalledNumber changes
  useEffect(() => {
    if (lastCalledNumber !== null) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 2000); // Animation duration
      return () => clearTimeout(timer);
    }
  }, [lastCalledNumber]);

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
          <p className="text-xl font-medium mb-4 text-gray-700">No tienes cartones para este evento</p>
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
    <div className="container mx-auto pt-4 pb-8 px-2 sm:px-4 md:py-8">
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
      <div className="flex flex-col sm:flex-row justify-between items-ceenter bg-gradient-to-r from-purple-50 to-indigo-50 p-3 sm:p-4 rounded-lg shadow mb-4">
        <div className="flex flex-row items-center gap-2">
          <p className="text-xs sm:text-sm text-gray-500">Estado del juego:</p>
          <div className="flex items-center gap-2">
            <span className={`font-medium text-sm sm:text-lg ${isLive
              ? 'text-indigo-700'
              : 'text-red-600'
              }`}>
              {isLive ? 'En vivo' : 'Desconectado'}
            </span>
            <div className={`h-3 w-3 rounded-full ${isLive
              ? 'bg-gradient-to-r from-purple-500 to-green-400 animate-pulse shadow-sm'
              : 'bg-gradient-to-r from-red-500 to-orange-400 shadow-sm'
              }`}></div>
          </div>
        </div>

        <div className="flex flex-row items-center gap-2">
          <p className="text-xs sm:text-sm text-gray-500">Último número llamado:</p>
          {lastCalledNumber ? (
            <div className="relative">
              <div
                className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full 
                  bg-gradient-to-r from-purple-600 to-indigo-600 
                  shadow-lg flex items-center justify-center
                  ${isAnimating ? 'animate-pulse ring-4 ring-yellow-400 scale-110' : ''}
                  transition-all duration-300`}
              >
                <span className="text-white text-2xl sm:text-3xl font-bold">
                  {lastCalledNumber}
                </span>
              </div>
              {isAnimating && previousNumber && (
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center opacity-0 animate-fade-out">
                  <span className="text-yellow-500 text-3xl font-bold absolute -top-6 -right-6 bg-white rounded-full px-2 py-1 border border-yellow-400">
                    {previousNumber}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <span className="text-xs font-medium text-gray-400">Ninguno aún</span>
          )}
        </div>

        <div className="flex flex-row items-center gap-2">
          <p className="text-xs sm:text-sm text-gray-500">Números cantados:</p>
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm sm:text-lg text-indigo-700">
              {calledNumbers.length}/75
            </span>
          </div>
        </div>
      </div>
      {/* Lista de números cantados en versión compacta */}
      <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-white rounded-lg shadow-sm border border-indigo-100">
        <h3 className="text-base sm:text-lg font-semibold mb-2 text-indigo-700">Números Cantados</h3>
        <div className="flex flex-wrap justify-start gap-1 sm:gap-2">
          {calledNumbers.length > 0
            ? calledNumbers.map((num, index) => (
              <span key={index} className="inline-block min-w-[30px] text-center py-1 bg-indigo-100 text-indigo-800 text-xs rounded-md">
                {num}
              </span>
            ))
            : <span className="text-gray-500 italic text-xs sm:text-sm">Aún no se han llamado números</span>
          }
        </div>
      </div>

      {/* Tab header - Cambiado el orden para que "Tus Cartones" sea primero */}
      <div className="flex border-b mb-4 mt-2 overflow-x-auto">
        <button
          className={`px-3 sm:px-4 py-2 cursor-pointer whitespace-nowrap ${activeTab === 'cards' ? 'border-b-2 border-purple-600 font-bold text-purple-700' : 'text-gray-500'}`}
          onClick={() => setActiveTab('cards')}
        >
          Tus Cartones
        </button>
        <button
          className={`px-3 sm:px-4 py-2 cursor-pointer whitespace-nowrap ${activeTab === 'info' ? 'border-b-2 border-purple-600 font-bold text-purple-700' : 'text-gray-500'}`}
          onClick={() => setActiveTab('info')}
        >
          ¿Cómo ganar?
        </button>
      </div>

      {activeTab === 'info' && (
        <>
          {/* Bingo Patterns Display */}
          <Card className="mb-2">
            <CardHeader className="px-6">
              <CardTitle className="text-base sm:text-lg">Patrones ganadores</CardTitle>
            </CardHeader>
            <CardContent>
              <BingoPatternsDisplay eventId={eventId} />
            </CardContent>
          </Card>


        </>
      )}

      {activeTab === 'cards' && (
        <div>
          {/* Auto-mark toggle */}
          <div className="mb-4 flex flex-row items-center justify-between gap-2">
            <h2 className="text-xl sm:text-2xl font-bold">Cartones</h2>
            <div className="flex items-center space-x-2 sm:self-auto">
              <Label htmlFor="auto-mark" className="text-xs sm:text-sm font-thin max-w-[150px] sm:max-w-none">
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
            {eventCards.map(card => (
              <div key={card.id} className="p-1 sm:p-2 bg-gradient-to-br from-white to-purple-50 rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
                <div className="transform scale-[0.95] sm:scale-100">
                  <BingoCard
                    cardId={String(card.id)} // Convertir a string
                    numbers={getCardNumbers(card)} // Asegurar que esta función devuelve string[][]
                    active={false} // Disable automatic verification
                    eventId={eventId}
                    calledNumbers={calledNumbers}
                    autoMarkEnabled={autoMarkEnabled} // Add this prop
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
