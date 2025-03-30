'use client';

import { useState, useEffect } from 'react';
import { useEventPatterns } from '@/src/hooks/api/useWinningPatterns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs';
import BingoPatternVisualizer from '@/src/components/BingoPatternVisualizer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';

export default function BingoPatternsDisplay({ eventId }: { eventId: string }) {
    const [activeTab, setActiveTab] = useState('0');
    const { data: patterns, isLoading, error } = useEventPatterns(eventId);

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
            <div className="relative w-full">
                <TabsList className="flex overflow-x-auto scrollbar-hide pb-2 max-w-full flex-nowrap">
                    {patterns.map((pattern, index) => (
                        <TabsTrigger key={pattern.id} value={index.toString()} className="px-3 py-1.5 text-xs whitespace-nowrap flex-shrink-0">
                            {pattern.name}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </div>

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
                        <div className="text-sm text-center text-muted-foreground mt-4 mb-4">
                            Para ganar, debes marcar todos los números que forman este patrón.
                        </div>
                    </Card>
                </TabsContent>
            ))}
        </Tabs>
    );
}
