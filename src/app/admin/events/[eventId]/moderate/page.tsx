'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useEvent } from '@/hooks/api/useEvents';
import { useNumbersByEvent, usePostNumbersByEvent, useDeleteLastNumber, useResetEventNumbers } from '@/hooks/api/useNumbers';
import AdminRouteGuard from '@/components/AdminRouteGuard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FaArrowLeft, FaTrash, FaUndo } from 'react-icons/fa';
import { toast } from 'sonner';
import { BingoNumber } from '@/src/lib/api/types';

export default function ModerateEventPage() {
    const params = useParams<{ eventId: string }>();
    const eventId = params?.eventId || '';

    const { data: event, isLoading: eventLoading } = useEvent(eventId);
    const { data: calledNumbersData, isLoading: numbersLoading } = useNumbersByEvent(eventId);

    const postNumberMutation = usePostNumbersByEvent(eventId);
    const deleteLastNumberMutation = useDeleteLastNumber(eventId);
    const resetEventNumbersMutation = useResetEventNumbers(eventId);

    const [calledNumbers, setCalledNumbers] = useState<number[]>([]);
    const [lastCalledNumber, setLastCalledNumber] = useState<number | null>(null);

    // Estados para los modales de confirmación
    const [showDeleteLastModal, setShowDeleteLastModal] = useState(false);
    const [showResetAllModal, setShowResetAllModal] = useState(false);

    // Referencia para rastrear si el cambio de lastCalledNumber vino de un clic del usuario
    const isManualUpdate = useRef(false);

    // Columnas del bingo (B, I, N, G, O)
    const columns = ['B', 'I', 'N', 'G', 'O'];

    useEffect(() => {
        if (calledNumbersData) {
            // Extraer los valores de los números cantados
            const numberValues = calledNumbersData.map((num: BingoNumber) => num.value);
            setCalledNumbers(numberValues);

            // Solo actualizamos el último número desde la API si no hay una actualización manual en progreso
            if (!isManualUpdate.current && calledNumbersData.length > 0) {
                // Ordenar los números por fecha de creación (si está disponible) o por ID
                const sortedNumbers = [...calledNumbersData].sort((a, b) => {
                    // Intentar ordenar primero por created_at si existe
                    if (a.called_at && b.called_at) {
                        return new Date(a.called_at).getTime() - new Date(b.called_at).getTime();
                    }
                    // Si no hay created_at, intentar ordenar por id
                    if (a.id !== undefined && b.id !== undefined) {
                        return a.id - b.id;
                    }
                    // Si no hay forma confiable de ordenar, devolver sin cambios
                    return 0;
                });

                // El último número es el más reciente en el array ordenado
                const mostRecentNumber = sortedNumbers[sortedNumbers.length - 1].value;
                setLastCalledNumber(mostRecentNumber);
            }

            // Resetear la bandera después de procesar los datos
            isManualUpdate.current = false;
        }
    }, [calledNumbersData]);

    // Genera todos los números del bingo (B1-O75)
    const generateBingoNumbers = () => {
        const numbers: { letter: string, number: number }[] = [];

        columns.forEach((letter, columnIndex) => {
            const start = columnIndex * 15 + 1;
            const end = start + 14;

            for (let i = start; i <= end; i++) {
                numbers.push({
                    letter,
                    number: i
                });
            }
        });

        return numbers;
    };

    const allBingoNumbers = generateBingoNumbers();

    const handleNumberClick = async (number: number) => {
        try {
            // Verificar si el número ya ha sido llamado
            if (calledNumbers.includes(number)) {
                toast.error(`El número ${number} ya ha sido llamado`);
                return;
            }

            // Establecer que estamos haciendo una actualización manual
            isManualUpdate.current = true;

            // Actualizar inmediatamente el último número llamado para UI
            setLastCalledNumber(number);

            // Llamar a la API para seleccionar este número
            await postNumberMutation.mutateAsync(number);

            toast.success(`Número ${number} llamado exitosamente`);
        } catch (error) {
            // Si hay un error, reseteamos la bandera
            isManualUpdate.current = false;
            toast.error('Error al llamar el número');
            console.error('Error calling number:', error);
        }
    };

    const handleDeleteLastNumber = async () => {
        try {
            if (calledNumbers.length === 0) {
                toast.error('No hay números para eliminar');
                return;
            }

            await deleteLastNumberMutation.mutateAsync();

            toast.success('Último número eliminado correctamente');
            setShowDeleteLastModal(false);
        } catch (error) {
            toast.error('Error al eliminar el último número');
            console.error('Error deleting last number:', error);
        }
    };

    // Función para resetear todos los números del evento
    const handleResetAllNumbers = async () => {
        try {
            if (calledNumbers.length === 0) {
                toast.error('No hay números para resetear');
                return;
            }

            await resetEventNumbersMutation.mutateAsync();

            // Reset lastCalledNumber when all numbers are reset
            setLastCalledNumber(null);

            toast.success('Todos los números han sido reseteados');
            setShowResetAllModal(false);
        } catch (error) {
            toast.error('Error al resetear los números');
            console.error('Error resetting numbers:', error);
        }
    };

    if (eventLoading || numbersLoading) {
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
                <div className="container mx-auto py-8 sm:py-16 px-4">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-4">Evento no encontrado 😢</h2>
                        <p className="text-gray-500">El evento que intentas moderar no existe o ha sido eliminado.</p>
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
            <div className="container mx-auto pt-8 pb-8 px-2 sm:px-4 md:pt-12">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6">
                    <h1 className="text-xl sm:text-3xl font-bold mb-2 sm:mb-0">Moderar: {event.name}</h1>
                    <Link href="/admin" passHref>
                        <Button variant="outline" size="sm" className="gap-2 text-gray-600">
                            <FaArrowLeft size={14} /> Volver
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <Card>
                        <CardHeader className="py-2">
                            <CardTitle className="text-base sm:text-lg">Información del Evento</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <p className="text-sm sm:text-base"><strong>Premio:</strong> ${event.prize}</p>
                            <p className="text-sm sm:text-base">
                                <strong>Fecha:</strong> {new Date(event.start ?? Date.now()).toLocaleDateString()}
                            </p>
                            <p className="text-sm sm:text-base">
                                <strong>Números cantados:</strong> {calledNumbers.length}/75
                            </p>

                            {/* Botones para acciones de gestión de números */}
                            <div className="flex flex-wrap gap-2 mt-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-1 text-amber-600 border-amber-600 hover:bg-amber-50 text-xs sm:text-sm"
                                    onClick={() => setShowDeleteLastModal(true)}
                                    disabled={calledNumbers.length === 0 || deleteLastNumberMutation.isPending}
                                >
                                    <FaUndo size={12} /> Eliminar último
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-1 text-red-600 border-red-600 hover:bg-red-50 text-xs sm:text-sm"
                                    onClick={() => setShowResetAllModal(true)}
                                    disabled={calledNumbers.length === 0 || resetEventNumbersMutation.isPending}
                                >
                                    <FaTrash size={12} /> Resetear todos
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="py-3 sm:py-4">
                            <CardTitle className="text-base sm:text-lg">Último Número Llamado</CardTitle>
                        </CardHeader>
                        <CardContent className="flex justify-center items-center py-8">
                            {lastCalledNumber ? (
                                <div className="text-5xl sm:text-6xl font-bold text-center text-purple-600">
                                    {lastCalledNumber}
                                </div>
                            ) : (
                                <p className="text-sm sm:text-base text-gray-500">No se ha llamado ningún número aún</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <Card className="mt-4 sm:mt-6">
                    <CardHeader className="py-3 sm:py-4">
                        <CardTitle className="text-base sm:text-lg">Seleccionar Números</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-5 gap-1 sm:gap-4">
                            {columns.map((letter) => (
                                <div key={letter} className="flex flex-col items-center">
                                    <h3 className="text-base sm:text-xl font-bold mb-2 sm:mb-4">{letter}</h3>
                                    <div className="flex flex-col gap-1 sm:gap-2">
                                        {allBingoNumbers
                                            .filter(item => item.letter === letter)
                                            .map(item => (
                                                <Button
                                                    key={item.number}
                                                    onClick={() => handleNumberClick(item.number)}
                                                    disabled={calledNumbers.includes(item.number)}
                                                    className={`
                                                        w-8 h-8 sm:w-12 sm:h-12 rounded-full text-sm sm:text-lg font-bold p-0
                                                        ${calledNumbers.includes(item.number)
                                                            ? 'bg-purple-200 text-purple-800 cursor-not-allowed'
                                                            : 'bg-white hover:bg-purple-100 border-2 border-purple-600 text-purple-600'}
                                                    `}
                                                >
                                                    {item.number}
                                                </Button>
                                            ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 sm:mt-8">
                            <h3 className="text-base sm:text-xl font-bold mb-2 sm:mb-4">Números Cantados</h3>
                            <div className="flex flex-wrap gap-1 sm:gap-2">
                                {calledNumbers.length > 0 ? (
                                    calledNumbers.map((number, index) => (
                                        <span
                                            key={index}
                                            className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-purple-100 text-purple-800 rounded-full"
                                        >
                                            {number}
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-xs sm:text-sm text-gray-500 italic">Aún no se han llamado números</p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Modal de confirmación para eliminar último número */}
                <Dialog open={showDeleteLastModal} onOpenChange={setShowDeleteLastModal}>
                    <DialogContent className="sm:max-w-[425px] max-w-[90vw] text-gray-800">
                        <DialogHeader>
                            <DialogTitle>Confirmar eliminación</DialogTitle>
                            <DialogDescription>
                                ¿Estás seguro de que deseas eliminar el último número llamado?
                                Esta acción no se puede deshacer.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="flex flex-col-reverse sm:flex-row justify-end gap-2 mt-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowDeleteLastModal(false)}
                                disabled={deleteLastNumberMutation.isPending}
                                className="w-full sm:w-auto"
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={handleDeleteLastNumber}
                                disabled={deleteLastNumberMutation.isPending}
                                className="w-full sm:w-auto"
                            >
                                {deleteLastNumberMutation.isPending ? 'Eliminando...' : 'Eliminar número'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Modal de confirmación para resetear todos los números */}
                <Dialog open={showResetAllModal} onOpenChange={setShowResetAllModal}>
                    <DialogContent className="sm:max-w-[425px] max-w-[90vw] text-gray-800">
                        <DialogHeader>
                            <DialogTitle>Confirmar reseteo</DialogTitle>
                            <DialogDescription>
                                ¿Estás seguro de que deseas resetear todos los números cantados?
                                Esta acción eliminará todos los números cantados y no se puede deshacer.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="flex flex-col-reverse sm:flex-row justify-end gap-2 mt-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowResetAllModal(false)}
                                disabled={resetEventNumbersMutation.isPending}
                                className="w-full sm:w-auto"
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={handleResetAllNumbers}
                                disabled={resetEventNumbersMutation.isPending}
                                className="w-full sm:w-auto"
                            >
                                {resetEventNumbersMutation.isPending ? 'Reseteando...' : 'Resetear todos'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminRouteGuard>
    );
}
