import { useState } from 'react';
import { usePurchaseCards, useTestCoinBalance } from '@/hooks/api/useTestCoins';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogFooter,
  DialogTitle,
  DialogDescription
} from '@/components/ui/responsive-dialog';
import { FaCoins, FaPlus, FaMinus } from 'react-icons/fa';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

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
      setErrorMessage(`💸 ¡Ups! Recarga para poder adquirir ${quantity} cartón${quantity !== 1 ? 'es' : ''}.`);
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
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        // Only allow closing if not in the middle of a purchase
        if (!purchaseCardsMutation.isPending) {
          onClose();
        }
      }}
    >
      <ResponsiveDialogContent
        className={cn(
          "relative rounded-2xl overflow-hidden backdrop-blur-md",
          "bg-black/30 border border-white/10",
          "shadow-[0_0_15px_rgba(123,58,237,0.2)]",
          "max-w-md mx-auto",
          "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        )}
      >
        {/* Background glow effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-indigo-900/20 z-0"></div>

        <ResponsiveDialogHeader className="relative z-10">
          <DialogTitle className="text-xl font-bold text-white">Compra tus cartones</DialogTitle>
          <DialogDescription className="text-sm text-gray-300">
            Selecciona el número de cartones que quieres comprar para este evento.
          </DialogDescription>
        </ResponsiveDialogHeader>

        <div className="relative z-10 space-y-4">
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/20 text-red-300 p-3 rounded-lg text-sm"
            >
              {errorMessage}
            </motion.div>
          )}

          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-500/20 text-green-300 p-3 rounded-lg text-sm"
            >
              {successMessage}
            </motion.div>
          )}

          <div className="flex flex-col items-center space-y-2">
            <p className="text-sm text-gray-300">Balance actual:</p>
            <div
              className="flex items-center bg-gradient-to-r from-slate-900/80 to-purple-900/80 text-white rounded-lg shadow-md border border-white/10 backdrop-blur-sm px-4 py-2"
            >
              <FaCoins className="text-amber-400 mr-2" />
              <div className="font-medium tracking-tight">
                <span className="text-xs text-slate-300 mr-1">USD</span>
                <span className="text-white">${(coinBalance?.balance || 0).toFixed(2)}</span>
              </div>
            </div>

            {!hasEnoughCoins && (
              <div className="flex flex-col items-center mt-2 space-y-2">
                <p className="text-red-400 text-sm">
                  💸 ¡Ups! Recarga para poder adquirir {quantity} cartón{quantity !== 1 ? 'es' : ''}.
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-300">Selecciona la cantidad:</p>
            <div className="flex items-center justify-between">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleDecrease}
                  disabled={quantity <= 1}
                  className={cn(
                    "cursor-pointer border border-white/20 bg-purple-900/20",
                    "hover:bg-purple-800/30 hover:border-white/30",
                    "text-white w-10 h-10"
                  )}
                >
                  <FaMinus className="h-4 w-4" />
                </Button>
              </motion.div>

              <span className="text-3xl font-bold text-white mx-4">{quantity}</span>

              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleIncrease}
                  disabled={quantity >= 100}
                  className={cn(
                    "cursor-pointer border border-white/20 bg-purple-900/20",
                    "hover:bg-purple-800/30 hover:border-white/30",
                    "text-white w-10 h-10"
                  )}
                >
                  <FaPlus className="h-4 w-4" />
                </Button>
              </motion.div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-4 mt-6">
            <div className="flex justify-between text-gray-300 text-sm">
              <span>Costo del cartón:</span>
              <span>{costPerCard.toFixed(2)} USD</span>
            </div>
            <div className="flex justify-between font-bold text-xl text-white mt-2">
              <span>Total ({quantity}):</span>
              <span className="text-purple-300">{totalCost.toFixed(2)} USD</span>
            </div>
          </div>
        </div>

        <ResponsiveDialogFooter className="mt-6 flex justify-between relative z-10">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="outline"
              onClick={onClose}
              disabled={purchaseCardsMutation.isPending}
              className={cn(
                "border border-white/20 text-gray-300",
                "bg-black/30 backdrop-blur-sm",
                "hover:bg-gray-800/50 hover:text-white hover:border-white/30",
                "rounded-full px-6 py-2 transition-all"
              )}
            >
              Cancelar
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={handlePurchase}
              disabled={!hasEnoughCoins || purchaseCardsMutation.isPending}
              className={cn(
                "bg-gradient-to-r from-purple-600 to-indigo-600",
                "hover:from-purple-700 hover:to-indigo-700 text-white",
                "shadow-md hover:shadow-lg",
                "border-none rounded-full px-6 py-2 transition-all duration-200"
              )}
            >
              {purchaseCardsMutation.isPending ? 'Procesando...' : 'Comprar'}
            </Button>
          </motion.div>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </Dialog>
  );
};

export default PurchaseCardsModal;
