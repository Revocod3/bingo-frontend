'use client';

import React from 'react';
import { FaGamepad, FaTrophy, FaUsers } from 'react-icons/fa';

export default function Features() {
    return (
        <section className="pt-2 pb-4 px-4">
            <div className="container mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
                    ¿Por qué escoger nuestro Bingo En Vivo?
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Card 1 */}
                    <div className="rounded-xl p-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-lg hover:shadow-purple-500/30 transition-all">
                        <div className="bg-gradient-to-l from-[#1E1B4B] to-[#3B0764] rounded-lg p-6 h-full">
                            <div className="flex items-center justify-center mb-4">
                                <FaGamepad className="text-4xl text-purple-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-white text-center mb-3">
                                Juego en Tiempo Real
                            </h3>
                            <p className="text-gray-300 text-center">
                                Disfruta de la emoción del bingo en vivo con números llamados en tiempo real y actualizaciones instantáneas.
                            </p>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="rounded-xl p-1 bg-gradient-to-r from-indigo-600 to-blue-600 hover:shadow-lg hover:shadow-indigo-500/30 transition-all">
                        <div className="bg-gradient-to-l from-[#1E1B4B] to-[#3B0764] rounded-lg p-6 h-full">
                            <div className="flex items-center justify-center mb-4">
                                <FaUsers className="text-4xl text-indigo-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-white text-center mb-3">
                                Experiencia Compartida
                            </h3>
                            <p className="text-gray-300 text-center">
                                Conecta con otros jugadores y comparte la emoción de cada número llamado en una experiencia social única.
                            </p>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="rounded-xl p-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:shadow-lg hover:shadow-blue-500/30 transition-all">
                        <div className="bg-gradient-to-l from-[#1E1B4B] to-[#3B0764] rounded-lg p-6 h-full">
                            <div className="flex items-center justify-center mb-4">
                                <FaTrophy className="text-4xl text-blue-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-white text-center mb-3">
                                Premios Instantáneos
                            </h3>
                            <p className="text-gray-300 text-center">
                                Tus victorias son verificadas al instante con nuestro sistema automático, permitiéndote reclamar tus premios de inmediato.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
