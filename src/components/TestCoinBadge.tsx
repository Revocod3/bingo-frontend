import React from 'react';
import { useTestCoinBalance } from '@/hooks/api/useTestCoins';
import { FaCoins } from 'react-icons/fa';

export const TestCoinBadge: React.FC = () => {
  const { data: balance, isLoading, error } = useTestCoinBalance();

  if (isLoading) {
    return (
      <div className="flex items-center px-3 py-1 bg-gray-700 text-white rounded-full animate-pulse">
        <FaCoins className="mr-2 text-yellow-400" />
        <span>Cargando...</span>
      </div>
    );
  }

  if (error || !balance) {
    return (
      <div className="flex items-center px-3 py-1 bg-red-700 text-white rounded-full">
        <FaCoins className="mr-2 text-yellow-400" />
        <span>Error</span>
      </div>
    );
  }

  return (
    <div className="flex items-center px-3 py-1 bg-[#1E1B4B] text-white rounded-full border border-[#7C3AED]">
      <FaCoins className="mr-2 text-yellow-400" />
      <span className="font-medium">Balance de prueba: {balance.balance}</span>
    </div>
  );
};

export default TestCoinBadge;
