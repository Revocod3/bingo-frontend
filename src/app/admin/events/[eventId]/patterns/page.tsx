'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEvent } from '@/hooks/api/useEvents';
import { useWinningPatterns, useEventPatterns, useSetEventPatterns } from '@/hooks/api/useWinningPatterns';
import AdminRouteGuard from '@/components/AdminRouteGuard';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { FaArrowLeft, FaSave } from 'react-icons/fa';

export default function EventPatternsPage() {
    const params = useParams<{ eventId: string }>();
    const eventId = params?.eventId || '';
    const router = useRouter();

    const { data: event, isLoading: eventLoading } = useEvent(eventId);
    const { data: allPatterns, isLoading: patternsLoading } = useWinningPatterns();
    const { data: eventPatterns, isLoading: eventPatternsLoading } = useEventPatterns(eventId);
    const setEventPatternsMutation = useSetEventPatterns(eventId);

    const [selectedPatterns, setSelectedPatterns] = useState<number[]>([]);

    useEffect(() => {
        if (eventPatterns) {
            setSelectedPatterns(eventPatterns.map(pattern => pattern.id));
        }
    }, [eventPatterns]);

    const handlePatternToggle = (patternId: number) => {
        setSelectedPatterns(prev => {
            if (prev.includes(patternId)) {
                return prev.filter(id => id !== patternId);
            } else {
                return [...prev, patternId];
            }
        });
    };

    const handleSavePatterns = async () => {
        try {
            await setEventPatternsMutation.mutateAsync(selectedPatterns);
            toast.success('Patrones del evento actualizados correctamente');
        } catch (error) {
            toast.error('Error al actualizar los patrones del evento');
            console.error('Error updating event patterns:', error);
        }
    };

    if (eventLoading || patternsLoading || eventPatternsLoading) {
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
                <div className="container mx-auto py-16 px-4">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-4">Evento no encontrado</h2>
                        <p className="text-gray-500 mb-6">El evento que intentas configurar no existe o ha sido eliminado.</p>
                        <Button asChild>
                            <Link href="/admin">Volver al panel de administración</Link>
                        </Button>
                    </div>
                </div>
            </AdminRouteGuard>
        );
    }

    return (
        <AdminRouteGuard>
            <div className="container mx-auto py-16 px-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => router.push('/admin')}
                        >
                            <FaArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold">Patrones de Ganancia</h1>
                            <p className="text-gray-500">
                                {event.name}
                            </p>
                        </div>
                    </div>

                    <Button
                        className="mt-4 md:mt-0 bg-[#7C3AED] hover:bg-[#6D28D9] text-white"
                        onClick={handleSavePatterns}
                        disabled={setEventPatternsMutation.isPending}
                    >
                        <FaSave className="mr-2" />
                        {setEventPatternsMutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
                    </Button>
                </div>

                <Card className="border shadow-md">
                    <CardHeader>
                        <CardTitle>Selecciona los patrones para este evento</CardTitle>
                        <CardDescription>
                            Los jugadores podrán ganar cuando completen uno de estos patrones en sus cartones
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {allPatterns && allPatterns.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {allPatterns.filter(pattern => pattern.is_active).map((pattern) => (
                                    <div
                                        key={pattern.id}
                                        className={`
                                            border rounded-lg p-4 cursor-pointer 
                                            ${selectedPatterns.includes(pattern.id)
                                                ? 'border-purple-400 bg-purple-50'
                                                : 'border-gray-200 hover:bg-gray-50'
                                            }
                                        `}
                                        onClick={() => handlePatternToggle(pattern.id)}
                                    >
                                        <div className="flex items-start gap-3">
                                            <Checkbox
                                                checked={selectedPatterns.includes(pattern.id)}
                                                onCheckedChange={() => handlePatternToggle(pattern.id)}
                                            />
                                            <div>
                                                <h3 className="font-medium">{pattern.name}</h3>
                                                <p className="text-sm text-gray-500">{pattern.description || 'Sin descripción'}</p>

                                                {pattern.pattern && (
                                                    <div className="grid grid-cols-5 gap-1 mt-3 max-w-[100px]">
                                                        {pattern.pattern.flat().map((cell, idx) => (
                                                            <div
                                                                key={idx}
                                                                className={`
                                                                    aspect-square rounded-sm
                                                                    ${idx === 12 ? 'bg-amber-100' : ''}
                                                                    ${cell && idx !== 12 ? 'bg-purple-200' : ''}
                                                                    ${!cell ? 'bg-gray-100' : ''}
                                                                `}
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-500 mb-4">No hay patrones disponibles</p>
                                <Button asChild>
                                    <Link href="/admin?tab=patterns">Crear patrones</Link>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {selectedPatterns.length > 0 && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h3 className="font-medium mb-2">Patrones seleccionados: {selectedPatterns.length}</h3>
                        <p className="text-sm text-gray-600">
                            Has seleccionado {selectedPatterns.length} {selectedPatterns.length === 1 ? 'patrón' : 'patrones'} para este evento.
                            Los jugadores podrán ganar completando cualquiera de estos patrones.
                        </p>
                    </div>
                )}
            </div>
        </AdminRouteGuard>
    );
}
