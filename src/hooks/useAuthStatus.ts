import { useSession } from 'next-auth/react';
import { useCurrentUser } from './api';

export function useAuthStatus() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';
  const isAdmin = isAuthenticated && session?.user?.is_staff === true;

  const { data: userData } = useCurrentUser();
  const isSeller = isAuthenticated && userData?.is_seller === true;
  
  return {
    isAuthenticated,
    isAdmin,
    session,
    status,
    isSeller,
  };
}
