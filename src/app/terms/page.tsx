'use client';

import React from 'react';
import { FaGavel, FaUserPlus, FaGlobe, FaMoneyBillWave, FaGamepad, FaShieldAlt, FaExclamationTriangle } from 'react-icons/fa';
import Link from 'next/link';

export default function TermsOfServicePage() {
    return (
        <div className="bg-white dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
                        Términos y Condiciones de Servicio
                    </h1>
                    <p className="mt-4 text-gray-500 dark:text-gray-400">
                        Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                        Los siguientes términos y condiciones regulan el uso de la plataforma Bingo en vivo, accesible desde bingoenvivo.casino.
                        Al registrarte o utilizar nuestros servicios, aceptas estas condiciones en su totalidad.
                    </p>
                </div>

                <div className="space-y-6">
                    <section className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-100 dark:border-blue-800">
                        <h2 className="text-xl font-semibold flex items-center text-blue-700 dark:text-blue-300 mb-4">
                            <FaUserPlus className="mr-2" /> Elegibilidad y registro
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            Para utilizar nuestros servicios, debes:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
                            <li>Tener al menos 18 años de edad</li>
                            <li>Proporcionar información precisa y completa durante el registro</li>
                            <li>Mantener tu información de cuenta actualizada</li>
                            <li>Ser responsable de mantener la confidencialidad de tu contraseña</li>
                            <li>Aceptar la responsabilidad de todas las actividades realizadas con tu cuenta</li>
                        </ul>
                    </section>

                    <section className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-100 dark:border-purple-800">
                        <h2 className="text-xl font-semibold flex items-center text-purple-700 dark:text-purple-300 mb-4">
                            <FaGamepad className="mr-2" /> Uso de nuestros servicios
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            Al utilizar nuestra plataforma de bingo en línea, aceptas:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
                            <li>Cumplir con todas las leyes aplicables</li>
                            <li>No participar en actividades fraudulentas o manipular los juegos</li>
                            <li>No utilizar ningún software automatizado para interactuar con nuestra plataforma</li>
                            <li>No interrumpir o interferir con la seguridad o el funcionamiento de la plataforma</li>
                            <li>Aceptar que los resultados de los juegos son aleatorios y finales</li>
                        </ul>
                    </section>

                    <section className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-100 dark:border-green-800">
                        <h2 className="text-xl font-semibold flex items-center text-green-700 dark:text-green-300 mb-4">
                            <FaMoneyBillWave className="mr-2" /> Pagos y premios
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            Respecto a los aspectos financieros de nuestro servicio:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
                            <li>Los precios de los cartones están sujetos a cambios sin previo aviso</li>
                            <li>Los pagos realizados son generalmente no reembolsables</li>
                            <li>Los premios serán pagados según las reglas específicas de cada evento</li>
                            <li>Nos reservamos el derecho de verificar la legitimidad de cualquier victoria</li>
                            <li>Podremos retener pagos si detectamos actividad sospechosa o fraudulenta</li>
                            <li>Los usuarios son responsables de cualquier impuesto aplicable a sus ganancias</li>
                        </ul>
                    </section>

                    <section className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-100 dark:border-red-800">
                        <h2 className="text-xl font-semibold flex items-center text-red-700 dark:text-red-300 mb-4">
                            <FaExclamationTriangle className="mr-2" /> Limitación de responsabilidad
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            Bingo en vivo y sus operadores:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
                            <li>No garantizan disponibilidad ininterrumpida de la plataforma</li>
                            <li>No son responsables por pérdidas o daños derivados del uso de nuestros servicios</li>
                            <li>Se reservan el derecho de suspender o terminar cuentas que violen estos términos</li>
                            <li>Pueden modificar o discontinuar servicios sin previo aviso</li>
                        </ul>
                    </section>

                    <section className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border border-yellow-100 dark:border-yellow-800">
                        <h2 className="text-xl font-semibold flex items-center text-yellow-700 dark:text-yellow-300 mb-4">
                            <FaShieldAlt className="mr-2" /> Propiedad intelectual
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            Todos los derechos de propiedad intelectual relacionados con nuestra plataforma:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
                            <li>El contenido y software de la plataforma están protegidos por derechos de autor</li>
                            <li>Las marcas, logotipos y nombres comerciales son propiedad exclusiva de Bingo en vivo</li>
                            <li>No se permite la reproducción, distribución o modificación sin autorización</li>
                        </ul>
                    </section>

                    <section className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-lg border border-indigo-100 dark:border-indigo-800">
                        <h2 className="text-xl font-semibold flex items-center text-indigo-700 dark:text-indigo-300 mb-4">
                            <FaGavel className="mr-2" /> Modificaciones a estos términos
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            Nos reservamos el derecho de modificar estos términos en cualquier momento. Las modificaciones entrarán en vigor inmediatamente después de su publicación. El uso continuado de nuestros servicios después de cualquier cambio constituye tu aceptación de los nuevos términos.
                        </p>
                    </section>

                    <section className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-semibold flex items-center text-gray-700 dark:text-gray-300 mb-4">
                            <FaGlobe className="mr-2" /> Legislación aplicable
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            Estos términos se regirán e interpretarán de acuerdo con las leyes del país de operación de Bingo en vivo, sin tener en cuenta sus disposiciones sobre conflictos de leyes. Cualquier disputa relacionada con estos términos estará sujeta a la jurisdicción exclusiva de los tribunales competentes en dicho país.
                        </p>
                    </section>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Para cualquier duda o consulta sobre estos términos, por favor
                        <Link href="/contact" className="text-purple-600 dark:text-purple-400 hover:underline ml-1">contáctanos</Link>.
                    </p>
                </div>
            </div>
        </div>
    );
}
