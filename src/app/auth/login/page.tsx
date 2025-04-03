"use client";

import { LoginForm } from "@/components/login-form";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { status, data: session } = useSession();
  const router = useRouter();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (status === 'authenticated') {
      console.log("Session authenticated, redirecting to dashboard");
      router.push('/dashboard');
    }
  }, [status, router]);

  // Mostrar mensaje mientras se carga la sesión
  if (status === 'loading') {
    return <div className="flex justify-center items-center min-h-screen">Cargando...</div>;
  }

  return (
      <LoginForm />
  );
}
