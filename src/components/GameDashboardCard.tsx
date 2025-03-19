'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FaCalendarAlt, FaDollarSign, FaUsers, FaGamepad } from 'react-icons/fa';

interface GameDashboardCardProps {
  id: number;
  name: string;
  date: string;
  prize: number;
  cardCount: number;
  totalPlayers?: number;
  isActive: boolean;
}

const GameDashboardCard = ({
  id,
  name,
  date,
  prize,
  cardCount,
  totalPlayers,
  isActive
}: GameDashboardCardProps) => {
  return (
    <Card className="border shadow-md hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle>{name}</CardTitle>
          {isActive && <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">Activo</div>}
        </div>
        <CardDescription className="flex items-center gap-2">
          <FaCalendarAlt className="text-muted-foreground" size={14} />
          {date}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <FaDollarSign className="text-[#7C3AED]" />
              <span>Premio:</span>
            </div>
            <span className="font-bold text-right">${prize.toFixed(2)}</span>
            
            <div className="flex items-center gap-2">
              <FaUsers className="text-[#7C3AED]" />
              <span>Cartones:</span>
            </div>
            <span className="font-bold text-right">{cardCount}</span>
            
            {totalPlayers !== undefined && (
              <>
                <div className="flex items-center gap-2">
                  <FaUsers className="text-[#7C3AED]" />
                  <span>Jugadores:</span>
                </div>
                <span className="font-bold text-right">{totalPlayers}</span>
              </>
            )}
          </div>
          
          <div className="flex flex-col gap-2">
            {cardCount > 0 && isActive && (
              <Link href={`/events/${id}/play`} passHref>
                <Button className="w-full bg-green-600 hover:bg-green-700 flex items-center gap-2">
                  <FaGamepad /> Jugar Ahora
                </Button>
              </Link>
            )}
            <Link href={`/events/${id}`} passHref>
              <Button variant="outline" className="w-full">
                Ver Detalles
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameDashboardCard;
