'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/hooks/api/useUsers';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import TestCoinBadge from '@/components/TestCoinBadge';
import { FaArrowLeft, FaCoins, FaHistory, FaInfoCircle, FaDollarSign, FaCheck, FaTimes, FaClock } from 'react-icons/fa';
import RechargeModal from '@/components/RechargeModal';
import { useCurrentExchangeRates } from '@/hooks/api/useExchangeRates';
import { useMyDeposits } from '@/hooks/api/useTestCoins';

export default function DepositsPage() {
    const router = useRouter();
    const { isLoading } = useCurrentUser();
    const [amount, setAmount] = useState<number>(10);
    const [isRechargeModalOpen, setIsRechargeModalOpen] = useState(false);
    const { data: exchangeRates } = useCurrentExchangeRates();
    // Fetch user's deposit history
    const { data: deposits, isLoading: isLoadingDeposits } = useMyDeposits();

    // Calculate exchange rate from API or use fallback
    const getExchangeRate = (currency: string) => {
        if (!exchangeRates || !exchangeRates.rates) return 100; // Fallback rate
        return Object.entries(exchangeRates.rates).reduce((acc, [key, value]) => {
            if (key === currency) {
                return parseFloat(value);
            }
            return acc;
        }
            , 0);

    };

    const vefRate = getExchangeRate('VEF');

    // Deposit options with dynamic exchange rates
    const depositOptions = [
        { amount: 1, label: '1 USD', price: `${(1 * vefRate).toFixed(2)} VEF` },
        { amount: 5, label: '5 USD', price: `${(5 * vefRate).toFixed(2)} VEF` },
        { amount: 10, label: '10 USD', price: `${(10 * vefRate).toFixed(2)} VEF` },
        { amount: 100, label: '100 USD', price: `${(100 * vefRate).toFixed(2)} VEF` },
    ];

    // Open modal with pre-selected amount
    const handleOpenRechargeModal = (preselectedAmount?: number) => {
        if (preselectedAmount) {
            // The modal will use this amount if needed
            setAmount(preselectedAmount);
        }
        setIsRechargeModalOpen(true);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-900 via-black to-indigo-900">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    // Helper function to get status badge for deposits
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return <Badge className="bg-green-900/30 text-green-300 border border-green-700/30 flex items-center gap-1"><FaCheck size={10} /> Aprobado</Badge>;
            case 'rejected':
                return <Badge className="bg-red-900/30 text-red-300 border border-red-700/30 flex items-center gap-1"><FaTimes size={10} /> Rechazado</Badge>;
            case 'pending':
            default:
                return <Badge className="bg-yellow-900/30 text-yellow-300 border border-yellow-700/30 flex items-center gap-1"><FaClock size={10} /> Pendiente</Badge>;
        }
    };

    // Format date to a more readable format
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="">
            {/* Background decorative elements */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>

            <div className="container py-8 px-4 md:py-12 max-w-6xl mx-auto relative z-10">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-b from-white to-purple-200 bg-clip-text text-transparent drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]">
                        Recargar saldo
                    </h1>
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        className="bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 transition-all"
                    >
                        <FaArrowLeft className="mr-2 h-4 w-4" />
                        Volver
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {/* Balance Card */}
                    <div className="rounded-2xl overflow-hidden backdrop-blur-md bg-black/30 border border-white/10 shadow-[0_0_15px_rgba(123,58,237,0.2)] p-6 relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-indigo-900/20 z-0"></div>
                        <div className="relative z-10">
                            <h2 className="text-sm font-medium text-gray-300 mb-4">Saldo Actual</h2>
                            <div className="flex justify-center flex-row items-center gap-2">
                                <TestCoinBadge />
                            </div>
                        </div>
                    </div>
                    {/* Transaction History */}
                    <div className="rounded-2xl overflow-hidden backdrop-blur-md bg-black/30 border border-white/10 shadow-[0_0_15px_rgba(123,58,237,0.2)] relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-indigo-900/20 z-0"></div>

                        {/* Header with gradient */}
                        <div className="w-full relative z-10 bg-gradient-to-r from-purple-700 to-indigo-700 shadow-md p-6">
                            <div className="flex items-center gap-3">
                                <FaHistory className="text-white text-xl" />
                                <h2 className="text-xl font-bold text-white">Historial de Transacciones</h2>
                            </div>
                        </div>

                        <div className="p-6 relative z-10">
                            {isLoadingDeposits ? (
                                <div className="flex justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                                </div>
                            ) : deposits && deposits.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-white/10">
                                                <th className="text-left p-3 text-sm font-medium text-gray-300">Fecha</th>
                                                <th className="text-left p-3 text-sm font-medium text-gray-300">Monto</th>
                                                <th className="text-left p-3 text-sm font-medium text-gray-300">Referencia</th>
                                                <th className="text-left p-3 text-sm font-medium text-gray-300">Estado</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {deposits.map((deposit) => (
                                                <tr key={deposit.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                    <td className="p-3 text-sm text-gray-300">{formatDate(deposit.created_at)}</td>
                                                    <td className="p-3 font-medium text-white">${deposit.amount.toFixed(2)} USD</td>
                                                    <td className="p-3 text-sm text-gray-400">{deposit.reference || 'N/A'}</td>
                                                    <td className="p-3">{getStatusBadge(deposit.status)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-400">
                                    <FaHistory className="mx-auto mb-4 text-4xl text-gray-600" />
                                    <p className="text-lg mb-2">No hay transacciones recientes.</p>
                                    <p className="text-sm">
                                        Las transacciones aparecerán aquí una vez que hayas realizado depósitos o compras.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Use the RechargeModal component */}
                <RechargeModal
                    isOpen={isRechargeModalOpen}
                    onClose={() => setIsRechargeModalOpen(false)}
                    initialAmount={amount}
                />
            </div>
        </div>
    );
}
