'use client';

import { useEvents } from '@/hooks/api/useEvents';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import TestCoinBadge from '@/components/TestCoinBadge';

export default function EventsPage() {
  const { data: events, isLoading } = useEvents();
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#7C3AED]"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Eventos</h1>
        <TestCoinBadge />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events && events.map((event) => (
          <Card key={event.id} className="border shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{event.name}</CardTitle>
              <CardDescription>
                Starts {formatDistanceToNow(new Date(event.start), { addSuffix: true })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Premio: ${event.prize.toFixed(2)}</p>
              <Link href={`/events/${event.id}`} passHref>
                <Button className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white">
                  Unirse al evento
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
        
        {(!events || events.length === 0) && (
          <div className="col-span-3 bg-gray-100 dark:bg-gray-800 p-8 rounded-lg text-center">
            <p className="text-xl font-medium text-gray-600 mb-4">No hay eventos disponibles</p>
            <p className="text-gray-500">Vuelve más tarde para ver los próximos eventos</p>
            <Button className="mt-4 bg-[#7C3AED] hover:bg-[#6D28D9] text-white" asChild>
                <Link href="dashboard">Volver al dashboard</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
