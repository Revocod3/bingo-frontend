import { useState } from 'react';
import { usePurchaseCards } from '@/hooks/api/useTestCoins';
import { useTestCoinBalance } from '@/hooks/api/useTestCoins';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogFooter,
  DialogTitle,
  DialogDescription
} from '@/components/ui/responsive-dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FaCoins, FaPlus, FaMinus } from 'react-icons/fa';
import Link from 'next/link';

interface PurchaseCardsModalProps {
  eventId: string;
  isOpen: boolean;
  onClose: () => void;
  costPerCard?: number;
}

export const PurchaseCardsModal: React.FC<PurchaseCardsModalProps> = ({
  eventId,
  isOpen,
  onClose,
  costPerCard = 0.2,
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
    setQuantity(quantity + 1);
  };

  const handlePurchase = async () => {
    if (!hasEnoughCoins) {
      setErrorMessage(`No tienes suficientes monedas para comprar ${quantity} cartón${quantity !== 1 ? 'es' : ''}.`);
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const result = await purchaseCardsMutation.mutateAsync({ eventId, quantity });

      if (result.success) {
        setSuccessMessage(`Has comprado ${quantity} cartón${quantity !== 1 ? 'es' : ''} con éxito.`);
        // Don't automatically close and don't set a timer
        // This prevents the possible race condition causing duplicate purchases
      } else {
        setErrorMessage(result.message || "Error desconocido");
      }
    } catch (error: unknown) {
      let errorMessage = "Error en la compra";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (error && typeof error === 'object') {
        // Type the error object more specifically
        const possibleApiError = error as { response?: { data?: { message?: string } } };
        if (possibleApiError.response?.data?.message) {
          errorMessage = possibleApiError.response.data.message;
        }
      }

      setErrorMessage(errorMessage);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {
      // Only allow closing if not in the middle of a purchase
      if (!purchaseCardsMutation.isPending) {
        onClose();
      }
    }}>
      <ResponsiveDialogContent className="text-gray-800">
        <ResponsiveDialogHeader>
          <DialogTitle className="xs:text-lg">Compra tus cartones</DialogTitle>
          <DialogDescription className="xs:text-xs">
            Selecciona el numero de cartones que quieres comprar para este evento.
          </DialogDescription>
        </ResponsiveDialogHeader>

        {errorMessage && (
          <Alert variant="destructive">
            <AlertDescription className="xs:text-xs">{errorMessage}</AlertDescription>
          </Alert>
        )}

        {successMessage && (
          <Alert className="bg-green-50 text-green-800 border-green-200">
            <AlertDescription className="xs:text-xs">{successMessage}</AlertDescription>
          </Alert>
        )}

        <div className="my-1 flex flex-col items-center">
          <p className="mb-1 text-sm xs:text-xs">Balance actual:</p>
          <div className="flex items-center bg-[#7C3AED]/20 rounded-full px-4 py-2">
            <FaCoins className="text-yellow-500 mr-2 xs:text-xs" />
            <span className="font-bold xs:text-sm">{coinBalance?.balance || 0} USD</span>
          </div>
          {!hasEnoughCoins && (
            <div className="flex flex-col items-center mt-2">
              <p className="text-red-500 text-sm my-2">
                No tienes suficientes monedas para comprar {quantity} cartón{quantity !== 1 ? 'es' : ''}.
              </p>
              <Link
                href="/deposits"
                className="py-2 px-4 bg-[#7C3AED] flex  items-center text-white rounded-full mt-2 hover:bg-[#6D28D9] transition duration-200"
              >
                Recargar
                <FaCoins className="ml-2" />
              </Link>
            </div>
          )}

        </div>

        <div className="my-2">
          <p className="mb-2 text-sm">Selecciona la cantidad:</p>
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="icon"
              onClick={handleDecrease}
              disabled={quantity <= 1}
              className="cursor-pointer"
            >
              <FaMinus className="h-4 w-4" />
            </Button>

            <span className="text-2xl font-bold mx-8">{quantity}</span>

            <Button
              variant="outline"
              size="icon"
              onClick={handleIncrease}
              disabled={quantity >= 100} // Assuming a max limit of 100
              className="cursor-pointer"
            >
              <FaPlus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between">
            <span>Costo del carton:</span>
            <span>{costPerCard.toFixed(2)} USD</span>
          </div>
          <div className="flex justify-between font-bold text-lg mt-2">
            <span>Total ({quantity}) :</span>
            <span>{totalCost.toFixed(2)} USD</span>
          </div>
        </div>

        <ResponsiveDialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={purchaseCardsMutation.isPending}
            className="border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer xs:text-xs xs:py-1"
          >
            Cancelar
          </Button>
          <Button
            onClick={handlePurchase}
            disabled={!hasEnoughCoins || purchaseCardsMutation.isPending}
            className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white cursor-pointer xs:text-xs xs:py-1"
          >
            {purchaseCardsMutation.isPending ? 'Procesando...' : 'Comprar'}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </Dialog>
  );
};

export default PurchaseCardsModal;
