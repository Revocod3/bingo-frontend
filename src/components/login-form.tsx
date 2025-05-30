'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FaGoogle } from 'react-icons/fa';
import { signIn } from 'next-auth/react';
import { Loader2 } from 'lucide-react';

// URL de destino después del inicio de sesión - centralizada para consistencia
const LOGIN_REDIRECT_URL = '/dashboard';

export function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Verificar si el usuario fue redirigido por sesión expirada
  useEffect(() => {
    // Sólo ejecutar esto en el cliente una vez al cargar el componente
    if (typeof window !== 'undefined') {
      // Obtener parámetros de URL
      const searchParams = new URLSearchParams(window.location.search);
      const expired = searchParams.get('expired');
      const session = searchParams.get('session');

      // Mostrar mensaje si cualquiera de los dos parámetros indica sesión expirada
      if (expired === 'true' || session === 'expired') {
        setError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');

        // Limpiar el parámetro de la URL para evitar mostrar el mensaje después de refrescar
        // Usamos history.replaceState en lugar de router.replace para evitar una recarga de página
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Credenciales inválidas. Por favor, verifica tu email y contraseña.');
        console.error('Login error:', result.error);
      } else {
        // Successful login - mostrar mensaje de redirección
        setIsRedirecting(true);
        console.log('Inicio de sesión exitoso, redirigiendo...');

        // Pequeño retraso para mostrar el mensaje de redirección
        setTimeout(() => {
          router.push(LOGIN_REDIRECT_URL);
          router.refresh();
        }, 500);
      }
    } catch (err) {
      setError('Ocurrió un error al iniciar sesión. Por favor, intenta de nuevo.');
      console.error('Login exception:', err);
    } finally {
      // Solo dejamos de mostrar el loading si hay un error
      if (!isRedirecting) {
        setIsLoading(false);
      }
    }
  };

  // Estado de redirección, mostramos un mensaje claro
  if (isRedirecting) {
    return (
      <div className="grid gap-6">
        <Card className="border shadow-sm">
          <CardContent className="flex flex-col items-center justify-center pt-6 pb-6">
            <div className="flex flex-col items-center space-y-4 py-6">
              <Loader2 className="h-10 w-10 text-[#7C3AED] animate-spin" />
              <p className="text-center text-xl font-medium">Inicio de sesión exitoso</p>
              <p className="text-center text-sm text-muted-foreground">
                Redirigiendo al dashboard...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Card className="border shadow-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-semibold">Iniciar sesión</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Ingresa tus credenciales para acceder a tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nombre@ejemplo.com"
                  autoComplete="email"
                  required
                  disabled={isLoading}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Contraseña
                  </Label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-muted-foreground hover:text-primary text-right"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  disabled={isLoading}
                  className="w-full"
                />
              </div>
              <div className="space-y-2 pt-2">
                <Button
                  type="submit"
                  className="w-full font-medium bg-[#7C3AED] hover:bg-[#6D28D9] text-white cursor-pointer"
                  disabled={isLoading}
                >
                  {isLoading ? 'Cargando...' : 'Iniciar sesión'}
                </Button>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-foreground/20"></span>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-card px-2 text-muted-foreground">o continuar con</span>
                  </div>
                </div>

                <div className="grid gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-[#7C3AED] text-[#8B5CF6] hover:bg-[#7C3AED]/50 hover:text-white cursor-pointer"
                    disabled={isLoading}
                    onClick={() => signIn('google', { callbackUrl: LOGIN_REDIRECT_URL })}
                  >
                    <FaGoogle className="mr-2" />
                    Google
                  </Button>
                  {/* <Button
                    type="button"
                    variant="outline"
                    className="w-full border-[#7C3AED] text-[#8B5CF6] hover:bg-[#2D2658] hover:text-white cursor-pointer"
                    disabled
                  >
                    <FaFacebook />
                    Facebook
                  </Button> */}
                </div>
              </div>
            </div>
            <div className="mt-6 text-center text-sm">
              ¿No tienes una cuenta?{' '}
              <Link
                href="/auth/register"
                className="font-medium text-[#8B5CF6] hover:text-[#6D28D9] transition-colors"
              >
                Regístrate
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
