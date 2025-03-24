'use client';

import { useState, useEffect } from 'react';
import { useEventPatterns } from '@/src/hooks/api/useWinningPatterns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs';
import BingoPatternVisualizer from '@/src/components/BingoPatternVisualizer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';

export default function BingoPatternsDisplay({ eventId }: { eventId: string }) {
    const [activeTab, setActiveTab] = useState('0');
    const { data: patterns, isLoading, error } = useEventPatterns(eventId);

    // Debug para verificar los patrones cargados
    useEffect(() => {
        if (patterns) {
            console.log("Patrones cargados:", patterns);
        }
        if (error) {
            console.error("Error al cargar patrones:", error);
        }
    }, [patterns, error]);

    // Resetear a la primera pestaña cuando cambian los patrones
    useEffect(() => {
        if (patterns && patterns.length > 0) {
            setActiveTab('0');
        }
    }, [patterns]);

    if (isLoading) {
        return <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#7C3AED]"></div>
        </div>;
    }

    if (!patterns || patterns.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Patrones de Ganancia</CardTitle>
                    <CardDescription>No hay patrones configurados para este evento.</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-flow-col auto-cols-fr mb-4">
                {patterns.map((pattern, index) => (
                    <TabsTrigger key={pattern.id} value={index.toString()}>
                        {pattern.name}
                    </TabsTrigger>
                ))}
            </TabsList>

            {patterns.map((pattern, index) => (
                <TabsContent key={pattern.id} value={index.toString()}>
                    <Card>
                        <CardHeader>
                            <CardTitle>{pattern.name}</CardTitle>
                            <CardDescription>{pattern.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex justify-center">
                            <BingoPatternVisualizer patternId={pattern.id} />
                        </CardContent>
                    </Card>
                </TabsContent>
            ))}
        </Tabs>
    );
}
