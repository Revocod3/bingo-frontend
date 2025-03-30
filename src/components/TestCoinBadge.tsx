import React from 'react';
import { useTestCoinBalance } from '@/hooks/api/useTestCoins';
import { FaCoins } from 'react-icons/fa';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export const TestCoinBadge: React.FC = () => {
  const { data: balance, isLoading, error } = useTestCoinBalance();

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
          <p>Cargando balance de monedas de prueba USDB</p>
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
          <p>Error al cargar el balance de monedas de prueba USDB</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center px-3 py-1 bg-[#1E1B4B] text-white rounded-full border border-[#7C3AED]">
          <span className="font-thin mr-2">USDB</span>
          <FaCoins className="mr-2 text-[#E4EB21]" />
          <span className="font-bold">${balance.balance}</span>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>USDB: La moneda de nuestra plataforma, equivalente a un dolar americano</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default TestCoinBadge;
