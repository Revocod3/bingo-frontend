import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/lib/api/services';

export function useLogin() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: authService.login,
    onSuccess: () => {
      // Invalidate user data to refetch after login
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    }
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: authService.register
  });
}

export function useVerifyEmail() {
  return useMutation({
    mutationFn: authService.verifyEmail
  });
}

export function useResendVerification() {
  return useMutation({
    mutationFn: authService.resendVerification
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => Promise.resolve(authService.logout()),
    onSuccess: () => {
      // Clear user data from cache
      queryClient.clear();
    }
  });
}
