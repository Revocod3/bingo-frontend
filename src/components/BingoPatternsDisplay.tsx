'use client';

import { useEventPatterns } from '@/src/hooks/api/useWinningPatterns';
import BingoPatternVisualizer from '@/src/components/BingoPatternVisualizer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';

export default function BingoPatternsDisplay({ eventId }: { eventId: string }) {
    const { data: patterns, isLoading } = useEventPatterns(eventId);

    if (isLoading) {
        return <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#7C3AED]"></div>
        </div>;
    }

    if (!patterns || patterns.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Patrones ganadores para este evento</CardTitle>
                    <CardDescription>No hay patrones configurados para este evento.</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardDescription>Todos los patrones disponibles para este evento.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {patterns.map((pattern) => (
                        <div key={pattern.id} className="flex flex-col items-center">
                            <div className="my-2 text-center">
                                <h3 className="font-medium">{pattern.name}</h3>
                                <p className="text-xs text-muted-foreground">{pattern.description}</p>
                            </div>
                            <BingoPatternVisualizer patternId={pattern.id} />
                        </div>
                    ))}
                </div>
            </CardContent>
            <div className="text-sm text-center text-muted-foreground m-2">
                Para ganar, debes marcar todos los números que forman alguno de estos patrones.
            </div>
        </Card>
    );
}
