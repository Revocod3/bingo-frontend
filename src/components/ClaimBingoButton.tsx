import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bingoCardService } from '@/lib/api/services';
import { getErrorMessage } from '@/lib/utils';
import { useBingoStore } from '@/lib/stores/bingo';
import { BingoPattern } from '@/lib/types';
import BingoPatternSelector from './BingoPatternSelector';

interface ClaimBingoButtonProps {
  cardId: number;
  eventId: string | number;
  disabled?: boolean;
}

export const ClaimBingoButton = ({ cardId, eventId, disabled = false }: ClaimBingoButtonProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPattern, setSelectedPattern] = useState<BingoPattern | null>(null);
  const { updateWinnerStatus } = useBingoStore();
  const queryClient = useQueryClient();

  const claimBingoMutation = useMutation({
    mutationFn: bingoCardService.claimBingo,
    onSuccess: (data) => {
      toast.success('¡Felicidades! Has ganado este Bingo');
      queryClient.invalidateQueries({ queryKey: ['bingoCards'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      
      // Actualizar el estado global con la información del ganador
      updateWinnerStatus(true, {
        userId: data.card.user,
        userName: 'Tú', // Asumimos que es el usuario actual
        cardId: data.card.id,
        isCurrentUser: true
      });
      
      // Cerrar el diálogo
      setIsDialogOpen(false);
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(error);
      toast.error(`Error al reclamar bingo: ${errorMessage}`);
    }
  });

  const handleClaimBingo = () => {
    if (!selectedPattern) {
      toast.error('Por favor selecciona un patrón para reclamar');
      return;
    }

    claimBingoMutation.mutate({ 
      cardId, 
      patternName: selectedPattern.id || selectedPattern.name 
    });
  };

  return (
    <>
      <Button
        onClick={() => setIsDialogOpen(true)}
        className="bg-green-600 hover:bg-green-700 text-white gap-2 w-full"
        disabled={disabled}
      >
        ¡BINGO!
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reclamar Bingo</DialogTitle>
            <DialogDescription>
              Selecciona el patrón que has completado en tu cartón para reclamar tu premio.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <h4 className="text-sm font-medium mb-3">Patrones disponibles:</h4>
            <BingoPatternSelector 
              eventId={eventId}
              onPatternSelect={setSelectedPattern}
              selectedPatternId={selectedPattern?.id}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleClaimBingo} 
              disabled={claimBingoMutation.isPending || !selectedPattern}
              className="bg-green-600 hover:bg-green-700"
            >
              {claimBingoMutation.isPending ? 'Reclamando...' : 'Reclamar Bingo'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ClaimBingoButton;
