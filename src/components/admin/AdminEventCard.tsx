'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FaCalendarAlt, FaClock, FaEdit, FaTrash } from 'react-icons/fa';

interface AdminEventCardProps {
    id: string | number;
    name: string;
    date: string;
    time: string;
    isActive: boolean;
    prize: number;
    onEdit?: () => void;
    onDelete?: () => void;
}

export default function AdminEventCard({
    id,
    name,
    date,
    time,
    isActive,
    prize,
    onEdit,
    onDelete
}: AdminEventCardProps) {
    const router = useRouter();

    return (
        <div className="rounded-xl overflow-hidden backdrop-blur-md bg-black/30 border border-white/10 shadow-[0_0_15px_rgba(123,58,237,0.2)] relative">
            {/* Decorative elements for glassmorphism effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-indigo-900/20 z-0"></div>

            {/* Encabezado con gradiente */}
            <div className="w-full relative z-10 bg-gradient-to-r from-purple-700 to-indigo-700 shadow-md p-4">
                <div className="text-center">
                    <h3 className="text-xl font-bold text-white">{name}</h3>
                </div>
            </div>

            {/* Contenido */}
            <div className="w-full p-4 bg-black/20 backdrop-blur-sm relative z-10">
                <div className="flex items-center justify-between text-xs text-gray-300 mb-2">
                    <div className="flex items-center gap-2">
                        <FaCalendarAlt className="h-4 w-4 text-purple-300" />
                        <span>{date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                        <FaClock className="h-4 w-4 text-purple-300" />
                        <span>{time}</span>
                    </div>
                    <Badge className={isActive ?
                        "bg-green-500/40 text-green-200 backdrop-blur-sm border border-green-500/30 animate-pulse" :
                        "bg-slate-500/40 text-white backdrop-blur-sm border border-slate-500/30"
                    }>
                        {isActive ? 'En Vivo' : 'Inactivo'}
                    </Badge>
                </div>

                <div className="rounded-lg bg-white/5 py-2 px-4 backdrop-blur-sm flex flex-row justify-between items-center mb-4 border border-white/10 shadow-inner">
                    <div className="flex items-center gap-2">
                        <FaCalendarAlt className="h-4 w-4 text-amber-500" />
                        <h4 className="text-amber-400 text-sm font-semibold">Premio</h4>
                    </div>
                    <p className="text-sm font-bold text-amber-300">
                        ${prize} USD
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/10">
                    <Button
                        variant="outline"
                        className="w-full flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20"
                        onClick={() => onEdit?.()}
                    >
                        <FaEdit className="h-4 w-4" /> Editar
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full flex items-center justify-center gap-2 bg-red-500/20 backdrop-blur-md text-red-200 border border-red-500/30 hover:bg-red-500/30"
                        onClick={() => onDelete?.()}
                    >
                        <FaTrash className="h-4 w-4" /> Eliminar
                    </Button>
                </div>
            </div>
        </div>
    );
}
