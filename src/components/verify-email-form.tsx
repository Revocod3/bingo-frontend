"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
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
import { useVerifyEmail, useResendVerification } from "@/hooks/api/useAuth"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function VerifyEmailForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  // Get email from URL parameters if available
  useEffect(() => {
    const emailParam = searchParams.get('email')
    if (emailParam) {
      setEmail(emailParam)
    }
  }, [searchParams])
  
  const verifyEmailMutation = useVerifyEmail()
  const resendVerificationMutation = useResendVerification()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    try {
      await verifyEmailMutation.mutateAsync({ email, verification_code: verificationCode })
      setSuccess("¡Email verificado correctamente! Redirigiendo al inicio de sesión...")
      setTimeout(() => {
        router.push('/auth/login')
      }, 2000)
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || "Error al verificar el email. Por favor, verifica el código."
      setError(errorMessage)
    }
  }

  const handleResendCode = async () => {
    if (!email) {
      setError("Por favor, introduce tu email")
      return
    }
    
    setError(null)
    setSuccess(null)
    
    try {
      await resendVerificationMutation.mutateAsync({ email })
      setSuccess("Se ha enviado un nuevo código a tu email.")
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || "Error al reenviar el código. Inténtalo de nuevo."
      setError(errorMessage)
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Card className="border shadow-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-semibold">Verifica tu email</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Introduce el código de verificación que hemos enviado a tu email
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
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  className="w-full"
                  required
                  disabled
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="verificationCode" className="text-sm font-medium">Código de verificación</Label>
                <Input 
                  id="verificationCode" 
                  type="text" 
                  className="w-full" 
                  required 
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength={6}
                  placeholder="123456"
                />
              </div>
              <div className="space-y-2 pt-2">
                <Button 
                  type="submit"
                  className="w-full font-medium bg-[#7C3AED] hover:bg-[#6D28D9] text-white cursor-pointer"
                  disabled={verifyEmailMutation.isPending}
                >
                  {verifyEmailMutation.isPending ? 'Verificando...' : 'Verificar email'}
                </Button>
                <Button 
                  type="button"
                  variant="outline"
                  className="w-full mt-2 font-medium text-[#8B5CF6] hover:bg-[#2D2658] hover:text-white cursor-pointer"
                  onClick={handleResendCode}
                  disabled={resendVerificationMutation.isPending}
                >
                  {resendVerificationMutation.isPending ? 'Reenviando...' : 'Reenviar código'}
                </Button>
              </div>
            </div>
            <div className="mt-6 text-center text-sm">
              <Link href="/auth/login" className="font-medium text-[#8B5CF6] hover:text-[#6D28D9] transition-colors">
                Volver al inicio de sesión
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
