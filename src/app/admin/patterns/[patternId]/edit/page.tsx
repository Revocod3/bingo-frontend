'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    useWinningPattern,
    useUpdateWinningPattern
} from '@/hooks/api/useWinningPatterns';
import AdminRouteGuard from '@/components/AdminRouteGuard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import PatternEditor from '@/components/admin/PatternEditor';
import { FaArrowLeft, FaSave } from 'react-icons/fa';

export default function EditPatternPage() {
    const params = useParams<{ patternId: string }>();
    const patternId = params?.patternId;
    const router = useRouter();

    const { data: pattern, isLoading } = useWinningPattern(patternId ?? '')
    const updatePatternMutation = useUpdateWinningPattern(patternId ?? '');

    const [formData, setFormData] = useState({
        name: '',
        positions: [] as number[],
        is_active: true,
        display_name: ''
    });

    useEffect(() => {
        if (pattern) {
            setFormData({
                name: pattern.name,
                display_name: pattern.name,
                positions: pattern.positions,
                is_active: pattern.is_active
            });
        }
    }, [pattern]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updatePatternMutation.mutateAsync(formData);
            toast.success('Patrón actualizado correctamente');
            router.back();
        } catch (error) {
            toast.error('Error al actualizar el patrón');
            console.error('Error updating pattern:', error);
        }
    };

    const handlePositionToggle = (position: number) => {
        setFormData(prev => {
            const newPositions = [...prev.positions];

            if (newPositions.includes(position)) {
                return {
                    ...prev,
                    positions: newPositions.filter(p => p !== position)
                };
            } else {
                return {
                    ...prev,
                    positions: [...newPositions, position]
                };
            }
        });
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

    if (!pattern) {
        return (
            <AdminRouteGuard>
                <div className="container mx-auto py-16 px-4">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-4">Patrón no encontrado</h2>
                        <p className="text-gray-500 mb-6">El patrón que intentas editar no existe o ha sido eliminado.</p>
                        <Button asChild>
                            <Link href="/admin?tab=patterns">Volver al panel de patrones</Link>
                        </Button>
                    </div>
                </div>
            </AdminRouteGuard>
        );
    }

    return (
        <AdminRouteGuard>
            <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 mt-6">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className='text-gray-300 cursor-pointer'
                            onClick={() => router.push('/admin?tab=patterns')}
                        >
                            <FaArrowLeft className="h-4 w-4" />
                        </Button>
                        <h1 className="text-2xl font-bold">Editar Patrón</h1>
                    </div>

                    <Button
                        className="mt-4 md:mt-0 bg-[#7C3AED] hover:bg-[#6D28D9] text-white cursor-pointer"
                        onClick={handleSubmit}
                        disabled={updatePatternMutation.isPending}
                    >
                        <FaSave className="mr-2" />
                        {updatePatternMutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="border shadow-md">
                        <CardHeader>
                            <CardTitle>Información del Patrón</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nombre</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Nombre del patrón"
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <Label htmlFor="is_active" className="cursor-pointer">Activo</Label>
                                    <Switch
                                        id="is_active"
                                        checked={formData.is_active}
                                        onCheckedChange={(checked) =>
                                            setFormData({ ...formData, is_active: checked })
                                        }
                                    />
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    <Card className="border shadow-md">
                        <CardHeader>
                            <CardTitle>Editor Visual del Patrón</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <PatternEditor
                                selectedPositions={formData.positions}
                                onTogglePosition={handlePositionToggle}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminRouteGuard>
    );
}
