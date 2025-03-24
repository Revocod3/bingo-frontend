'use client';

import { useState } from 'react';
import { useWinningPatterns, useCreateWinningPattern, useDeleteWinningPattern } from '@/hooks/api/useWinningPatterns';
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
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { toast } from 'sonner';
import Link from 'next/link';

export default function WinningPatternsPanel() {
    const { data: patterns, isLoading } = useWinningPatterns();
    const createPatternMutation = useCreateWinningPattern();
    const deletePatternMutation = useDeleteWinningPattern();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newPattern, setNewPattern] = useState({
        name: '',
        description: '',
        positions: [] as number[],
    });

    const handleCreatePattern = async () => {
        try {
            await createPatternMutation.mutateAsync(newPattern);
            toast.success('Patrón creado exitosamente');
            setIsCreateModalOpen(false);
            resetForm();
        } catch (error) {
            toast.error('Error al crear el patrón');
            console.error('Error creating pattern:', error);
        }
    };

    const handleDeletePattern = async (id: number) => {
        if (confirm('¿Estás seguro que deseas eliminar este patrón? Esta acción no se puede deshacer.')) {
            try {
                await deletePatternMutation.mutateAsync(id);
                toast.success('Patrón eliminado correctamente');
            } catch (error) {
                toast.error('Error al eliminar el patrón');
                console.error('Error deleting pattern:', error);
            }
        }
    };

    const resetForm = () => {
        setNewPattern({
            name: '',
            description: '',
            positions: [],
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
                <h2 className="text-2xl font-semibold">Patrones de Ganancia</h2>
                <Button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white"
                >
                    <FaPlus className="mr-2" /> Crear Patrón
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {patterns && patterns.map((pattern) => (
                    <Card key={pattern.id} className="border shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle>{pattern.name}</CardTitle>
                            <CardDescription>
                                {pattern.is_active ? 'Activo' : 'Inactivo'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-2 truncate">{pattern.description || 'Sin descripción'}</p>

                            {pattern.pattern && (
                                <div className="mt-4">
                                    <div className="grid grid-cols-5 gap-1 max-w-[150px] mx-auto">
                                        {pattern.pattern.flat().map((cell, idx) => {
                                            const isCenterCell = idx === 12; // Posición central (FREE)
                                            return (
                                                <div
                                                    key={idx}
                                                    className={`
                                                        aspect-square rounded-sm flex items-center justify-center text-[8px]
                                                        ${isCenterCell ? 'bg-amber-100 border border-amber-300' : ''}
                                                        ${cell && !isCenterCell ? 'bg-purple-200 border border-purple-400' : ''}
                                                        ${!cell ? 'bg-gray-100 border border-gray-200' : ''}
                                                    `}
                                                >
                                                    {isCenterCell && cell ? 'FREE' : ''}
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="mt-2 text-center">
                                        <span className="text-xs text-gray-500">
                                            {pattern.positions.length} posiciones
                                        </span>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="flex justify-between gap-2">
                            <Link href={`/admin/patterns/${pattern.id}/edit`} passHref style={{ flexGrow: 1 }}>
                                <Button variant="outline" className="w-full">
                                    <FaEdit className="mr-2" /> Editar
                                </Button>
                            </Link>
                            <Button
                                variant="outline"
                                className="text-red-500 border-red-500 hover:bg-red-50"
                                onClick={() => handleDeletePattern(pattern.id)}
                                style={{ flexGrow: 0 }}
                            >
                                <FaTrash />
                            </Button>
                        </CardFooter>
                    </Card>
                ))}

                {(!patterns || patterns.length === 0) && (
                    <div className="col-span-full bg-gray-100 dark:bg-gray-800 p-8 rounded-lg text-center">
                        <p className="text-xl font-medium text-gray-600 mb-4">No hay patrones disponibles</p>
                        <p className="text-gray-500 mb-4">Crea tu primer patrón para empezar</p>
                        <Button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white"
                        >
                            <FaPlus className="mr-2" /> Crear Patrón
                        </Button>
                    </div>
                )}
            </div>

            {/* Create Pattern Modal */}
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogContent className="sm:max-w-[500px] text-gray-800">
                    <DialogHeader>
                        <DialogTitle>Crear Nuevo Patrón</DialogTitle>
                        <DialogDescription>
                            Completa los datos para crear un nuevo patrón de ganancia
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nombre del Patrón</Label>
                            <Input
                                id="name"
                                value={newPattern.name}
                                onChange={(e) => setNewPattern({ ...newPattern, name: e.target.value })}
                                placeholder="Ej: Línea horizontal"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Descripción</Label>
                            <Textarea
                                id="description"
                                value={newPattern.description}
                                onChange={(e) => setNewPattern({ ...newPattern, description: e.target.value })}
                                placeholder="Describe el patrón..."
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="positions">Posiciones (separadas por coma)</Label>
                            <Input
                                id="positions"
                                value={newPattern.positions.join(',')}
                                onChange={(e) => {
                                    const positionsStr = e.target.value;
                                    const positions = positionsStr
                                        .split(',')
                                        .map(pos => parseInt(pos.trim()))
                                        .filter(pos => !isNaN(pos) && pos >= 0 && pos < 25);
                                    setNewPattern({ ...newPattern, positions });
                                }}
                                placeholder="Ej: 0,1,2,3,4"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleCreatePattern}
                            className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white"
                            disabled={!newPattern.name || newPattern.positions.length === 0}
                        >
                            Crear Patrón
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
