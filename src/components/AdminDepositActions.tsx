'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useDepositDetails, useAdminDepositActions } from '@/hooks/api/useAdminDeposits';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import { FaCheck, FaTimes } from 'react-icons/fa';

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
            <div className="mt-4 p-3 bg-gray-50 rounded-md border">
                <h4 className="font-medium text-gray-700 mb-2">Detalles del método de pago:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(details).map(([key, value]) => (
                        <div key={key} className="contents">
                            <div className="font-medium text-gray-500">{key}:</div>
                            <div>{value}</div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Gestionar Depósito</DialogTitle>
                    <DialogDescription>
                        Revisar y gestionar la solicitud de depósito
                    </DialogDescription>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex justify-center py-4">
                        <Spinner />
                    </div>
                ) : deposit ? (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="font-medium text-gray-500">Usuario:</div>
                            <div>{typeof deposit.user === 'object' ? deposit.user.email : `ID: ${deposit.user}`}</div>

                            <div className="font-medium text-gray-500">Monto:</div>
                            <div>${deposit.amount.toFixed(2)} USD</div>

                            <div className="font-medium text-gray-500">Método de pago:</div>
                            <div>{deposit.payment_method_details?.payment_method || 'Transferencia'}</div>

                            <div className="font-medium text-gray-500">Referencia:</div>
                            <div>{deposit.reference || 'N/A'}</div>

                            <div className="font-medium text-gray-500">Código único:</div>
                            <div>{deposit.unique_code}</div>

                            <div className="font-medium text-gray-500">Fecha:</div>
                            <div>{new Date(deposit.created_at).toLocaleString()}</div>

                            <div className="font-medium text-gray-500">Estado:</div>
                            <div>{deposit.status_display || deposit.status}</div>
                        </div>

                        {renderPaymentMethodDetails()}

                        <div className="space-y-2">
                            <label htmlFor="adminNotes" className="text-sm font-medium">
                                Notas administrativas
                            </label>
                            <Textarea
                                id="adminNotes"
                                value={adminNotes}
                                onChange={(e) => setAdminNotes(e.target.value)}
                                placeholder="Agregar notas administrativas (opcional)"
                                className="min-h-[100px]"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-4 text-gray-500">
                        No se pudo cargar la información del depósito.
                    </div>
                )}

                <DialogFooter className="flex sm:justify-between">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isPending}
                    >
                        Cancelar
                    </Button>
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleReject}
                            disabled={isLoading || isPending || !deposit}
                            className="flex items-center gap-2"
                        >
                            {isPending ? <Spinner size="sm" /> : <FaTimes size={14} />}
                            Rechazar
                        </Button>
                        <Button
                            type="button"
                            onClick={handleApprove}
                            disabled={isLoading || isPending || !deposit}
                            className="flex items-center gap-2"
                        >
                            {isPending ? <Spinner size="sm" /> : <FaCheck size={14} />}
                            Aprobar
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
