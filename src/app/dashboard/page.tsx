'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useEvents } from '@/hooks/api/useEvents';
import { useBingoCards } from '@/hooks/api/useBingoCards';
import { useCurrentUser } from '@/hooks/api/useUsers';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TestCoinBadge from '@/components/TestCoinBadge';
import BingoCard from '@/components/BingoCard';
import { FaGamepad, FaCalendarAlt, FaTrophy } from 'react-icons/fa';
import { Event } from '@/src/lib/api/types';
export default function DashboardPage() {
  const { data: events, isLoading: eventsLoading } = useEvents();
  const { data: cards } = useBingoCards();
  const { data: user } = useCurrentUser();
  const [activeTab, setActiveTab] = useState('active');

  // Filter for active events (those that haven't ended)
  const activeEvents = events?.filter((event: Event) => 
    new Date(event.start) < new Date()
  ) || [];

  // Get user's cards grouped by event
  const cardsByEvent = cards?.reduce((acc, card) => {
    if (!acc[card.event]) {
      acc[card.event] = [];
    }
    acc[card.event].push(card);
    return acc;
  }, {} as Record<number, typeof cards>) || {};

  if (eventsLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#7C3AED]"></div>
      </div>
    );
  }

  // Get card numbers from the BingoCardType (simplified version of the function in CardCarousel)
  const getCardNumbers = (card: any): number[] => {
    if (!card.numbers) return Array(25).fill(0);
    
    if (Array.isArray(card.numbers)) {
      return card.numbers;
    }
    
    return Object.values(card.numbers)
      .flatMap(n => typeof n === 'object' && n !== null ? Object.values(n) : [n])
      .map(Number);
  };

  return (
    <div className="container mx-auto pt-24 pb-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Bingo Dashboard</h1>
          <p className="text-gray-500 mt-2">
            Gestiona tus juegos y cartones
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-4">
          {user && <TestCoinBadge />}
        </div>
      </div>

      <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="active" className="flex items-center gap-2">
            <FaGamepad /> Juegos Activos
          </TabsTrigger>
          <TabsTrigger value="cards" className="flex items-center gap-2">
            <FaCalendarAlt /> Mis Cartones
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <FaTrophy /> Historial
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="space-y-4">
          <h2 className="text-2xl font-bold mb-4">Juegos Activos</h2>
          
          {activeEvents.length === 0 ? (
            <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg text-center">
              <p className="text-xl font-medium mb-4 text-gray-700">No hay juegos activos actualmente</p>
              <p className="text-gray-500">Vuelve más tarde para ver nuevos eventos</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeEvents.map(event => {
                const eventCards = cardsByEvent[event.id] || [];
                return (
                  <Card key={event.id} className="border shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle>{event.name}</CardTitle>
                      <CardDescription>
                        {new Date(event.start).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span>Premio:</span>
                        <span className="font-bold">${event.prize.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Tus cartones:</span>
                        <span className="font-bold">{eventCards.length}</span>
                      </div>
                      <div className="flex flex-col gap-2">
                        {eventCards.length > 0 ? (
                          <Link href={`/events/${event.id}/play`} passHref>
                            <Button className="w-full bg-green-600 hover:bg-green-700">
                              Jugar Ahora
                            </Button>
                          </Link>
                        ) : null}
                        <Link href={`/events/${event.id}`} passHref>
                          <Button variant="outline" className="w-full">
                            Ver Detalles
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="cards" className="space-y-4">
          <h2 className="text-2xl font-bold mb-4">Mis Cartones</h2>
          
          {!cards || cards.length === 0 ? (
            <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg text-center">
              <p className="text-xl font-medium mb-4 text-gray-700">No tienes cartones</p>
              <p className="text-gray-500">Compra cartones para participar en los eventos</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {cards.map(card => {
                const eventName = events?.find(e => e.id === card.event)?.name || 'Evento';
                return (
                  <div key={card.id}>
                    <div className="mb-2 text-center">
                      <span className="text-sm text-muted-foreground">
                        Carton #{card.id.toString().substring(0, 8)} - {eventName}
                      </span>
                    </div>
                    <BingoCard 
                      cardId={card.id}
                      numbers={getCardNumbers(card)}
                      active={false}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4">
          <h2 className="text-2xl font-bold mb-4">Historial de Juegos</h2>
          
          <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg text-center">
            <p className="text-xl font-medium mb-4 text-gray-700">Historial no disponible</p>
            <p className="text-gray-500">Tu historial de juegos aparecerá aquí</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
