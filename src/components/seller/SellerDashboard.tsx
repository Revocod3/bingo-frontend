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
import { FaSpinner, FaFileDownload, FaEnvelope, FaIdCard } from 'react-icons/fa';
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
                setError(err.message);
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
        <div className="container py-8 px-4 md:py-12 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between mb-6">
                <h1 className="text-xl md:2xl font-bold mb-6">Panel de Vendedor</h1>
                <TestCoinBadge />
            </div>
            {error && (
                <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {success && (
                <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
                    <AlertDescription>{success}</AlertDescription>
                </Alert>
            )}

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Seleccionar Evento</CardTitle>
                    <CardDescription>Elige el evento para el cual quieres generar cartones</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="event">Evento</Label>
                            <Select
                                value={selectedEventId}
                                onValueChange={setSelectedEventId}
                            >
                                <SelectTrigger id="event">
                                    <SelectValue placeholder="Selecciona un evento" />
                                </SelectTrigger>
                                <SelectContent>
                                    {isLoadingEvents ? (
                                        <SelectItem value="loading" disabled>Cargando eventos...</SelectItem>
                                    ) : events && events.length > 0 ? (
                                        events.map((event) => (
                                            <SelectItem key={event.id} value={String(event.id)}>
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
                </CardContent>
            </Card>

            {selectedEventId && (
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid grid-cols-3 w-full">
                        <TabsTrigger value="generate" className="flex items-center gap-2">
                            <FaIdCard className="h-4 w-4" />
                            <span>Generar</span>
                        </TabsTrigger>
                        <TabsTrigger value="download" className="flex items-center gap-2" disabled={generatedCards.length === 0}>
                            <FaFileDownload className="h-4 w-4" />
                            <span>Descargar</span>
                        </TabsTrigger>
                        <TabsTrigger value="email" className="flex items-center gap-2" disabled={generatedCards.length === 0}>
                            <FaEnvelope className="h-4 w-4" />
                            <span>Enviar</span>
                        </TabsTrigger>
                        <TabsTrigger value="transactions" className="flex items-center gap-2">
                            <FaFileDownload className="h-4 w-4" />
                            <span>Transacciones</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="generate" className="space-y-4 mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Generar Cartones</CardTitle>
                                <CardDescription>Especifica la cantidad de cartones que deseas generar</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="quantity">Cantidad (máximo 100)</Label>
                                        <Input
                                            id="quantity"
                                            type="number"
                                            min="1"
                                            max="100"
                                            value={cardQuantity}
                                            onChange={(e) => setCardQuantity(parseInt(e.target.value || '0'))}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    onClick={handleGenerateCards}
                                    disabled={generateCardsMutation.isPending || !selectedEventId}
                                    className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white flex items-center gap-2"
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
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    <TabsContent value="download" className="space-y-4 mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Descargar Cartones como PDF</CardTitle>
                                <CardDescription>Descarga los {generatedCards.length} cartones generados como un archivo PDF</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="p-4 bg-gray-50 rounded-lg mb-4">
                                    <p className="font-medium">Resumen:</p>
                                    <ul className="list-disc pl-5 mt-2 space-y-1">
                                        <li>Evento: {events?.find(e => String(e.id) === selectedEventId)?.name}</li>
                                        <li>Cartones generados: {generatedCards.length}</li>
                                    </ul>
                                </div>

                                {generatedCards.length > 0 && (
                                    <div>
                                        <h3 className="font-medium mb-3">Vista previa:</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-80 overflow-y-auto p-2">
                                            {generatedCards.slice(0, 6).map((card) => (
                                                <CardPreview key={card.id} card={card} isCompact={true} />
                                            ))}
                                            {generatedCards.length > 6 && (
                                                <div className="flex items-center justify-center border border-dashed border-gray-300 rounded-md p-4">
                                                    <p className="text-gray-500">+{generatedCards.length - 6} cartones más</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter>
                                <Button
                                    onClick={handleDownloadPdf}
                                    disabled={downloadPdfMutation.isPending || generatedCards.length === 0}
                                    className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white flex items-center gap-2"
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
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    <TabsContent value="email" className="space-y-4 mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Enviar Cartones por Correo</CardTitle>
                                <CardDescription>Envía los cartones generados por correo electrónico</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Correo Electrónico del Destinatario</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={recipientEmail}
                                            onChange={(e) => setRecipientEmail(e.target.value)}
                                            placeholder="correo@ejemplo.com"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="subject">Asunto (opcional)</Label>
                                        <Input
                                            id="subject"
                                            type="text"
                                            value={emailSubject}
                                            onChange={(e) => setEmailSubject(e.target.value)}
                                            placeholder="Cartones para el evento de Bingo"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="message">Mensaje (opcional)</Label>
                                        <Textarea
                                            id="message"
                                            value={emailMessage}
                                            onChange={(e) => setEmailMessage(e.target.value)}
                                            placeholder="Aquí están tus cartones para el evento..."
                                            rows={4}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    onClick={handleEmailCards}
                                    disabled={emailCardsMutation.isPending || generatedCards.length === 0 || !recipientEmail}
                                    className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white flex items-center gap-2"
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
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    <TabsContent value="transactions" className="space-y-4 mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Mis Transacciones</CardTitle>
                                <CardDescription>
                                    Historial de cartones generados para eventos
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {error && (
                                    <Alert variant="destructive" className="mb-4">
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                )}
                                {success && (
                                    <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
                                        <AlertDescription>{success}</AlertDescription>
                                    </Alert>
                                )}

                                {isLoadingTransactions ? (
                                    <div className="text-center py-4">Cargando transacciones...</div>
                                ) : transactions && transactions.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Fecha</TableHead>
                                                <TableHead>Evento</TableHead>
                                                <TableHead>Cantidad</TableHead>
                                                <TableHead>Acciones</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {transactions.map((transaction, i) => (
                                                <TableRow key={i}>
                                                    <TableCell>
                                                        {transaction.generated_at
                                                            ? format(new Date(transaction.generated_at), 'dd/MM/yyyy HH:mm')
                                                            : 'Fecha no disponible'}
                                                    </TableCell>
                                                    <TableCell>{transaction.event_name}</TableCell>
                                                    <TableCell>{transaction.batch_size} cartones</TableCell>
                                                    <TableCell>
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleDownloadTransactionCards(transaction.transaction_id)}
                                                            disabled={downloadTransactionCardsMutation.isPending}
                                                        >
                                                            Descargar PDF
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <div className="text-center py-4">No hay transacciones disponibles</div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            )}
        </div>
    );
}
