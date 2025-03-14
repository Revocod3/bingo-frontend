import Link from 'next/link';
import React from 'react';

const Hero: React.FC = () => {
    return (
        <section className='min-h-screen flex flex-col items-center justify-center relative z-10 w-full overflow-hidden py-8'>
            <span id='top-bubble' className='absolute top-0 left-0 z-0 bg-[#2B216C] w-60 h-60 md:w-80 md:h-80 lg:w-96 lg:h-96 border-white rounded-full transform -translate-x-1/4 -translate-y-1/4'/>
            <span id='bottom-bubble' className='absolute bottom-0 right-0 z-0 bg-[#46137B] w-60 h-60 md:w-80 md:h-80 lg:w-96 lg:h-96 border-white rounded-full transform translate-x-1/4 translate-y-1/4'/>
            <div className='flex flex-col md:flex-row items-center md:space-x-8 lg:space-x-20 z-10 px-4 sm:px-8 md:px-12 lg:px-20'>
                <div className='text-center md:text-left space-y-6 md:space-y-8 lg:space-y-12 mb-8 md:mb-0'>
                    <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-[76px] font-bold leading-tight lg:leading-[84px] text-center md:text-left">
                        Juega bingo<br />
                        En <span className='text-[#8B5CF6]'>directo</span> con tus<br />
                        Amigos y familiares
                    </h1>
                    <h4 className="text-center md:text-left text-[#DDD6FE] text-sm md:text-[16px] leading-tight md:leading-[20px] px-4 md:px-0">
                        Conectate, juega y diviértete con Bingo en tiempo real, con los <span className='text-[#8B5CF6] font-bold'>mejores premios</span>. ¡Regístrate y juega ahora!
                    </h4>
                    <div className='flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 md:space-x-6 justify-center md:justify-start'>
                        <Link href='/auth/login' className='bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-8 sm:px-12 md:px-16 lg:px-20 py-3 md:py-4 rounded-full font-medium transition-colors shadow-lg text-center'>
                            Jugar Ahora
                        </Link>
                        <Link href='#' className='bg-transparent border-2 border-[#7C3AED] hover:bg-[#6D28D9] text-white px-8 sm:px-12 md:px-16 lg:px-20 py-3 md:py-4 rounded-full font-medium transition-colors shadow-lg text-center'>
                            Contactanos
                        </Link>
                    </div>
                </div>
                <img src="/hero-img.svg" alt="Hero Image" className="max-w-full w-3/4 sm:w-2/3 md:w-1/2 lg:w-auto h-auto" />
            </div>
        </section>
    );
};

export default Hero;