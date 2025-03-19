"use client"

import { useCurrentUser } from "@/hooks/api/useUsers"
import { useLogout } from "@/hooks/api/useAuth"
import { useEvents } from "@/hooks/api/useEvents"
import { useBingoCards } from "@/hooks/api/useBingoCards"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import TestCoinBadge from "@/components/TestCoinBadge"
import Link from "next/link"

export default function DashboardPage() {
  const { data: user, isLoading, isError } = useCurrentUser()
  const { data: events } = useEvents()
  const { data: cards } = useBingoCards()
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

  // Get upcoming events (limit to 3)
  const upcomingEvents = events
    ?.filter(event => new Date(event.start) > new Date())
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    .slice(0, 3);
  
  // Get user's active bingo cards (limit to 3)
  const userCards = cards?.slice(0, 3);
  
  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <TestCoinBadge />
          <Button
            variant="destructive"
            onClick={handleLogout}
          >
            Cerrar sesión
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* User Profile Card */}
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

        {/* Upcoming Events Card */}
        <Card>
          <CardHeader>
            <CardTitle>Próximos Eventos</CardTitle>
            <CardDescription>Eventos disponibles para participar</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingEvents && upcomingEvents.length > 0 ? (
              <div className="space-y-4">
                {upcomingEvents.map(event => (
                  <div key={event.id} className="border-b pb-2 last:border-0">
                    <h3 className="font-medium">{event.name}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(event.start).toLocaleDateString()}
                    </p>
                    <div className="mt-2">
                      <Link href={`/events/${event.id}`} passHref>
                        <Button variant="outline" size="sm" className="text-[#7C3AED]">
                          Ver evento
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No hay eventos próximos</p>
            )}
            <div className="mt-4 pt-2 border-t">
              <Link href="/events" passHref>
                <Button className="w-full bg-[#7C3AED] hover:bg-[#6D28D9]">
                  Ver todos los eventos
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Bingo Cards Card */}
        <Card>
          <CardHeader>
            <CardTitle>Tus Cartones</CardTitle>
            <CardDescription>Cartones de bingo activos</CardDescription>
          </CardHeader>
          <CardContent>
            {userCards && userCards.length > 0 ? (
              <div className="space-y-4">
                {userCards.map(card => (
                  <div key={card.id} className="border-b pb-2 last:border-0">
                    <h3 className="font-medium">Carton #{card.id.toString().substring(0, 8)}</h3>
                    <p className="text-sm text-gray-500">
                      {card.is_winner ? 'Ganador' : 'En juego'}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs">Evento #{card.event}</span>
                      <Link href={`/events/${card.event}`} passHref>
                        <Button variant="outline" size="sm" className="text-[#7C3AED]">
                          Ver detalles
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No tienes cartones activos</p>
            )}
            <div className="mt-4 pt-2 border-t">
              <Link href="/events" passHref>
                <Button className="w-full bg-[#7C3AED] hover:bg-[#6D28D9]">
                  Comprar cartones
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links Card */}
        <Card>
          <CardHeader>
            <CardTitle>Accesos rápidos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/events" passHref>
              <Button className="w-full bg-[#7C3AED] hover:bg-[#6D28D9]">
                Ver todos los eventos
              </Button>
            </Link>
            
            <Link href="#" passHref>
              <Button className="w-full" variant="outline" disabled>
                Historial de juegos
              </Button>
            </Link>
            
            <Link href="#" passHref>
              <Button className="w-full" variant="outline">
                Recargar monedas de prueba
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
