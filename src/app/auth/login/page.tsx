'use client';

import { LoginForm } from '@/components/login-form';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

// Componente que utiliza useSearchParams para verificar mensajes de expiración de sesión
function SessionExpiredAlert() {
  // useSearchParams debe estar dentro de un componente cliente y dentro de Suspense
  const [showExpiredMessage, setShowExpiredMessage] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const expired = searchParams.get('expired');
    const session = searchParams.get('session');

    if (expired === 'true' || session === 'expired') {
      setShowExpiredMessage(true);
    }
  }, []);

  if (!showExpiredMessage) return null;

  return (
    <div className="container mx-auto max-w-md mb-4 mt-6">
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Tu sesión ha expirado</AlertTitle>
        <AlertDescription>
          Por razones de seguridad, tu sesión ha expirado. Por favor, inicia sesión nuevamente.
        </AlertDescription>
      </Alert>
    </div>
  );
}

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();

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
      <Suspense fallback={null}>
        <SessionExpiredAlert />
      </Suspense>
      <LoginForm />
    </>
  );
}
