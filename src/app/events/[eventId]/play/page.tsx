'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useEvent } from '@/hooks/api/useEvents';
import { useBingoCards } from '@/hooks/api/useBingoCards';
import { useNumbersByEvent } from '@/hooks/api/useNumbers';
import { useBingoStore } from '@/lib/stores/bingo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CardCarousel from '@/components/CardCarousel';
import { FaDice, FaUndo, FaHistory, FaArrowLeft } from 'react-icons/fa';

export default function GamePlayPage() {
  const params = useParams<{ eventId: string }>();
  const eventId = params?.eventId || '';
  const eventIdNumber = Number(eventId);
  const { data: event, isLoading: eventLoading } = useEvent(eventIdNumber);
  const { data: cards, isLoading: cardsLoading } = useBingoCards();
  const { data: calledNumbers } = useNumbersByEvent(eventIdNumber);
  
  const { 
    callNumber,
    resetGame, 
    isPlaying,
    calledNumbers: storeCalledNumbers,
    currentNumber,
    initializeGame
  } = useBingoStore();
  
  const [showHistory, setShowHistory] = useState(false);
  
  // Filter cards for the current event
  const eventCards = cards?.filter(card => card.event === eventIdNumber) || [];
  
  // Initialize game with called numbers from API if available
  useEffect(() => {
    if (calledNumbers?.length && !isPlaying) {
      initializeGame([]);
    }
  }, [calledNumbers, isPlaying, initializeGame]);

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
        <div className="lg:col-span-2">
          <CardCarousel cards={eventCards} eventId={eventIdNumber} />
        </div>
        
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
                
                <Button 
                  onClick={() => setShowHistory(!showHistory)}
                  variant="outline"
                  className="gap-2"
                  size="lg"
                >
                  <FaHistory size={18} /> 
                  {showHistory ? 'Ocultar historial' : 'Mostrar historial'}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Number History */}
          {showHistory && (
            <Card>
              <CardHeader>
                <CardTitle>Historial de números</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2">
                  {storeCalledNumbers.map((num, idx) => (
                    <div 
                      key={idx} 
                      className={`
                        rounded-full w-10 h-10 flex items-center justify-center font-bold
                        ${idx === storeCalledNumbers.length - 1 ? 'bg-[#7C3AED] text-white' : 'bg-[#DDD6FE]'}
                      `}
                    >
                      {num}
                    </div>
                  ))}
                </div>
                {storeCalledNumbers.length === 0 && (
                  <p className="text-center text-gray-500">No hay números llamados aún</p>
                )}
              </CardContent>
            </Card>
          )}
          
          {/* Game Info */}
          <Card>
            <CardHeader>
              <CardTitle>Información del evento</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span>Premio:</span> 
                  <span className="font-bold">${event.prize.toFixed(2)}</span>
                </li>
                <li className="flex justify-between">
                  <span>Tus cartones:</span> 
                  <span className="font-bold">{eventCards.length}</span>
                </li>
                <li className="flex justify-between">
                  <span>Números llamados:</span> 
                  <span className="font-bold">{storeCalledNumbers.length}/75</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
