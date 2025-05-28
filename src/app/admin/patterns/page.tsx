'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { FaArrowLeft, FaPlus } from 'react-icons/fa';
import AdminRouteGuard from '@/components/AdminRouteGuard';
import WinningPatternsPanel from '@/components/admin/WinningPatternsPanel';

export default function AdminPatternsPage() {
    const router = useRouter();

    return (
        <AdminRouteGuard>
            <div className="container mx-auto py-8 px-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-b from-white to-purple-200 bg-clip-text text-transparent drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]">Patrones de Ganancia</h1>
                        <p className="text-gray-300 mt-2">
                            Configura los patrones ganadores para los eventos de bingo
                        </p>
                    </div>

                    <div className="mt-4 md:mt-0">
                        <Link href="/admin" passHref>
                            <Button variant="ghost" className="bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20">
                                <FaArrowLeft className="mr-2 h-4 w-4" />
                                Panel Admin
                            </Button>
                        </Link>
                    </div>
                </div>

                <WinningPatternsPanel />
            </div>
        </AdminRouteGuard>
    );
}
