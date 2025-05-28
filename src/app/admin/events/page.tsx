'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { FaArrowLeft, FaPlus } from 'react-icons/fa';
import { useEvents, useDeleteEvent } from '@/hooks/api/useEvents';
import { toast } from 'sonner';
import AdminEventCard from '@/components/admin/AdminEventCard';
import AdminRouteGuard from '@/components/AdminRouteGuard';

export default function AdminEventsPage() {
    const router = useRouter();
    const { data: events, isLoading } = useEvents();
    const deleteEventMutation = useDeleteEvent();

    const handleDeleteEvent = async (id: string) => {
        if (confirm('¿Estás seguro que deseas eliminar este evento? Esta acción no se puede deshacer.')) {
            try {
                await deleteEventMutation.mutateAsync(id);
                toast.success('Evento eliminado correctamente');
            } catch (error) {
                toast.error('Error al eliminar el evento');
                console.error('Error deleting event:', error);
            }
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-700"></div>
            </div>
        );
    }

    return (
        <AdminRouteGuard>
            <div className="container mx-auto py-8 px-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-b from-white to-purple-200 bg-clip-text text-transparent drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]">Listado de Eventos</h1>
                        <p className="text-gray-300 mt-2">
                            Gestiona todos los eventos de bingo en la plataforma
                        </p>
                    </div>

                    <div className="mt-4 md:mt-0 flex gap-2">
                        <Link href="/admin" passHref>
                            <Button variant="ghost" className="bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20">
                                <FaArrowLeft className="mr-2 h-4 w-4" />
                                Panel Admin
                            </Button>
                        </Link>
                        <Button
                            className="bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700 text-white hover:shadow-[0_4px_20px_rgba(123,58,237,0.7)] border border-white/10 flex items-center gap-2"
                            onClick={() => router.push('/admin/events/create')}
                        >
                            <FaPlus className="h-4 w-4" /> Crear Evento
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events && events.length > 0 ? (
                        events.map((event) => (
                            <AdminEventCard
                                key={event.id}
                                id={event.id}
                                name={event.name}
                                date={event.start ? new Date(event.start).toLocaleDateString() : 'Fecha desconocida'}
                                time={event.start ? new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                isActive={event.is_live || false}
                                prize={event.prize}
                                onEdit={() => router.push(`/admin/events/${event.id}/edit`)}
                                onDelete={() => handleDeleteEvent(String(event.id))}
                            />
                        ))
                    ) : (
                        <div className="col-span-full rounded-2xl overflow-hidden backdrop-blur-md bg-black/30 border border-white/10 shadow-[0_0_15px_rgba(123,58,237,0.2)] relative p-8">
                            {/* Decorative elements for glassmorphism effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-indigo-900/20 z-0"></div>

                            <div className="relative z-10 text-center">
                                <p className="text-xl font-medium text-white mb-4">No hay eventos disponibles</p>
                                <p className="text-gray-300 mb-4">Crea tu primer evento para empezar</p>
                                <Button
                                    onClick={() => router.push('/admin/events/create')}
                                    className="bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700 text-white hover:shadow-[0_4px_20px_rgba(123,58,237,0.7)] border border-white/10 flex items-center gap-2"
                                >
                                    <FaPlus className="h-4 w-4" /> Crear Evento
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminRouteGuard>
    );
}
