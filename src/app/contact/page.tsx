'use client';

import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaCheck, FaPaperPlane } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const contactFormSchema = z.object({
    name: z.string().min(3, { message: 'El nombre debe tener al menos 3 caracteres' }),
    email: z.string().email({ message: 'Por favor ingresa un correo electrónico válido' }),
    subject: z.string().min(1, { message: 'Por favor selecciona un asunto' }),
    message: z.string().min(10, { message: 'El mensaje debe tener al menos 10 caracteres' })
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const form = useForm<ContactFormValues>({
        resolver: zodResolver(contactFormSchema),
        defaultValues: {
            name: '',
            email: '',
            subject: '',
            message: ''
        }
    });

    const onSubmit = async (data: ContactFormValues) => {
        setIsSubmitting(true);

        try {
            // Aquí iría la lógica para enviar el formulario a tu backend
            // Por ahora simulamos un tiempo de espera
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Simulamos éxito
            setIsSubmitted(true);
            toast.success('Mensaje enviado correctamente');
        } catch (error) {
            toast.error('Error al enviar el mensaje. Inténtalo de nuevo.');
            console.error('Error sending message:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        form.reset();
        setIsSubmitted(false);
    };

    return (
        <div className="bg-white dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
                        Contáctanos
                    </h1>
                    <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                        ¿Tienes alguna pregunta, comentario o sugerencia? Estamos aquí para ayudarte. Completa el formulario a continuación y nos pondremos en contacto contigo lo antes posible.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                    <div className="md:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Información de contacto</CardTitle>
                                <CardDescription>
                                    Otras formas de comunicarte con nosotros
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <FaEnvelope className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <p className="font-medium text-gray-900 dark:text-white">Correo electrónico</p>
                                        <p className="text-gray-500 dark:text-gray-400">info@bingoenvivo.casino</p>
                                        <p className="text-gray-500 dark:text-gray-400">soporte@bingoenvivo.casino</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <FaPhone className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <p className="font-medium text-gray-900 dark:text-white">Teléfono</p>
                                        <p className="text-gray-500 dark:text-gray-400">+58 (212) 555-1234</p>
                                        <p className="text-gray-500 dark:text-gray-400">Lunes a viernes: 9:00 AM - 6:00 PM</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <FaMapMarkerAlt className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <p className="font-medium text-gray-900 dark:text-white">Oficina principal</p>
                                        <p className="text-gray-500 dark:text-gray-400">
                                            Avenida Principal de Las Mercedes<br />
                                            Edificio Torre Mercedes, Piso 5<br />
                                            Caracas, Venezuela
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Horario de atención</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <dl className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <dt className="font-medium text-gray-900 dark:text-white">Lunes - Viernes:</dt>
                                        <dd className="text-gray-500 dark:text-gray-400">9:00 AM - 6:00 PM</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="font-medium text-gray-900 dark:text-white">Sábado:</dt>
                                        <dd className="text-gray-500 dark:text-gray-400">10:00 AM - 3:00 PM</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="font-medium text-gray-900 dark:text-white">Domingo:</dt>
                                        <dd className="text-gray-500 dark:text-gray-400">Cerrado</dd>
                                    </div>
                                </dl>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="md:col-span-3">
                        <Card className="h-full">
                            <CardHeader>
                                <CardTitle>Envíanos un mensaje</CardTitle>
                                <CardDescription>
                                    Completa el formulario y te responderemos lo antes posible
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {isSubmitted ? (
                                    <div className="flex flex-col items-center justify-center py-8 space-y-4">
                                        <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                                            <FaCheck className="h-8 w-8 text-green-600 dark:text-green-400" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                            Mensaje enviado
                                        </h3>
                                        <p className="text-center text-gray-500 dark:text-gray-400 max-w-md">
                                            Gracias por contactarnos. Hemos recibido tu mensaje y nos pondremos en contacto contigo lo antes posible.
                                        </p>
                                        <Button
                                            onClick={resetForm}
                                            variant="outline"
                                            className="mt-4"
                                        >
                                            Enviar otro mensaje
                                        </Button>
                                    </div>
                                ) : (
                                    <Form {...form}>
                                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name="name"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Nombre completo</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="Tu nombre" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="email"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Correo electrónico</FormLabel>
                                                            <FormControl>
                                                                <Input type="email" placeholder="tu@ejemplo.com" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            <FormField
                                                control={form.control}
                                                name="subject"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Asunto</FormLabel>
                                                        <Select
                                                            onValueChange={field.onChange}
                                                            defaultValue={field.value}
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Selecciona un asunto" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="support">Soporte técnico</SelectItem>
                                                                <SelectItem value="billing">Facturación y pagos</SelectItem>
                                                                <SelectItem value="feedback">Comentarios y sugerencias</SelectItem>
                                                                <SelectItem value="partnership">Propuesta de colaboración</SelectItem>
                                                                <SelectItem value="other">Otro</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="message"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Mensaje</FormLabel>
                                                        <FormControl>
                                                            <Textarea
                                                                placeholder="Escribe tu mensaje aquí..."
                                                                className="min-h-[150px]"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <Button
                                                type="submit"
                                                className="w-full"
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <span className="animate-spin mr-2">⏳</span>
                                                        Enviando...
                                                    </>
                                                ) : (
                                                    <>
                                                        <FaPaperPlane className="mr-2 h-4 w-4" />
                                                        Enviar mensaje
                                                    </>
                                                )}
                                            </Button>
                                        </form>
                                    </Form>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
