'use client';

import { useState } from 'react';
import { useEvents } from '@/hooks/api/useEvents';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    useGenerateBulkCards,
    useDownloadCardsPdf,
    useEmailCards,
    useListTransactions,
    useDownloadTransactionCards
} from '@/hooks/api/useSellerCards';
import { FaSpinner, FaFileDownload, FaEnvelope, FaIdCard, FaHistory } from 'react-icons/fa';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BingoCard } from '@/src/lib/api/types';
import CardPreview from './CardPreview';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import TestCoinBadge from '../TestCoinBadge';
import { useQueryClient } from '@tanstack/react-query';

export default function SellerDashboard() {
    const { data: events, isLoading: isLoadingEvents } = useEvents();
    const [selectedEventId, setSelectedEventId] = useState<string>('');
    const [cardQuantity, setCardQuantity] = useState<number>(5);
    const [generatedCards, setGeneratedCards] = useState<BingoCard[]>([]);
    const [recipientEmail, setRecipientEmail] = useState<string>('');
    const [emailSubject, setEmailSubject] = useState<string>('');
    const [emailMessage, setEmailMessage] = useState<string>('');
    const [activeTab, setActiveTab] = useState<string>('generate');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const generateCardsMutation = useGenerateBulkCards();
    const downloadPdfMutation = useDownloadCardsPdf();
    const emailCardsMutation = useEmailCards();
    const { data: transactions, isLoading: isLoadingTransactions } = useListTransactions();
    const downloadTransactionCardsMutation = useDownloadTransactionCards();

    const queryClient = useQueryClient();

    const handleGenerateCards = async () => {
        if (!selectedEventId) {
            setError('Por favor, selecciona un evento');
            return;
        }

        if (cardQuantity < 1 || cardQuantity > 100) {
            setError('La cantidad debe estar entre 1 y 100 cartones');
            return;
        }

        setError(null);
        setSuccess(null);

        try {
            const response = await generateCardsMutation.mutateAsync({
                event_id: selectedEventId,
                quantity: cardQuantity
            });

            setGeneratedCards(response.cards);
            setSuccess(`Se han generado ${response.cards.length} cartones exitosamente con ID de transacción: ${response.transaction_id}`);
            setActiveTab('download');

            queryClient.invalidateQueries({ queryKey: ['testCoinBalance'] });
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message.includes('Insufficient') ? 'No tienes suficiente saldo para generar los cartones, recarga tu cuenta' : err.message);
            } else {
                setError('Error al generar los cartones');
            }
        }
    };

    const handleDownloadPdf = async () => {
        if (!selectedEventId || generatedCards.length === 0) {
            setError('No hay cartones generados para descargar');
            return;
        }

        setError(null);
        setSuccess(null);

        try {
            await downloadPdfMutation.mutateAsync({
                event_id: selectedEventId,
                cards: generatedCards
            });
            setSuccess('PDF descargado exitosamente');
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Error al descargar el PDF');
            }
        }
    };

    const handleEmailCards = async () => {
        if (!selectedEventId || generatedCards.length === 0) {
            setError('No hay cartones generados para enviar');
            return;
        }

        if (!recipientEmail) {
            setError('Por favor, ingresa un correo electrónico');
            return;
        }

        setError(null);
        setSuccess(null);

        try {
            await emailCardsMutation.mutateAsync({
                email: recipientEmail,
                event_id: selectedEventId,
                cards: generatedCards,
                subject: emailSubject || undefined,
                message: emailMessage || undefined
            });
            setSuccess('Cartones enviados por correo exitosamente');
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Error al enviar los cartones por correo');
            }
        }
    };

    const handleDownloadTransactionCards = async (transactionId: string) => {
        setError(null);
        setSuccess(null);
        try {
            await downloadTransactionCardsMutation.mutateAsync({
                transaction_id: transactionId
            });
            setSuccess('PDF descargado exitosamente');
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Error al descargar el PDF de la transacción');
            }
        }
    };

    return (

        <div className="container py-4 px-4 md:py-8 max-w-5xl mx-auto">
            <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:justify-between sm:items-center">
                <h1 className="text-xl font-bold text-white sm:text-2xl">Panel de Vendedor</h1>
                <TestCoinBadge />
            </div>

            {error && (
                <Alert variant="destructive" className="mb-4 bg-red-900/30 text-red-300 border border-red-700/30">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {success && (
                <Alert className="mb-4 bg-green-900/30 text-green-300 border border-green-700/30">
                    <AlertDescription>{success}</AlertDescription>
                </Alert>
            )}

            <div className="rounded-2xl overflow-hidden backdrop-blur-md bg-black/30 border border-white/10 shadow-[0_0_15px_rgba(123,58,237,0.2)] mb-6">
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-4">
                    <h2 className="text-lg font-bold text-white">Seleccionar Evento</h2>
                    <p className="text-sm text-gray-200 mt-1">Elige el evento para el cual quieres generar cartones</p>
                </div>
                <div className="p-4">
                    <div className="space-y-2">
                        <Label htmlFor="event" className="text-gray-300">Evento</Label>
                        <Select
                            value={selectedEventId}
                            onValueChange={setSelectedEventId}
                        >
                            <SelectTrigger id="event" className="w-full bg-white/10 border-white/20 text-white">
                                <SelectValue placeholder="Selecciona un evento" />
                            </SelectTrigger>
                            <SelectContent className="bg-black/90 border-white/20">
                                {isLoadingEvents ? (
                                    <SelectItem value="loading" disabled>Cargando eventos...</SelectItem>
                                ) : events && events.length > 0 ? (
                                    events.map((event) => (
                                        <SelectItem key={event.id} value={String(event.id)} className="text-white">
                                            {event.name}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <SelectItem value="empty" disabled>No hay eventos disponibles</SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {selectedEventId && (
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="w-full grid grid-cols-2 sm:grid-cols-4 mb-6 bg-black/30 backdrop-blur-md border border-white/10 rounded-xl p-1 shadow-[0_0_15px_rgba(123,58,237,0.15)]">
                        <TabsTrigger value="generate" className="flex flex-col items-center gap-1 py-3 sm:flex-row sm:gap-2 sm:py-2 cursor-pointer data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-700 data-[state=active]:to-indigo-700 data-[state=active]:border-purple-500/50 data-[state=active]:shadow-[0_0_10px_rgba(139,92,246,0.3)] text-white rounded-lg">
                            <FaIdCard className="h-4 w-4" />
                            <span className="text-xs sm:text-sm">Generar</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="download"
                            className="flex flex-col items-center gap-1 py-3 sm:flex-row sm:gap-2 sm:py-2 cursor-pointer data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-700 data-[state=active]:to-indigo-700 data-[state=active]:border-purple-500/50 data-[state=active]:shadow-[0_0_10px_rgba(139,92,246,0.3)] text-white rounded-lg"
                            disabled={generatedCards.length === 0}
                        >
                            <FaFileDownload className="h-4 w-4" />
                            <span className="text-xs sm:text-sm">Descargar</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="email"
                            className="flex flex-col items-center gap-1 py-3 sm:flex-row sm:gap-2 sm:py-2 cursor-pointer data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-700 data-[state=active]:to-indigo-700 data-[state=active]:border-purple-500/50 data-[state=active]:shadow-[0_0_10px_rgba(139,92,246,0.3)] text-white rounded-lg"
                            disabled={generatedCards.length === 0}
                        >
                            <FaEnvelope className="h-4 w-4" />
                            <span className="text-xs sm:text-sm">Enviar</span>
                        </TabsTrigger>
                        <TabsTrigger value="transactions" className="flex flex-col items-center gap-1 py-3 sm:flex-row sm:gap-2 sm:py-2 cursor-pointer data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-700 data-[state=active]:to-indigo-700 data-[state=active]:border-purple-500/50 data-[state=active]:shadow-[0_0_10px_rgba(139,92,246,0.3)] text-white rounded-lg">
                            <FaHistory className="h-4 w-4" />
                            <span className="text-xs sm:text-sm">Historial</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="generate" className="space-y-4 mt-6">
                        <div className="rounded-2xl overflow-hidden backdrop-blur-md bg-black/30 border border-white/10 shadow-[0_0_15px_rgba(123,58,237,0.2)]">
                            <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-4">
                                <h2 className="text-lg font-bold text-white">Generar Cartones</h2>
                                <p className="text-sm text-gray-200 mt-1">Especifica la cantidad de cartones que deseas generar</p>
                            </div>
                            <div className="p-4">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="quantity" className="text-gray-300">Cantidad (máximo 100)</Label>
                                        <Input
                                            id="quantity"
                                            type="number"
                                            min="1"
                                            max="100"
                                            value={cardQuantity}
                                            onChange={(e) => setCardQuantity(parseInt(e.target.value || '0'))}
                                            className="bg-white/10 border-white/20 text-white"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 pt-0">
                                <Button
                                    onClick={handleGenerateCards}
                                    disabled={generateCardsMutation.isPending || !selectedEventId}
                                    className="bg-gradient-to-r from-purple-700 to-indigo-700 hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] border border-white/10 text-white flex items-center gap-2 w-full py-3"
                                >
                                    {generateCardsMutation.isPending ? (
                                        <>
                                            <FaSpinner className="h-4 w-4 animate-spin" />
                                            <span>Generando...</span>
                                        </>
                                    ) : (
                                        <>
                                            <FaIdCard className="h-4 w-4" />
                                            <span>Generar Cartones</span>
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="download" className="space-y-4 mt-6">
                        <div className="rounded-2xl overflow-hidden backdrop-blur-md bg-black/30 border border-white/10 shadow-[0_0_15px_rgba(123,58,237,0.2)]">
                            <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-4">
                                <h2 className="text-lg font-bold text-white">Descargar Cartones como PDF</h2>
                                <p className="text-sm text-gray-200 mt-1">Descarga los {generatedCards.length} cartones generados como un archivo PDF</p>
                            </div>
                            <div className="p-4">
                                <div className="p-4 bg-white/10 backdrop-blur-md rounded-lg mb-4 border border-white/10">
                                    <p className="font-medium text-white">Resumen:</p>
                                    <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-300">
                                        <li>Evento: {events?.find(e => String(e.id) === selectedEventId)?.name}</li>
                                        <li>Cartones generados: {generatedCards.length}</li>
                                    </ul>
                                </div>

                                {generatedCards.length > 0 && (
                                    <div>
                                        <h3 className="font-medium mb-3 text-white">Vista previa:</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-80 overflow-y-auto p-2 bg-black/20 rounded-lg border border-white/10">
                                            {generatedCards.slice(0, 6).map((card) => (
                                                <CardPreview key={card.id} card={card} isCompact={true} />
                                            ))}
                                            {generatedCards.length > 6 && (
                                                <div className="flex items-center justify-center border border-dashed border-white/30 rounded-md p-4">
                                                    <p className="text-gray-400">+{generatedCards.length - 6} cartones más</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="p-4 pt-0">
                                <Button
                                    onClick={handleDownloadPdf}
                                    disabled={downloadPdfMutation.isPending || generatedCards.length === 0}
                                    className="bg-gradient-to-r from-purple-700 to-indigo-700 hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] border border-white/10 text-white flex items-center gap-2 w-full py-3"
                                >
                                    {downloadPdfMutation.isPending ? (
                                        <>
                                            <FaSpinner className="h-4 w-4 animate-spin" />
                                            <span>Descargando...</span>
                                        </>
                                    ) : (
                                        <>
                                            <FaFileDownload className="h-4 w-4" />
                                            <span>Descargar PDF</span>
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="email" className="space-y-4 mt-6">
                        <div className="rounded-2xl overflow-hidden backdrop-blur-md bg-black/30 border border-white/10 shadow-[0_0_15px_rgba(123,58,237,0.2)]">
                            <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-4">
                                <h2 className="text-lg font-bold text-white">Enviar Cartones por Correo</h2>
                                <p className="text-sm text-gray-200 mt-1">Envía los cartones generados por correo electrónico</p>
                            </div>
                            <div className="p-4">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-gray-300">Correo Electrónico del Destinatario</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={recipientEmail}
                                            onChange={(e) => setRecipientEmail(e.target.value)}
                                            placeholder="correo@ejemplo.com"
                                            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="subject" className="text-gray-300">Asunto (opcional)</Label>
                                        <Input
                                            id="subject"
                                            type="text"
                                            value={emailSubject}
                                            onChange={(e) => setEmailSubject(e.target.value)}
                                            placeholder="Cartones para el evento de Bingo"
                                            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="message" className="text-gray-300">Mensaje (opcional)</Label>
                                        <Textarea
                                            id="message"
                                            value={emailMessage}
                                            onChange={(e) => setEmailMessage(e.target.value)}
                                            placeholder="Aquí están tus cartones para el evento..."
                                            rows={4}
                                            className="min-h-24 py-3 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 pt-0">
                                <Button
                                    onClick={handleEmailCards}
                                    disabled={emailCardsMutation.isPending || generatedCards.length === 0 || !recipientEmail}
                                    className="bg-gradient-to-r from-purple-700 to-indigo-700 hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] border border-white/10 text-white flex items-center gap-2 w-full py-3"
                                >
                                    {emailCardsMutation.isPending ? (
                                        <>
                                            <FaSpinner className="h-4 w-4 animate-spin" />
                                            <span>Enviando...</span>
                                        </>
                                    ) : (
                                        <>
                                            <FaEnvelope className="h-4 w-4" />
                                            <span>Enviar por Correo</span>
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="transactions" className="space-y-4 mt-6">
                        <div className="rounded-2xl overflow-hidden backdrop-blur-md bg-black/30 border border-white/10 shadow-[0_0_15px_rgba(123,58,237,0.2)]">
                            <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-4">
                                <h2 className="text-lg font-bold text-white">Mis Transacciones</h2>
                                <p className="text-sm text-gray-200 mt-1">Historial de cartones generados para eventos</p>
                            </div>
                            <div className="p-4">
                                {error && (
                                    <Alert variant="destructive" className="mb-4 bg-red-900/30 text-red-300 border border-red-700/30">
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                )}
                                {success && (
                                    <Alert className="mb-4 bg-green-900/30 text-green-300 border border-green-700/30">
                                        <AlertDescription>{success}</AlertDescription>
                                    </Alert>
                                )}

                                {isLoadingTransactions ? (
                                    <div className="text-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
                                        <p className="text-gray-300 mt-2">Cargando transacciones...</p>
                                    </div>
                                ) : transactions && transactions.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        {/* Mobile Cards View */}
                                        <div className="block md:hidden space-y-4">
                                            {transactions.map((transaction, i) => (
                                                <div key={i} className="bg-white/5 rounded-lg p-4 border border-white/10">
                                                    <div className="grid grid-cols-2 gap-3 mb-3">
                                                        <div>
                                                            <p className="text-xs text-gray-400">Fecha:</p>
                                                            <p className="font-medium text-white text-sm">
                                                                {transaction.generated_at
                                                                    ? format(new Date(transaction.generated_at), 'dd/MM/yyyy HH:mm')
                                                                    : 'No disponible'}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-400">Cantidad:</p>
                                                            <p className="font-medium text-white text-sm">{transaction.batch_size} cartones</p>
                                                        </div>
                                                    </div>
                                                    <div className="mb-3">
                                                        <p className="text-xs text-gray-400">Evento:</p>
                                                        <p className="font-medium text-white text-sm">{transaction.event_name}</p>
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleDownloadTransactionCards(transaction.transaction_id)}
                                                        disabled={downloadTransactionCardsMutation.isPending}
                                                        className="w-full bg-gradient-to-r from-purple-700 to-indigo-700 hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] border border-white/10 text-white"
                                                    >
                                                        <FaFileDownload className="mr-2 h-3 w-3" />
                                                        Descargar PDF
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Desktop Table View */}
                                        <div className="hidden md:block">
                                            <div className="bg-white/5 rounded-lg overflow-hidden border border-white/10">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow className="border-b border-white/10 hover:bg-white/5">
                                                            <TableHead className="text-gray-300">Fecha</TableHead>
                                                            <TableHead className="text-gray-300">Evento</TableHead>
                                                            <TableHead className="text-gray-300">Cantidad</TableHead>
                                                            <TableHead className="text-gray-300">Acciones</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {transactions.map((transaction, i) => (
                                                            <TableRow key={i} className="border-b border-white/5 hover:bg-white/5">
                                                                <TableCell className="text-white">
                                                                    {transaction.generated_at
                                                                        ? format(new Date(transaction.generated_at), 'dd/MM/yyyy HH:mm')
                                                                        : 'No disponible'}
                                                                </TableCell>
                                                                <TableCell className="text-white">{transaction.event_name}</TableCell>
                                                                <TableCell className="text-white">{transaction.batch_size} cartones</TableCell>
                                                                <TableCell>
                                                                    <Button
                                                                        size="sm"
                                                                        onClick={() => handleDownloadTransactionCards(transaction.transaction_id)}
                                                                        disabled={downloadTransactionCardsMutation.isPending}
                                                                        className="bg-gradient-to-r from-purple-700 to-indigo-700 hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] border border-white/10 text-white"
                                                                    >
                                                                        <FaFileDownload className="mr-2 h-3 w-3" />
                                                                        Descargar
                                                                    </Button>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-12 text-gray-400">
                                        <FaHistory className="mx-auto mb-4 text-4xl text-gray-600" />
                                        <p className="text-lg mb-2">No hay transacciones disponibles</p>
                                        <p className="text-sm">Las transacciones aparecerán aquí cuando generes cartones</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            )}
        </div>
    );
}
