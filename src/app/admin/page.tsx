'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminRouteGuard from '@/components/AdminRouteGuard';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FaCalendarPlus, FaListAlt, FaUserCog, FaChartBar } from 'react-icons/fa';
import { useEvents } from '@/hooks/api/useEvents';
import { formatDistanceToNow } from 'date-fns';
import TestCoinBadge from '@/components/TestCoinBadge';
import EventManagementPanel from '@/components/admin/EventManagementPanel';

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState('events');
    const router = useRouter();

    return (
        <AdminRouteGuard>
            <div className="container mx-auto py-24 px-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Panel de Administración</h1>
                        <p className="text-gray-500 mt-2">
                            Gestiona eventos, usuarios y configuración del sistema
                        </p>
                    </div>

                    <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-4">
                        <Link href="/dashboard" passHref>
                            <Button variant="outline" className="gap-2 text-gray-600">
                                Volver al Dashboard
                            </Button>
                        </Link>
                        <TestCoinBadge />
                    </div>
                </div>

                <Tabs defaultValue="events" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="events" className="flex items-center gap-2">
                            <FaCalendarPlus /> Gestión de Eventos
                        </TabsTrigger>
                        <TabsTrigger value="users" className="flex items-center gap-2">
                            <FaUserCog /> Usuarios
                        </TabsTrigger>
                        <TabsTrigger value="stats" className="flex items-center gap-2">
                            <FaChartBar /> Estadísticas
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
