'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface AuthGuardProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export function AuthGuard({ children, adminOnly = false }: AuthGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isAdmin = session?.user?.is_staff === true;
  const isLoading = status === 'loading';
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Solo establecer autorizado si todo está correcto
    if (!isLoading) {
      if (!session) {
        router.replace('/auth/login');
      } else if (adminOnly && !isAdmin) {
        router.replace('/dashboard');
      } else {
        setIsAuthorized(true);
      }
    }
  }, [session, status, isAdmin, adminOnly, router, isLoading]);

  // Mostrar un loader mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Verificando autenticación...</p>
      </div>
    );
  }

  // No mostrar nada hasta confirmar que el usuario está autorizado
  if (!isAuthorized) {
    return null;
  }

  // Solo mostrar el contenido si el usuario está autorizado
  return <>{children}</>;
}
