import { useState } from 'react';
import { usePurchaseCards } from '@/hooks/api/useTestCoins';
import { useTestCoinBalance } from '@/hooks/api/useTestCoins';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FaCoins, FaPlus, FaMinus } from 'react-icons/fa';

interface PurchaseCardsModalProps {
  eventId: number;
  isOpen: boolean;
  onClose: () => void;
  costPerCard?: number; // Default cost shown in the UI
}

export const PurchaseCardsModal: React.FC<PurchaseCardsModalProps> = ({
  eventId,
  isOpen,
  onClose,
  costPerCard = 10, // Default cost per card
}) => {
  const [quantity, setQuantity] = useState(1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const { data: coinBalance } = useTestCoinBalance();
  const purchaseCardsMutation = usePurchaseCards();
  
  const totalCost = costPerCard * quantity;
  const hasEnoughCoins = coinBalance && coinBalance.balance >= totalCost;
  
  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const handleIncrease = () => {
    if (quantity < 3) { // Maximum 3 cards
      setQuantity(quantity + 1);
    }
  };
  
  const handlePurchase = async () => {
    if (!hasEnoughCoins) {
      setErrorMessage(`Insufficient test coins. You need ${totalCost} coins but have ${coinBalance?.balance || 0}.`);
      return;
    }
    
    setErrorMessage(null);
    setSuccessMessage(null);
    
    try {
      const result = await purchaseCardsMutation.mutateAsync({ eventId, quantity });
      
      if (result.success) {
        setSuccessMessage(`Successfully purchased ${quantity} bingo card${quantity !== 1 ? 's' : ''}!`);
        setTimeout(() => {
          onClose();
          setSuccessMessage(null);
        }, 2000);
      } else {
        setErrorMessage(result.message || "Failed to purchase cards");
      }
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message || 
        error.message || 
        "Failed to purchase cards. Please try again."
      );
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Compra tus cartones</DialogTitle>
          <DialogDescription>
            Selecciona el numero de cartones que quieres comprar para este evento.
          </DialogDescription>
        </DialogHeader>
        
        {errorMessage && (
          <Alert variant="destructive">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        
        {successMessage && (
          <Alert className="bg-green-50 text-green-800 border-green-200">
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}
        
        <div className="my-4">
          <p className="mb-2 text-sm">Balance actual:</p>
          <div className="flex items-center">
            <FaCoins className="text-yellow-500 mr-2" />
            <span className="font-bold">{coinBalance?.balance || 0} moneda de prueba</span>
          </div>
        </div>
        
        <div className="my-6">
          <p className="mb-2 text-sm">Selecciona la cantidad (max 3):</p>
          <div className="flex items-center justify-between">
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleDecrease}
              disabled={quantity <= 1}
            >
              <FaMinus className="h-4 w-4" />
            </Button>
            
            <span className="text-2xl font-bold mx-8">{quantity}</span>
            
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleIncrease}
              disabled={quantity >= 3}
            >
              <FaPlus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between">
            <span>Cost per card:</span>
            <span>{costPerCard} monedas de prueba</span>
          </div>
          <div className="flex justify-between font-bold text-lg mt-2">
            <span>Total:</span>
            <span>{totalCost} monedas de prueba</span>
          </div>
        </div>
        
        <DialogFooter className="mt-4">
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={purchaseCardsMutation.isPending}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handlePurchase} 
            disabled={!hasEnoughCoins || purchaseCardsMutation.isPending}
            className="bg-[#7C3AED] hover:bg-[#6D28D9]"
          >
            {purchaseCardsMutation.isPending ? 'Procesando...' : `Compra de ${quantity} Carton ${quantity !== 1 ? 'es' : ''}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseCardsModal;
