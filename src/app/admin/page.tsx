'use client';

import { useState } from 'react';
import Link from 'next/link';
import AdminRouteGuard from '@/components/AdminRouteGuard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FaCalendarAlt, FaUsers, FaChartBar } from 'react-icons/fa';
import TestCoinBadge from '@/components/TestCoinBadge';
import EventManagementPanel from '@/components/admin/EventManagementPanel';

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState('events');

    return (
        <AdminRouteGuard>
            <div className="container mx-auto pt-24 pb-8 px-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Panel de Administración</h1>
                        <p className="text-gray-500 mt-2">
                            Gestiona eventos, usuarios y estadísticas
                        </p>
                    </div>

                    <div className="mt-4 md:mt-0">
                        <Link href="/dashboard" passHref>
                            <Button variant="outline" className="gap-2 text-gray-600">
                                Volver al Dashboard
                            </Button>
                        </Link>
                    </div>
                </div>

                <Tabs defaultValue="events" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                    <TabsList className="mb-2 w-full overflow-x-auto">
                        <TabsTrigger value="events" className="flex items-center gap-1 sm:gap-2 flex-1">
                            <span className="sm:inline"><FaCalendarAlt /></span>
                            <span className="text-xs sm:text-sm">Eventos</span>
                        </TabsTrigger>
                        <TabsTrigger value="users" className="flex items-center gap-1 sm:gap-2 flex-1">
                            <span className="sm:inline"><FaUsers /></span>
                            <span className="text-xs sm:text-sm">Usuarios</span>
                        </TabsTrigger>
                        <TabsTrigger value="stats" className="flex items-center gap-1 sm:gap-2 flex-1">
                            <span className="sm:inline"><FaChartBar /></span>
                            <span className="text-xs sm:text-sm">Estadísticas</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="events" className="space-y-4">
                        <EventManagementPanel />
                    </TabsContent>

                    <TabsContent value="users" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Gestión de Usuarios</CardTitle>
                                <CardDescription>
                                    Administra los usuarios de la plataforma
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-500">Funcionalidad en desarrollo</p>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="stats" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Estadísticas del Sistema</CardTitle>
                                <CardDescription>
                                    Métricas y estadísticas de uso
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-500">Funcionalidad en desarrollo</p>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AdminRouteGuard>
    );
}
