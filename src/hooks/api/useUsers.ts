import { useQuery } from '@tanstack/react-query';
import { userService } from '@/lib/api/services';

export function useCurrentUser() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: userService.getCurrentUser,
    retry: false,
  });
}

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: userService.getUsers
  });
}

export function useUser(id: number) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => userService.getUser(id),
    enabled: !!id
  });
}
