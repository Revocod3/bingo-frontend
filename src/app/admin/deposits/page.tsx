'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAdminDeposits } from '@/hooks/api/useAdminDeposits';
import { FaArrowLeft, FaInfoCircle } from 'react-icons/fa';
import { AdminDepositActions } from '@/components/AdminDepositActions';
import { useCurrentUser } from '@/hooks/api/useUsers';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Deposit } from '@/src/lib/api/depositTypes';

export default function AdminDepositsPage() {
    const router = useRouter();
    const { data: user, isLoading: userLoading } = useCurrentUser();
    const { deposits, isLoading, refetch } = useAdminDeposits();
    const [selectedDepositId, setSelectedDepositId] = useState<string | null>(null);

    // Check if user is admin
    if (userLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
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
    const getUserIdentifier = (deposit: Deposit) => {
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
    const getPaymentMethod = (deposit: Deposit) => {
        if (deposit.payment_method_details?.payment_method) {
            return deposit.payment_method_details.payment_method;
        }
        return 'Transferencia';
    };

    return (
        <div className="container py-4 px-4 md:py-8 max-w-6xl mx-auto">
            <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:justify-between sm:items-center">
                <h1 className="text-xl font-bold text-white sm:text-2xl lg:text-3xl">
                    Gestión de Depósitos
                </h1>
                <Button
                    variant="ghost"
                    onClick={handleBackClick}
                    className="self-start bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 transition-all sm:self-auto"
                >
                    <FaArrowLeft className="mr-2 h-4 w-4" />
                    Volver
                </Button>
            </div>

            <div className="rounded-2xl overflow-hidden backdrop-blur-md bg-black/30 border border-white/10 shadow-[0_0_15px_rgba(123,58,237,0.2)]">
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-4 sm:p-6">
                    <h2 className="text-lg font-bold text-white sm:text-xl">
                        Depósitos Pendientes
                    </h2>
                    <p className="text-sm text-gray-200 mt-1">
                        Gestiona las solicitudes de depósito pendientes de los usuarios
                    </p>
                </div>

                <div className="p-4 sm:p-6">
                    {isLoading ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                        </div>
                    ) : deposits && deposits.length > 0 ? (
                        <div className="overflow-x-auto">
                            {/* Mobile Cards View */}
                            <div className="block md:hidden space-y-4">
                                {deposits.map((deposit) => (
                                    <div
                                        key={deposit.id}
                                        className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h3 className="font-medium text-white text-sm">
                                                    {getUserIdentifier(deposit)}
                                                </h3>
                                                <p className="text-xs text-gray-400">
                                                    {new Date(deposit.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <Badge
                                                className={
                                                    deposit.status === 'pending' ? 'bg-yellow-900/30 text-yellow-300 border border-yellow-700/30' :
                                                        deposit.status === 'approved' ? 'bg-green-900/30 text-green-300 border border-green-700/30' :
                                                            'bg-red-900/30 text-red-300 border border-red-700/30'
                                                }
                                            >
                                                {deposit.status_display ||
                                                    (deposit.status === 'pending' ? 'Pendiente' :
                                                        deposit.status === 'approved' ? 'Aprobado' : 'Rechazado')}
                                            </Badge>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 text-xs">
                                            <div>
                                                <p className="text-gray-400">Monto</p>
                                                <p className="font-medium text-white">${deposit.amount.toFixed(2)} USD</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400">Método</p>
                                                <p className="text-white">{getPaymentMethod(deposit)}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400">Referencia</p>
                                                <p className="text-white">{deposit.reference || 'N/A'}</p>
                                            </div>
                                            {deposit.status === 'pending' && (
                                                <div className="flex justify-end col-span-2 mt-2">
                                                    <Button
                                                        size="sm"
                                                        onClick={() => setSelectedDepositId(deposit.id)}
                                                        className="bg-gradient-to-r from-purple-700 to-indigo-700 hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] border border-white/10 text-white text-xs"
                                                    >
                                                        Gestionar
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Desktop Table View */}
                            <div className="hidden md:block">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="border-b border-white/10">
                                            <th className="text-left p-3 text-sm font-medium text-gray-300">Usuario</th>
                                            <th className="text-left p-3 text-sm font-medium text-gray-300">Fecha</th>
                                            <th className="text-left p-3 text-sm font-medium text-gray-300">Monto</th>
                                            <th className="text-left p-3 text-sm font-medium text-gray-300">Método</th>
                                            <th className="text-left p-3 text-sm font-medium text-gray-300">Referencia</th>
                                            <th className="text-left p-3 text-sm font-medium text-gray-300">Estado</th>
                                            <th className="text-right p-3 text-sm font-medium text-gray-300">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {deposits.map((deposit) => (
                                            <tr key={deposit.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                <td className="p-3 text-white text-sm">{getUserIdentifier(deposit)}</td>
                                                <td className="p-3 text-gray-300 text-sm">{new Date(deposit.created_at).toLocaleString()}</td>
                                                <td className="p-3 text-white font-medium text-sm">${deposit.amount.toFixed(2)} USD</td>
                                                <td className="p-3 text-white text-sm">
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <span className="flex items-center gap-1 cursor-help">
                                                                {getPaymentMethod(deposit)}
                                                                <FaInfoCircle className="text-gray-400" size={14} />
                                                            </span>
                                                        </TooltipTrigger>
                                                        <TooltipContent className="max-w-xs bg-black/90 text-white border border-white/20">
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
                                                <td className="p-3 text-gray-300 text-sm">{deposit.reference || 'N/A'}</td>
                                                <td className="p-3">
                                                    <Badge
                                                        className={
                                                            deposit.status === 'pending' ? 'bg-yellow-900/30 text-yellow-300 border border-yellow-700/30' :
                                                                deposit.status === 'approved' ? 'bg-green-900/30 text-green-300 border border-green-700/30' :
                                                                    'bg-red-900/30 text-red-300 border border-red-700/30'
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
                                                                onClick={() => setSelectedDepositId(deposit.id)}
                                                                className="bg-gradient-to-r from-purple-700 to-indigo-700 hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] border border-white/10 text-white text-xs"
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
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-400">
                            <p className="text-lg mb-2">No hay depósitos pendientes en este momento.</p>
                            <p className="text-sm">Los depósitos aparecerán aquí cuando los usuarios realicen solicitudes.</p>
                        </div>
                    )}
                </div>
            </div>

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
