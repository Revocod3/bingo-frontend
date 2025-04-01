import React, { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FaCoins, FaMoneyBillWave, FaClipboard, FaCheck, FaBackspace, FaCreditCard, FaMobile, FaOtter, FaPaypal } from 'react-icons/fa';
import { useDepositRequest, useDepositConfirm } from '@/hooks/api/useTestCoins';
import { useActivePaymentMethods } from '@/hooks/api/usePaymentMethods';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface RechargeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const RechargeModal: React.FC<RechargeModalProps> = ({ isOpen, onClose }) => {
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

    // Add state for the active payment method
    const [activePaymentMethod, setActivePaymentMethod] = useState<string>('bank');

    // Map icon types to actual icon components
    const getIconComponent = (iconType: string): React.ReactNode => {
        console.log('Icon Type:', iconType);
        switch (iconType) {
            case 'Pago Movil':
                return <FaMobile className="text-purple-500" />;
            case 'Transferencia':
                return <FaMoneyBillWave className="text-green-500" />;
            case 'Otros':
                return <FaPaypal className="text-blue-500" />;
            case 'Nequi':
                return <FaCreditCard className="text-red-500" />;
            default:
                return <FaCoins className="text-yellow-400" />;
        }
    };

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
            await depositConfirm.mutateAsync({ uniqueCode, reference });
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
                <div className="w-full mb-4 flex justify-center border p-4 border-gray-300 pb-2 rounded-md">
                    <div className="text-5xl font-bold flex items-center">
                        <span className="text-gray-500 text-2xl">$</span>
                        <span>{amountStr || '0'}</span>
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
                        className="w-full h-14"
                    >
                        {isLoading ? 'Procesando...' : 'Continuar'}
                    </Button>
                </div>
            </div>
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px] text-gray-800">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FaCoins className="text-yellow-400" />
                        {currentStep === 1 && "Recargar Monedas USD"}
                        {currentStep === 2 && "Información de Pago"}
                        {currentStep === 3 && "Recarga Exitosa"}
                    </DialogTitle>
                    <DialogDescription>
                        {currentStep === 1 && "Ingresa el monto que deseas recargar en tu cuenta."}
                        {currentStep === 2 && "Completa tu pago usando esta información."}
                        {currentStep === 3 && "¡Tu recarga ha sido procesada exitosamente!"}
                    </DialogDescription>
                </DialogHeader>

                {error && (
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {currentStep === 1 && (
                    <div className="grid gap-4 py-4">
                        <Label className="text-center text-lg font-medium">
                            Monto a recargar
                        </Label>
                        {renderNumericKeypad()}
                    </div>
                )}

                {currentStep === 2 && (
                    <div className="grid gap-4 py-4">
                        <div className="bg-slate-100 p-4 rounded-md">
                            <div className="flex flex-col space-y-3 mb-4">
                                <div className="text-center">
                                    <Label className="text-sm text-gray-600:">Código Único</Label>
                                </div>

                                <div className="border border-[#7C3AED] bg-[#7C3AED]/10 rounded-lg p-2 shadow-md relative overflow-hidden">
                                    <div className="relative flex items-center justify-center">
                                        <code className="text-[#1E1B4B] text-xl font-mono font-bold tracking-wider">
                                            {uniqueCode}
                                        </code>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="ml-4 h-8 w-8 rounded-xl bg-[#7C3AED]/10 hover:bg-[#7C3AED]/30 text-[#1E1B4B] cursor-pointer"
                                            onClick={() => copyToClipboard(uniqueCode)}
                                            title="Copiar código único"
                                        >
                                            <FaClipboard />
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 text-sm">
                                <h4 className="font-semibold px-2">Métodos de Pago</h4>

                                {/* Replace custom tabs with Tabs component */}
                                <Tabs defaultValue="bank" value={activePaymentMethod} onValueChange={setActivePaymentMethod}>
                                    <TabsList className="w-full">
                                        {paymentMethods.map(method => (
                                            <TabsTrigger key={method.id} value={method.id ?? ''} className="flex items-center cursor-pointer">
                                                {method.icon}
                                                <span>{method.name}</span>
                                            </TabsTrigger>
                                        ))}
                                    </TabsList>

                                    {paymentMethods.map(method => (
                                        <TabsContent key={method.id} value={method.id ?? ''} className="mt-3">
                                            <p>{method.instructions}</p>
                                            <div className="font-mono bg-white p-3 rounded-lg space-y-2">
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
                                                                className="ml-2 h-6 w-6 rounded-full hover:bg-gray-100 p-1"
                                                                onClick={() => copyToClipboard(value)}
                                                                title={`Copiar ${key}`}
                                                            >
                                                                <FaClipboard className="h-3 w-3 text-gray-500" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <p>Monto a pagar: <b>${amountStr}</b></p>
                                            <p>Incluye el código único <b>{uniqueCode}</b> en el concepto de la transacción.</p>
                                        </TabsContent>
                                    ))}
                                </Tabs>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4 mt-2">
                            <Label htmlFor="reference" className="text-right">
                                Referencia
                            </Label>
                            <Input
                                id="reference"
                                className="col-span-3"
                                value={reference}
                                onChange={(e) => setReference(e.target.value)}
                                placeholder="Número de referencia de tu pago"
                            />
                        </div>

                        <div className="flex justify-end mt-4">
                            <Button
                                variant="outline"
                                onClick={() => setCurrentStep(1)}
                                className="mr-2"
                                disabled={isLoading}
                            >
                                Atrás
                            </Button>
                            <Button
                                onClick={handleSubmitReference}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Procesando...' : 'Confirmar Pago'}
                            </Button>
                        </div>
                    </div>
                )}

                {currentStep === 3 && (
                    <div className="grid gap-4 py-4">
                        <div className="bg-green-50 border border-green-200 rounded-md p-4 flex items-center gap-3">
                            <div className="bg-green-100 rounded-full p-2">
                                <FaCheck className="text-green-600" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-green-800">¡Recarga Exitosa!</h4>
                                <p className="text-green-700 text-sm">Tu recarga de ${amountStr} ha sido procesada correctamente.</p>
                            </div>
                        </div>

                        <p className="text-sm text-gray-500 mt-2">
                            Tu balance ha sido actualizado y ya puedes usar tus monedas para comprar cartones de bingo.
                        </p>

                        <div className="flex justify-end mt-4">
                            <Button onClick={handleClose}>
                                Cerrar
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog >
    );
};

export default RechargeModal;
