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
import { useRegister } from "@/hooks/api/useAuth"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FaGoogle, FaFacebook } from "react-icons/fa"

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  // Split full name into first and last name
  const getNames = () => {
    const names = fullName.trim().split(' ')
    const firstName = names[0] || ''
    const lastName = names.slice(1).join(' ') || ''
    return { first_name: firstName, last_name: lastName }
  }

  const registerMutation = useRegister()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Form validation
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres")
      return
    }

    try {
      const { first_name, last_name } = getNames()
      await registerMutation.mutateAsync({
        email,
        password,
        first_name,
        last_name
      })
      setSuccess(true)
      // Redirect to verification page after a short delay
      setTimeout(() => {
        router.push(`/verify-email?email=${encodeURIComponent(email)}`)
      }, 2000)
    } catch (err: any) {
      const errorData = err.response?.data
      if (errorData) {
        // Handle validation errors from API
        if (typeof errorData === 'object') {
          const firstError = Object.entries(errorData)[0]
          const fieldName = firstError[0]
          const fieldError = Array.isArray(firstError[1]) ? firstError[1][0] : String(firstError[1])
          setError(`${fieldName}: ${fieldError}`)
        } else {
          setError(String(errorData))
        }
      } else {
        setError("Error al registrar. Por favor, inténtalo de nuevo.")
      }
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Card className="border shadow-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-semibold">Crea una cuenta</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Completa el formulario para registrarte y comenzar
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
              <AlertDescription>
                ¡Registro exitoso! Te estamos redirigiendo a la página de verificación...
              </AlertDescription>
            </Alert>
          )}
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">Nombre completo</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Juan José Pérez"
                  className="w-full"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
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
                <Label htmlFor="password" className="text-sm font-medium">Contraseña</Label>
                <Input 
                  id="password" 
                  type="password" 
                  className="w-full" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirmar contraseña</Label>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  className="w-full" 
                  required 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2 pt-2">
                <Button 
                  type="submit"
                  className="w-full font-medium bg-[#7C3AED] hover:bg-[#6D28D9] text-white cursor-pointer"
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending ? 'Registrando...' : 'Registrarse'}
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
              ¿Ya tienes una cuenta?{" "}
              <Link href="/auth/login" className="font-medium text-[#8B5CF6] hover:text-[#6D28D9] transition-colors">
                Inicia sesión
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
