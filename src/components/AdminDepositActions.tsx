'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogDescription,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useDepositDetails, useAdminDepositActions } from '@/hooks/api/useAdminDeposits';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { ResponsiveDialogContent, ResponsiveDialogFooter, ResponsiveDialogHeader } from './ui/responsive-dialog';

interface AdminDepositActionsProps {
    depositId: string;
    onClose: () => void;
    onActionComplete: () => void;
}

export function AdminDepositActions({
    depositId,
    onClose,
    onActionComplete,
}: AdminDepositActionsProps) {
    const [adminNotes, setAdminNotes] = useState('');
    const { deposit, isLoading } = useDepositDetails(depositId);
    const { approveDeposit, rejectDeposit, isPending } = useAdminDepositActions();

    const handleApprove = async () => {
        if (!deposit) return;

        try {
            await approveDeposit({
                depositId: deposit.id,
                adminNotes
            });
            toast.success('Depósito aprobado correctamente');
            onActionComplete();
        } catch (error) {
            console.error('Error approving deposit:', error);
            toast.error('Error al aprobar el depósito');
        }
    };

    const handleReject = async () => {
        if (!deposit) return;

        try {
            await rejectDeposit({
                depositId: deposit.id,
                adminNotes
            });
            toast.success('Depósito rechazado correctamente');
            onActionComplete();
        } catch (error) {
            console.error('Error rejecting deposit:', error);
            toast.error('Error al rechazar el depósito');
        }
    };

    const renderPaymentMethodDetails = () => {
        if (!deposit?.payment_method_details) return null;

        const { details } = deposit.payment_method_details;

        return (
            <div className="mt-4 p-3 rounded-lg backdrop-blur-md bg-black/30 border border-white/10">
                <h4 className="font-medium text-white mb-2">Detalles del método de pago:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(details).map(([key, value]) => (
                        <div key={key} className="contents text-xs md:text-sm">
                            <div className="font-medium text-gray-300">{key}:</div>
                            <div className="text-white">{value}</div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <ResponsiveDialogContent className="bg-black/90 backdrop-blur-md border border-white/10 text-white max-w-[90vw] sm:max-w-md">
                <ResponsiveDialogHeader>
                    <DialogTitle className="text-white">Gestionar Depósito</DialogTitle>
                    <DialogDescription className="text-gray-300">
                        Revisar y gestionar la solicitud de depósito
                    </DialogDescription>
                </ResponsiveDialogHeader>

                {isLoading ? (
                    <div className="flex justify-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                    </div>
                ) : deposit ? (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-2 text-xs md:text-sm">
                            <div className="font-medium text-gray-300">Usuario:</div>
                            <div className="text-white">{typeof deposit.user === 'object' ? deposit.user.email : `ID: ${deposit.user}`}</div>

                            <div className="font-medium text-gray-300">Monto:</div>
                            <div className="text-white">${deposit.amount.toFixed(2)} USD</div>

                            <div className="font-medium text-gray-300">Método de pago:</div>
                            <div className="text-white">{deposit.payment_method_details?.payment_method || 'Transferencia'}</div>

                            <div className="font-medium text-gray-300">Referencia:</div>
                            <div className="text-white">{deposit.reference || 'N/A'}</div>

                            <div className="font-medium text-gray-300">Código único:</div>
                            <div className="text-white">{deposit.unique_code}</div>

                            <div className="font-medium text-gray-300">Fecha:</div>
                            <div className="text-white">{new Date(deposit.created_at).toLocaleString()}</div>

                            <div className="font-medium text-gray-300">Estado:</div>
                            <div className="text-white">{deposit.status_display || deposit.status}</div>
                        </div>

                        {renderPaymentMethodDetails()}

                        <div className="space-y-2">
                            <label htmlFor="adminNotes" className="text-sm font-medium text-gray-300">
                                Notas administrativas
                            </label>
                            <Textarea
                                id="adminNotes"
                                value={adminNotes}
                                onChange={(e) => setAdminNotes(e.target.value)}
                                placeholder="Agregar notas administrativas (opcional)"
                                className="min-h-[100px] bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-4 text-gray-400">
                        No se pudo cargar la información del depósito.
                    </div>
                )}

                <ResponsiveDialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isPending}
                        className="bg-white/10 text-white border-white/20 hover:bg-white/20 w-full sm:w-auto"
                    >
                        Cancelar
                    </Button>
                    <div className="flex gap-2 sm:flex-row flex-col">
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleReject}
                            disabled={isLoading || isPending || !deposit}
                            className="flex items-center gap-2 w-full sm:w-auto bg-red-600 hover:bg-red-700"
                        >
                            {isPending ? <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div> : <FaTimes size={14} />}
                            Rechazar
                        </Button>
                        <Button
                            type="button"
                            onClick={handleApprove}
                            disabled={isLoading || isPending || !deposit}
                            className="flex items-center gap-2 w-full sm:w-auto bg-gradient-to-r from-purple-700 to-indigo-700 hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] border border-white/10 text-white"
                        >
                            {isPending ? <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div> : <FaCheck size={14} />}
                            Aprobar
                        </Button>
                    </div>
                </ResponsiveDialogFooter>
            </ResponsiveDialogContent>
        </Dialog>
    );
}
