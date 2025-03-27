import React from 'react';
import { FaUserPlus, FaCalendarCheck, FaTicketAlt, FaTrophy } from 'react-icons/fa';

export default function Steps() {
    const steps = [
        {
            icon: <FaUserPlus aria-hidden="true" className="text-4xl text-purple-400" />,
            title: 'Regístrate',
            description: 'Crea tu cuenta gratis en nuestra plataforma en segundos.'
        },
        {
            icon: <FaCalendarCheck aria-hidden="true" className="text-4xl text-indigo-400" />,
            title: 'Ingresa al evento',
            description: 'Selecciona el evento de bingo al que deseas unirte.'
        },
        {
            icon: <FaTicketAlt aria-hidden="true" className="text-4xl text-blue-400" />,
            title: 'Adquiere tus cartones',
            description: 'Compra uno o varios cartones para aumentar tus posibilidades de ganar.'
        },
        {
            icon: <FaTrophy aria-hidden="true" className="text-4xl text-cyan-400" />,
            title: 'Juega y Gana',
            description: 'Participa en el evento en vivo y gana premios instantáneos.'
        }
    ];

    return (
        <section className="pt-6 pb-4 px-auto" id="how-to-play">

            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
                ¿Cómo funciona?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4 max-w-6xl mx-auto relative">
                {/* Connecting line (only visible on lg screens) */}
                <div className="hidden lg:block absolute top-1/3 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 z-0" />

                {steps.map((step, index) => (
                    <div
                        key={index}
                        className="relative z-10 rounded-xl p-1 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:shadow-lg hover:shadow-purple-500/30 transition-all"
                        aria-label={`Paso ${index + 1}: ${step.title}`}
                    >
                        <div className="bg-gradient-to-l from-[#1E1B4B] to-[#3B0764] rounded-lg p-6 h-full">
                            {/* Step number badge */}
                            <div
                                className="absolute -top-4 left-1/2 transform -translate-x-1/2 lg:-top-5 lg:-left-3 lg:translate-x-0 w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md"
                                aria-hidden="true"
                            >
                                {index + 1}
                            </div>

                            <div className="flex flex-col items-center pt-4">
                                <div className="flex items-center justify-center mb-4 w-20 h-20 rounded-full bg-gray-800 bg-opacity-30">
                                    {step.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-white text-center mb-3">
                                    {step.title}
                                </h3>
                                <p className="text-gray-300 text-center">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
