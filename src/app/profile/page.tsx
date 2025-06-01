'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/hooks/api/useUsers';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import TestCoinBadge from '@/components/TestCoinBadge';
import { FaUser, FaEnvelope, FaCalendarAlt, FaEdit, FaCrown, FaGamepad, FaReceipt, FaTrophy, FaHistory } from 'react-icons/fa';

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
                {/* Saldo de cuenta con glassmorphism */}
                <div className="rounded-2xl overflow-hidden backdrop-blur-md bg-black/30 border border-white/10 shadow-[0_0_15px_rgba(123,58,237,0.2)] relative">
                    {/* Decorative elements for glassmorphism effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-indigo-900/20 z-0"></div>

                    {/* Encabezado con gradiente */}
                    <div className="w-full relative z-10 bg-gradient-to-r from-purple-700 to-indigo-700 shadow-md">
                        <div className="text-center font-bold py-2 text-sm sm:text-base text-white">
                            <span className="inline-block bg-gradient-to-b from-white to-purple-200 bg-clip-text text-transparent drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]">
                                Saldo de Cuenta
                            </span>
                        </div>
                    </div>

                    {/* Contenido */}
                    <div className="w-full p-4 bg-black/20 backdrop-blur-sm relative z-10">
                        <div className="flex justify-center flex-col md:flex-row items-center gap-2">
                            <TestCoinBadge />
                            <Button
                                variant="outline"
                                size="sm"
                                className="bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 cursor-pointer"
                                onClick={() => router.push('/deposits')}
                            >
                                <span className="flex items-center gap-1.5">
                                    Depósitos <FaHistory size={14} />
                                </span>
                            </Button>
                        </div>
                    </div>
                </div>
                {/* Información Personal con glassmorphism */}
                <div className="rounded-2xl overflow-hidden backdrop-blur-md bg-black/30 border border-white/10 shadow-[0_0_15px_rgba(123,58,237,0.2)] relative">
                    {/* Decorative elements for glassmorphism effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-indigo-900/20 z-0"></div>

                    {/* Encabezado con gradiente */}
                    <div className="w-full relative z-10 bg-gradient-to-r from-purple-700 to-indigo-700 shadow-md">
                        <div className="flex justify-between items-center px-4 py-3">
                            <div className="text-center font-bold text-sm sm:text-base text-white">
                                <span className="inline-block bg-gradient-to-b from-white to-purple-200 bg-clip-text text-transparent drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]">
                                    Información Personal
                                </span>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-white/80 hover:text-white hover:bg-white/10"
                                onClick={() => setIsEditing(!isEditing)}
                            >
                                <FaEdit className="mr-2" />
                                {isEditing ? 'Cancelar' : 'Editar'}
                            </Button>
                        </div>
                        <div className="text-white/70 text-xs px-4 pb-2">
                            Administra tus datos personales y cuenta
                        </div>
                    </div>

                    {/* Contenido */}
                    <div className="w-full p-4 bg-black/20 backdrop-blur-sm relative z-10 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <div className="text-sm text-gray-300 flex items-center">
                                    <FaUser className="mr-2 text-purple-300" />
                                    Nombre
                                </div>
                                <div className="font-medium text-white">
                                    {user.first_name || 'No especificado'} {user.last_name || ''}
                                </div>
                            </div>

                            <div className="space-y-1">
                                <div className="text-sm text-gray-300 flex items-center">
                                    <FaEnvelope className="mr-2 text-purple-300" />
                                    Correo Electrónico
                                </div>
                                <div className="font-medium text-white">
                                    {user.email}
                                </div>
                            </div>

                            <div className="space-y-1">
                                <div className="text-sm text-gray-300 flex items-center">
                                    <FaCalendarAlt className="mr-2 text-purple-300" />
                                    Miembro desde
                                </div>
                                <div className="font-medium text-white">
                                    {formattedDate}
                                </div>
                            </div>

                            <div className="space-y-1">
                                <div className="text-sm text-gray-300 flex items-center">
                                    <FaCrown className="mr-2 text-purple-300" />
                                    Tipo de cuenta
                                </div>
                                <div className="font-medium">
                                    {user.is_staff ?
                                        <Badge className="bg-purple-500/40 text-purple-200 backdrop-blur-sm border border-purple-500/30">Administrador</Badge> :
                                        <Badge className="bg-indigo-500/40 text-indigo-200 backdrop-blur-sm border border-indigo-500/30">Jugador</Badge>
                                    }
                                </div>
                            </div>
                        </div>

                        {/* Footer info */}
                        <div className="pt-3 border-t border-white/10">
                            {isEditing ? (
                                <div className="w-full space-y-4">
                                    <p className="text-gray-300 text-sm">
                                        La edición de perfil se implementará pronto. Podrás cambiar tu nombre, contraseña y más.
                                    </p>
                                    <Button
                                        className="w-full bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700 hover:shadow-[0_4px_20px_rgba(123,58,237,0.7)] border border-white/10"
                                        onClick={() => setIsEditing(false)}
                                    >
                                        Guardar Cambios
                                    </Button>
                                </div>
                            ) : (
                                <p className="text-gray-300 text-sm">
                                    Tu información está segura y es privada. Solo tú puedes verla y editarla.
                                </p>
                            )}
                        </div>
                    </div>
                </div>


                {/* Stats and Account Info */}
                <div className="space-y-6">
                    {/* Estadísticas con glassmorphism */}
                    <div className="rounded-2xl overflow-hidden backdrop-blur-md bg-black/30 border border-white/10 shadow-[0_0_15px_rgba(123,58,237,0.2)] relative">
                        {/* Decorative elements for glassmorphism effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-indigo-900/20 z-0"></div>

                        {/* Encabezado con gradiente */}
                        <div className="w-full relative z-10 bg-gradient-to-r from-purple-700 to-indigo-700 shadow-md">
                            <div className="text-center font-bold py-2 text-sm sm:text-base text-white">
                                <span className="inline-block bg-gradient-to-b from-white to-purple-200 bg-clip-text text-transparent drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]">
                                    Estadísticas
                                </span>
                            </div>
                        </div>

                        {/* Contenido */}
                        <div className="w-full p-4 bg-black/20 backdrop-blur-sm relative z-10">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-300 flex items-center">
                                        <FaGamepad className="mr-2 text-purple-300" />
                                        Eventos Jugados
                                    </span>
                                    <Badge className="bg-black/30 backdrop-blur-sm text-white border border-white/20 font-bold">0</Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-300 flex items-center">
                                        <FaReceipt className="mr-2 text-purple-300" />
                                        Cartones Comprados
                                    </span>
                                    <Badge className="bg-black/30 backdrop-blur-sm text-white border border-white/20 font-bold">0</Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-300 flex items-center">
                                        <FaTrophy className="mr-2 text-purple-300" />
                                        Victorias
                                    </span>
                                    <Badge className="bg-black/30 backdrop-blur-sm text-white border border-white/20 font-bold">0</Badge>
                                </div>
                            </div>

                            <div className="mt-6 pt-3 border-t border-white/10">
                                <Button
                                    className="w-full bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20"
                                    onClick={() => router.push('/dashboard')}
                                >
                                    Ver Todos los Eventos
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}
