import { useSession } from 'next-auth/react';
import { useCurrentUser } from './api/useUsers';

export function useAuthStatus() {
  const { data: session, status } = useSession();
  const { data: userData } = useCurrentUser();
  
  const isAuthenticated = status === 'authenticated';
  const isAdmin = isAuthenticated && session?.user?.is_staff === true;
  
  // Get is_seller from the /me endpoint data
  const isSeller = isAuthenticated && userData?.is_seller === true;
  
  return {
    isAuthenticated,
    isAdmin,
    isSeller,
    session,
    status
  };
}
