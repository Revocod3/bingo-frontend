'use client';

import React, { useState, Suspense, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import AdminRouteGuard from '@/components/AdminRouteGuard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FaCalendarAlt, FaUsers, FaChartBar, FaPuzzlePiece, FaCogs, FaArrowLeft, FaMoneyBillWave } from 'react-icons/fa';
import WinningPatternsPanel from '@/components/admin/WinningPatternsPanel';
import AdminMenuCard from '@/components/admin/AdminMenuCard';
import { useCurrentUser } from '@/hooks/api/useUsers';

// Client component to safely use the useSearchParams hook
function TabParamHandler({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
    const searchParams = useSearchParams();
    const tabParam = searchParams?.get('tab') || 'events';

    // Update parent state with the tab from URL using useEffect to avoid state updates during render
    useEffect(() => {
        if (tabParam) {
            setActiveTab(tabParam);
        }
    }, [tabParam, setActiveTab]);

    return null;
}

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState('events');
    const { data: user } = useCurrentUser();

    return (
        <AdminRouteGuard>
            {/* Wrap the component using useSearchParams in Suspense */}
            <Suspense fallback={null}>
                <TabParamHandler setActiveTab={setActiveTab} />
            </Suspense>

            <div className="container mx-auto pt-8 pb-8 px-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-b from-white to-purple-200 bg-clip-text text-transparent drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]">Panel de Administración</h1>
                        <p className="text-gray-300 mt-2">
                            Bienvenido, {user?.first_name || 'Admin'}! Gestiona eventos, patrones y usuarios desde este panel.
                        </p>
                    </div>

                    <div className="mt-2 md:mt-0">
                        <Link href="/dashboard" passHref>
                            <Button variant="ghost" className="bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20">
                                <FaArrowLeft className="mr-2 h-4 w-4" />
                                Dashboard
                            </Button>
                        </Link>
                    </div>
                </div>

                <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                    <TabsList className="mb-2 w-full overflow-x-auto bg-black/30 backdrop-blur-md border border-white/10 rounded-xl p-1 shadow-[0_0_15px_rgba(123,58,237,0.15)]">
                        <TabsTrigger value="events" className="flex items-center gap-1 sm:gap-2 flex-1 cursor-pointer data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-700 data-[state=active]:to-indigo-700 data-[state=active]:border-purple-500/50 data-[state=active]:shadow-[0_0_10px_rgba(139,92,246,0.3)] text-white rounded-lg">
                            <span className="sm:inline"><FaCalendarAlt /></span>
                            <span className="text-xs sm:text-sm">Eventos</span>
                        </TabsTrigger>
                        <TabsTrigger value="patterns" className="flex items-center gap-1 sm:gap-2 flex-1 cursor-pointer data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-700 data-[state=active]:to-indigo-700 data-[state=active]:border-purple-500/50 data-[state=active]:shadow-[0_0_10px_rgba(139,92,246,0.3)] text-white rounded-lg">
                            <span className="sm:inline"><FaPuzzlePiece /></span>
                            <span className="text-xs sm:text-sm">Patrones</span>
                        </TabsTrigger>
                        <TabsTrigger value="deposits" className="flex items-center gap-1 sm:gap-2 flex-1 cursor-pointer data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-700 data-[state=active]:to-indigo-700 data-[state=active]:border-purple-500/50 data-[state=active]:shadow-[0_0_10px_rgba(139,92,246,0.3)] text-white rounded-lg">
                            <span className="sm:inline"><FaMoneyBillWave /></span>
                            <span className="text-xs sm:text-sm">Depósitos</span>
                        </TabsTrigger>
                        <TabsTrigger value="users" className="flex items-center gap-1 sm:gap-2 flex-1 cursor-pointer data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-700 data-[state=active]:to-indigo-700 data-[state=active]:border-purple-500/50 data-[state=active]:shadow-[0_0_10px_rgba(139,92,246,0.3)] text-white rounded-lg">
                            <span className="sm:inline"><FaUsers /></span>
                            <span className="text-xs sm:text-sm">Usuarios</span>
                        </TabsTrigger>
                        <TabsTrigger value="stats" className="flex items-center gap-1 sm:gap-2 flex-1 cursor-pointer data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-700 data-[state=active]:to-indigo-700 data-[state=active]:border-purple-500/50 data-[state=active]:shadow-[0_0_10px_rgba(139,92,246,0.3)] text-white rounded-lg">
                            <span className="sm:inline"><FaChartBar /></span>
                            <span className="text-xs sm:text-sm">Estadísticas</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="events" className="space-y-4">
                        <h2 className="text-xl md:text-2xl font-bold inline-block bg-gradient-to-b from-white to-purple-200 bg-clip-text text-transparent drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]">Gestión de Eventos</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <AdminMenuCard
                                icon={<FaCalendarAlt className="h-5 w-5 text-white" />}
                                title="Listado de Eventos"
                                description="Gestiona todos los eventos de bingo"
                                href="/admin/events"
                                buttonText="Ver Eventos"
                                buttonIcon={<FaCalendarAlt className="h-4 w-4" />}
                            />
                            <AdminMenuCard
                                icon={<FaPuzzlePiece className="h-5 w-5 text-white" />}
                                title="Patrones de Ganancia"
                                description="Configura patrones para eventos"
                                href="/admin/patterns"
                                buttonText="Ver Patrones"
                                buttonIcon={<FaPuzzlePiece className="h-4 w-4" />}
                            />
                            <AdminMenuCard
                                icon={<FaChartBar className="h-5 w-5 text-white" />}
                                title="Estadísticas de Eventos"
                                description="Analiza el rendimiento de eventos"
                                href="#"
                                buttonText="Ver Estadísticas"
                                buttonIcon={<FaChartBar className="h-4 w-4" />}
                                disabled={true}
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="patterns">
                        <WinningPatternsPanel />
                    </TabsContent>

                    <TabsContent value="deposits" className="space-y-4">
                        <h2 className="text-xl md:text-2xl font-bold inline-block bg-gradient-to-b from-white to-purple-200 bg-clip-text text-transparent drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]">Gestión de Depósitos</h2>

                        <div className="rounded-2xl overflow-hidden backdrop-blur-md bg-black/30 border border-white/10 shadow-[0_0_15px_rgba(123,58,237,0.2)] relative">
                            {/* Decorative elements for glassmorphism effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-indigo-900/20 z-0"></div>

                            {/* Encabezado con gradiente */}
                            <div className="w-full relative z-10 bg-gradient-to-r from-purple-700 to-indigo-700 shadow-md p-4">
                                <div className="text-center">
                                    <h3 className="text-xl font-bold text-white">Depósitos y Transacciones</h3>
                                </div>
                                <div className="text-white/70 text-xs text-center mt-2">
                                    Supervisa y gestiona todos los movimientos económicos dentro de la plataforma
                                </div>
                            </div>

                            {/* Contenido */}
                            <div className="w-full p-4 bg-black/20 backdrop-blur-sm relative z-10">
                                <div className="rounded-lg bg-white/5 p-4 backdrop-blur-sm flex flex-row justify-between items-center mb-4 border border-white/10 shadow-inner">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-gradient-to-r from-purple-700 to-indigo-600 p-2 rounded-lg shadow-[0_0_8px_rgba(139,92,246,0.5)]">
                                            <FaMoneyBillWave className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <h4 className="text-white text-base font-semibold">Gestión de Pagos</h4>
                                            <p className="text-gray-300 text-sm">Revisa y aprueba las solicitudes de depósito</p>
                                        </div>
                                    </div>
                                </div>

                                <Link href="/admin/deposits" passHref className="w-full block mt-4">
                                    <Button className="w-full bg-gradient-to-r from-purple-700 to-indigo-700 hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] border border-white/10 gap-2 py-5 font-medium transition-all">
                                        <FaMoneyBillWave className="h-4 w-4" /> Administrar Depósitos
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="users" className="space-y-4">
                        <h2 className="text-2xl font-bold mb-4 inline-block bg-gradient-to-b from-white to-purple-200 bg-clip-text text-transparent drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]">Gestión de Usuarios</h2>

                        <div className="rounded-2xl overflow-hidden backdrop-blur-md bg-black/30 border border-white/10 shadow-[0_0_15px_rgba(123,58,237,0.2)] relative">
                            {/* Decorative elements for glassmorphism effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-indigo-900/20 z-0"></div>

                            {/* Encabezado con gradiente */}
                            <div className="w-full relative z-10 bg-gradient-to-r from-purple-700 to-indigo-700 shadow-md p-4">
                                <div className="text-center">
                                    <h3 className="text-xl font-bold text-white">Usuarios del Sistema</h3>
                                </div>
                                <div className="text-white/70 text-xs text-center mt-2">
                                    Administra los usuarios, sus permisos y monitorea la actividad en la plataforma
                                </div>
                            </div>

                            {/* Contenido */}
                            <div className="w-full p-4 bg-black/20 backdrop-blur-sm relative z-10">
                                <div className="rounded-lg bg-white/5 p-4 backdrop-blur-sm flex flex-row justify-between items-center mb-4 border border-white/10 shadow-inner">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-gradient-to-r from-purple-700 to-indigo-600 p-2 rounded-lg shadow-[0_0_8px_rgba(139,92,246,0.5)]">
                                            <FaUsers className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <h4 className="text-white text-base font-semibold">Usuarios Activos</h4>
                                            <p className="text-gray-300 text-sm">Gestiona roles y permisos del sistema</p>
                                        </div>
                                    </div>
                                </div>

                                <Button disabled className="w-full bg-gradient-to-r from-purple-700 to-indigo-700 opacity-70 hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] border border-white/10 gap-2 py-5 font-medium transition-all mt-4">
                                    <FaCogs className="h-4 w-4" /> Configurar Usuarios
                                </Button>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="stats" className="space-y-4">
                        <h2 className="text-2xl font-bold inline-block bg-gradient-to-b from-white to-purple-200 bg-clip-text text-transparent drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]">Estadísticas del Sistema</h2>

                        <div className="rounded-2xl overflow-hidden backdrop-blur-md bg-black/30 border border-white/10 shadow-[0_0_15px_rgba(123,58,237,0.2)] relative">
                            {/* Decorative elements for glassmorphism effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-indigo-900/20 z-0"></div>

                            {/* Encabezado con gradiente */}
                            <div className="w-full relative z-10 bg-gradient-to-r from-purple-700 to-indigo-700 shadow-md p-4">
                                <div className="text-center">
                                    <h3 className="text-xl font-bold text-white">Métricas y Analíticas</h3>
                                </div>
                                <div className="text-white/70 text-xs text-center mt-2">
                                    Visualiza estadísticas detalladas del rendimiento y uso de la plataforma
                                </div>
                            </div>

                            {/* Contenido */}
                            <div className="w-full p-4 bg-black/20 backdrop-blur-sm relative z-10">
                                <div className="rounded-lg bg-white/5 p-4 backdrop-blur-sm flex flex-row justify-between items-center mb-4 border border-white/10 shadow-inner">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-gradient-to-r from-purple-700 to-indigo-600 p-2 rounded-lg shadow-[0_0_8px_rgba(139,92,246,0.5)]">
                                            <FaChartBar className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <h4 className="text-white text-base font-semibold">Estadísticas Avanzadas</h4>
                                            <p className="text-gray-300 text-sm">Analiza el comportamiento y rendimiento</p>
                                        </div>
                                    </div>
                                </div>

                                <Button disabled className="w-full bg-gradient-to-r from-purple-700 to-indigo-700 opacity-70 hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] border border-white/10 gap-2 py-5 font-medium transition-all mt-4">
                                    <FaChartBar className="h-4 w-4" /> Ver Estadísticas
                                </Button>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </AdminRouteGuard>
    );
}
