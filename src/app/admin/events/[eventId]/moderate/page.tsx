'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useEvent, useUpdateEvent } from '@/hooks/api/useEvents';
import {
  useNumbersByEvent,
  usePostNumbersByEvent,
  useDeleteLastNumber,
  useResetEventNumbers,
} from '@/hooks/api/useNumbers';
import AdminRouteGuard from '@/components/AdminRouteGuard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FaArrowLeft, FaTrash, FaUndo, FaRandom, FaDice } from 'react-icons/fa';
import { toast } from 'sonner';
import { BingoNumber } from '@/src/lib/api/types';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function ModerateEventPage() {
  const params = useParams<{ eventId: string }>();
  const eventId = params?.eventId || '';

  const { data: event, isLoading: eventLoading } = useEvent(eventId);
  const { data: calledNumbersData, isLoading: numbersLoading } = useNumbersByEvent(eventId);
  const updateEvent = useUpdateEvent();

  const postNumberMutation = usePostNumbersByEvent(eventId);
  const deleteLastNumberMutation = useDeleteLastNumber(eventId);
  const resetEventNumbersMutation = useResetEventNumbers(eventId);

  const [calledNumbers, setCalledNumbers] = useState<number[]>([]);
  const [lastCalledNumber, setLastCalledNumber] = useState<number | null>(null);
  const [isLive, setIsLive] = useState<boolean>(false);

  // Estados para los modales de confirmación
  const [showDeleteLastModal, setShowDeleteLastModal] = useState(false);
  const [showResetAllModal, setShowResetAllModal] = useState(false);
  const [isAutoCallingActive, setIsAutoCallingActive] = useState(false);
  const [autoCallInterval, setAutoCallInterval] = useState<NodeJS.Timeout | null>(null);
  const [autoCallDelay, setAutoCallDelay] = useState(5000); // 5 segundos por defecto

  // Referencia para rastrear si el cambio de lastCalledNumber vino de un clic del usuario
  const isManualUpdate = useRef(false);

  // Columnas del bingo (B, I, N, G, O)
  const columns = ['B', 'I', 'N', 'G', 'O'];

  // Efecto para inicializar el estado 'is_live' cuando se carga el evento
  useEffect(() => {
    if (event) {
      setIsLive(event.is_live || false);
    }
  }, [event]);

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

  // Manejador para cambiar el estado 'is_live' del evento
  const handleLiveStatusChange = async (checked: boolean) => {
    try {
      setIsLive(checked);
      await updateEvent.mutateAsync({
        id: eventId,
        data: { is_live: checked },
      });

      toast.success(`El evento ahora está ${checked ? 'en línea' : 'fuera de línea'}`);
    } catch (error) {
      // Revertir el cambio en caso de error
      setIsLive(!checked);
      toast.error('Error al cambiar el estado del evento');
      console.error('Error updating event live status:', error);
    }
  };

  // Genera todos los números del bingo (B1-O75)
  const generateBingoNumbers = () => {
    const numbers: { letter: string; number: number }[] = [];

    columns.forEach((letter, columnIndex) => {
      const start = columnIndex * 15 + 1;
      const end = start + 14;

      for (let i = start; i <= end; i++) {
        numbers.push({
          letter,
          number: i,
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

  // Función para seleccionar un número aleatorio que no haya sido llamado
  const callRandomNumber = () => {
    // Si todos los números ya han sido llamados, mostrar mensaje
    if (calledNumbers.length >= 75) {
      toast.error('Ya se han llamado todos los números');
      return;
    }

    // Obtener números que aún no han sido llamados
    const availableNumbers = allBingoNumbers
      .map((item) => item.number)
      .filter((num) => !calledNumbers.includes(num));

    // Si hay números disponibles, elegir uno al azar
    if (availableNumbers.length > 0) {
      // Obtener índice aleatorio
      const randomIndex = Math.floor(Math.random() * availableNumbers.length);
      // Obtener número aleatorio
      const randomNumber = availableNumbers[randomIndex];

      // Llamar al número
      handleNumberClick(randomNumber);
    }
  };

  // Función para activar/desactivar el llamado automático de números
  const toggleAutoCalling = () => {
    if (isAutoCallingActive) {
      // Si está activo, desactivarlo
      if (autoCallInterval) {
        clearInterval(autoCallInterval);
        setAutoCallInterval(null);
      }
      setIsAutoCallingActive(false);
      toast.info('Llamado automático desactivado');
    } else {
      // Si está inactivo, activarlo
      // Llamar un número inmediatamente
      callRandomNumber();

      // Configurar intervalo para llamar números cada X segundos
      const interval = setInterval(() => {
        callRandomNumber();
      }, autoCallDelay);

      setAutoCallInterval(interval);
      setIsAutoCallingActive(true);
      toast.success(`Llamado automático activado (${autoCallDelay / 1000} segundos)`);
    }
  };

  // Limpiar intervalo al desmontar componente
  useEffect(() => {
    return () => {
      if (autoCallInterval) {
        clearInterval(autoCallInterval);
      }
    };
  }, [autoCallInterval]);

  if (eventLoading || numbersLoading) {
    return (
      <AdminRouteGuard>
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </AdminRouteGuard>
    );
  }

  if (!event) {
    return (
      <AdminRouteGuard>
        <div>
          <div className="container mx-auto py-8 px-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4 text-white">Evento no encontrado 😢</h2>
              <p className="text-gray-300 mb-4">
                El evento que intentas moderar no existe o ha sido eliminado.
              </p>
              <Button className="bg-gradient-to-r from-purple-700 to-indigo-700 hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] border border-white/10 text-white" asChild>
                <Link href="/admin">Volver al Panel de Administración</Link>
              </Button>
            </div>
          </div>
        </div>
      </AdminRouteGuard>
    );
  }

  return (
    <AdminRouteGuard>
      <div className="container mx-auto py-4 px-4 max-w-7xl">
        {/* Header - Mobile First */}
        <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:justify-between sm:items-center">
          <h1 className="text-xl font-bold text-white sm:text-2xl lg:text-3xl">
            Moderar: {event.name}
          </h1>
          <Link href="/admin" passHref>
            <Button
              variant="ghost"
              size="sm"
              className="self-start bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 transition-all sm:self-auto"
            >
              <FaArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
          </Link>
        </div>

        {/* Info Cards - Mobile First Grid */}
        <div className="grid grid-cols-1 gap-4 mb-6 lg:grid-cols-2">
          {/* Event Info Card */}
          <div className="rounded-2xl overflow-hidden backdrop-blur-md bg-black/30 border border-white/10 shadow-[0_0_15px_rgba(123,58,237,0.2)]">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-4">
              <h2 className="text-lg font-bold text-white">Información del Evento</h2>
            </div>
            <div className="p-4 space-y-4">
              {/* Live Status Toggle */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col">
                  <Label htmlFor="live-status" className="font-medium text-white">
                    Estado del evento
                  </Label>
                  <span className="text-xs text-gray-300">
                    Activar para poner el evento en línea
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="live-status"
                    checked={isLive}
                    onCheckedChange={handleLiveStatusChange}
                    disabled={updateEvent.isPending}
                  />
                  <span className={`text-sm font-medium ${isLive ? 'text-green-400' : 'text-gray-400'}`}>
                    {isLive ? 'En línea' : 'Fuera de línea'}
                  </span>
                </div>
              </div>

              {/* Event Details */}
              <div className="space-y-2">
                <p className="text-sm text-gray-300">
                  <strong className="text-white">Premio:</strong> ${event.prize}
                </p>
                <p className="text-sm text-gray-300">
                  <strong className="text-white">Fecha:</strong> {new Date(event.start ?? Date.now()).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-300">
                  <strong className="text-white">Números cantados:</strong> {calledNumbers.length}/75
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-amber-600/20 text-amber-400 border-amber-600/30 hover:bg-amber-600/30 text-xs"
                  onClick={() => setShowDeleteLastModal(true)}
                  disabled={calledNumbers.length === 0 || deleteLastNumberMutation.isPending}
                >
                  <FaUndo className="mr-2 h-3 w-3" />
                  Eliminar último
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-red-600/20 text-red-400 border-red-600/30 hover:bg-red-600/30 text-xs"
                  onClick={() => setShowResetAllModal(true)}
                  disabled={calledNumbers.length === 0 || resetEventNumbersMutation.isPending}
                >
                  <FaTrash className="mr-2 h-3 w-3" />
                  Resetear todos
                </Button>
              </div>
            </div>
          </div>

          {/* Last Called Number Card */}
          <div className="rounded-2xl overflow-hidden backdrop-blur-md bg-black/30 border border-white/10 shadow-[0_0_15px_rgba(123,58,237,0.2)]">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-4">
              <h2 className="text-lg font-bold text-white">Último Número Llamado</h2>
            </div>
            <div className="p-4 flex flex-col justify-center items-center min-h-[200px]">
              {lastCalledNumber ? (
                <div className="text-4xl font-bold text-center text-purple-400 mb-4 sm:text-5xl lg:text-6xl">
                  {lastCalledNumber}
                </div>
              ) : (
                <p className="text-sm text-gray-400 mb-4 text-center">
                  No se ha llamado ningún número aún
                </p>
              )}

              {/* Random/Auto Call Buttons */}
              <div className="flex flex-col gap-2 w-full sm:flex-row sm:justify-center">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-purple-700 to-indigo-700 hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] border border-white/10 text-white text-xs"
                  onClick={callRandomNumber}
                  disabled={calledNumbers.length >= 75 || postNumberMutation.isPending}
                >
                  <FaDice className="mr-2 h-3 w-3" />
                  Llamar Aleatorio
                </Button>
                <Button
                  size="sm"
                  className={`${isAutoCallingActive
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-gradient-to-r from-purple-700 to-indigo-700 hover:shadow-[0_0_15px_rgba(139,92,246,0.5)]'
                    } border border-white/10 text-white text-xs`}
                  onClick={toggleAutoCalling}
                  disabled={calledNumbers.length >= 75 || postNumberMutation.isPending}
                >
                  <FaRandom className="mr-2 h-3 w-3" />
                  {isAutoCallingActive ? 'Detener Auto' : 'Iniciar Auto'}
                </Button>
              </div>

              {/* Auto Call Interval Selector */}
              {isAutoCallingActive && (
                <div className="mt-3 flex flex-col gap-2 w-full sm:flex-row sm:items-center sm:justify-center">
                  <span className="text-xs text-gray-300">Intervalo:</span>
                  <select
                    className="text-xs bg-black/40 border border-white/20 rounded p-2 text-white"
                    value={autoCallDelay}
                    onChange={(e) => {
                      const newDelay = parseInt(e.target.value);
                      setAutoCallDelay(newDelay);

                      if (isAutoCallingActive) {
                        if (autoCallInterval) {
                          clearInterval(autoCallInterval);
                        }
                        const interval = setInterval(() => {
                          callRandomNumber();
                        }, newDelay);
                        setAutoCallInterval(interval);
                        toast.success(`Intervalo actualizado a ${newDelay / 1000} segundos`);
                      }
                    }}
                  >
                    <option value={3000}>3 segundos</option>
                    <option value={5000}>5 segundos</option>
                    <option value={10000}>10 segundos</option>
                    <option value={15000}>15 segundos</option>
                    <option value={30000}>30 segundos</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Numbers Grid */}
        <div className="rounded-2xl overflow-hidden backdrop-blur-md bg-black/30 border border-white/10 shadow-[0_0_15px_rgba(123,58,237,0.2)]">
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-4">
            <h2 className="text-lg font-bold text-white">Seleccionar Números</h2>
          </div>
          <div className="p-4">
            {/* Bingo Grid - Mobile First */}
            <div className="grid grid-cols-5 gap-2 mb-6 sm:gap-4">
              {columns.map((letter) => (
                <div key={letter} className="flex flex-col items-center">
                  <h3 className="text-lg font-bold mb-2 text-white sm:text-xl sm:mb-4">
                    {letter}
                  </h3>
                  <div className="flex flex-col gap-1 sm:gap-2">
                    {allBingoNumbers
                      .filter((item) => item.letter === letter)
                      .map((item) => (
                        <Button
                          key={item.number}
                          onClick={() => handleNumberClick(item.number)}
                          disabled={calledNumbers.includes(item.number)}
                          className={`
                              w-8 h-8 rounded-full text-xs font-bold p-0 sm:w-10 sm:h-10 sm:text-sm lg:w-12 lg:h-12 lg:text-base
                              ${calledNumbers.includes(item.number)
                              ? 'bg-purple-600/50 text-purple-200 cursor-not-allowed'
                              : 'bg-white/10 hover:bg-white/20 border-2 border-purple-400 text-purple-300 hover:text-white'
                            }
                            `}
                        >
                          {item.number}
                        </Button>
                      ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Called Numbers */}
            <div>
              <h3 className="text-lg font-bold mb-3 text-white sm:text-xl">
                Números Cantados
              </h3>
              <div className="flex flex-wrap gap-2">
                {calledNumbers.length > 0 ? (
                  calledNumbers.map((number, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-xs bg-purple-600/30 text-purple-200 rounded-full border border-purple-500/30 sm:text-sm"
                    >
                      {number}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-gray-400 italic">
                    Aún no se han llamado números
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation Modals */}
        <Dialog open={showDeleteLastModal} onOpenChange={setShowDeleteLastModal}>
          <DialogContent className="bg-black/90 backdrop-blur-md border border-white/10 text-white max-w-[90vw] sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-white">Confirmar eliminación</DialogTitle>
              <DialogDescription className="text-gray-300">
                ¿Estás seguro de que deseas eliminar el último número llamado? Esta acción no se puede deshacer.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteLastModal(false)}
                disabled={deleteLastNumberMutation.isPending}
                className="bg-white/10 text-white border-white/20 hover:bg-white/20 w-full sm:w-auto"
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteLastNumber}
                disabled={deleteLastNumberMutation.isPending}
                className="bg-red-600 hover:bg-red-700 w-full sm:w-auto"
              >
                {deleteLastNumberMutation.isPending ? 'Eliminando...' : 'Eliminar número'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showResetAllModal} onOpenChange={setShowResetAllModal}>
          <DialogContent className="bg-black/90 backdrop-blur-md border border-white/10 text-white max-w-[90vw] sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-white">Confirmar reseteo</DialogTitle>
              <DialogDescription className="text-gray-300">
                ¿Estás seguro de que deseas resetear todos los números cantados? Esta acción eliminará todos los números cantados y no se puede deshacer.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowResetAllModal(false)}
                disabled={resetEventNumbersMutation.isPending}
                className="bg-white/10 text-white border-white/20 hover:bg-white/20 w-full sm:w-auto"
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleResetAllNumbers}
                disabled={resetEventNumbersMutation.isPending}
                className="bg-red-600 hover:bg-red-700 w-full sm:w-auto"
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
