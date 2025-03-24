'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useEvent } from '@/hooks/api/useEvents';
import { useBingoCards } from '@/hooks/api/useBingoCards';
import { useCurrentUser } from '@/hooks/api/useUsers';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import TestCoinBadge from '@/components/TestCoinBadge';
import PurchaseCardsModal from '@/components/PurchaseCardsModal';
import { FaArrowLeft } from 'react-icons/fa';

export default function EventDetailPage() {
  const params = useParams<{ eventId: string }>();
  const eventId = params?.eventId || '';

  const { data: event, isLoading: eventLoading } = useEvent(eventId);
  const { data: user } = useCurrentUser();
  const { data: cards } = useBingoCards();

  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const eventCards = cards?.filter(card =>
    card.event === eventId
  ) || [];

  if (eventLoading) {
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

  return (
    <div className="container mx-auto py-24 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{event.name}</h1>
          <p className="text-gray-500 mt-2">
            {event.start ? new Date(event.start).toLocaleString() : ''}
          </p>
        </div>

        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-4">
          <Link href="/dashboard" passHref>
            <Button variant="outline" className="gap-2 text-gray-600 cursor-pointer">
              <FaArrowLeft size={14} /> Dashboard
            </Button>
          </Link>

          {user && <TestCoinBadge />}

          {eventCards.length > 0 && (
            <Link href={`/events/${eventId}/play`} passHref>
              <Button className="bg-green-600 hover:bg-green-700 text-white cursor-pointer">
                Jugar Ahora
              </Button>
            </Link>
          )}

          <Button
            onClick={() => setIsPurchaseModalOpen(true)}
            className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white cursor-pointer"
          >
            Comprar Cartones
          </Button>
        </div>
      </div>

      <div className="my-8">
        <h2 className="text-2xl font-bold mb-4">Tus cartones</h2>

        {eventCards.length === 0 ? (
          <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg text-center">
            <p className="text-xl font-medium mb-4 text-gray-700">No tienes cartones para este evento</p>
            <p className="text-gray-500">Compra tus primeros cartones para participar</p>
            <Button
              onClick={() => setIsPurchaseModalOpen(true)}
              className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white"
            >
              Comprar cartones
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventCards.map((card) => (
              <Card key={card.id} className="border shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>Carton #{card.id.toString().substring(0, 8)}</CardTitle>
                  <CardDescription>
                    {card.is_winner ? 'Ganador' : 'En juego'}
                  </CardDescription>
                </CardHeader>
                <CardContent className='cursor-pointer'>
                  <Button className="w-full">Ver cartón</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Purchase Modal */}
      <PurchaseCardsModal
        eventId={eventId}
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
      />
    </div>
  );
}
