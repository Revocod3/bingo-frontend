'use client';

import { useEffect, useState } from 'react';
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

export default function GamePlayPage() {
  const params = useParams<{ eventId: string }>();
  const eventId = params?.eventId || '';
  const { data: event, isLoading: eventLoading } = useEvent(eventId);
  const { data: cards, isLoading: cardsLoading } = useBingoCards();
  const { data: calledNumbersData, isLoading: numbersLoading } = useNumbersByEvent(eventId);
  const queryClient = useQueryClient();

  // Use ReactQuery with refetchInterval for real-time updates
  useEffect(() => {
    // Set up polling to check for new numbers every 5 seconds
    const intervalId = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ['numbers', eventId] });
    }, 5000);

    // Cleanup interval on unmount
    return () => {
      clearInterval(intervalId);
    };
  }, [eventId, queryClient]);

  const {
    isPlaying,
    calledNumbers,
    initializeGame,
    isConnected
  } = useBingoStore();

  // State for bingo claim modal
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'cards'>('info');

  // Filter cards for the current event
  const eventCards = cards?.filter(card => card.event === eventId) || [];

  // Initialize game with called numbers from API if available
  useEffect(() => {
    if (calledNumbersData?.length && !calledNumbers.length) {
      initializeGame([]);
      // Add all called numbers from API
      calledNumbersData.forEach((numData) => {
        const num = numData as unknown as { number: number; called_at: string };
        useBingoStore.getState().addCalledNumber(num.number, num.called_at);
      });
    }
  }, [calledNumbersData, calledNumbers.length, initializeGame]);

  // Handle bingo claim
  const handleClaimBingo = () => {
    // Open modal to confirm bingo claim
    setShowClaimModal(true);
  };

  // Submit bingo claim
  const submitBingoClaim = async (cardId: number) => {
    try {
      // API call to submit bingo claim
      const response = await fetch(`/api/bingo/claim`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          eventId,
          cardId,
          numbers: calledNumbers.map(n => n)
        })
      });

      const data = await response.json();

      // Handle response (show success or error)
      if (response.ok) {
        // Show success message
        alert('¡Bingo reclamado con éxito!');
      } else {
        // Show error
        alert(`Error: ${data.message || 'No se pudo reclamar el bingo'}`);
      }
    } catch (error) {
      console.error('Error claiming bingo:', error);
      alert('Error al reclamar bingo. Por favor intenta nuevamente.');
    } finally {
      setShowClaimModal(false);
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

      {/* Tab header */}
      <div className="flex border-b mb-4">
        <button
          className={`px-4 py-2 cursor-pointer ${activeTab === 'info' ? 'border-b-2 font-bold' : 'text-gray-500'}`}
          onClick={() => setActiveTab('info')}
        >
          Información
        </button>
        <button
          className={`px-4 py-2 cursor-pointer ${activeTab === 'cards' ? 'border-b-2 font-bold' : 'text-gray-500'}`}
          onClick={() => setActiveTab('cards')}
        >
          Tus Cartones
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
          {/* New section for last called number and Claim Bingo Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2">
            <div className="flex flex-row gap-4 items-center justify-center items-center">
              <h2 className="text-xl font-bold mb-2">Último Número</h2>
              {calledNumbers.length > 0 ? (
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 
                                shadow-lg flex items-center justify-center transform transition-all 
                                duration-300 hover:scale-105 animate-pulse-once">
                    <span className="text-white text-3xl font-bold">{calledNumbers[calledNumbers.length - 1]}</span>
                  </div>
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-5 h-5 rounded-full bg-gray-200"></div>
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center shadow-md">
                  <span className="text-gray-500 text-xl font-bold">N/A</span>
                </div>
              )}
            </div>
            <Button
              onClick={handleClaimBingo}
              className="mt-4 sm:mt-0 bg-green-600 hover:bg-green-700 text-white font-bold py-4 text-lg gap-2"
              disabled={!isPlaying || calledNumbers.length < 5}
            >
              <FaTrophy size={20} /> ¡CANTAR BINGO!
            </Button>
          </div>

          <h2 className="text-2xl font-bold mb-4">Tus Cartones</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {eventCards.map(card => (
              <div key={card.id} className="p-2 bg-gray-50 rounded shadow">
                <BingoCard cardId={card.id} numbers={getCardNumbers(card)} active={false} />
                <p className="mt-2 text-right mr-2 font-thin text-xs text-gray-500">Cartón #{card.id}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bingo Claim Modal */}
      <Dialog open={showClaimModal} onOpenChange={setShowClaimModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar Bingo</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="mb-4">Selecciona el cartón con el que has obtenido bingo:</p>
            <div className="space-y-2">
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
                disabled={!selectedCard}
              >
                Confirmar Bingo
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
