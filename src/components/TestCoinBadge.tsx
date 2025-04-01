import React, { useState } from 'react';
import { useTestCoinBalance } from '@/hooks/api/useTestCoins';
import { FaCoins, FaPlus } from 'react-icons/fa';
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
          <div className="flex items-center px-3 py-1 bg-gray-700 text-white rounded-full animate-pulse">
            <FaCoins className="mr-2 text-yellow-400" />
            <span>Cargando...</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Cargando balance de monedas de prueba USD</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  if (error || !balance) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center px-3 py-1 bg-red-700 text-white rounded-full">
            <FaCoins className="mr-2 text-yellow-400" />
            <span>Error</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Error al cargar el balance de monedas de prueba USD</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center px-3 py-1 bg-[#1E1B4B] text-white rounded-full border border-[#7C3AED]">
              <span className="font-thin mr-2">USD</span>
              <FaCoins className="mr-2 text-[#E4EB21]" />
              <span className="font-bold">${balance.balance}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className='w-[200px] md:w-auto text-center'>
              USD: La moneda de nuestra plataforma, equivalente a un dolar americano</p>
          </TooltipContent>
        </Tooltip>

        <Button
          variant="outline"
          size="sm"
          className="h-8 px-2 rounded-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white border-none"
          onClick={() => setIsRechargeModalOpen(true)}
        >
          <FaPlus className="mr-1" size={12} />
          <span className="text-xs">Recargar</span>
        </Button>
      </div>

      <RechargeModal
        isOpen={isRechargeModalOpen}
        onClose={() => setIsRechargeModalOpen(false)}
      />
    </>
  );
};

export default TestCoinBadge;
