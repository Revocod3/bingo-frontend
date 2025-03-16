import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/lib/api/services';
import { LoginRequest, RegisterRequest, TokenResponse, User, VerifyEmailRequest, ResendVerificationRequest } from '@/lib/api/types';

export function useLogin(): UseMutationResult<TokenResponse, Error, LoginRequest, unknown> {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: authService.login,
    onSuccess: () => {
      // Invalidate and refetch current user data after successful login
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });
}

export function useRegister(): UseMutationResult<User, Error, RegisterRequest, unknown> {
  return useMutation({
    mutationFn: authService.register,
  });
}

export function useVerifyEmail(): UseMutationResult<{ detail: string }, Error, VerifyEmailRequest, unknown> {
  return useMutation({
    mutationFn: authService.verifyEmail,
  });
}

export function useResendVerification(): UseMutationResult<{ detail: string }, Error, ResendVerificationRequest, unknown> {
  return useMutation({
    mutationFn: authService.resendVerification,
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  
  return () => {
    authService.logout();
    queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    queryClient.clear();
  };
}
