import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { testCoinService } from '@/lib/api/services';

// Hook to fetch all pending deposits
export function useAdminDeposits() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['admin', 'deposits'],
    queryFn: testCoinService.getPendingDeposits
  });

  return {
    deposits: data,
    isLoading,
    error,
    refetch
  };
}

// Hook to fetch details of a specific deposit
export function useDepositDetails(depositId: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin', 'deposit', depositId],
    queryFn: async () => {
      const response = await testCoinService.getPendingDeposits();
      return response.find(deposit => deposit.id === depositId);
    },
    enabled: !!depositId
  });

  return {
    deposit: data,
    isLoading,
    error
  };
}

// Hook for admin actions on deposits
export function useAdminDepositActions() {
  const [isPending, setIsPending] = useState(false);

  const approveMutation = useMutation({
    mutationFn: async (data: { depositId: string; adminNotes?: string }) => {
      setIsPending(true);
      try {
        return await testCoinService.approveDeposit(data.depositId, data.adminNotes);
      } finally {
        setIsPending(false);
      }
    }
  });

  const rejectMutation = useMutation({
    mutationFn: async (data: { depositId: string; adminNotes?: string }) => {
      setIsPending(true);
      try {
        return await testCoinService.rejectDeposit(data.depositId, data.adminNotes);
      } finally {
        setIsPending(false);
      }
    }
  });

  return {
    approveDeposit: approveMutation.mutateAsync,
    rejectDeposit: rejectMutation.mutateAsync,
    isPending
  };
}
