'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FaArrowLeft, FaEnvelope } from 'react-icons/fa';

export default function DataDeletionPage() {
    return (
        <div className="container mx-auto py-12 px-4 max-w-3xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <h1 className="text-2xl md:text-3xl font-bold">Solicitud de Eliminación de Datos</h1>
                <Link href="/" passHref>
                    <Button variant="ghost" className="mt-4 md:mt-0 hover:bg-accent hover:text-accent-foreground">
                        <FaArrowLeft className="mr-2 h-4 w-4" />
                        Volver al inicio
                    </Button>
                </Link>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 md:p-8">
                <h2 className="text-xl font-semibold mb-4">¿Cómo solicitar la eliminación de tus datos?</h2>

                <p className="mb-6 text-gray-600 dark:text-gray-300">
                    En Bingo en vivo respetamos tu privacidad y tu derecho a controlar tus datos personales. Si deseas solicitar la eliminación
                    de tu cuenta y todos los datos asociados a ella, puedes hacerlo de las siguientes maneras:
                </p>

                <div className="space-y-6">
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-100 dark:border-purple-800">
                        <h3 className="font-semibold flex items-center text-purple-700 dark:text-purple-300 mb-3">
                            <FaEnvelope className="mr-2" /> Por correo electrónico
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            Envía un correo electrónico a <a href="mailto:privacidad@bingoenvivo.casino" className="text-purple-600 dark:text-purple-400 font-semibold hover:underline">privacidad@bingoenvivo.casino</a> con el asunto "Solicitud de eliminación de datos" e incluye la siguiente información:
                        </p>
                        <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-300">
                            <li>Tu nombre completo</li>
                            <li>Correo electrónico registrado en tu cuenta</li>
                            <li>Motivo de la solicitud (opcional)</li>
                        </ul>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg border border-gray-100 dark:border-gray-700">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            <strong>Nota importante:</strong> Una vez que procesemos tu solicitud de eliminación de datos, esta acción no se podrá deshacer.
                            Toda la información de tu cuenta, incluyendo historial de juegos, transacciones y cartones comprados será eliminada permanentemente
                            de nuestros sistemas en un plazo máximo de 30 días.
                        </p>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-100 dark:border-blue-800">
                        <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-3">Tiempo de respuesta</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            Procesaremos tu solicitud en un plazo máximo de 10 días hábiles. Una vez completado el proceso,
                            recibirás una confirmación por correo electrónico.
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-8 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Si tienes alguna pregunta adicional sobre el proceso de eliminación de datos,
                    puedes consultar nuestra <Link href="/privacy" className="text-purple-600 dark:text-purple-400 hover:underline">Política de Privacidad</Link>
                    o contactarnos directamente.
                </p>
            </div>
        </div>
    );
}
