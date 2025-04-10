import React, { useState, useMemo, useEffect } from 'react';
import { Dialog, ResponsiveDialogContent, ResponsiveDialogHeader, ResponsiveDialogFooter, DialogTitle, DialogDescription } from '@/components/ui/responsive-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FaCoins, FaMoneyBillWave, FaClipboard, FaCheck, FaBackspace, FaMobile, FaPaypal, FaInfoCircle } from 'react-icons/fa';
import { useDepositRequest, useDepositConfirm } from '@/hooks/api/useTestCoins';
import { useActivePaymentMethods } from '@/hooks/api/usePaymentMethods';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useCurrentExchangeRates } from '../hooks/api/useExchangeRates';

interface RechargeModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialAmount?: number;
}

const RechargeModal: React.FC<RechargeModalProps> = ({ isOpen, onClose, initialAmount }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [amountStr, setAmountStr] = useState<string>('');
    const [uniqueCode, setUniqueCode] = useState('');
    const [reference, setReference] = useState('');
    const [error, setError] = useState<string | null>(null);

    // Use the mutation hooks
    const depositRequest = useDepositRequest();
    const depositConfirm = useDepositConfirm();

    // Fetch payment methods from API
    const { data: apiPaymentMethods, isLoading: isLoadingPaymentMethods } = useActivePaymentMethods();

    // Fetch exchange rates
    const { data: exchangeRates } = useCurrentExchangeRates();

    // Set initial amount when provided and modal opens
    useEffect(() => {
        if (isOpen && initialAmount && initialAmount > 0) {
            setAmountStr(initialAmount.toString());
        }
    }, [isOpen, initialAmount]);

    // Add state for the active payment method
    const [activePaymentMethod, setActivePaymentMethod] = useState<string>(apiPaymentMethods?.[0]?.id || 'bank');

    // Map icon types to actual icon components
    const getIconComponent = (iconType: string): React.ReactNode => {
        switch (iconType) {
            case 'Pago Movil':
                return <FaMobile className="text-purple-500" />;
            case 'Transferencia':
                return <FaMoneyBillWave className="text-green-500" />;
            case 'Otros':
                return <FaPaypal className="text-blue-500" />;
            case 'Nequi':
                return <FaMobile className="text-red-500" />;
            default:
                return <FaCoins className="text-yellow-400" />;
        }
    };

    const localAmount = (amount: number, paymentMethod: string) => {
        // Convert the amount to the local currency based on the payment method

        const rates = Object.entries(exchangeRates?.rates || {});
        if (!rates.length) return amount;
        const rate = rates.find(([key]) => paymentMethod === 'Nequi' ? key === 'COP' : key === 'VEF');
        if (!rate) return amount;
        const [, rateValue] = rate;
        return (amount * Number(rateValue)).toFixed(2);
    }

    // Transform API payment methods to the format used by the component
    const paymentMethods = useMemo(() => {
        if (!apiPaymentMethods || isLoadingPaymentMethods) {
            return [{

                id: 'bank',
                name: 'Transferencia',
                icon: <FaMoneyBillWave className="text-green-500" />,
                instructions: 'Realiza la transferencia bancaria y proporciona el número de referencia.',
                details: {
                    'Banco': 'Cargando...',
                }
            }];
        }

        return apiPaymentMethods
            .map(method => ({
                id: method.id,
                name: method.payment_method,
                icon: getIconComponent(method.payment_method ?? ''),
                instructions: method.instructions,
                details: method.details
            }));
    }, [apiPaymentMethods, isLoadingPaymentMethods]);

    // Set default payment method when data loads
    React.useEffect(() => {
        if (paymentMethods.length > 0 && !activePaymentMethod) {
            setActivePaymentMethod(paymentMethods[0].id || 'default-id');
        }
    }, [paymentMethods, activePaymentMethod]);

    // Copy to clipboard function
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    // Reset the form when the modal is closed
    const handleClose = () => {
        setCurrentStep(1);
        setAmountStr('');
        setUniqueCode('');
        setReference('');
        setError(null);
        onClose();
    };

    // Handle numeric keypad input
    const handleKeypadPress = (digit: string) => {
        // Prevent adding more than 6 digits (reasonable max amount)
        if (amountStr.length >= 6) return;

        // Prevent multiple zeros at the beginning
        if (digit === '0' && amountStr === '0') return;

        // Replace single zero with the new digit
        if (amountStr === '0' && digit !== '0') {
            setAmountStr(digit);
            return;
        }

        setAmountStr(prev => prev + digit);
    };

    // Handle backspace
    const handleBackspace = () => {
        setAmountStr(prev => prev.slice(0, -1));
    };

    // Clear the amount
    const handleClear = () => {
        setAmountStr('');
    };

    // Handle step 1 submission (amount input)
    const handleSubmitAmount = async () => {
        const amount = Number(amountStr);

        if (!amount || amount <= 0) {
            setError('Por favor, ingresa un monto válido mayor a 0');
            return;
        }

        setError(null);

        try {
            const response = await depositRequest.mutateAsync(amount);
            setUniqueCode(response.unique_code);
            setCurrentStep(2);
        } catch (err) {
            setError('Error al solicitar la recarga. Por favor, intenta de nuevo.');
            console.error('Error requesting deposit:', err);
        }
    };

    // Handle step 2 submission (reference input)
    const handleSubmitReference = async () => {
        if (!reference) {
            setError('Por favor, ingresa el número de referencia');
            return;
        }

        setError(null);

        try {
            await depositConfirm.mutateAsync({
                uniqueCode,
                reference,
                paymentMethodId: activePaymentMethod
            });
            setCurrentStep(3);
        } catch (err) {
            setError('Error al confirmar la recarga. Verifica el número de referencia e intenta de nuevo.');
            console.error('Error confirming deposit:', err);
        }
    };

    // Use loading states from the mutation hooks
    const isLoading = depositRequest.isPending || depositConfirm.isPending;

    // Generate the numeric keypad
    const renderNumericKeypad = () => {
        const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

        return (
            <div className="mt-4">
                {/* MUI-style floating label for amount display */}
                <div className="relative mb-4">
                    <div className="border border-[#e5e7eb] bg-white rounded-lg py-3 px-4 shadow-sm relative group focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 hover:border-gray-400 transition-colors">
                        <label className="absolute text-xs font-medium text-gray-500 left-2 -top-2 bg-white px-1 transition-all">
                            Monto a recargar:
                        </label>
                        <div className="flex justify-center">
                            <div className="text-5xl font-bold flex items-center">
                                <span className="text-gray-500 text-2xl">$</span>
                                <span>{amountStr || '0'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                    {digits.map(digit => (
                        <Button
                            key={digit}
                            type="button"
                            variant="outline"
                            className={`h-14 text-xl font-semibold ${digit === '0' ? 'col-span-3' : ''}`}
                            onClick={() => handleKeypadPress(digit)}
                        >
                            {digit}
                        </Button>
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2">
                    <Button
                        type="button"
                        variant="outline"
                        className="h-14"
                        onClick={handleClear}
                    >
                        Limpiar
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        className="h-14"
                        onClick={handleBackspace}
                    >
                        <FaBackspace className="h-5 w-5" />
                    </Button>
                </div>

                <div className="mt-4">
                    <Button
                        onClick={handleSubmitAmount}
                        disabled={isLoading || !amountStr}
                        className="w-full h-14 bg-purple-600 hover:bg-purple-700 text-white"
                    >
                        {isLoading ? 'Procesando...' : 'Continuar'}
                    </Button>
                </div>
            </div>
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <ResponsiveDialogContent className="text-gray-800 bg-white rounded-xl shadow-md">
                <ResponsiveDialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl xs:text-lg font-medium">
                        {currentStep === 1 && "Recargar Monedas USD"}
                        {currentStep === 2 && "Información de Pago"}
                        {currentStep === 3 && "Solicitud de Recarga Exitosa"}
                        <FaCoins className="text-yellow-500" />
                    </DialogTitle>
                    <DialogDescription className="xs:text-xs">
                        {currentStep === 1 && "Ingresa el monto que deseas recargar en tu cuenta."}
                        {currentStep === 2 && "Completa tu pago usando esta información."}
                        {currentStep === 3 && "¡Tu recarga ha sido procesada exitosamente!"}
                    </DialogDescription>
                </ResponsiveDialogHeader>

                {error && (
                    <Alert variant="destructive">
                        <AlertDescription className="xs:text-xs">{error}</AlertDescription>
                    </Alert>
                )}

                {currentStep === 1 && (
                    <div className="grid gap-4">
                        {renderNumericKeypad()}
                    </div>
                )}

                {currentStep === 2 && (
                    <div className="grid gap-3">
                        <div className="bg-white rounded-md">
                            {/* Unique Code Section - MUI style floating label */}
                            <div className="mb-6 mt-2">
                                <div className="relative">
                                    <div className="border border-[#e5e7eb] bg-white rounded-lg p-3 pt-3 pb-3 shadow-sm relative group focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 hover:border-gray-400 transition-colors">
                                        <label className="absolute text-xs font-medium text-gray-500 left-2 -top-2 bg-white px-1 transition-all">
                                            Código Único:
                                        </label>
                                        <div className="flex items-center justify-between">
                                            <code className="text-[#111827] text-xl font-mono font-semibold tracking-wider">
                                                {uniqueCode}
                                            </code>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="ml-2 p-1 h-8 rounded-md bg-[#f3f4f6] hover:bg-[#e5e7eb] text-[#4b5563] cursor-pointer"
                                                onClick={() => copyToClipboard(uniqueCode)}
                                                title="Copiar"
                                            >
                                                <FaClipboard className="mr-1 h-3 w-3" /> Copiar
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Methods */}
                            <div className="space-y-3">
                                <h4 className="font-medium text-gray-700">Métodos de Pago</h4>

                                <Tabs defaultValue="bank" value={activePaymentMethod} onValueChange={setActivePaymentMethod}>
                                    <TabsList className="w-full bg-[#f9fafb] p-1 rounded-xl">
                                        {paymentMethods.map(method => (
                                            <TabsTrigger
                                                key={method.id}
                                                value={method.id ?? ''}
                                                className="flex items-center gap-2 text-sm py-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm cursor-pointer"
                                            >
                                                {method.icon}
                                                <span>{method.name}</span>
                                            </TabsTrigger>
                                        ))}
                                    </TabsList>

                                    {paymentMethods.map(method => (
                                        <TabsContent key={method.id} value={method.id ?? ''}>
                                            <p className="text-sm text-gray-600 mb-3">{method.instructions}</p>
                                            <div className="font-mono bg-[#f9fafb] p-4 rounded-xl space-y-3 shadow-sm border border-[#e5e7eb]">
                                                {Object.entries(method.details).map(([key, value]) => (
                                                    <div key={key} className="flex items-center justify-between">
                                                        <span className="font-medium text-gray-700">{key}:</span>
                                                        <div className="flex items-center">
                                                            {key === 'link' ? (
                                                                <a
                                                                    href={`https://${value}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-blue-600 hover:underline"
                                                                >
                                                                    WhatsApp
                                                                </a>
                                                            ) : (
                                                                <span className="text-gray-800">{value}</span>
                                                            )}
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="ml-2 h-6 w-6 rounded-full hover:bg-gray-200 p-1 cursor-pointer"
                                                                onClick={() => copyToClipboard(value)}
                                                                title={`Copiar ${key}`}
                                                            >
                                                                <FaClipboard className="h-3 w-3 text-gray-500 cursor-pointer" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="mt-3 text-sm">
                                                <div className="bg-[#f9fafb] p-3 rounded-lg border border-[#e5e7eb] mt-3">

                                                    <div className="relative mb-3">
                                                        <div className="border border-[#e5e7eb] bg-white rounded-lg p-3 shadow-sm relative group">
                                                            <label className="absolute text-xs font-medium text-gray-500 left-2 -top-2 bg-white px-1">
                                                                Monto a pagar:
                                                            </label>
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-lg font-bold text-purple-700">
                                                                    {localAmount(Number(amountStr), method.name as string)}
                                                                    {
                                                                        method.name === 'Nequi'
                                                                            ? ' COP'
                                                                            : ' VEF'
                                                                    }
                                                                </span>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="ml-2 p-1 h-8 rounded-md bg-[#f3f4f6] hover:bg-[#e5e7eb] text-[#4b5563] cursor-pointer"
                                                                    onClick={() => copyToClipboard(String(localAmount(Number(amountStr), method.name as string)))}
                                                                    title="Copiar monto"
                                                                >
                                                                    <FaClipboard className="mr-1 h-3 w-3" /> Copiar
                                                                </Button>
                                                            </div>
                                                            <p className="text-xs text-gray-600 mb-2 font-thin">Monto de la recarga: <span className="font-semibold">${amountStr} USD</span></p>
                                                        </div>
                                                    </div>

                                                    <p className="text-gray-600 text-xs rounded-lg p-2 bg-gradient-to-r from-yellow-100 to-yellow-50">
                                                        <FaInfoCircle className="inline-block mr-1" />
                                                        No olvides incluir el código único <span className="font-semibold">{uniqueCode}</span> en el concepto de la transacción.
                                                    </p>
                                                </div>
                                            </div>
                                        </TabsContent>
                                    ))}
                                </Tabs>
                            </div>
                        </div>

                        {/* Reference Input - also update to match MUI style */}
                        <div className="mt-2">
                            <div className="relative ">
                                <Input
                                    id="reference"
                                    className="w-full h-14 px-4 pt-2 rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                    value={reference}
                                    onChange={(e) => setReference(e.target.value)}
                                    placeholder=" "
                                />
                                <label
                                    htmlFor="reference"
                                    className="absolute text-xs font-medium text-gray-500 left-3 -top-2 bg-white px-1 transition-all pointer-events-none"
                                >
                                    Referencia de tu pago
                                </label>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 mt-4">
                            <Button
                                onClick={handleSubmitReference}
                                disabled={isLoading}
                                className="w-full h-14 bg-purple-600 hover:bg-purple-700 text-white cursor-pointer"
                            >
                                {isLoading ? 'Procesando...' : 'Confirmar Pago'}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setCurrentStep(1)}
                                className="w-full text-gray-600 border-gray-300 cursor-pointer hover:bg-gray-100"
                                disabled={isLoading}
                            >
                                Atrás
                            </Button>
                        </div>
                    </div>
                )}

                {currentStep === 3 && (
                    <div className="py-4 flex flex-col items-center">
                        <div className="mb-4 bg-green-50 p-4 rounded-full">
                            <FaCheck className="h-12 w-12 text-green-500" />
                        </div>
                        <h3 className="text-xl font-medium mb-2 text-center">
                            ¡Solicitud confirmada!
                        </h3>
                        <p className="text-gray-600 text-center mb-4">
                            Tu solicitud de recarga se ha enviado correctamente.
                            Recibirás los fondos en tu cuenta tan pronto como se verifique el pago.
                        </p>
                        <p className="text-gray-400 text-xs text-center mb-4">
                            Por lo general se verifica en minutos, pero hay casos que puede tardar hasta 24 horas.
                        </p>
                        <div className="w-full bg-gray-50 p-4 rounded-lg">
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-600">Monto:</span>
                                <span className="font-medium">${amountStr} USD</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-600">Referencia:</span>
                                <span className="font-medium">{reference}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Método de pago:</span>
                                <span className="font-medium">
                                    {paymentMethods.find(m => m.id === activePaymentMethod)?.name || 'Transferencia'}
                                </span>
                            </div>
                        </div>
                        <ResponsiveDialogFooter>
                            <Button
                                onClick={handleClose}
                                className="w-full xs:h-10 sm:h-14 mt-4 bg-purple-600 hover:bg-purple-700 text-white cursor-pointer"
                            >
                                Cerrar
                            </Button>
                        </ResponsiveDialogFooter>
                    </div>
                )}
            </ResponsiveDialogContent>
        </Dialog>
    );
};

export default RechargeModal;
