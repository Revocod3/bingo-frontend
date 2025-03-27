import { useSession } from 'next-auth/react';

export function useAuthStatus() {
  try {
    const { data: session, status } = useSession();
    const isAuthenticated = status === 'authenticated';
    const isAdmin = isAuthenticated && true; // Replace true with your admin check logic
    console.log(session);
    
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
