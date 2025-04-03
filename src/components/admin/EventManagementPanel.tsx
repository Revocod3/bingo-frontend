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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    ResponsiveDialogContent,
    ResponsiveDialogHeader,
    ResponsiveDialogFooter,
    DialogTitle,
    DialogDescription
} from '@/components/ui/responsive-dialog';
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

    const handleDeleteEvent = async (id: number) => {
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
                <h2 className="text-xl md:text-2xl font-bold">Listado de Eventos</h2>
                <Button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white flex items-center gap-2 cursor-pointer"
                >
                    <FaPlus className="h-4 w-4" /> Crear Evento
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events && events.length > 0 ? (
                    events.map((event) => (
                        <Card key={event.id} className="overflow-hidden shadow-md hover:shadow-lg gap-4 transition-shadow pt-0 border-0 rounded-lg">
                            <div className="relative h-28 bg-gradient-to-r from-purple-700 to-indigo-700 rounded-t-lg opacity-80">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <h3 className="text-2xl font-bold text-white">{event.name}</h3>
                                </div>
                            </div>
                            <CardHeader>
                                <CardDescription>
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <FaCalendarAlt className="h-4 w-4 text-muted-foreground" />
                                            <span>{event.start ? new Date(event.start).toLocaleDateString() : 'Fecha desconocida'}</span>
                                            {event.start && (
                                                <div className="flex items-center gap-2 text-xs">
                                                    <FaClock className="h-4 w-4 text-muted-foreground" />
                                                    <span>{new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <Badge className={cn("bg-slate-400 text-slate-200", {
                                                'bg-green-400 text-green-200 animate-pulse': event.is_live,
                                            })}>
                                                {event.is_live ? 'En Vivo' : 'Inactivo'}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="rounded-lg bg-amber-50 py-1 px-4 dark:bg-amber-950/50 flex flex-row justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <FaTrophy className="h-4 w-4 text-amber-500" />
                                        <h4 className="text-amber-600 text-sm font-semibold dark:text-amber-400">Premio</h4>
                                    </div>
                                    <p className="text-sm font-bold text-amber-700">
                                        ${event.prize} USD
                                    </p>
                                </div>

                                {event.description && (
                                    <div className="rounded-lg bg-gray-50 py-2 px-4 dark:bg-gray-800/50">
                                        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{event.description}</p>
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter className="flex gap-2 flex-wrap">
                                <Link href={`/admin/events/${event.id}/moderate`} passHref className="flex-1">
                                    <Button variant="outline" className="w-full flex items-center justify-center gap-2 cursor-pointer">
                                        <FaEye className="h-4 w-4" /> Moderar
                                    </Button>
                                </Link>
                                <Link href={`/admin/events/${event.id}/patterns`} passHref className="flex-1">
                                    <Button variant="outline" className="w-full flex items-center justify-center gap-2 cursor-pointer">
                                        <FaPuzzlePiece className="h-4 w-4" /> Patrones
                                    </Button>
                                </Link>
                                <Link href={`/admin/events/${event.id}/edit`} passHref className="flex-1">
                                    <Button variant="outline" className="w-full flex items-center justify-center gap-2 cursor-pointer">
                                        <FaEdit className="h-4 w-4" /> Editar
                                    </Button>
                                </Link>
                                <Button
                                    variant="outline"
                                    className="text-red-500 border-red-500 hover:bg-red-50 p-2 h-10 w-10 flex items-center justify-center cursor-pointer"
                                    onClick={() => handleDeleteEvent(event.id)}
                                >
                                    <FaTrash />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full bg-gray-100 dark:bg-gray-800 p-8 rounded-lg text-center">
                        <p className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-4">No hay eventos disponibles</p>
                        <p className="text-gray-500 mb-4">Crea tu primer evento para empezar</p>
                        <Button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white flex items-center gap-2 cursor-pointer"
                        >
                            <FaPlus className="h-4 w-4" /> Crear Evento
                        </Button>
                    </div>
                )}
            </div>

            {/* Create Event Modal */}
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <ResponsiveDialogContent className='max-w-[90vw] sm:max-w-[425px]'>
                    <ResponsiveDialogHeader>
                        <DialogTitle>Crear Nuevo Evento</DialogTitle>
                        <DialogDescription>
                            Completa los datos para crear un nuevo evento de bingo
                        </DialogDescription>
                    </ResponsiveDialogHeader>
                    <div className="grid 2xs:gap-2 xs:gap-3 gap-4 2xs:py-2 xs:py-3 py-4">
                        <div className="grid 2xs:gap-1 gap-2">
                            <Label htmlFor="name" className="2xs:text-xs">Nombre del Evento</Label>
                            <Input
                                id="name"
                                value={newEvent.name}
                                onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                                placeholder="Ej: Bingo Solidario"
                                className="2xs:text-xs 2xs:p-2"
                            />
                        </div>
                        <div className="grid 2xs:gap-1 gap-2">
                            <Label htmlFor="prize" className="2xs:text-xs">Premio (USD)</Label>
                            <Input
                                id="prize"
                                type="number"
                                value={newEvent.prize}
                                onChange={(e) => setNewEvent({ ...newEvent, prize: Number(e.target.value) })}
                                placeholder="Ej: 500"
                                className="2xs:text-xs 2xs:p-2"
                            />
                        </div>
                        <div className="grid 2xs:gap-1 gap-2">
                            <Label htmlFor="start_date" className="2xs:text-xs">Fecha y Hora de Inicio</Label>
                            <Input
                                id="start"
                                type="datetime-local"
                                value={newEvent.start}
                                onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
                                className="2xs:text-xs 2xs:p-2"
                            />
                        </div>
                        <div className="grid 2xs:gap-1 gap-2">
                            <Label htmlFor="end_date" className="2xs:text-xs">Fecha y Hora de Fin (opcional)</Label>
                            <Input
                                id="end"
                                type="datetime-local"
                                value={newEvent.end_date || ''}
                                onChange={(e) => setNewEvent({ ...newEvent, end_date: e.target.value })}
                                className="2xs:text-xs 2xs:p-2"
                            />
                        </div>
                        <div className="grid 2xs:gap-1 gap-2">
                            <Label htmlFor="description" className="2xs:text-xs">Descripción</Label>
                            <Textarea
                                id="description"
                                value={newEvent.description || ''}
                                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                                placeholder="Describe el evento..."
                                className="2xs:text-xs 2xs:p-2 2xs:min-h-[60px]"
                            />
                        </div>
                    </div>
                    <ResponsiveDialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}
                            className="2xs:text-xs 2xs:py-1 2xs:h-8">
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleCreateEvent}
                            className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white 2xs:text-xs 2xs:py-1 2xs:h-8"
                            disabled={!newEvent.name || newEvent.prize <= 0 || !newEvent.start}
                        >
                            Crear Evento
                        </Button>
                    </ResponsiveDialogFooter>
                </ResponsiveDialogContent>
            </Dialog>
        </div>
    );
}
