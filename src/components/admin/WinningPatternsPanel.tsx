'use client';

import { useState } from 'react';
import { useWinningPatterns, useCreateWinningPattern, useDeleteWinningPattern } from '@/hooks/api/useWinningPatterns';
import { Button } from '@/components/ui/button';
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
                <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-b from-white to-purple-200 bg-clip-text text-transparent drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]">Patrones de Ganancia</h2>
                <Button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700 text-white hover:shadow-[0_4px_20px_rgba(123,58,237,0.7)] border border-white/10 flex items-center gap-2"
                >
                    <FaPlus className="h-4 w-4" /> Crear Patrón
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {patterns && patterns.length > 0 ? (
                    patterns.map((pattern) => (
                        <div key={pattern.id} className="rounded-xl overflow-hidden backdrop-blur-md bg-black/30 border border-white/10 shadow-[0_0_15px_rgba(123,58,237,0.2)] relative">
                            {/* Decorative elements for glassmorphism effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-indigo-900/20 z-0"></div>

                            {/* Encabezado con gradiente */}
                            <div className="w-full relative z-10 bg-gradient-to-r from-purple-700 to-indigo-700 shadow-md p-4">
                                <div className="text-center">
                                    <h3 className="text-xl font-bold text-white">{pattern.name}</h3>
                                </div>
                            </div>

                            {/* Contenido */}
                            <div className="w-full p-4 bg-black/20 backdrop-blur-sm relative z-10">
                                <div className="mb-4">
                                    <div className="flex items-center justify-between text-xs text-gray-300 mb-2">
                                        <div className="flex items-center gap-2">
                                            <FaPuzzlePiece className="h-4 w-4 text-purple-300" />
                                            <span>Patrón de Bingo</span>
                                        </div>
                                        <Badge className={cn("bg-slate-500/40 text-white backdrop-blur-sm border border-slate-500/30", {
                                            'bg-green-500/40 text-green-200 border-green-500/30': pattern.is_active,
                                        })}>
                                            {pattern.is_active ? 'Activo' : 'Inactivo'}
                                        </Badge>
                                    </div>

                                    {pattern.description && (
                                        <div className="rounded-lg bg-white/5 py-2 px-4 backdrop-blur-sm border border-white/10 shadow-inner mb-3">
                                            <p className="text-sm text-gray-300 line-clamp-2">{pattern.description}</p>
                                        </div>
                                    )}

                                    <div className="rounded-lg bg-blue-900/20 py-2 px-4 backdrop-blur-sm flex flex-row justify-between items-center border border-blue-500/20 shadow-inner">
                                        <div className="flex items-center gap-2">
                                            <FaCheck className="h-4 w-4 text-blue-400" />
                                            <h4 className="text-blue-300 text-sm font-semibold">Celdas</h4>
                                        </div>
                                        <p className="text-sm font-bold text-blue-200">
                                            {pattern.positions?.length || 0}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-2 flex-wrap pt-3 border-t border-white/10">
                                    <Link href={`/admin/patterns/${pattern.id}/edit`} passHref className="flex-1">
                                        <Button variant="outline" className="w-full flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20">
                                            <FaEdit className="h-4 w-4" /> Editar
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="outline"
                                        className="bg-red-500/20 backdrop-blur-md text-red-200 border border-red-500/30 hover:bg-red-500/30 p-2 h-10 w-10 flex items-center justify-center"
                                        onClick={() => handleDeletePattern(pattern.id)}
                                    >
                                        <FaTrash />
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
                            <p className="text-xl font-medium text-white mb-4">No hay patrones disponibles</p>
                            <p className="text-gray-300 mb-4">Crea tu primer patrón para empezar</p>
                            <Button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700 text-white hover:shadow-[0_4px_20px_rgba(123,58,237,0.7)] border border-white/10 flex items-center gap-2"
                            >
                                <FaPlus className="h-4 w-4" /> Crear Patrón
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Create Pattern Modal */}
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <ResponsiveDialogContent className="hide-scrollbar bg-black/80 backdrop-blur-md border border-white/10 shadow-[0_0_30px_rgba(123,58,237,0.3)]">
                    <ResponsiveDialogHeader>
                        <DialogTitle className="bg-gradient-to-b from-white to-purple-200 bg-clip-text text-transparent drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]">Crear Nuevo Patrón</DialogTitle>
                        <DialogDescription className="text-gray-300">
                            Completa los datos para crear un nuevo patrón de ganancia
                        </DialogDescription>
                    </ResponsiveDialogHeader>
                    <div className="grid gap-3 py-2">
                        <div className="grid gap-2">
                            <Label htmlFor="name" className="text-gray-200">Nombre del Patrón</Label>
                            <Input
                                id="name"
                                value={newPattern.name}
                                onChange={(e) => setNewPattern({ ...newPattern, name: e.target.value })}
                                placeholder="Ej: Línea horizontal"
                                mobileFriendly
                                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description" className="text-gray-200">Descripción</Label>
                            <Textarea
                                id="description"
                                className="max-h-24 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                                value={newPattern.description}
                                onChange={(e) => setNewPattern({ ...newPattern, description: e.target.value })}
                                placeholder="Describe el patrón..."
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label className="text-gray-200">Selecciona las posiciones para tu patrón</Label>
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
                        <Button
                            variant="outline"
                            onClick={() => setIsCreateModalOpen(false)}
                            className="bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20"
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleCreatePattern}
                            className="bg-gradient-to-r from-purple-700 to-indigo-700 hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] border border-white/10 text-white"
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
