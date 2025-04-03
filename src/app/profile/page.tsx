'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/hooks/api/useUsers';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import TestCoinBadge from '@/components/TestCoinBadge';
import { FaUser, FaEnvelope, FaCalendarAlt, FaEdit, FaCrown, FaGamepad, FaReceipt, FaTrophy, FaPlusCircle, FaHistory } from 'react-icons/fa';

export default function ProfilePage() {
    const router = useRouter();
    const { data: user, isLoading, error } = useCurrentUser();
    const [isEditing, setIsEditing] = useState(false);

    // Handle unauthorized or loading states
    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center max-w-md p-6 bg-card rounded-lg border shadow-sm">
                    <h2 className="text-2xl font-bold mb-4">Acceso no autorizado</h2>
                    <p className="text-muted-foreground mb-6">Debes iniciar sesión para ver esta página.</p>
                    <Button
                        onClick={() => router.push('/auth/login')}
                        className="w-full"
                    >
                        Iniciar Sesión
                    </Button>
                </div>
            </div>
        );
    }

    // Format registration date
    const formattedDate = user.date_joined
        ? new Date(user.date_joined).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
        : 'Fecha desconocida';

    return (
        <div className="container py-8 px-4 md:py-12 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-8 text-left">Tu Perfil</h1>

            <div className="grid grid-cols-1 gap-6">
                {/* Main Profile Information */}
                <Card className='pt-2 bg-gradient-to-l from-yellow-50 border-0 to-purple-100 shadow-lg'>
                    <CardHeader className="px-4">
                        <CardTitle className="text-lg m-0 p-0">Saldo de Cuenta</CardTitle>
                    </CardHeader>
                    <CardContent className='pb-6 m-0'>
                        <div className="flex justify-center flex-col md:flex-row items-center gap-2">
                            <TestCoinBadge />
                            <Button
                                variant="outline"
                                size="sm"
                                className="rounded-lg hover:bg-purple-100 cursor-pointer"
                                onClick={() => router.push('/deposits')}
                            >
                                <span className="flex items-center gap-1.5 text-gray-800">
                                    Depósitos <FaHistory size={14} />
                                </span>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-4">
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-xl md:text-2xl">Información Personal</CardTitle>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground hover:text-primary"
                                onClick={() => setIsEditing(!isEditing)}
                            >
                                <FaEdit className="mr-2" />
                                {isEditing ? 'Cancelar' : 'Editar'}
                            </Button>
                        </div>
                        <CardDescription>
                            Administra tus datos personales y cuenta
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <div className="text-sm text-muted-foreground flex items-center">
                                    <FaUser className="mr-2 text-primary" />
                                    Nombre
                                </div>
                                <div className="font-medium">
                                    {user.first_name || 'No especificado'} {user.last_name || ''}
                                </div>
                            </div>

                            <div className="space-y-1">
                                <div className="text-sm text-muted-foreground flex items-center">
                                    <FaEnvelope className="mr-2 text-primary" />
                                    Correo Electrónico
                                </div>
                                <div className="font-medium">
                                    {user.email}
                                </div>
                            </div>

                            <div className="space-y-1">
                                <div className="text-sm text-muted-foreground flex items-center">
                                    <FaCalendarAlt className="mr-2 text-primary" />
                                    Miembro desde
                                </div>
                                <div className="font-medium">
                                    {formattedDate}
                                </div>
                            </div>

                            <div className="space-y-1">
                                <div className="text-sm text-muted-foreground flex items-center">
                                    <FaCrown className="mr-2 text-primary" />
                                    Tipo de cuenta
                                </div>
                                <div className="font-medium">
                                    {user.is_staff ?
                                        <Badge variant="secondary" className="bg-purple-100 text-purple-800 hover:bg-purple-200">Administrador</Badge> :
                                        <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">Jugador</Badge>
                                    }
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        {isEditing ? (
                            <div className="w-full space-y-4">
                                <p className="text-muted-foreground text-sm">
                                    La edición de perfil se implementará pronto. Podrás cambiar tu nombre, contraseña y más.
                                </p>
                                <Button
                                    className="w-full"
                                    onClick={() => setIsEditing(false)}
                                >
                                    Guardar Cambios
                                </Button>
                            </div>
                        ) : (
                            <p className="text-muted-foreground text-sm">
                                Tu información está segura y es privada. Solo tú puedes verla y editarla.
                            </p>
                        )}
                    </CardFooter>
                </Card>


                {/* Stats and Account Info */}
                <div className="space-y-6">

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg">Estadísticas</CardTitle>
                        </CardHeader>
                        <CardContent className="pb-6 space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground flex items-center">
                                    <FaGamepad className="mr-2 text-primary" />
                                    Eventos Jugados
                                </span>
                                <Badge variant="outline" className="font-bold">0</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground flex items-center">
                                    <FaReceipt className="mr-2 text-primary" />
                                    Cartones Comprados
                                </span>
                                <Badge variant="outline" className="font-bold">0</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground flex items-center">
                                    <FaTrophy className="mr-2 text-primary" />
                                    Victorias
                                </span>
                                <Badge variant="outline" className="font-bold">0</Badge>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => router.push('/dashboard')}
                            >
                                Ver Todos los Eventos
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div >
    );
}
