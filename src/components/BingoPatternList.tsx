import React, { useState } from 'react';
import { useEventPatterns, convertPatternsToLocal } from '@/hooks/api/usePatterns';
import { BingoPattern } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

import { FaInfoCircle } from 'react-icons/fa';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import BingoPatternDisplay from './BingoPatternDisplay';

interface BingoPatternListProps {
  eventId: string | number;
}

const BingoPatternList: React.FC<BingoPatternListProps> = ({ eventId }) => {
  const { data: apiPatterns, isLoading } = useEventPatterns(eventId);
  const patterns = convertPatternsToLocal(apiPatterns);
  const [selectedPattern, setSelectedPattern] = useState<BingoPattern | null>(null);
  
  if (isLoading) {
    return (
      <Card className="border">
        <CardHeader className="py-3">
          <CardTitle className="text-lg">Patrones disponibles</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#7C3AED]"></div>
        </CardContent>
      </Card>
    );
  }

  if (!patterns || patterns.length === 0) {
    return (
      <Card className="border">
        <CardHeader className="py-3">
          <CardTitle className="text-lg">Patrones disponibles</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 text-center py-4">
            No hay patrones disponibles para este evento.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border">
      <CardHeader className="py-3 flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Patrones disponibles</CardTitle>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <FaInfoCircle className="h-4 w-4" />
              <span className="sr-only">Info sobre patrones</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Patrones de Bingo</DialogTitle>
              <DialogDescription>
                Para ganar, debes completar uno de estos patrones en tu cartón.
                Los patrones se completan cuando todos los números del patrón han sido llamados.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 gap-4 py-4">
              <BingoPatternDisplay showAllPatterns patterns={patterns} />
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="grid" className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="grid">Cuadrícula</TabsTrigger>
            <TabsTrigger value="list">Lista</TabsTrigger>
          </TabsList>
          <TabsContent value="grid" className="mt-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {patterns.map((pattern) => (
                <div key={pattern.id || pattern.name} className="text-center">
                  <BingoPatternDisplay pattern={pattern} />
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="list" className="mt-4">
            <ul className="divide-y">
              {patterns.map((pattern) => (
                <li key={pattern.id || pattern.name} className="py-2 flex items-center justify-between">
                  <span className="font-medium">{pattern.name}</span>
                  <Button variant="link" className="p-0 h-auto text-xs" onClick={() => setSelectedPattern(pattern)}>
                    Ver patrón
                  </Button>
                </li>
              ))}
            </ul>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default BingoPatternList;
