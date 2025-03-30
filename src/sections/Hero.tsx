import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Hero: React.FC = () => {
    return (
        <section className='h-100vh py-6 flex flex-col items-center justify-center relative z-10 w-full overflow-hidden'>
            <span id='top-bubble' className='absolute top-0 left-0 z-0 bg-[#2B216C] w-60 h-60 md:w-80 md:h-80 lg:w-96 lg:h-96 border-white rounded-full transform -translate-x-1/4 -translate-y-1/4' />
            <span id='bottom-bubble' className='absolute bottom-0 right-0 z-0 bg-[#46137B] w-60 h-60 md:w-80 md:h-80 lg:w-96 lg:h-96 border-white rounded-full transform translate-x-1/4 translate-y-1/4' />
            <div className='flex flex-col md:flex-row items-center md:space-x-8 lg:space-x-20 z-10 px-4 sm:px-8 md:px-12 lg:px-20'>
                <div className='text-center md:text-left space-y-4 md:space-y-6 lg:space-y-8 mb-8 md:mb-0'>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[76px] font-bold leading-tight lg:leading-[84px] text-center md:text-left">
                        ¡Vive la emoción <br />
                        del <span className='text-[#8B5CF6]'>Bingo</span> en Vivo!<br />
                    </h1>
                    <h4 className="text-center md:text-left text-[#DDD6FE] pb-4 md:text-[16px] leading-tight md:leading-[20px] px-4 md:px-0">
                        Conéctate, con amigos y familiares en tiempo real, compite por <span className='text-[#8B5CF6] font-bold'>grandes premios</span> y disfruta de un gran momento sin salir de casa.
                    </h4>
                    <div className='flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 md:space-x-6 justify-center md:justify-start'>
                        <Link href='/auth/register' className='bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-8 sm:px-12 md:px-16 lg:px-20 py-3 md:py-4 rounded-full font-medium transition-colors shadow-lg text-center'>
                            Registrate Ahora
                        </Link>
                        <Link href='https://wa.me/+573228031537' target='_blank' className='bg-transparent border-2 border-[#7C3AED] hover:bg-[#6D28D9] text-white px-8 sm:px-12 md:px-16 lg:px-20 py-3 md:py-4 rounded-full font-medium transition-colors shadow-lg text-center'>
                            Contáctanos
                        </Link>
                    </div>
                </div>
                <Image src="/hero_img.png" alt="Hero Image" height={800} width={800} className='rounded-sm' />
            </div>
        </section>
    );
};

export default Hero;