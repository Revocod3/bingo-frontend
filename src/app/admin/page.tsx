'use client';

import { useState } from 'react';
import Link from 'next/link';
import AdminRouteGuard from '@/components/AdminRouteGuard';
import { Card, CardContent, CardDescription, CardHeader, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FaCalendarAlt, FaUsers, FaChartBar, FaPuzzlePiece, FaCogs, FaArrowLeft, FaMoneyBillWave } from 'react-icons/fa';
import EventManagementPanel from '@/components/admin/EventManagementPanel';
import WinningPatternsPanel from '@/components/admin/WinningPatternsPanel';
import { useCurrentUser } from '@/hooks/api/useUsers';

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState('events');
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
                        <Card className="overflow-hidden shadow-md hover:shadow-lg gap-4 transition-shadow pt-0 border-0 rounded-lg">
                            <div className="relative h-28 bg-gradient-to-r from-emerald-700 to-green-700 rounded-t-lg opacity-80">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <h3 className="text-2xl font-bold text-white">Depósitos y Transacciones</h3>
                                </div>
                            </div>
                            <CardHeader>
                                <CardDescription>
                                    Administra los depósitos y transacciones de los usuarios
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-lg bg-emerald-50 py-3 px-4 dark:bg-emerald-950/50 flex flex-row justify-between items-center mb-4">
                                    <div className="flex items-center gap-2">
                                        <FaMoneyBillWave className="h-4 w-4 text-emerald-500" />
                                        <h4 className="text-emerald-600 text-sm font-semibold dark:text-emerald-400">Gestión de Pagos</h4>
                                    </div>
                                    <p className="text-gray-500">Ver y administrar los depósitos</p>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Link href="/admin/deposits" passHref>
                                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 gap-1 cursor-pointer">
                                        <FaMoneyBillWave className="h-3 w-3" /> Ver Depósitos
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    <TabsContent value="users" className="space-y-4">
                        <h2 className="text-2xl font-bold mb-4">Gestión de Usuarios</h2>
                        <Card className="overflow-hidden shadow-md hover:shadow-lg gap-4 transition-shadow pt-0 border-0 rounded-lg">
                            <div className="relative h-28 bg-gradient-to-r from-blue-700 to-cyan-700 rounded-t-lg opacity-80">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <h3 className="text-2xl font-bold text-white">Usuarios del Sistema</h3>
                                </div>
                            </div>
                            <CardHeader>
                                <CardDescription>
                                    Administra los usuarios de la plataforma, permisos y roles
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-lg bg-blue-50 py-3 px-4 dark:bg-blue-950/50 flex flex-row justify-between items-center mb-4">
                                    <div className="flex items-center gap-2">
                                        <FaUsers className="h-4 w-4 text-blue-500" />
                                        <h4 className="text-blue-600 text-sm font-semibold dark:text-blue-400">Usuarios Activos</h4>
                                    </div>
                                    <p className="text-gray-500">Funcionalidad en desarrollo</p>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button disabled className="bg-blue-600 hover:bg-blue-700 gap-1 cursor-pointer">
                                    <FaCogs className="h-3 w-3" /> Configurar Usuarios
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    <TabsContent value="stats" className="space-y-4">
                        <h2 className="text-2xl font-bold mb-4">Estadísticas del Sistema</h2>
                        <Card className="overflow-hidden shadow-md hover:shadow-lg gap-4 transition-shadow pt-0 border-0 rounded-lg">
                            <div className="relative h-28 bg-gradient-to-r from-green-700 to-emerald-700 rounded-t-lg opacity-80">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <h3 className="text-2xl font-bold text-white">Métricas y Analíticas</h3>
                                </div>
                            </div>
                            <CardHeader>
                                <CardDescription>
                                    Visualiza estadísticas de uso y rendimiento de la plataforma
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-lg bg-green-50 py-3 px-4 dark:bg-green-950/50 flex flex-row justify-between items-center mb-4">
                                    <div className="flex items-center gap-2">
                                        <FaChartBar className="h-4 w-4 text-green-500" />
                                        <h4 className="text-green-600 text-sm font-semibold dark:text-green-400">Estadísticas Avanzadas</h4>
                                    </div>
                                    <p className="text-gray-500">Funcionalidad en desarrollo</p>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button disabled className="bg-green-600 hover:bg-green-700 gap-1 cursor-pointer">
                                    <FaChartBar className="h-3 w-3" /> Ver Estadísticas
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AdminRouteGuard>
    );
}
