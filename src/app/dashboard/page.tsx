'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useEvents } from '@/hooks/api/useEvents';
import { useBingoCards } from '@/hooks/api/useBingoCards';
import { useCurrentUser } from '@/hooks/api/useUsers';
import { AuthGuard } from '@/components/auth-guard';

import { Card, CardContent, CardHeader, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TestCoinBadge from '@/components/TestCoinBadge';
import BingoCard from '@/components/BingoCard';
import { FaGamepad, FaCalendarAlt, FaTrophy, FaClock, FaArrowRight, FaPlus } from 'react-icons/fa';
import { Event } from '@/src/lib/api/types';
import { cn, getCardNumbers } from '@/src/lib/utils';
import { Badge } from '@/src/components/ui/badge';
import { PurchaseCardsModal } from '@/components/PurchaseCardsModal';

export default function DashboardPage() {
  const { data: events, isLoading: eventsLoading } = useEvents();
  const { data: cards } = useBingoCards();
  const { data: user } = useCurrentUser();
  const [activeTab, setActiveTab] = useState('events');
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string>('');

  // Filter for active events (those that haven't ended)
  const activeEvents =
    events?.filter((event: Event) => !event.end_date || new Date(event.end_date) > new Date()) ||
    [];

  // Get user's cards grouped by event
  const cardsByEvent =
    cards?.reduce((acc, card) => {
      const eventId = String(card.event);
      if (!acc[eventId]) {
        acc[eventId] = [];
      }
      acc[eventId].push(card);
      return acc;
    }, {} as Record<string, typeof cards>) || {};

  // Función para abrir el modal de compra
  const handleOpenPurchaseModal = (eventId: string) => {
    setSelectedEventId(eventId);
    setIsPurchaseModalOpen(true);
  };

  const renderDashboardContent = () => {
    if (eventsLoading) {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#7C3AED]"></div>
        </div>
      );
    }

    return (
      <div className="container mx-auto pt-8 pb-8 px-4 md:pt-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold"> Bienvenido, {user?.first_name || 'Jugador'}!</h1>
            <p className="text-gray-400 mt-2">
              Participa en nuestros eventos de bingo y gana premios increíbles. Compra cartones y
              juega en tiempo real.
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-4">
            {user && (
              <div className="flex items-center gap-2">
                <TestCoinBadge />
              </div>
            )}
          </div>
        </div>

        <Tabs
          defaultValue="events"
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="mb-2">
            <TabsTrigger
              value="events"
              className="flex items-center gap-1 sm:gap-2 flex-1 cursor-pointer"
            >
              <span className="sm:inline">
                <FaCalendarAlt />
              </span>
              <span className="text-xs sm:text-sm">Eventos</span>
            </TabsTrigger>
            <TabsTrigger
              value="cards"
              className="flex items-center gap-1 sm:gap-2 flex-1 cursor-pointer"
            >
              <span className="sm:inline">
                <FaGamepad />
              </span>
              <span className="text-xs sm:text-sm">Cartones</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">Eventos Activos</h2>

            {activeEvents.length === 0 ? (
              <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg text-center">
                <p className="text-xl font-medium mb-4 text-gray-700">
                  No hay eventos activos actualmente
                </p>
                <p className="text-gray-500">Vuelve más tarde para ver nuevos eventos</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeEvents.map((event) => {
                  const eventId = String(event.id);
                  const eventCards = cardsByEvent[eventId] || [];
                  const isLive = event.is_active ? event.is_active && event.is_live : false;

                  return (
                    <Card
                      key={eventId}
                      className="overflow-hidden shadow-md hover:shadow-lg gap-4 transition-shadow pt-0 border-0 rounder-lg"
                    >
                      <div className="relative h-16 bg-gradient-to-r from-purple-700 to-indigo-700 rounded-t-lg opacity-80">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <h3 className="text-2xl font-bold text-white">{event.name}</h3>
                        </div>
                      </div>
                      <CardHeader>
                        <CardDescription>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <FaCalendarAlt className="h-4 w-4 text-muted-foreground" />
                              <span>
                                {event.start
                                  ? new Date(event.start).toLocaleDateString()
                                  : 'Fecha desconocida'}
                              </span>
                              {event.start && (
                                <div className="flex items-center gap-2 text-xs">
                                  <FaClock className="h-4 w-4 text-muted-foreground" />
                                  <span>
                                    {new Date(event.start).toLocaleTimeString([], {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center justify-between">
                              <Badge
                                className={cn('bg-slate-400 text-slate-200', {
                                  'bg-green-400 text-green-200 animate-pulse': isLive,
                                })}
                              >
                                En Vivo
                              </Badge>
                            </div>
                          </div>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="rounded-lg bg-amber-50 py-1 px-4 dark:bg-amber-950/50 flex flex-row justify-between items-center">
                          <div className="flex items-center gap-2">
                            <FaTrophy className="h-4 w-4 text-amber-500" />
                            <h4 className="text-amber-600 text-sm font-semibold dark:text-amber-400">
                              Premio
                            </h4>
                          </div>
                          <p className="text-sm font-bold text-amber-700">${event.prize} USD</p>
                        </div>

                        <div className="rounded-lg bg-purple-50 py-1 px-4 dark:bg-purple-950/50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <FaGamepad className="h-4 w-4 text-purple-500" />
                              <span className="text-sm font-semibold text-purple-700 dark:text-purple-400">
                                Tus cartones
                              </span>
                            </div>
                            <span className="font-bold text-purple-800">{eventCards.length}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex flex-col gap-2">
                        <div className="flex gap-2 w-full">
                          {eventCards.length > 0 ? (
                            <Link href={`/events/${eventId}/play`} passHref className="flex-1">
                              <Button className="w-full bg-green-600 hover:bg-green-700 gap-1 cursor-pointer">
                                <FaArrowRight className="h-3 w-3 ml-1" /> Jugar Ahora
                              </Button>
                            </Link>
                          ) : null}
                          <Button
                            className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white flex items-center gap-1 cursor-pointer"
                            onClick={() => handleOpenPurchaseModal(eventId)}
                          >
                            <FaPlus className="h-3 w-3" /> Cartones
                          </Button>
                        </div>
                      </CardFooter>
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
                {cards.map((card) => {
                  const eventId = String(card.event);
                  const eventName = events?.find((e) => String(e.id) === eventId)?.name || 'Evento';
                  return (
                    <div key={card.id}>
                      <div className="mb-2 text-center">
                        <span className="text-sm text-muted-foreground">
                          Carton #{card.correlative_id || card.id.toString().substring(0, 8)} -{' '}
                          {eventName}
                        </span>
                      </div>
                      <BingoCard
                        cardId={card.correlative_id ? String(card.correlative_id) : String(card.id)}
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

        <PurchaseCardsModal
          eventId={selectedEventId}
          isOpen={isPurchaseModalOpen}
          onClose={() => setIsPurchaseModalOpen(false)}
        />
      </div>
    );
  };

  return <AuthGuard>{renderDashboardContent()}</AuthGuard>;
}
