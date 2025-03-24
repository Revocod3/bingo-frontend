import React, { useState } from 'react';
import { BingoPattern } from '@/lib/types';
import { useEventPatterns, convertPatternsToLocal } from '@/hooks/api/usePatterns';
import BingoPatternDisplay from './BingoPatternDisplay';
import { Card, CardContent } from './ui/card';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import BingoPatternDetail from './BingoPatternDetail';
import { Info } from 'lucide-react';
import { Button } from './ui/button';

interface BingoPatternSelectorProps {
  eventId: string | number;
  onPatternSelect: (pattern: BingoPattern) => void;
  selectedPatternId?: string;
}

export const BingoPatternSelector: React.FC<BingoPatternSelectorProps> = ({
  eventId,
  onPatternSelect,
  selectedPatternId
}) => {
  const { data: apiPatterns, isLoading, error } = useEventPatterns(eventId);
  const patterns = convertPatternsToLocal(apiPatterns);
  const [selectedDetailPattern, setSelectedDetailPattern] = useState<BingoPattern | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  
  const handlePatternChange = (patternId: string) => {
    const selectedPattern = patterns.find(pattern => pattern.id === patternId);
    if (selectedPattern) {
      onPatternSelect(selectedPattern);
    }
  };
  
  const openPatternDetail = (pattern: BingoPattern) => {
    setSelectedDetailPattern(pattern);
    setDetailDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#7C3AED]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-2 text-sm">
        Error al cargar los patrones
      </div>
    );
  }

  if (!patterns || patterns.length === 0) {
    return (
      <div className="text-gray-500 text-center py-2 text-sm">
        No hay patrones disponibles para este evento
      </div>
    );
  }

  return (
    <>
      <Card className="border">
        <CardContent className="pt-4">
          <RadioGroup
            value={selectedPatternId}
            onValueChange={handlePatternChange}
            className="grid grid-cols-2 sm:grid-cols-3 gap-3"
          >
            {patterns.map((pattern) => (
              <div key={pattern.id} className="flex flex-col items-center relative">
                <RadioGroupItem
                  value={pattern.id || ''}
                  id={`pattern-${pattern.id}`}
                  className="sr-only"
                />
                <Label
                  htmlFor={`pattern-${pattern.id}`}
                  className={`
                    cursor-pointer p-2 rounded-md w-full flex flex-col items-center
                    ${selectedPatternId === pattern.id 
                      ? 'bg-purple-100 dark:bg-purple-900/30 border-2 border-[#7C3AED]' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }
                  `}
                >
                  <BingoPatternDisplay pattern={pattern} />
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      openPatternDetail(pattern);
                    }}
                    className="absolute top-0 right-0 h-6 w-6 p-0"
                  >
                    <Info className="h-3 w-3" />
                    <span className="sr-only">Ver detalles</span>
                  </Button>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>
      
      {/* Pattern Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalles del patrón</DialogTitle>
          </DialogHeader>
          {selectedDetailPattern && <BingoPatternDetail pattern={selectedDetailPattern} />}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BingoPatternSelector;
