"use client"

import { useCurrentUser } from "@/hooks/api/useUsers"
import { useLogout } from "@/hooks/api/useAuth"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
  const { data: user, isLoading, isError } = useCurrentUser()
  const logout = useLogout()
  const router = useRouter()
  
  const handleLogout = () => {
    logout()
    router.push('/auth/login')
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#7C3AED]"></div>
      </div>
    )
  }
  
  if (isError || !user) {
    // If not authenticated, redirect to login
    router.push('/auth/login')
    return null
  }
  
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button
          variant="destructive"
          onClick={handleLogout}
        >
          Cerrar sesión
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Perfil de usuario</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd>{user.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Nombre</dt>
                <dd>{user.first_name || 'No especificado'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Apellido</dt>
                <dd>{user.last_name || 'No especificado'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Email verificado</dt>
                <dd>{user.is_email_verified ? 'Sí' : 'No'}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Bienvenido</CardTitle>
          </CardHeader>
          <CardContent>
            <p>¡Gracias por registrarte en nuestra plataforma!</p>
            <p className="mt-2">Esta es tu área privada de dashboard.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
