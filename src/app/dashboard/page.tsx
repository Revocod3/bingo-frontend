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
import { FaGamepad, FaCalendarAlt, FaTrophy, FaCogs } from 'react-icons/fa';
import { Event } from '@/src/lib/api/types';
import { getCardNumbers } from '@/src/lib/utils';

export default function DashboardPage() {
  const { data: events, isLoading: eventsLoading } = useEvents();
  const { data: cards } = useBingoCards();
  const { data: user } = useCurrentUser();
  const [activeTab, setActiveTab] = useState('events');

  // Filter for active events (those that haven't ended)
  const activeEvents = events?.filter((event: Event) =>
    !event.end_date || new Date(event.end_date) > new Date()
  ) || [];

  // Get user's cards grouped by event
  const cardsByEvent = cards?.reduce((acc, card) => {
    const eventId = String(card.event);
    if (!acc[eventId]) {
      acc[eventId] = [];
    }
    acc[eventId].push(card);
    return acc;
  }, {} as Record<string, typeof cards>) || {};

  if (eventsLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#7C3AED]"></div>
      </div>
    );
  }

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

      <Tabs defaultValue="events" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="mb-2">
          <TabsTrigger value="events" className="flex items-center gap-1 sm:gap-2 flex-1 cursor-pointer bg">
            <span className="sm:inline"><FaGamepad /></span>
            <span className="text-xs sm:text-sm">Eventos</span>
          </TabsTrigger>
          <TabsTrigger value="cards" className="flex items-center gap-1 sm:gap-2 flex-1 cursor-pointer">
            <span className="sm:inline"><FaCalendarAlt /></span>
            <span className="text-xs sm:text-sm">Cartones</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-4">
          <h2 className="text-2xl font-bold mb-4">Eventos Activos</h2>

          {activeEvents.length === 0 ? (
            <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg text-center">
              <p className="text-xl font-medium mb-4 text-gray-700">No hay eventos activos actualmente</p>
              <p className="text-gray-500">Vuelve más tarde para ver nuevos eventos</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeEvents.map(event => {
                const eventId = String(event.id);
                const eventCards = cardsByEvent[eventId] || [];
                return (
                  <Card key={eventId} className="border shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle>{event.name}</CardTitle>
                      <CardDescription>
                        {event.start ? new Date(event.start).toLocaleDateString() : 'Fecha desconocida'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span>Premio:</span>
                        <span className="font-bold">${event.prize}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Tus cartones:</span>
                        <span className="font-bold">{eventCards.length}</span>
                      </div>
                      <div className="flex flex-col gap-2">
                        {eventCards.length > 0 ? (
                          <Link href={`/events/${eventId}/play`} passHref>
                            <Button className="w-full bg-green-600 hover:bg-green-700">
                              Jugar Ahora
                            </Button>
                          </Link>
                        ) : null}
                        <Link href={`/events/${eventId}`} passHref>
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
                const eventId = String(card.event);
                const eventName = events?.find(e => String(e.id) === eventId)?.name || 'Evento';
                return (
                  <div key={card.id}>
                    <div className="mb-2 text-center">
                      <span className="text-sm text-muted-foreground">
                        Carton #{card.id.toString().substring(0, 8)} - {eventName}
                      </span>
                    </div>
                    <BingoCard
                      cardId={String(card.id)}
                      numbers={getCardNumbers(card)}
                      active={false}
                      autoMarkEnabled
                    />
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>

      </Tabs>
    </div>
  );
}
