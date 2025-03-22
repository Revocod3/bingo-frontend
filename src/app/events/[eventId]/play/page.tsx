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
import { WinModal } from '@/components/WinModal';
import { FaArrowLeft, FaTrophy } from 'react-icons/fa';
import { useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import BingoPatternsDisplay from '@/src/components/BingoPatternsDisplay';
import BingoCard from '@/components/BingoCard';
import { getCardNumbers } from '@/src/lib/utils';
import { NumberCallNotification } from '@/components/NumberCallNotification';
import { useClaimBingo } from '@/hooks/api/useBingoCards';
import { toast } from 'sonner';

// Define interfaces for type safety
interface CalledNumberData {
  value?: number;
  number?: number;
  called_at?: string;
  created_at?: string;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export default function GamePlayPage() {
  const params = useParams<{ eventId: string }>();
  const eventId = params?.eventId || '';
  const { data: event, isLoading: eventLoading } = useEvent(eventId);
  const { data: cards, isLoading: cardsLoading } = useBingoCards();
  const { data: calledNumbersData, isLoading: numbersLoading } = useNumbersByEvent(eventId);
  const queryClient = useQueryClient();

  // State for tracking last number for notifications
  const [lastCalledNumber, setLastCalledNumber] = useState<number | null>(null);
  const [previousNumber, setPreviousNumber] = useState<number | null>(null);
  // Auto-refresh interval reference
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Use ReactQuery with refetchInterval for real-time updates (more aggressive polling)
  useEffect(() => {
    // Clear any existing interval first
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
    }

    // Set up polling to check for new numbers more frequently (every 3 seconds)
    refreshIntervalRef.current = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ['numbers', eventId] });
    }, 3000);

    // Cleanup interval on unmount
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [eventId, queryClient]);

  const {
    isPlaying,
    calledNumbers,
    initializeGame,
    isConnected,
    addCalledNumber
  } = useBingoStore();

  // State for bingo claim modal
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  // Changed default tab to 'cards' to show cartones first
  const [activeTab, setActiveTab] = useState<'info' | 'cards'>('cards');

  // Filter cards for the current event
  const eventCards = cards?.filter(card => card.event === eventId) || [];

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

  // Handle bingo claim
  const handleClaimBingo = () => {
    // Open modal to confirm bingo claim
    setShowClaimModal(true);
  };

  // Add this hook
  const claimBingoMutation = useClaimBingo();
  const [claimSubmitting, setClaimSubmitting] = useState(false); // Add loading state

  // Submit bingo claim
  const submitBingoClaim = async (cardId: number) => {
    try {
      setClaimSubmitting(true);

      // Log the card details before submission for debugging
      const cardToSubmit = eventCards.find(card => card.id === cardId);
      console.log('Attempting to claim bingo with card:', cardToSubmit);
      console.log('Called numbers:', calledNumbers);

      const result = await claimBingoMutation.mutateAsync({
        cardId
      });

      if (result.success) {
        toast.success(result.message || '¡Bingo reclamado con éxito!');
        setShowClaimModal(false);
      } else {
        // More specific error message
        const errorMsg = result.message || 'No se pudo validar el bingo';
        toast.error(errorMsg);
        console.error('Bingo claim rejected:', result);
      }
    } catch (error: unknown) {
      console.error('Error claiming bingo:', error);

      // Cast to ApiError type to access properties safely
      const apiError = error as ApiError;
      // More detailed error handling
      const errorMessage = apiError.response?.data?.message ||
        apiError.message ||
        'Error al reclamar bingo. Por favor intenta nuevamente.';
      toast.error(errorMessage);
    } finally {
      setClaimSubmitting(false);
    }
  };

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
    <div className="container mx-auto pt-[92px] px-4">
      {/* Notification component for new numbers */}
      <NumberCallNotification number={lastCalledNumber} previousNumber={previousNumber} />

      <div className="flex justify-between items-center mb-2">
        <h1 className="text-3xl font-bold">{event.name}</h1>
        <div className="flex gap-2 text-gray-500">
          <Link href={`/events/${eventId}`} passHref>
            <Button variant="outline" size="sm" className="gap-1">
              <FaArrowLeft size={14} /> Evento
            </Button>
          </Link>
          <Link href="/dashboard" passHref>
            <Button variant="outline" size="sm">
              Dashboard
            </Button>
          </Link>
        </div>
      </div>

      {/* Estado y último número prominentes */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg shadow mb-4">
        <div className="flex flex-col items-center sm:items-start mb-3 sm:mb-0">
          <p className="text-sm text-gray-500">Estado del juego:</p>
          <span className={`font-bold text-lg ${!isConnected ? 'text-green-600' : 'text-red-600'}`}>
            {!isConnected ? '✓ Conectado' : '✗ Desconectado'}
          </span>
        </div>

        <div className="flex flex-col items-center">
          <p className="text-sm text-gray-500">Último número llamado:</p>
          {lastCalledNumber ? (
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 
                           shadow-lg flex items-center justify-center">
                <span className="text-white text-3xl font-bold">{lastCalledNumber}</span>
              </div>
            </div>
          ) : (
            <span className="text-lg font-medium text-gray-400">Ninguno aún</span>
          )}
        </div>

        <div className="flex flex-col items-center sm:items-end">
          <p className="text-sm text-gray-500">Números llamados:</p>
          <span className="font-bold text-lg text-indigo-700">{calledNumbers.length}/75</span>
        </div>
      </div>

      {/* Tab header - Cambiado el orden para que "Tus Cartones" sea primero */}
      <div className="flex border-b mb-4">
        <button
          className={`px-4 py-2 cursor-pointer ${activeTab === 'cards' ? 'border-b-2 border-purple-600 font-bold text-purple-700' : 'text-gray-500'}`}
          onClick={() => setActiveTab('cards')}
        >
          Tus Cartones
        </button>
        <button
          className={`px-4 py-2 cursor-pointer ${activeTab === 'info' ? 'border-b-2 border-purple-600 font-bold text-purple-700' : 'text-gray-500'}`}
          onClick={() => setActiveTab('info')}
        >
          Información
        </button>
      </div>

      {activeTab === 'info' && (
        <>
          <div className="flex flex-col">
            {/* Bingo Patterns Display */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Patrones de ganancia</CardTitle>
              </CardHeader>
              <CardContent>
                <BingoPatternsDisplay />
              </CardContent>
            </Card>

            {/* Game Info */}
            <Card>
              <CardHeader>
                <CardTitle>Información del evento</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span>Premio:</span>
                    <span className="font-bold">${event.prize}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Tus cartones:</span>
                    <span className="font-bold">{eventCards.length}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Números llamados:</span>
                    <span className="font-bold">{calledNumbers.length}/75</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Estado:</span>
                    <span className={`font-bold ${isConnected ? 'text-green-500' : 'text-red-500'}`}>
                      {isConnected ? 'Conectado' : 'Desconectado'}
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
          {/* Section to display all called numbers */}
          <div className="mt-6 p-4 bg-white rounded-lg shadow-sm border border-pink-100">
            <h2 className="text-xl font-bold mb-2 text-pink-600">Todos los Números Llamados</h2>
            <div className="flex flex-wrap gap-2">
              {calledNumbers.length > 0
                ? calledNumbers.map((num, index) => (
                  <span key={index} className="px-3 py-1 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full shadow">
                    {num}
                  </span>
                ))
                : <span className="text-gray-500 italic">Aún no se han llamado números</span>
              }
            </div>
          </div>
        </>
      )}

      {activeTab === 'cards' && (
        <div>
          {/* Botón de CANTAR BINGO más prominente */}
          <div className="mb-6 flex justify-center">
            <Button
              onClick={handleClaimBingo}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 
                       text-white font-bold py-4 px-8 text-lg gap-2 rounded-full shadow-lg transform transition-all 
                       duration-200 hover:scale-105"
              disabled={!isPlaying || calledNumbers.length < 5}
            >
              <FaTrophy size={24} /> ¡CANTAR BINGO!
            </Button>
          </div>

          <h2 className="text-2xl font-bold mb-4">Tus Cartones</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventCards.map(card => (
              <div key={card.id} className="p-2 bg-gradient-to-br from-white to-purple-50 rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
                <BingoCard cardId={card.id} numbers={getCardNumbers(card)} active={true} />
                <div className="mt-2 flex justify-between items-center px-2">
                  <p className="font-thin text-xs text-gray-500">Cartón #{card.id}</p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs border-green-500 text-green-600 hover:bg-green-50"
                    onClick={() => {
                      setSelectedCard(card.id);
                      setShowClaimModal(true);
                    }}
                  >
                    Cantar con este
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Lista de números llamados en versión compacta */}
          <div className="mt-8 p-4 bg-white rounded-lg shadow-sm border border-indigo-100">
            <h3 className="text-lg font-semibold mb-2 text-indigo-700">Números Llamados</h3>
            <div className="flex flex-wrap gap-2">
              {calledNumbers.length > 0
                ? calledNumbers.map((num, index) => (
                  <span key={index} className="inline-block px-2 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-md">
                    {num}
                  </span>
                ))
                : <span className="text-gray-500 italic">Aún no se han llamado números</span>
              }
            </div>
          </div>
        </div>
      )}

      <Dialog open={showClaimModal} onOpenChange={setShowClaimModal}>
        <DialogContent className="sm:max-w-[425px] text-gray-700">
          <DialogHeader>
            <DialogTitle>Confirmar Bingo</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="mb-2 mt-4">Selecciona el cartón con el que has obtenido bingo:</p>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {eventCards.map(card => (
                <div
                  key={card.id}
                  className={`p-3 border rounded-md cursor-pointer ${selectedCard === card.id ? 'border-green-500 bg-green-50' : ''}`}
                  onClick={() => setSelectedCard(card.id)}
                >
                  Cartón #{card.id}
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() => submitBingoClaim(selectedCard!)}
                disabled={!selectedCard || claimSubmitting}
              >
                {claimSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span> Verificando
                  </>
                ) : (
                  'Confirmar Bingo'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Win Modal - shows automatically when isWinner is true */}
      <WinModal />
    </div>
  );
}
