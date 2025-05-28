'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FaCalendarAlt, FaClock, FaEdit, FaEye, FaPuzzlePiece, FaTrophy, FaTrash } from 'react-icons/fa';
import { cn } from '@/lib/utils';

interface EventCardProps {
    id: string | number;
    name: string;
    date: string; // formatted date string
    time: string; // formatted time string
    prize: number;
    description?: string;
    isLive: boolean;
    onDelete: (id: string) => void;
}

export default function EventCard({
    id,
    name,
    date,
    time,
    prize,
    description,
    isLive,
    onDelete
}: EventCardProps) {
    return (
        <div className="rounded-2xl overflow-hidden backdrop-blur-md bg-black/30 border border-white/10 shadow-[0_0_15px_rgba(123,58,237,0.2)] relative">
            {/* Decorative elements for glassmorphism effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-indigo-900/20 z-0"></div>

            {/* Encabezado con gradiente */}
            <div className="w-full relative z-10 bg-gradient-to-r from-purple-700 to-indigo-700 shadow-md">
                <div className="text-center font-bold py-3 text-lg text-white">
                    <span className="inline-block bg-gradient-to-b from-white to-purple-200 bg-clip-text text-transparent drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]">
                        {name}
                    </span>
                </div>
            </div>

            {/* Contenido */}
            <div className="w-full p-4 bg-black/20 backdrop-blur-sm relative z-10">
                <div className="mb-4">
                    <div className="flex items-center justify-between text-xs text-gray-300 mb-2">
                        <div className="flex items-center gap-2">
                            <FaCalendarAlt className="h-4 w-4 text-purple-300" />
                            <span>{date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                            <FaClock className="h-4 w-4 text-purple-300" />
                            <span>{time}</span>
                        </div>
                        <Badge className={cn("bg-slate-500/40 text-white backdrop-blur-sm border border-slate-500/30", {
                            'bg-green-500/40 text-green-200 border-green-500/30 animate-pulse': isLive,
                        })}>
                            {isLive ? 'En Vivo' : 'Inactivo'}
                        </Badge>
                    </div>

                    <div className="rounded-lg bg-white/5 py-2 px-4 backdrop-blur-sm flex flex-row justify-between items-center mb-4 border border-white/10 shadow-inner">
                        <div className="flex items-center gap-2">
                            <FaTrophy className="h-4 w-4 text-amber-500" />
                            <h4 className="text-amber-400 text-sm font-semibold">Premio</h4>
                        </div>
                        <p className="text-sm font-bold text-amber-300">
                            ${prize} USD
                        </p>
                    </div>

                    {description && (
                        <div className="rounded-lg bg-white/5 py-2 px-4 backdrop-blur-sm border border-white/10 shadow-inner">
                            <p className="text-sm text-gray-300 line-clamp-2">{description}</p>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/10">
                    <Link href={`/admin/events/${id}/moderate`} passHref>
                        <Button variant="outline" className="w-full flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20">
                            <FaEye className="h-4 w-4" /> Moderar
                        </Button>
                    </Link>
                    <Link href={`/admin/events/${id}/patterns`} passHref>
                        <Button variant="outline" className="w-full flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20">
                            <FaPuzzlePiece className="h-4 w-4" /> Patrones
                        </Button>
                    </Link>
                    <Link href={`/admin/events/${id}/edit`} passHref>
                        <Button variant="outline" className="w-full flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20">
                            <FaEdit className="h-4 w-4" /> Editar
                        </Button>
                    </Link>
                    <Button
                        variant="outline"
                        className="w-full flex items-center justify-center gap-2 bg-red-500/20 backdrop-blur-md text-red-200 border border-red-500/30 hover:bg-red-500/30"
                        onClick={() => onDelete(String(id))}
                    >
                        <FaTrash className="h-4 w-4" /> Eliminar
                    </Button>
                </div>
            </div>
        </div>
    );
}
