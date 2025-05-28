'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FaPuzzlePiece, FaCalendarAlt, FaUsers, FaChartBar, FaMoneyBillWave } from 'react-icons/fa';

interface AdminMenuCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    href: string;
    buttonText: string;
    buttonIcon?: React.ReactNode;
    disabled?: boolean;
}

export default function AdminMenuCard({
    icon,
    title,
    description,
    href,
    buttonText,
    buttonIcon,
    disabled = false
}: AdminMenuCardProps) {
    const CardContent = () => (
        <div className="rounded-2xl overflow-hidden backdrop-blur-md bg-black/30 border border-white/10 shadow-[0_0_15px_rgba(123,58,237,0.2)] relative">
            {/* Decorative elements for glassmorphism effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-indigo-900/20 z-0"></div>

            {/* Encabezado con gradiente */}
            <div className="w-full relative z-10 bg-gradient-to-r from-purple-700 to-indigo-700 shadow-md p -4">
                <div className="text-center">
                    <h3 className="text-xl font-bold text-white drop-shadow-md">{title}</h3>
                </div>
                <div className="text-white/70 text-xs text-center mt-2">
                    {description}
                </div>
            </div>

            {/* Contenido */}
            <div className="w-full p-4 bg-black/20 backdrop-blur-sm relative z-10">
                <div className="rounded-lg bg-white/5 p-4 backdrop-blur-sm flex flex-row justify-between items-center mb-4 border border-white/10 shadow-inner">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-r from-purple-700 to-indigo-600 p-2 rounded-lg shadow-[0_0_8px_rgba(139,92,246,0.5)]">
                            {icon}
                        </div>
                        <div>
                            <h4 className="text-white text-base font-semibold">{title}</h4>
                            <p className="text-gray-300 text-sm">{description}</p>
                        </div>
                    </div>
                </div>

                {disabled ? (
                    <Button
                        disabled
                        className="w-full bg-gradient-to-r from-purple-700 to-indigo-700 opacity-70 hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] border border-white/10 gap-2 py-5 font-medium transition-all mt-4"
                    >
                        {buttonIcon} {buttonText}
                    </Button>
                ) : (
                    <Button
                        className="w-full bg-gradient-to-r from-purple-700 to-indigo-700 hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] border border-white/10 gap-2 py-5 font-medium transition-all mt-4"
                    >
                        {buttonIcon} {buttonText}
                    </Button>
                )}
            </div>
        </div>
    );

    return disabled ? (
        <CardContent />
    ) : (
        <Link href={href} passHref className="block">
            <CardContent />
        </Link>
    );
}
