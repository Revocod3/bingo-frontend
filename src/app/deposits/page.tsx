'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/hooks/api/useUsers';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import TestCoinBadge from '@/components/TestCoinBadge';
import { FaArrowLeft, FaCoins, FaHistory, FaInfoCircle, FaDollarSign, FaCheck, FaTimes, FaClock } from 'react-icons/fa';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/src/components/ui/tooltip';
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
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#7C3AED]"></div>
            </div>
        );
    }

    // Helper function to get status badge for deposits
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return <Badge className="bg-green-100 text-green-800 flex items-center gap-1"><FaCheck size={10} /> Aprobado</Badge>;
            case 'rejected':
                return <Badge variant="destructive" className="flex items-center gap-1"><FaTimes size={10} /> Rechazado</Badge>;
            case 'pending':
            default:
                return <Badge variant="outline" className="flex items-center gap-1"><FaClock size={10} /> Pendiente</Badge>;
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
        <div className="container py-8 px-4 md:py-12 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Recargar saldo</h1>
                <Button variant="ghost" onClick={() => router.back()} className="hover:bg-accent hover:text-accent-foreground">
                    <FaArrowLeft className="mr-2 h-4 w-4" />
                    Volver
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {/* Balance Card */}
                <Card className='p-4 bg-gradient-to-l from-yellow-50 to-purple-100 border shadow-lg'>
                    <CardTitle className="text-sm text-gray-700">Saldo Actual</CardTitle>
                    <div className="flex justify-center flex-row items-center gap-2">
                        <TestCoinBadge />
                    </div>
                </Card>

                {/* Deposit Options */}
                <div>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xl">Selecciona un paquete</CardTitle>
                            <CardDescription>
                                Elige la cantidad de <strong>USD (Moneda de la plataforma)</strong> que deseas comprar, ten en cuenta que con 1 USD puedes comprar 5 cartones.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {depositOptions.map((option) => (
                                <div
                                    key={option.amount}
                                    className={`
                                        p-4 rounded-lg border cursor-pointer transition-all
                                        ${amount === option.amount
                                            ? 'border-indigo-500 bg-indigo-50 shadow-md'
                                            : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50'
                                        }
                                    `}
                                    onClick={() => setAmount(option.amount)}
                                >
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center">
                                            <FaCoins className="text-amber-500 mr-2" />
                                            <span className="font-bold">{option.label}</span>
                                        </div>
                                        <Badge variant="outline" className="bg-amber-50 text-amber-600">
                                            {option.price}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </CardContent>

                        <CardFooter className="flex flex-col space-y-4">
                            <div className="w-full bg-slate-50 p-4 rounded-lg border border-slate-200">
                                <div className="flex items-center mb-2">
                                    <FaInfoCircle className="text-blue-500 mr-2" />
                                    <h3 className="font-medium">Información de pago</h3>
                                </div>
                                <p className="text-sm text-gray-600 mb-4">
                                    Una vez inicialices el pago, tendras un maximo de <strong>2:00 horas</strong> para completar la transacción. De lo contrario, se cancelará automáticamente.
                                </p>
                                <div className="flex flex-col items-start justify-between">
                                    <div className="flex items-center flex-col sm:flex-row justify-between w-full mb-2">
                                        <span className="font-semibold">Total a pagar en dolares:</span>
                                        <span className="font-semibold text-indigo-600">
                                            ${amount.toFixed(2)} USD
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between flex-col sm:flex-row w-full">
                                        <span className="font-bold">Total a pagar en Bolívares:</span>
                                        <div className="flex flex-col sm:flex-row items-center gap-2">
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <span className="text-xs flex items-center mt-2 sm:mt-0 gap-2 font-thin text-mute-foreground text-gray-500">
                                                        <FaInfoCircle className="text-gray-400 sm:ml-2" />
                                                        ({vefRate.toFixed(2)} VEF/USD)
                                                    </span>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p className="text-sm line-clamp-4 text-center max-w-[300px]">
                                                        {'El tipo de cambio puede variar. Si oprimes el botón de "Completar Pago", se congelará el tipo de cambio actual por 2 horas.'}
                                                    </p>
                                                </TooltipContent>
                                            </Tooltip>
                                            <span className="font-bold text-indigo-600">
                                                ${(amount * vefRate).toFixed(2)} VEF
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Button
                                onClick={() => handleOpenRechargeModal(amount)}
                                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white cursor-pointer"
                            >
                                <FaDollarSign className="mr-2" />
                                Completar Pago
                            </Button>
                        </CardFooter>
                    </Card>
                </div>

                {/* Transaction History */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FaHistory />
                            Historial de Transacciones
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoadingDeposits ? (
                            <div className="flex justify-center py-4">
                                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#7C3AED]"></div>
                            </div>
                        ) : deposits && deposits.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b text-sm text-gray-500">
                                            <th className="text-left p-2">Fecha</th>
                                            <th className="text-left p-2">Monto</th>
                                            <th className="text-left p-2">Referencia</th>
                                            <th className="text-left p-2">Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {deposits.map((deposit) => (
                                            <tr key={deposit.id} className="border-b hover:bg-gray-50">
                                                <td className="p-2 text-sm">{formatDate(deposit.created_at)}</td>
                                                <td className="p-2 font-medium">${deposit.amount.toFixed(2)} USD</td>
                                                <td className="p-2 text-sm text-gray-600">{deposit.reference || 'N/A'}</td>
                                                <td className="p-2">{getStatusBadge(deposit.status)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <p>No hay transacciones recientes.</p>
                                <p className="text-sm mt-2">
                                    Las transacciones aparecerán aquí una vez que hayas realizado depósitos o compras.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Use the RechargeModal component */}
            <RechargeModal
                isOpen={isRechargeModalOpen}
                onClose={() => setIsRechargeModalOpen(false)}
                initialAmount={amount}
            />
        </div>
    );
}
