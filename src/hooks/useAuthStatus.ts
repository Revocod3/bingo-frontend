import { useSession } from 'next-auth/react';

export function useAuthStatus() {
  try {
    const { data: session, status } = useSession();
    const isAuthenticated = status === 'authenticated';
    const isAdmin = isAuthenticated && session?.user?.is_staff === true;
    
    return {
      isAuthenticated,
      isAdmin,
      session,
      status
    };
  } catch (error) {
    return {
      isAuthenticated: false,
      isAdmin: false,
      session: null,
      status: 'unauthenticated'
    };
  }
}
