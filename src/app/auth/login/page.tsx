'use client';

import { LoginForm } from '@/components/login-form';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showExpiredMessage, setShowExpiredMessage] = useState(false);

  // Verificar si el usuario ha sido redirigido por expiración de sesión
  useEffect(() => {
    const expired = searchParams?.get('expired');
    const session = searchParams?.get('session');

    if (expired === 'true' || session === 'expired') {
      setShowExpiredMessage(true);
    }
  }, [searchParams]);

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (status === 'authenticated') {
      console.log('Session authenticated, redirecting to dashboard');
      router.push('/dashboard');
    }
  }, [status, router]);

  // Mostrar mensaje mientras se carga la sesión
  if (status === 'loading') {
    return <div className="flex justify-center items-center min-h-screen">Cargando...</div>;
  }

  return (
    <>
      {showExpiredMessage && (
        <div className="container mx-auto max-w-md mb-4 mt-6">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Tu sesión ha expirado</AlertTitle>
            <AlertDescription>
              Por razones de seguridad, tu sesión ha expirado. Por favor, inicia sesión nuevamente.
            </AlertDescription>
          </Alert>
        </div>
      )}
      <LoginForm />
    </>
  );
}
