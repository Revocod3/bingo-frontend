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
    CardTitle
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
import { FaPlus, FaEdit, FaTrash, FaEye, FaPuzzlePiece } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import Link from 'next/link';
import { CreateEventRequest } from '@/lib/api/types';

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
            <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#7C3AED]"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Listado de Eventos</h2>
                <Button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white"
                >
                    <FaPlus className="mr-2" /> Crear Evento
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events && events.map((event) => (
                    <Card key={event.id} className="border shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle>{event.name}</CardTitle>
                            <CardDescription>
                                {event.start ? (
                                    <>Inicia {formatDistanceToNow(new Date(event.start), { addSuffix: true })}</>
                                ) : (
                                    'Fecha no establecida'
                                )}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-2 truncate">{event.description || 'Sin descripción'}</p>
                            <div className="flex justify-between items-center text-sm font-medium">
                                <span>Premio:</span>
                                <span>${event.prize}</span>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between gap-2 flex-wrap">
                            <Link href={`/admin/events/${event.id}/moderate`} passHref style={{ flexGrow: 1 }}>
                                <Button variant="outline" className="w-full">
                                    <FaEye className="mr-2" /> Moderar
                                </Button>
                            </Link>
                            <Link href={`/admin/events/${event.id}/patterns`} passHref style={{ flexGrow: 1 }}>
                                <Button variant="outline" className="w-full">
                                    <FaPuzzlePiece className="mr-2" /> Patrones
                                </Button>
                            </Link>
                            <Link href={`/admin/events/${event.id}/edit`} passHref style={{ flexGrow: 1 }}>
                                <Button variant="outline" className="w-full">
                                    <FaEdit className="mr-2" /> Editar
                                </Button>
                            </Link>
                            <Button
                                variant="outline"
                                className="text-red-500 border-red-500 hover:bg-red-50"
                                onClick={() => handleDeleteEvent(event.id)}
                                style={{ flexGrow: 0 }}
                            >
                                <FaTrash />
                            </Button>
                        </CardFooter>
                    </Card>
                ))}

                {(!events || events.length === 0) && (
                    <div className="col-span-full bg-gray-100 dark:bg-gray-800 p-8 rounded-lg text-center">
                        <p className="text-xl font-medium text-gray-600 mb-4">No hay eventos disponibles</p>
                        <p className="text-gray-500 mb-4">Crea tu primer evento para empezar</p>
                        <Button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white"
                        >
                            <FaPlus className="mr-2" /> Crear Evento
                        </Button>
                    </div>
                )}
            </div>

            {/* Create Event Modal */}
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogContent className="sm:max-w-[500px] text-gray-800">
                    <DialogHeader>
                        <DialogTitle>Crear Nuevo Evento</DialogTitle>
                        <DialogDescription>
                            Completa los datos para crear un nuevo evento de bingo
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nombre del Evento</Label>
                            <Input
                                id="name"
                                value={newEvent.name}
                                onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                                placeholder="Ej: Bingo Solidario"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="prize">Premio (USD)</Label>
                            <Input
                                id="prize"
                                type="number"
                                value={newEvent.prize}
                                onChange={(e) => setNewEvent({ ...newEvent, prize: Number(e.target.value) })}
                                placeholder="Ej: 500"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="start_date">Fecha y Hora de Inicio</Label>
                            <Input
                                id="start"
                                type="datetime-local"
                                value={newEvent.start}
                                onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="end_date">Fecha y Hora de Fin (opcional)</Label>
                            <Input
                                id="end"
                                type="datetime-local"
                                value={newEvent.end_date || ''}
                                onChange={(e) => setNewEvent({ ...newEvent, end_date: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Descripción</Label>
                            <Textarea
                                id="description"
                                value={newEvent.description || ''}
                                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                                placeholder="Describe el evento..."
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleCreateEvent}
                            className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white"
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
