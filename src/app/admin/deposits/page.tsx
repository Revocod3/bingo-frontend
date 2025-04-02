'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAdminDeposits } from '@/hooks/api/useAdminDeposits';
import { FaArrowLeft } from 'react-icons/fa';
import { Spinner } from '@/components/ui/spinner';
import { AdminDepositActions } from '@/components/AdminDepositActions';
import { useCurrentUser } from '@/hooks/api/useUsers';
import { toast } from 'sonner';

export default function AdminDepositsPage() {
    const router = useRouter();
    const { data: user, isLoading: userLoading } = useCurrentUser();
    const { deposits, isLoading, refetch } = useAdminDeposits();
    const [selectedDepositId, setSelectedDepositId] = useState<string | null>(null);

    // Check if user is admin
    if (userLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spinner size="lg" />
            </div>
        );
    }

    // Redirect if not admin
    if (!userLoading && (!user || !user.is_staff)) {
        toast.error("No tienes permiso para acceder a esta página");
        router.push('/');
        return null;
    }

    const handleBackClick = () => {
        router.push('/admin');
    };

    return (
        <div className="container py-8 px-4 md:py-12 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <Button variant="ghost" onClick={handleBackClick} className="p-2">
                    <FaArrowLeft className="mr-2" />
                    Volver
                </Button>
                <h1 className="text-2xl font-bold">Gestión de Depósitos</h1>
            </div>

            <Card>
                <CardHeader className="pb-2">
                    <CardTitle>Depósitos Pendientes</CardTitle>
                    <CardDescription>
                        Gestiona las solicitudes de depósito pendientes de los usuarios
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center py-8 text-gray-500">
                            <Spinner />
                        </div>
                    ) : deposits && deposits.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left p-3">Usuario</th>
                                        <th className="text-left p-3">Fecha</th>
                                        <th className="text-left p-3">Monto</th>
                                        <th className="text-left p-3">Método</th>
                                        <th className="text-left p-3">Estado</th>
                                        <th className="text-right p-3">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {deposits.map((deposit) => (
                                        <tr key={deposit.id} className="border-b hover:bg-gray-50">
                                            {/* <td className="p-3">{typeof deposit.user === 'object' && deposit.user !== null && 'email' in deposit.user ? deposit.user.email : `User ID: ${deposit.user}`}</td> */}
                                            <td className="p-3">{new Date(deposit.created_at).toLocaleString()}</td>
                                            <td className="p-3">${deposit.amount.toFixed(2)} USD</td>
                                            <td className="p-3">{deposit.paymentMethod}</td>
                                            <td className="p-3">
                                                <Badge
                                                    variant={
                                                        deposit.status === 'pending' ? 'outline' :
                                                            deposit.status === 'approved' ? 'secondary' : 'destructive'
                                                    }
                                                >
                                                    {deposit.status === 'pending' ? 'Pendiente' :
                                                        deposit.status === 'approved' ? 'Aprobado' : 'Rechazado'}
                                                </Badge>
                                            </td>
                                            <td className="p-3 text-right">
                                                {deposit.status === 'pending' && (
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => setSelectedDepositId(deposit.id)}
                                                        >
                                                            Gestionar
                                                        </Button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <p>No hay depósitos pendientes en este momento.</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {selectedDepositId && (
                <AdminDepositActions
                    depositId={selectedDepositId}
                    onClose={() => setSelectedDepositId(null)}
                    onActionComplete={() => {
                        setSelectedDepositId(null);
                        refetch();
                    }}
                />
            )}
        </div>
    );
}
