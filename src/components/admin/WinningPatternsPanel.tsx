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
} from '@/components/ui/card';
import {
    Dialog,
    DialogTitle,
    DialogDescription
} from '@/components/ui/responsive-dialog';
import {
    ResponsiveDialogContent,
    ResponsiveDialogHeader,
    ResponsiveDialogFooter
} from '@/components/ui/responsive-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FaPlus, FaEdit, FaTrash, FaPuzzlePiece, FaCheck } from 'react-icons/fa';
import { toast } from 'sonner';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import PatternEditor from '@/components/admin/PatternEditor';

export default function WinningPatternsPanel() {
    const { data: patterns, isLoading } = useWinningPatterns();
    const createPatternMutation = useCreateWinningPattern();
    const deletePatternMutation = useDeleteWinningPattern();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newPattern, setNewPattern] = useState({
        name: '',
        description: '',
        positions: [] as number[],
        display_name: '', // Added display_name field
    });

    const handleCreatePattern = async () => {
        try {
            await createPatternMutation.mutateAsync({
                ...newPattern,
                display_name: newPattern.name,
            });
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
            display_name: '', // Making sure to reset display_name too
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
                <h2 className="text-xl md:text-2xl font-bold">Patrones de Ganancia</h2>
                <Button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white flex items-center gap-2"
                >
                    <FaPlus className="h-4 w-4" /> Crear Patrón
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {patterns && patterns.length > 0 ? (
                    patterns.map((pattern) => (
                        <Card key={pattern.id} className="overflow-hidden shadow-md hover:shadow-lg gap-4 transition-shadow pt-0 border-0 rounded-lg">
                            <div className="relative h-16 bg-gradient-to-r from-purple-700 to-indigo-700 rounded-t-lg opacity-80">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <h3 className="text-2xl font-bold text-white">{pattern.name}</h3>
                                </div>
                            </div>
                            <CardHeader>
                                <CardDescription>
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <FaPuzzlePiece className="h-4 w-4 text-muted-foreground" />
                                            <span>Patrón de Bingo</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <Badge className={cn("bg-slate-400 text-slate-200", {
                                                'bg-green-400 text-green-200': pattern.is_active,
                                            })}>
                                                {pattern.is_active ? 'Activo' : 'Inactivo'}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {pattern.description && (
                                    <div className="rounded-lg bg-gray-50 py-2 px-4 dark:bg-gray-800/50">
                                        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{pattern.description}</p>
                                    </div>
                                )}

                                <div className="rounded-lg bg-blue-50 py-1 px-4 dark:bg-blue-950/50 flex flex-row justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <FaCheck className="h-4 w-4 text-blue-500" />
                                        <h4 className="text-blue-600 text-sm font-semibold dark:text-blue-400">Celdas</h4>
                                    </div>
                                    <p className="text-sm font-bold text-blue-700">
                                        {pattern.positions?.length || 0}
                                    </p>
                                </div>
                            </CardContent>
                            <CardFooter className="flex gap-2 flex-wrap">
                                <Link href={`/admin/patterns/${pattern.id}/edit`} passHref className="flex-1">
                                    <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                                        <FaEdit className="h-4 w-4" /> Editar
                                    </Button>
                                </Link>
                                <Button
                                    variant="outline"
                                    className="text-red-500 border-red-500 hover:bg-red-50 p-2 h-10 w-10 flex items-center justify-center"
                                    onClick={() => handleDeletePattern(pattern.id)}
                                >
                                    <FaTrash />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full bg-gray-100 dark:bg-gray-800 p-8 rounded-lg text-center">
                        <p className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-4">No hay patrones disponibles</p>
                        <p className="text-gray-500 mb-4">Crea tu primer patrón para empezar</p>
                        <Button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white flex items-center gap-2"
                        >
                            <FaPlus className="h-4 w-4" /> Crear Patrón
                        </Button>
                    </div>
                )}
            </div>

            {/* Create Pattern Modal */}
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <ResponsiveDialogContent className="hide-scrollbar">
                    <ResponsiveDialogHeader>
                        <DialogTitle>Crear Nuevo Patrón</DialogTitle>
                        <DialogDescription>
                            Completa los datos para crear un nuevo patrón de ganancia
                        </DialogDescription>
                    </ResponsiveDialogHeader>
                    <div className="grid gap-3 py-2">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nombre del Patrón</Label>
                            <Input
                                id="name"
                                value={newPattern.name}
                                onChange={(e) => setNewPattern({ ...newPattern, name: e.target.value })}
                                placeholder="Ej: Línea horizontal"
                                mobileFriendly
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Descripción</Label>
                            <Textarea
                                id="description"
                                className="max-h-24"
                                value={newPattern.description}
                                onChange={(e) => setNewPattern({ ...newPattern, description: e.target.value })}
                                placeholder="Describe el patrón..."
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Selecciona las posiciones para tu patrón</Label>
                            <div className="max-w-full">
                                <PatternEditor
                                    selectedPositions={newPattern.positions}
                                    onTogglePosition={(position) => {
                                        const positions = [...newPattern.positions];
                                        const index = positions.indexOf(position);

                                        if (index === -1) {
                                            // Add position if not already selected
                                            positions.push(position);
                                        } else {
                                            // Remove position if already selected
                                            positions.splice(index, 1);
                                        }

                                        setNewPattern({ ...newPattern, positions });
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <ResponsiveDialogFooter>
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
                    </ResponsiveDialogFooter>
                </ResponsiveDialogContent>
            </Dialog>
        </div>
    );
}
