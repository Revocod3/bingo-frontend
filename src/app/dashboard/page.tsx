'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useEvents } from '@/hooks/api/useEvents';
import { useBingoCards } from '@/hooks/api/useBingoCards';
import { useCurrentUser } from '@/hooks/api/useUsers';
import { AuthGuard } from '@/components/auth-guard';

import { Button } from '@/components/ui/button';
import TestCoinBadge from '@/components/TestCoinBadge';
import { FaGamepad, FaCalendarAlt, FaTrophy, FaClock, FaArrowRight, FaPlus, FaUsers } from 'react-icons/fa';
import { Event } from '@/src/lib/api/types';
import { cn } from '@/src/lib/utils';
import { Badge } from '@/src/components/ui/badge';
import { PurchaseCardsModal } from '@/components/PurchaseCardsModal';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const { data: events, isLoading: eventsLoading } = useEvents();
  const { data: cards } = useBingoCards();
  const { data: user } = useCurrentUser();
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
      <div className="container mx-auto pt-6 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent drop-shadow-sm">
              Bienvenido, {user?.first_name || 'Jugador'}!
            </h1>
            <p className="text-gray-400 mt-2 max-w-2xl">
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

        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold">Eventos Activos</h2>
            <div className="h-1 w-24 bg-gradient-to-r from-purple-600 to-transparent rounded-full"></div>
          </div>

          {activeEvents.length === 0 ? (
            <div className="backdrop-blur-md bg-black/30 border border-white/10 rounded-xl p-8 text-center">
              <p className="text-xl font-medium mb-4 text-white">
                No hay eventos activos actualmente
              </p>
              <p className="text-gray-300">Vuelve más tarde para ver nuevos eventos</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeEvents.map((event) => {
                const eventId = String(event.id);
                const eventCards = cardsByEvent[eventId] || [];
                const isLive = event.is_active ? event.is_active && event.is_live : false;

                return (
                  <motion.div
                    key={eventId}
                    className={cn(
                      "rounded-xl overflow-hidden transition-all relative",
                      "backdrop-blur-md border border-white/10",
                      "shadow-[0_0_15px_rgba(123,58,237,0.2)] hover:shadow-[0_0_25px_rgba(123,58,237,0.4)]"
                    )}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * parseInt(eventId) % 5 }}
                  >
                    {/* Image Section */}
                    <div className="relative h-48">
                      <Image
                        src={event.image || '/bingo-event-1.png'}
                        alt={event.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent z-10"></div>
                      {isLive && (
                        <div className="absolute top-3 right-3 z-20">
                          <Badge className="bg-red-500 text-white px-3 py-1 animate-pulse">En Vivo</Badge>
                        </div>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="relative z-10 px-5 pt-5 pb-6 flex flex-col h-fit bg-black/30 backdrop-blur-md rounded-b-xl">
                      <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-md">{event.name}</h3>
                      <div className="flex items-center gap-2 text-white/80 text-sm mb-4">
                        <FaCalendarAlt className="h-3.5 w-3.5" />
                        <span>
                          {event.start
                            ? new Date(event.start).toLocaleDateString()
                            : 'Fecha próximamente'}
                        </span>
                        {event.start && (
                          <>
                            <span className="text-white/60">•</span>
                            <FaClock className="h-3.5 w-3.5" />
                            <span>
                              {new Date(event.start).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="backdrop-blur-sm bg-white/10 rounded-lg p-3 flex flex-col">
                          <span className="text-white/70 text-xs flex items-center gap-1 mb-1">
                            <FaTrophy className="h-3 w-3 text-amber-400" /> Premio
                          </span>
                          <span className="text-white font-bold text-lg">
                            ${event.prize} <span className="text-xs font-normal">USD</span>
                          </span>
                        </div>
                        <div className="backdrop-blur-sm bg-white/10 rounded-lg p-3 flex flex-col">
                          <span className="text-white/70 text-xs flex items-center gap-1 mb-1">
                            <FaGamepad className="h-3 w-3 text-purple-400" /> Tus Cartones
                          </span>
                          <span className="text-white font-bold text-lg">{eventCards.length}</span>
                        </div>
                      </div>

                      <div className="mt-auto flex gap-2 w-full">
                        {eventCards.length > 0 ? (
                          <Link href={`/events/${eventId}/play`} passHref className="flex-1">
                            <Button
                              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 
                                        hover:from-green-700 hover:to-emerald-700 border border-white/10 
                                        shadow-[0_4px_12px_rgba(16,185,129,0.3)]
                                        flex items-center justify-center gap-2"
                            >
                              <FaArrowRight className="h-3 w-3" /> Jugar Ahora
                            </Button>
                          </Link>
                        ) : (
                          <Button
                            className="w-full bg-gradient-to-r from-[#7C3AED] to-indigo-700 
                                      hover:from-[#6D28D9] hover:to-indigo-800
                                      border border-white/10 shadow-[0_4px_12px_rgba(124,58,237,0.3)]
                                      flex items-center justify-center gap-2"
                            onClick={() => handleOpenPurchaseModal(eventId)}
                          >
                            <FaPlus className="h-3 w-3" /> Comprar Cartones
                          </Button>
                        )}

                        {eventCards.length > 0 && (
                          <Button
                            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm
                                      text-white border border-white/10 flex items-center gap-1"
                            onClick={() => handleOpenPurchaseModal(eventId)}
                          >
                            <FaPlus className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

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
