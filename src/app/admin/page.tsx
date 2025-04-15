'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import AdminRouteGuard from '@/components/AdminRouteGuard';
import { Card, CardContent, CardDescription, CardHeader, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FaCalendarAlt, FaUsers, FaChartBar, FaPuzzlePiece, FaCogs, FaArrowLeft, FaMoneyBillWave } from 'react-icons/fa';
import EventManagementPanel from '@/components/admin/EventManagementPanel';
import WinningPatternsPanel from '@/components/admin/WinningPatternsPanel';
import { useCurrentUser } from '@/hooks/api/useUsers';

export default function AdminPage() {
    // Use useSearchParams to get the tab from URL
    const searchParams = useSearchParams();
    const tabParam = searchParams?.get('tab') || 'events';

    const [activeTab, setActiveTab] = useState(tabParam);
    const { data: user } = useCurrentUser();

    return (
        <AdminRouteGuard>
            <div className="container mx-auto pt-8 pb-8 px-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold">Panel de Administración</h1>
                        <p className="text-gray-400 mt-2">
                            Bienvenido, {user?.first_name || 'Administrador'}! Gestiona eventos, patrones y usuarios desde este panel.
                        </p>
                    </div>

                    <div className="mt-2 md:mt-0">
                        <Link href="/dashboard" passHref>
                            <Button variant="ghost" className="hover:bg-accent hover:text-accent-foreground">
                                <FaArrowLeft className="mr-2 h-4 w-4" />
                                Dashboard
                            </Button>
                        </Link>
                    </div>
                </div>

                <Tabs defaultValue="events" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                    <TabsList className="mb-2 w-full overflow-x-auto">
                        <TabsTrigger value="events" className="flex items-center gap-1 sm:gap-2 flex-1 cursor-pointer">
                            <span className="sm:inline"><FaCalendarAlt /></span>
                            <span className="text-xs sm:text-sm">Eventos</span>
                        </TabsTrigger>
                        <TabsTrigger value="patterns" className="flex items-center gap-1 sm:gap-2 flex-1 cursor-pointer">
                            <span className="sm:inline"><FaPuzzlePiece /></span>
                            <span className="text-xs sm:text-sm">Patrones</span>
                        </TabsTrigger>
                        <TabsTrigger value="deposits" className="flex items-center gap-1 sm:gap-2 flex-1 cursor-pointer">
                            <span className="sm:inline"><FaMoneyBillWave /></span>
                            <span className="text-xs sm:text-sm">Depósitos</span>
                        </TabsTrigger>
                        <TabsTrigger value="users" className="flex items-center gap-1 sm:gap-2 flex-1 cursor-pointer">
                            <span className="sm:inline"><FaUsers /></span>
                            <span className="text-xs sm:text-sm">Usuarios</span>
                        </TabsTrigger>
                        <TabsTrigger value="stats" className="flex items-center gap-1 sm:gap-2 flex-1 cursor-pointer">
                            <span className="sm:inline"><FaChartBar /></span>
                            <span className="text-xs sm:text-sm">Estadísticas</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="events" className="space-y-4">
                        <h2 className="text-xl md:text-2xl font-bold ">Gestión de Eventos</h2>
                        <EventManagementPanel />
                    </TabsContent>

                    <TabsContent value="patterns" className="space-y-4">
                        <h2 className="text-xl md:text-2xl font-bold">Gestión de Patrones</h2>
                        <WinningPatternsPanel />
                    </TabsContent>

                    <TabsContent value="deposits" className="space-y-4">
                        <h2 className="text-xl md:text-2xl font-bold">Gestión de Depósitos</h2>
                        <Card className="overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 rounded-xl">
                            <div className="relative h-16 bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] rounded-t-xl">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <FaMoneyBillWave className="absolute opacity-10 h-32 w-32 text-white/20" />
                                    <h3 className="text-2xl font-bold text-white drop-shadow-md">Depósitos y Transacciones</h3>
                                </div>
                            </div>
                            <CardHeader className="pb-2">
                                <CardDescription className="text-sm">
                                    Supervisa y gestiona todos los movimientos económicos dentro de la plataforma
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-lg bg-[#DDD6FE]/20 py-4 px-4 flex flex-row justify-between items-center mb-4 border border-[#DDD6FE]/50">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-[#7C3AED] p-2 rounded-lg">
                                            <FaMoneyBillWave className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <h4 className="text-[#7C3AED] text-base font-semibold">Gestión de Pagos</h4>
                                            <p className="text-gray-500 text-sm">Revisa y aprueba las solicitudes de depósito</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Link href="/admin/deposits" passHref className="w-full">
                                    <Button className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] gap-2 py-5 font-medium transition-all">
                                        <FaMoneyBillWave className="h-4 w-4" /> Administrar Depósitos
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    <TabsContent value="users" className="space-y-4">
                        <h2 className="text-2xl font-bold mb-4">Gestión de Usuarios</h2>
                        <Card className="overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 rounded-xl">
                            <div className="relative h-16 bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] rounded-t-xl">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <FaUsers className="absolute opacity-10 h-32 w-32 text-white/20" />
                                    <h3 className="text-2xl font-bold text-white drop-shadow-md">Usuarios del Sistema</h3>
                                </div>
                            </div>
                            <CardHeader className="pb-2">
                                <CardDescription className="text-sm">
                                    Administra los usuarios, sus permisos y monitorea la actividad en la plataforma
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-lg bg-[#DDD6FE]/20 py-4 px-4 flex flex-row justify-between items-center mb-4 border border-[#DDD6FE]/50">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-[#7C3AED] p-2 rounded-lg">
                                            <FaUsers className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <h4 className="text-[#7C3AED] text-base font-semibold">Usuarios Activos</h4>
                                            <p className="text-gray-500 text-sm">Gestiona roles y permisos del sistema</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button disabled className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] opacity-70 gap-2 py-5 font-medium transition-all">
                                    <FaCogs className="h-4 w-4" /> Configurar Usuarios
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    <TabsContent value="stats" className="space-y-4">
                        <h2 className="text-2xl font-bold">Estadísticas del Sistema</h2>
                        <Card className="overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 rounded-xl">
                            <div className="relative h-16 bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] rounded-t-xl">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <FaChartBar className="absolute opacity-10 h-32 w-32 text-white/20" />
                                    <h3 className="text-2xl font-bold text-white drop-shadow-md">Métricas y Analíticas</h3>
                                </div>
                            </div>
                            <CardHeader className="pb-2">
                                <CardDescription className="text-sm">
                                    Visualiza estadísticas detalladas del rendimiento y uso de la plataforma
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-lg bg-[#DDD6FE]/20 py-4 px-4 flex flex-row justify-between items-center mb-4 border border-[#DDD6FE]/50">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-[#7C3AED] p-2 rounded-lg">
                                            <FaChartBar className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <h4 className="text-[#7C3AED] text-base font-semibold">Estadísticas Avanzadas</h4>
                                            <p className="text-gray-500 text-sm">Analiza el comportamiento y rendimiento</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button disabled className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] opacity-70 gap-2 py-5 font-medium transition-all">
                                    <FaChartBar className="h-4 w-4" /> Ver Estadísticas
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AdminRouteGuard>
    );
}
