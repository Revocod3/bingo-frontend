'use client';

import Link from 'next/link';

export default function CTA() {
    return (
        <section className="py-6 px-4 sm:px-6" id="cta">
            <div className="max-w-5xl mx-auto p-8 rounded-xl bg-gradient-to-br from-[#7A3AEC] to-[#4F45E4] shadow-xl">
                <div className="text-center space-y-6">
                    <h2 className="text-3xl md:text-4xl font-bold text-white">
                        ¿Listo para comenzar a ganar?
                    </h2>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        Únete a las miles de personas que ya disfrutan de nuestro Bingo en Vivo
                    </p>

                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-8 justify-center">
                        <Link
                            href="/auth/register"
                            className="bg-white hover:bg-[#6D28D9] text-[#7C3AED] hover:text-white px-8 py-3 rounded-full font-medium transition-colors shadow-lg text-center"
                        >
                            Regístrate Ahora
                        </Link>
                        <Link
                            href="/contact"
                            className="bg-transparent border-2 border-white hover:bg-white hover:text-[#7C3AED] hover:border-[#6D28D9] text-white px-8 py-3 rounded-full font-medium transition-colors shadow-lg text-center"
                        >
                            Contáctanos
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
