'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useEvent, useUpdateEvent } from '@/hooks/api/useEvents';
import AdminRouteGuard from '@/components/AdminRouteGuard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import Link from 'next/link';

export default function EditEventPage() {
    const params = useParams<{ eventId: string }>();
    const eventId = params?.eventId || '';
    const router = useRouter();

    const { data: event, isLoading } = useEvent(eventId);
    const updateEventMutation = useUpdateEvent();

    const [formData, setFormData] = useState({
        name: '',
        prize: 0,
        description: '',
        start_date: '',
        end_date: ''
    });

    useEffect(() => {
        if (event) {
            setFormData({
                name: event.name,
                prize: event.prize,
                description: event.description || '',
                start_date: event.start_date
                    ? new Date(event.start_date).toISOString().slice(0, 16)
                    : new Date().toISOString().slice(0, 16),
                end_date: event.end_date
                    ? new Date(event.end_date).toISOString().slice(0, 16)
                    : ''
            });
        }
    }, [event]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await updateEventMutation.mutateAsync({
                id: eventId,
                data: {
                    name: formData.name,
                    prize: Number(formData.prize),
                    description: formData.description,
                    start: formData.start_date,
                    end: formData.end_date || undefined
                }
            });
            toast.success('Evento actualizado correctamente');
            router.push('/admin');
        } catch (error) {
            toast.error('Error al actualizar el evento');
            console.error('Error updating event:', error);
        }
    };

    if (isLoading) {
        return (
            <AdminRouteGuard>
                <div className="flex justify-center items-center min-h-screen">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#7C3AED]"></div>
                </div>
            </AdminRouteGuard>
        );
    }

    if (!event) {
        return (
            <AdminRouteGuard>
                <div className="container mx-auto py-24 px-4">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-4">Evento no encontrado 😢</h2>
                        <p className="text-gray-500">El evento que intentas editar no existe o ha sido eliminado.</p>
                        <Button className="mt-4" asChild>
                            <Link href="/admin">Volver al Panel de Administración</Link>
                        </Button>
                    </div>
                </div>
            </AdminRouteGuard>
        );
    }

    return (
        <AdminRouteGuard>
            <div className="container mx-auto py-8 px-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Editar Evento</h1>
                    <Link href="/admin" passHref>
                        <Button variant="ghost" className="flex items-center text-gray-300">
                            <FaArrowLeft size={14} /> Volver
                        </Button>
                    </Link>
                </div>

                <Card className="max-w-2xl mx-auto">
                    <form onSubmit={handleSubmit}>
                        <CardHeader>
                            <CardTitle>Editar Evento #{eventId}</CardTitle>
                            <CardDescription>
                                Modifica los datos del evento
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nombre del Evento</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Nombre del evento"
                                    required
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="prize">Premio (USD)</Label>
                                <Input
                                    id="prize"
                                    type="number"
                                    value={formData.prize}
                                    onChange={(e) => setFormData({ ...formData, prize: Number(e.target.value) })}
                                    placeholder="Monto del premio"
                                    required
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="start_date">Fecha y Hora de Inicio</Label>
                                <Input
                                    id="start_date"
                                    type="datetime-local"
                                    value={formData.start_date}
                                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description">Descripción</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description || ''}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Describe el evento..."
                                    rows={4}
                                />
                            </div>
                        </CardContent>

                        <CardFooter className="flex justify-between mt-4">
                            <Button type="button" variant="outline" onClick={() => router.push('/admin')}>
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white"
                                disabled={updateEventMutation.isPending}
                            >
                                <FaSave className="mr-2" />
                                {updateEventMutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </AdminRouteGuard>
    );
}
