import Image from 'next/image';
import React from 'react';

const Testimonials = () => {
    const testimonials = [
        {
            name: "Sarah Johnson",
            handle: "@sarahplays",
            image: "/testimonial1.jpg",
            text: "¡Increíble experiencia! Bingo me ha dado horas de diversión y he conocido a personas maravillosas. Los premios son excelentes y la plataforma es muy fácil de usar."
        },
        {
            name: "Mike Chen",
            handle: "@mikestreams",
            image: "/testimonial2.jpg",
            text: "He probado muchos sitios de bingo, pero este es definitivamente el mejor. Atención al cliente impecable y eventos especiales que hacen que vuelva cada semana."
        },
        {
            name: "Emma Wilson",
            handle: "@emmogames",
            image: "/testimonial3.jpg",
            text: "Lo que más me gusta es la comunidad. Siempre hay alguien con quien charlar mientras jugamos. La aplicación móvil es perfecta para jugar sobre la marcha."
        }
    ];

    return (
        <section className="py-16 px-4 text-white">
            <h2 className="text-center text-4xl font-bold mb-16">
                Qué dicen nuestros jugadores
            </h2>

            <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto">
                {testimonials.map((testimonial, index) => (
                    <div
                        key={index}
                        className="bg-white/5 backdrop-blur-lg rounded-xl p-8 flex-1 basis-[300px] max-w-[350px] shadow-xl transition-transform duration-300 hover:-translate-y-2"
                    >
                        <div className="flex items-center mb-6">
                            <div className="w-16 h-16 mr-4 rounded-full overflow-hidden flex-shrink-0">
                                <Image
                                    src={testimonial.image}
                                    alt={testimonial.name}
                                    width={80}
                                    height={80}
                                    className="rounded-full object-cover w-full h-full"
                                />
                            </div>
                            <div>
                                <h3 className="text-lg font-medium m-0">{testimonial.name}</h3>
                                <p className="text-green-300 text-sm mt-1">{testimonial.handle}</p>
                            </div>
                        </div>
                        <p className="text-gray-200 leading-relaxed">"{testimonial.text}"</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Testimonials;
