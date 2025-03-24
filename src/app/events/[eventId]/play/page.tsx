'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useEvent } from '@/hooks/api/useEvents';
import { useBingoCards, useGenerateBingoCard } from '@/hooks/api/useBingoCards';
import { useNumbersByEvent } from '@/hooks/api/useNumbers';
import { useBingoStore } from '@/lib/stores/bingo';

import { getCardNumbers } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BingoCard from '@/components/BingoCard';
import { WinModal } from '@/components/WinModal';
import BingoPatternList from '@/components/BingoPatternList';
import ClaimBingoButton from '@/components/ClaimBingoButton';
import { FaArrowLeft, FaHistory } from 'react-icons/fa';
import Link from 'next/link';

export default function EventPlayPage() {
  const params = useParams<{ eventId: string }>();
  const eventId = params?.eventId || '';
  const router = useRouter();
  
  // Queries
  const { data: event, isLoading: eventLoading } = useEvent(eventId);
  const { data: cards = [], isLoading: cardsLoading } = useBingoCards();
  const { data: calledNumbersData = [] } = useNumbersByEvent(eventId);


  // Local state
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  
  // Store
  const { connectToGame, disconnectFromGame, calledNumbers, currentNumber, isPlaying } = useBingoStore();

  // Filter cards for this specific event
  const eventCards = useMemo(() => {
    return cards.filter(card => card.event === eventId);
  }, [cards, eventId]);
  
  // Get numbers for active card
  const activeCardNumbers = useMemo(() => {
    if (!eventCards.length) return [];
    return getCardNumbers(eventCards[activeCardIndex]);
  }, [eventCards, activeCardIndex]);
  


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
          <Button className="mt-6" asChild>
            <Link href="/events">Ver otros eventos</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (eventCards.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-4">No tienes cartones para este evento</h2>
          <p className="text-gray-500 mb-6">Necesitas al menos un cartón para participar en este evento.</p>
          <Button className="w-full mb-2" asChild>
            <Link href={`/events/${eventId}`}>Comprar cartones</Link>
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/events">Ver otros eventos</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-24 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href={`/events/${eventId}`} passHref>
              <Button variant="ghost" size="sm" className="gap-1">
                <FaArrowLeft size={12} /> Volver
              </Button>
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold">{event.name}</h1>
          </div>
          <p className="text-gray-500">Premio: ${event.prize}</p>
        </div>
        
        <div className="mt-4 md:mt-0">
          {currentNumber && (
            <div className="bg-[#7C3AED] text-white py-2 px-6 rounded-lg text-center">
              <p className="text-xs uppercase font-semibold mb-1">Último número llamado</p>
              <span className="text-4xl font-bold">{currentNumber}</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main column: Bingo card and controls */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card navigation if multiple cards */}
          {eventCards.length > 1 && (
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-lg">Tus cartones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {eventCards.map((card, idx) => (
                    <Button
                      key={card.id}
                      variant={idx === activeCardIndex ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveCardIndex(idx)}
                      className={idx === activeCardIndex ? "bg-[#7C3AED]" : ""}
                    >
                      Cartón {idx + 1}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Active Bingo Card */}
          <div>
            <BingoCard
              cardId={eventCards[activeCardIndex]?.id}
              numbers={activeCardNumbers}
              active={isPlaying}
            />
            
            <div className="mt-4">
              <ClaimBingoButton 
                cardId={eventCards[activeCardIndex]?.id} 
                eventId={eventId}
                disabled={!isPlaying || eventCards[activeCardIndex]?.is_winner}
              />
            </div>
          </div>
          
          {/* Called numbers history */}
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="flex items-center gap-2">
                <FaHistory size={14} /> Historial de números llamados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {calledNumbers.length > 0 ? (
                  calledNumbers.map((number, idx) => (
                    <span key={idx} className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm">
                      {number}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">Aún no se han llamado números</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Side column: Patterns and info */}
        <div className="space-y-6">
          {/* Bingo Patterns */}
          <BingoPatternList eventId={eventId} />
          
          {/* Game Info */}
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-lg">Información del juego</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-2">
                <strong>Estado:</strong> {isPlaying ? "En progreso" : "Finalizado"}
              </p>
              <p className="text-sm text-gray-500 mb-2">
                <strong>Números llamados:</strong> {calledNumbers.length} / 75
              </p>
              <p className="text-sm text-gray-500">
                <strong>Tus cartones:</strong> {eventCards.length}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Winner Modal */}
      <WinModal />
    </div>
  );
}
