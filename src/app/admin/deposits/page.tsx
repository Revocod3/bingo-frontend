'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAdminDeposits } from '@/hooks/api/useAdminDeposits';
import { FaArrowLeft, FaUser, FaMoneyBill, FaCalendar, FaExchangeAlt, FaInfoCircle } from 'react-icons/fa';
import { Spinner } from '@/components/ui/spinner';
import { AdminDepositActions } from '@/components/AdminDepositActions';
import { useCurrentUser } from '@/hooks/api/useUsers';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

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

    // Helper to get user name or email
    const getUserIdentifier = (deposit: any) => {
        if (typeof deposit.user === 'object' && deposit.user !== null) {
            const { first_name, last_name, email } = deposit.user;
            if (first_name && last_name) {
                return `${first_name} ${last_name}`;
            }
            return email;
        }
        return `User ID: ${deposit.user}`;
    };

    // Helper to get payment method name
    const getPaymentMethod = (deposit: any) => {
        if (deposit.payment_method_details?.payment_method) {
            return deposit.payment_method_details.payment_method;
        }
        return 'Transferencia';
    };

    return (
        <div className="container py-8 px-4 md:py-12 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <Button variant="ghost" onClick={handleBackClick} className="hover:bg-accent hover:text-accent-foreground">
                    <FaArrowLeft className="mr-2 h-4 w-4" />
                    Volver
                </Button>
                <h1 className="text-2xl font-bold">Gestión de Depósitos</h1>
            </div>

            <Card className="border shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle>Depósitos Pendientes</CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Gestiona las solicitudes de depósito pendientes de los usuarios
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center py-8 text-muted-foreground">
                            <Spinner />
                        </div>
                    ) : deposits && deposits.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="text-left p-3 text-sm font-medium text-muted-foreground">Usuario</th>
                                        <th className="text-left p-3 text-sm font-medium text-muted-foreground">Fecha</th>
                                        <th className="text-left p-3 text-sm font-medium text-muted-foreground">Monto</th>
                                        <th className="text-left p-3 text-sm font-medium text-muted-foreground">Método</th>
                                        <th className="text-left p-3 text-sm font-medium text-muted-foreground">Referencia</th>
                                        <th className="text-left p-3 text-sm font-medium text-muted-foreground">Estado</th>
                                        <th className="text-right p-3 text-sm font-medium text-muted-foreground">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {deposits.map((deposit) => (
                                        <tr key={deposit.id} className="border-b border-border hover:bg-accent/5 transition-colors">
                                            <td className="p-3 text-foreground">{getUserIdentifier(deposit)}</td>
                                            <td className="p-3 text-foreground">{new Date(deposit.created_at).toLocaleString()}</td>
                                            <td className="p-3 text-foreground font-medium">${deposit.amount.toFixed(2)} USD</td>
                                            <td className="p-3 text-foreground">
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <span className="flex items-center gap-1 cursor-help">
                                                            {getPaymentMethod(deposit)}
                                                            <FaInfoCircle className="text-muted-foreground" size={14} />
                                                        </span>
                                                    </TooltipTrigger>
                                                    <TooltipContent className="max-w-xs bg-popover text-popover-foreground">
                                                        <div className="text-sm">
                                                            {deposit.payment_method_details?.details &&
                                                                Object.entries(deposit.payment_method_details.details).map(([key, value]) => (
                                                                    <div key={key} className="flex justify-between gap-2">
                                                                        <span className="font-medium">{key}:</span>
                                                                        <span>{value}</span>
                                                                    </div>
                                                                ))
                                                            }
                                                        </div>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </td>
                                            <td className="p-3 text-foreground">{deposit.reference || 'N/A'}</td>
                                            <td className="p-3">
                                                <Badge
                                                    variant={
                                                        deposit.status === 'pending' ? 'outline' :
                                                            deposit.status === 'approved' ? 'secondary' : 'destructive'
                                                    }
                                                >
                                                    {deposit.status_display ||
                                                        (deposit.status === 'pending' ? 'Pendiente' :
                                                            deposit.status === 'approved' ? 'Aprobado' : 'Rechazado')}
                                                </Badge>
                                            </td>
                                            <td className="p-3 text-right">
                                                {deposit.status === 'pending' && (
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="secondary"
                                                            onClick={() => setSelectedDepositId(deposit.id)}
                                                            className="text-xs"
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
                        <div className="text-center py-8 text-muted-foreground">
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
