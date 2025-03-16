"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useLogin } from "@/hooks/api/useAuth"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FaGoogle, FaFacebook } from "react-icons/fa"
import { ApiError } from "@/lib/api/types"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  const loginMutation = useLogin()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      await loginMutation.mutateAsync({ email, password })
      router.push('/dashboard')
    } catch (err: unknown) {
      const apiError = err as ApiError
      const errorMessage = apiError.response?.data?.detail || "Credenciales inválidas. Por favor, verifica tu email y contraseña."
      setError(errorMessage)
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
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
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="mail@ejemplo.com"
                  className="w-full"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">Contraseña</Label>
                  <Link href="/auth/reset-password" className="text-xs text-[#8B5CF6] hover:text-[#6D28D9]">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  className="w-full"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2 pt-2">
                <Button
                  type="submit"
                  className="w-full font-medium bg-[#7C3AED] hover:bg-[#6D28D9] text-white cursor-pointer"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? 'Iniciando sesión...' : 'Iniciar sesión'}
                </Button>
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-foreground/20"></span>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-card px-2 text-muted-foreground">o continuar con</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-[#7C3AED] text-[#8B5CF6] hover:bg-[#2D2658] hover:text-white cursor-pointer"
                  >
                    <FaGoogle className="mr-2" />
                    Google
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-[#7C3AED] text-[#8B5CF6] hover:bg-[#2D2658] hover:text-white cursor-pointer"
                  >
                    <FaFacebook className="mr-2" />
                    Facebook
                  </Button>
                </div>
              </div>
            </div>
            <div className="mt-6 text-center text-sm">
              ¿No tienes una cuenta?{" "}
              <Link href="/auth/register" className="font-medium text-[#8B5CF6] hover:text-[#6D28D9] transition-colors">
                Regístrate aquí
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
