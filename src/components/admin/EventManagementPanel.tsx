'use client';

import { useState } from 'react';
import { useEvents, useCreateEvent, useDeleteEvent } from '@/hooks/api/useEvents';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FaPlus, FaEdit, FaTrash, FaEye, FaPuzzlePiece, FaCalendarAlt, FaClock, FaTrophy } from 'react-icons/fa';
import { toast } from 'sonner';
import Link from 'next/link';
import { CreateEventRequest } from '@/lib/api/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function EventManagementPanel() {
    const { data: events, isLoading } = useEvents();
    const createEventMutation = useCreateEvent();
    const deleteEventMutation = useDeleteEvent();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newEvent, setNewEvent] = useState<Omit<CreateEventRequest, 'start'> & { start: string }>({
        name: '',
        prize: 0,
        description: '',
        start: new Date().toISOString().slice(0, 16), // Format "yyyy-MM-ddThh:mm"
        end: new Date(Date.now() + 3600000).toISOString().slice(0, 16), // One hour later
    });

    const handleCreateEvent = async () => {
        try {
            await createEventMutation.mutateAsync({
                ...newEvent,
                prize: Number(newEvent.prize),
            });
            toast.success('Evento creado exitosamente');
            setIsCreateModalOpen(false);
            resetForm();
        } catch (error) {
            toast.error('Error al crear el evento');
            console.error('Error creating event:', error);
        }
    };

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

    const resetForm = () => {
        setNewEvent({
            name: '',
            prize: 0,
            description: '',
            start: new Date().toISOString().slice(0, 16),
            end_date: new Date(Date.now() + 3600000).toISOString().slice(0, 16),
        });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#7C3AED]"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-b from-white to-purple-200 bg-clip-text text-transparent drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]">Listado de Eventos</h2>
                <Button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700 text-white hover:shadow-[0_4px_20px_rgba(123,58,237,0.7)] border border-white/10 flex items-center gap-2 cursor-pointer"
                >
                    <FaPlus className="h-4 w-4" /> Crear Evento
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events && events.length > 0 ? (
                    events.map((event) => (
                        <div key={event.id} className="rounded-xl overflow-hidden backdrop-blur-md bg-black/30 border border-white/10 shadow-[0_0_15px_rgba(123,58,237,0.2)] relative">
                            {/* Decorative elements for glassmorphism effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-indigo-900/20 z-0"></div>

                            {/* Encabezado con gradiente */}
                            <div className="w-full relative z-10 bg-gradient-to-r from-purple-700 to-indigo-700 shadow-md p-4">
                                <div className="text-center">
                                    <h3 className="text-xl font-bold text-white">{event.name}</h3>
                                </div>
                            </div>

                            {/* Contenido */}
                            <div className="w-full p-4 bg-black/20 backdrop-blur-sm relative z-10">
                                <div className="mb-4">
                                    <div className="flex items-center justify-between text-xs text-gray-300 mb-2">
                                        <div className="flex items-center gap-2">
                                            <FaCalendarAlt className="h-4 w-4 text-purple-300" />
                                            <span>{event.start ? new Date(event.start).toLocaleDateString() : 'Fecha desconocida'}</span>
                                        </div>
                                        {event.start && (
                                            <div className="flex items-center gap-2 text-xs">
                                                <FaClock className="h-4 w-4 text-purple-300" />
                                                <span>{new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        )}
                                        <Badge className={cn("bg-slate-500/40 text-white backdrop-blur-sm border border-slate-500/30", {
                                            'bg-green-500/40 text-green-200 border-green-500/30 animate-pulse': event.is_live,
                                        })}>
                                            {event.is_live ? 'En Vivo' : 'Inactivo'}
                                        </Badge>
                                    </div>

                                    <div className="rounded-lg bg-white/5 py-2 px-4 backdrop-blur-sm flex flex-row justify-between items-center mb-4 border border-white/10 shadow-inner">
                                        <div className="flex items-center gap-2">
                                            <FaTrophy className="h-4 w-4 text-amber-500" />
                                            <h4 className="text-amber-400 text-sm font-semibold">Premio</h4>
                                        </div>
                                        <p className="text-sm font-bold text-amber-300">
                                            ${event.prize} USD
                                        </p>
                                    </div>

                                    {event.description && (
                                        <div className="rounded-lg bg-white/5 py-2 px-4 backdrop-blur-sm border border-white/10 shadow-inner">
                                            <p className="text-sm text-gray-300 line-clamp-2">{event.description}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/10">
                                    <Link href={`/admin/events/${event.id}/moderate`} passHref>
                                        <Button variant="outline" className="w-full flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20">
                                            <FaEye className="h-4 w-4" /> Moderar
                                        </Button>
                                    </Link>
                                    <Link href={`/admin/events/${event.id}/patterns`} passHref>
                                        <Button variant="outline" className="w-full flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20">
                                            <FaPuzzlePiece className="h-4 w-4" /> Patrones
                                        </Button>
                                    </Link>
                                    <Link href={`/admin/events/${event.id}/edit`} passHref>
                                        <Button variant="outline" className="w-full flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20">
                                            <FaEdit className="h-4 w-4" /> Editar
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="outline"
                                        className="w-full flex items-center justify-center gap-2 bg-red-500/20 backdrop-blur-md text-red-200 border border-red-500/30 hover:bg-red-500/30"
                                        onClick={() => handleDeleteEvent(String(event.id))}
                                    >
                                        <FaTrash className="h-4 w-4" /> Eliminar
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full rounded-xl overflow-hidden backdrop-blur-md bg-black/30 border border-white/10 shadow-[0_0_15px_rgba(123,58,237,0.2)] relative p-8">
                        {/* Decorative elements for glassmorphism effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-indigo-900/20 z-0"></div>

                        <div className="relative z-10 text-center">
                            <p className="text-xl font-medium text-white mb-4">No hay eventos disponibles</p>
                            <p className="text-gray-300 mb-4">Crea tu primer evento para empezar</p>
                            <Button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700 text-white hover:shadow-[0_4px_20px_rgba(123,58,237,0.7)] border border-white/10 flex items-center gap-2 cursor-pointer"
                            >
                                <FaPlus className="h-4 w-4" /> Crear Evento
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Create Event Modal */}
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogContent className="sm:max-w-[500px] bg-black/80 backdrop-blur-md border border-white/10 shadow-[0_0_30px_rgba(123,58,237,0.3)]">
                    <DialogHeader>
                        <DialogTitle className="bg-gradient-to-b from-white to-purple-200 bg-clip-text text-transparent drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]">Crear Nuevo Evento</DialogTitle>
                        <DialogDescription className="text-gray-300">
                            Completa los datos para crear un nuevo evento de bingo
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name" className="text-gray-200">Nombre del Evento</Label>
                            <Input
                                id="name"
                                value={newEvent.name}
                                onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                                placeholder="Ej: Bingo Solidario"
                                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="prize" className="text-gray-200">Premio (USD)</Label>
                            <Input
                                id="prize"
                                type="number"
                                value={newEvent.prize}
                                onChange={(e) => setNewEvent({ ...newEvent, prize: Number(e.target.value) })}
                                placeholder="Ej: 500"
                                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="start_date" className="text-gray-200">Fecha y Hora de Inicio</Label>
                            <Input
                                id="start"
                                type="datetime-local"
                                value={newEvent.start}
                                onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
                                className="bg-white/10 border-white/20 text-white"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description" className="text-gray-200">Descripción</Label>
                            <Textarea
                                id="description"
                                value={newEvent.description || ''}
                                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                                placeholder="Describe el evento..."
                                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}
                            className="bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20">
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleCreateEvent}
                            className="bg-gradient-to-r from-purple-700 to-indigo-700 hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] border border-white/10 text-white"
                            disabled={!newEvent.name || newEvent.prize <= 0 || !newEvent.start}
                        >
                            Crear Evento
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
