import React, { useState } from 'react';
import { useTestCoinBalance } from '@/hooks/api/useTestCoins';
import { FaCoins, FaPlus, FaPlusCircle } from 'react-icons/fa';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import RechargeModal from '@/components/RechargeModal';

export const TestCoinBadge: React.FC = () => {
  const { data: balance, isLoading, error } = useTestCoinBalance();
  const [isRechargeModalOpen, setIsRechargeModalOpen] = useState(false);

  if (isLoading) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center px-3 py-1.5 bg-slate-800/90 text-white rounded-lg animate-pulse backdrop-blur-sm">
            <div className="h-4 w-20 bg-slate-600 rounded animate-pulse"></div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Cargando balance de monedas USD</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  if (error || !balance) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center px-3 py-1.5 bg-red-700/90 text-white rounded-lg backdrop-blur-sm">
            <FaCoins className="mr-2 text-yellow-400" />
            <span>Error</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Error al cargar el balance de monedas USD</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  // Format the balance with 2 decimal places
  const formattedBalance = parseFloat(String(balance.balance)).toFixed(2);

  return (
    <>
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center px-3 py-1.5 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-lg shadow-md border border-slate-700/50 backdrop-blur-sm hover:shadow-lg transition-all duration-200">
              <div className="flex items-center gap-1.5">
                <FaCoins className="text-amber-400" size={14} />
                <span className="font-medium tracking-tight">
                  <span className="text-xs text-slate-400 mr-1">USD</span>
                  <span>${formattedBalance}</span>
                </span>
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="w-[200px] md:w-auto text-center">
              USD: La moneda de nuestra plataforma, equivalente a un dolar americano
            </p>
          </TooltipContent>
        </Tooltip>

        <Button
          variant="outline"
          size="sm"
          className="h-8 px-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white hover:text-white border-none shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
          onClick={() => setIsRechargeModalOpen(true)}
        >
          <FaPlusCircle className="mr-1" size={10} />
          <span className="text-xs">Recargar</span>
        </Button>
      </div>

      <RechargeModal
        isOpen={isRechargeModalOpen}
        onClose={() => setIsRechargeModalOpen(false)}
        initialAmount={undefined}
      />
    </>
  );
};

export default TestCoinBadge;
