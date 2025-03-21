'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useEvent } from '@/hooks/api/useEvents';
import { useBingoCards } from '@/hooks/api/useBingoCards';
import { useNumbersByEvent } from '@/hooks/api/useNumbers';
import { useBingoStore } from '@/lib/stores/bingo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CardCarousel from '@/components/CardCarousel';
import { WinModal } from '@/components/WinModal';
import CalledNumbersSidebar from '@/components/CalledNumbersSidebar';
import { FaDice, FaUndo, FaArrowLeft } from 'react-icons/fa';

export default function GamePlayPage() {
  const params = useParams<{ eventId: string }>();
  const eventId = params?.eventId || '';
  const { data: event, isLoading: eventLoading } = useEvent(eventId);
  const { data: cards, isLoading: cardsLoading } = useBingoCards();
  const { data: initialCalledNumbers } = useNumbersByEvent(eventId);

  const {
    callNumber,
    resetGame,
    isPlaying,
    calledNumbers,
    initializeGame,
    connectToGame,
    disconnectFromGame,
    isConnected
  } = useBingoStore();

  // Filter cards for the current event
  const eventCards = cards?.filter(card => card.event === eventId) || [];

  // Connect to WebSocket when page loads
  useEffect(() => {
    // Get the token from local storage
    const token = localStorage.getItem('authToken');

    if (token && eventId && !isConnected) {
      connectToGame(eventId, token);

      // Initialize game with initial data
      initializeGame([]);
    }

    // Disconnect when component unmounts
    return () => {
      disconnectFromGame();
    };
  }, [eventId, connectToGame, disconnectFromGame, isConnected, initializeGame]);

  // Initialize game with called numbers from API if available
  useEffect(() => {
    if (initialCalledNumbers?.length && !calledNumbers.length && !isConnected) {
      initializeGame([]);
      // Add all called numbers (mock implementation, would be replaced by WebSocket)
      initialCalledNumbers.forEach(num => {
        useBingoStore.getState().addCalledNumber(num, new Date().toISOString());
      });
    }
  }, [initialCalledNumbers, calledNumbers.length, isConnected, initializeGame]);

  if (eventLoading || cardsLoading) {
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
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{event.name}</h1>
        <div className="flex gap-2">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* <div className="lg:col-span-2">
          <CardCarousel cards={eventCards} eventId={eventId} />
        </div> */}

        <div className="space-y-6">
          {/* Game Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Controles de juego</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <Button
                  onClick={() => callNumber()}
                  className="bg-[#7C3AED] hover:bg-[#6D28D9] gap-2"
                  disabled={!isPlaying}
                  size="lg"
                >
                  <FaDice size={18} /> Llamar número
                </Button>

                <Button
                  onClick={() => resetGame()}
                  variant="outline"
                  className="gap-2"
                  size="lg"
                >
                  <FaUndo size={18} /> Reiniciar juego
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Called Numbers Display */}
          <CalledNumbersSidebar />

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
      </div>

      {/* Win Modal - shows automatically when isWinner is true */}
      <WinModal />
    </div>
  );
}
