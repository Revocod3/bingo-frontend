import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BingoPattern } from '@/lib/types';
import { usePatternVisualization } from '@/hooks/api/usePatterns';
import BingoPatternDisplay from './BingoPatternDisplay';

interface BingoPatternDetailProps {
  pattern: BingoPattern;
}

export const BingoPatternDetail: React.FC<BingoPatternDetailProps> = ({ pattern }) => {
  const [currentView, setCurrentView] = useState<'visual' | 'ascii'>('visual');
  const { data: asciiPattern, isLoading } = usePatternVisualization(pattern.id);
  
  const getCellIndexes = (row: number, col: number) => {
    return row * 5 + col;
  };
  
  const renderGridView = () => {
    return (
      <div className="space-y-4">
        <div className="max-w-[300px] mx-auto">
          <BingoPatternDisplay pattern={pattern} size="lg" />
        </div>
        
        <div className="text-sm space-y-2">
          <h3 className="font-bold">Posiciones:</h3>
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 25 }).map((_, idx) => (
              <div 
                key={idx}
                className={`p-1.5 text-center text-xs border rounded-sm ${
                  pattern.cells.includes(idx) 
                    ? 'bg-[#7C3AED]/20 border-[#7C3AED]' 
                    : 'border-gray-200'
                }`}
              >
                {idx}
              </div>
            ))}
          </div>
        </div>
        
        <div className="text-sm space-y-2">
          <h3 className="font-bold">Coordenadas:</h3>
          <div className="grid grid-cols-2 gap-2">
            {pattern.cells.map(idx => {
              const row = Math.floor(idx / 5) + 1;
              const col = (idx % 5) + 1;
              return (
                <div key={idx} className="p-1.5 text-center border border-gray-200 rounded-sm">
                  Fila {row}, Col {col}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };
  
  const renderAsciiView = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#7C3AED]"></div>
        </div>
      );
    }
    
    if (!asciiPattern) {
      return (
        <div className="p-4 text-center text-gray-500">
          No hay representación ASCII disponible para este patrón.
        </div>
      );
    }
    
    return (
      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md overflow-auto">
        <pre className="font-mono text-xs sm:text-sm whitespace-pre">
          {asciiPattern}
        </pre>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{pattern.name}</CardTitle>
        <CardDescription>{pattern.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="visual" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="visual">Visual</TabsTrigger>
            <TabsTrigger value="ascii">ASCII</TabsTrigger>
          </TabsList>
          <TabsContent value="visual">
            {renderGridView()}
          </TabsContent>
          <TabsContent value="ascii">
            {renderAsciiView()}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default BingoPatternDetail;
