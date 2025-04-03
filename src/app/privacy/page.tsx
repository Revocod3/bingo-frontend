'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FaArrowLeft, FaShieldAlt, FaCookieBite, FaUserShield, FaServer, FaGlobe, FaEnvelope } from 'react-icons/fa';

export default function PrivacyPolicyPage() {
    return (
        <div className="container mx-auto py-12 px-4 max-w-4xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <h1 className="text-2xl md:text-3xl font-bold">Política de Privacidad</h1>
                <Link href="/" passHref>
                    <Button variant="ghost" className="mt-4 md:mt-0 hover:bg-accent hover:text-accent-foreground">
                        <FaArrowLeft className="mr-2 h-4 w-4" />
                        Volver al inicio
                    </Button>
                </Link>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 md:p-8 space-y-8">
                <div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                        En Bingo en vivo, accesible desde bingoenvivo.casino, una de nuestras principales prioridades es la privacidad de nuestros visitantes.
                        Este documento de Política de Privacidad contiene los tipos de información que Bingo en vivo recopila y registra, y cómo la utilizamos.
                    </p>
                </div>

                <div className="space-y-6">
                    <section className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-100 dark:border-purple-800">
                        <h2 className="text-xl font-semibold flex items-center text-purple-700 dark:text-purple-300 mb-4">
                            <FaShieldAlt className="mr-2" /> Información que recopilamos
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            Cuando te registras en nuestra plataforma, recopilamos la siguiente información:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
                            <li>Información personal como tu nombre, dirección de correo electrónico y datos de contacto</li>
                            <li>Información de transacciones relacionadas con tus compras y depósitos</li>
                            <li>Registros de actividad de juego, incluyendo los cartones comprados y eventos en los que participas</li>
                            <li>Información técnica como dirección IP, tipo de navegador, proveedor de servicios de Internet y sistema operativo</li>
                        </ul>
                    </section>

                    <section className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-100 dark:border-blue-800">
                        <h2 className="text-xl font-semibold flex items-center text-blue-700 dark:text-blue-300 mb-4">
                            <FaUserShield className="mr-2" /> Cómo utilizamos tu información
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            Utilizamos la información recopilada para:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
                            <li>Proporcionar, operar y mantener nuestros servicios</li>
                            <li>Mejorar, personalizar y ampliar nuestros servicios</li>
                            <li>Procesar transacciones y gestionar tus cuentas</li>
                            <li>Verificar tu identidad para prevenir fraudes</li>
                            <li>Comunicarnos contigo, incluyendo notificaciones sobre cambios en nuestros servicios</li>
                            <li>Proporcionar asistencia al cliente</li>
                            <li>Analizar cómo utilizas nuestros servicios para mejorar nuestra oferta</li>
                        </ul>
                    </section>

                    <section className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-100 dark:border-green-800">
                        <h2 className="text-xl font-semibold flex items-center text-green-700 dark:text-green-300 mb-4">
                            <FaGlobe className="mr-2" /> Compartición de datos
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            No vendemos, intercambiamos ni transferimos tu información personal a terceros sin tu consentimiento, excepto en las siguientes circunstancias:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
                            <li>Con proveedores de servicios que nos ayudan a operar nuestra plataforma (procesadores de pago, servicios de alojamiento)</li>
                            <li>Cuando sea requerido por ley, como en respuesta a una citación o proceso legal similar</li>
                            <li>Cuando creemos de buena fe que la divulgación es necesaria para proteger nuestros derechos, proteger tu seguridad o la seguridad de otros, investigar fraudes o responder a una solicitud gubernamental</li>
                        </ul>
                    </section>

                    <section className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border border-yellow-100 dark:border-yellow-800">
                        <h2 className="text-xl font-semibold flex items-center text-yellow-700 dark:text-yellow-300 mb-4">
                            <FaCookieBite className="mr-2" /> Cookies y tecnologías de seguimiento
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            Utilizamos cookies y tecnologías similares para mejorar tu experiencia, analizar el tráfico y personalizar el contenido. Puedes controlar el uso de cookies a nivel de navegador individual, pero si desactivas las cookies, es posible que algunas características de nuestro sitio no funcionen correctamente.
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">
                            Utilizamos tanto cookies de sesión (que expiran cuando cierras el navegador) como cookies persistentes (que permanecen en tu dispositivo hasta que las eliminas o caducan).
                        </p>
                    </section>

                    <section className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-100 dark:border-red-800">
                        <h2 className="text-xl font-semibold flex items-center text-red-700 dark:text-red-300 mb-4">
                            <FaServer className="mr-2" /> Seguridad de datos
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            Implementamos medidas de seguridad adecuadas para proteger tu información personal contra acceso no autorizado, alteración, divulgación o destrucción no autorizada. Estas medidas incluyen:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
                            <li>Cifrado SSL para todas las transmisiones de datos</li>
                            <li>Prácticas seguras de gestión de bases de datos</li>
                            <li>Acceso restringido a la información personal</li>
                            <li>Monitoreo continuo de nuestros sistemas para detectar vulnerabilidades</li>
                        </ul>
                    </section>

                    <section className="p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-semibold mb-4">Tus derechos de privacidad</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            Dependiendo de tu ubicación, puedes tener los siguientes derechos con respecto a tus datos personales:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
                            <li>Derecho a acceder a tu información personal</li>
                            <li>Derecho a rectificar o actualizar tus datos personales</li>
                            <li>Derecho a eliminar tus datos personales (como se detalla en nuestra <Link href="/data-deletion" className="text-purple-600 dark:text-purple-400 hover:underline">política de eliminación de datos</Link>)</li>
                            <li>Derecho a objetar o limitar el procesamiento de tus datos</li>
                            <li>Derecho a la portabilidad de datos</li>
                            <li>Derecho a retirar el consentimiento en cualquier momento</li>
                        </ul>
                        <p className="text-gray-600 dark:text-gray-300 mt-4">
                            Para ejercer estos derechos, contáctanos a través de los medios indicados al final de esta política.
                        </p>
                    </section>

                    <section className="p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-semibold mb-4">Cambios a esta política</h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            Podemos actualizar nuestra política de privacidad periódicamente. Te notificaremos sobre cualquier cambio publicando la nueva política de privacidad en esta página y, si los cambios son significativos, te enviaremos una notificación por correo electrónico. Te recomendamos revisar esta política de privacidad periódicamente para estar informado sobre cómo estamos protegiendo tu información.
                        </p>
                    </section>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-100 dark:border-purple-800">
                    <h2 className="text-xl font-semibold flex items-center text-purple-700 dark:text-purple-300 mb-4">
                        <FaEnvelope className="mr-2" /> Contáctanos
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                        Si tienes preguntas o inquietudes sobre esta política de privacidad, no dudes en contactarnos:
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-600 dark:text-gray-300">
                        <li>Por correo electrónico: <a href="mailto:privacidad@bingoenvivo.casino" className="text-purple-600 dark:text-purple-400 font-semibold hover:underline">privacidad@bingoenvivo.casino</a></li>
                        <li>A través de nuestro <Link href="/contact" className="text-purple-600 dark:text-purple-400 hover:underline">formulario de contacto</Link></li>
                    </ul>
                </div>
            </div>

            <div className="mt-8 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Esta política de privacidad fue creada para cumplir con las regulaciones de protección de datos aplicables, incluyendo el RGPD.
                </p>
            </div>
        </div>
    );
}
