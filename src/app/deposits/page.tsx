'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/hooks/api/useUsers';
import { useTestCoinBalance } from '@/src/hooks/api/useTestCoins';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import TestCoinBadge from '@/components/TestCoinBadge';
import { FaArrowLeft, FaCreditCard, FaCoins, FaHistory, FaInfoCircle, FaCashRegister, FaDollarSign } from 'react-icons/fa';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/src/components/ui/tooltip';

// Mock function for adding test coins - this should be replaced with a real API call
const mockAddCoins = async (amount: number) => {
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            resolve();
        }, 1500);
    });
};

export default function DepositsPage() {
    const router = useRouter();
    const { isLoading } = useCurrentUser();
    const { refetch: refetchBalance } = useTestCoinBalance();
    const [amount, setAmount] = useState<number>(10);
    const [isPending, setIsPending] = useState(false);
    const tasaVEF = 100;

    // Mock deposit amounts
    const depositOptions = [
        { amount: 1, label: '1 USD', price: `${(1 * tasaVEF).toFixed(2)} VEF` },
        { amount: 5, label: '5 USD', price: `${(5 * tasaVEF).toFixed(2)} VEF` },
        { amount: 10, label: '10 USD', price: `${(10 * tasaVEF).toFixed(2)} VEF` },
        { amount: 100, label: '100 USD', price: `${(100 * tasaVEF).toFixed(2)} VEF` },

    ];

    const handleDeposit = async () => {
        try {
            setIsPending(true);
            await mockAddCoins(amount);
            await refetchBalance();
            toast.success(`¡Has añadido ${amount} USD a tu cuenta!`);
            setAmount(10);
        } catch (error) {
            toast.error('Ha ocurrido un error al procesar tu depósito');
            console.error(error);
        } finally {
            setIsPending(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#7C3AED]"></div>
            </div>
        );
    }

    return (
        <div className="container py-8 px-4 md:py-12 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Recargar saldo</h1>
                <Button
                    variant="outline"
                    onClick={() => router.back()}
                    className="gap-2 text-gray-600 cursor-pointer"
                >
                    <FaArrowLeft size={14} /> Volver
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {/* Balance Card */}
                <Card className='p-2 bg-gradient-to-r from-purple-200 to-purple-100 border gap-1 border-gray-200 shadow-xl'>
                    <CardTitle className="text-sm text-center">Saldo Actual</CardTitle>
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
                                            ? 'border-[#7C3AED] bg-purple-50 shadow-md'
                                            : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50/50'
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
                            <div className="w-full bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <div className="flex items-center mb-2">
                                    <FaInfoCircle className="text-blue-500 mr-2" />
                                    <h3 className="font-medium">Información de pago</h3>
                                </div>
                                <p className="text-sm text-gray-600 mb-4">
                                    Una vez inicialices el pago, tendras un maximo de <strong>2:00 horas</strong> para completar la transacción. De lo contrario, se cancelará automáticamente.
                                </p>
                                <div className="flex flex-col items-start justify-between">
                                    <div className="flex items-center justify-between w-full mb-2">
                                        <span className="font-semibold">Total a pagar en dolares:</span>
                                        <span className="font-semibold text-[#7C3AED]">
                                            ${amount.toFixed(2)} USD
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between w-full">
                                        <span className="font-bold">Total a pagar en Bolívares:</span>
                                        <div className="flex items-center gap-2">
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <span className="text-xs flex items-center gap-2 font-thin text-mute-foreground text-gray-500">
                                                        <FaInfoCircle className="text-gray-400 ml-2" />
                                                        ({tasaVEF} VEF/USD)
                                                    </span>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p className="text-sm line-clamp-4 text-center max-w-[300px]">
                                                        El tipo de cambio puede variar. Si oprimes el botón de "Completar Pago", se congelará el tipo de cambio actual por 2 horas.
                                                    </p>
                                                </TooltipContent>
                                            </Tooltip>
                                            <span className="font-bold text-[#7C3AED]">
                                                ${(amount * tasaVEF).toFixed(2)} VEF
                                            </span>
                                        </div>

                                    </div>
                                </div>
                            </div>

                            <Button
                                onClick={handleDeposit}
                                disabled={isPending}
                                className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white cursor-pointer"
                            >
                                <FaDollarSign />
                                {isPending ? 'Procesando...' : 'Completar Pago'}
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
                        <div className="text-center py-8 text-gray-500">
                            <p>No hay transacciones recientes.</p>
                            <p className="text-sm mt-2">
                                Las transacciones aparecerán aquí una vez que hayas realizado depósitos o compras.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
