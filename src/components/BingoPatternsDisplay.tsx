'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEventPatterns } from '@/hooks/api/useWinningPatterns';

interface BingoPatternsDisplayProps {
    eventId: string | number;
}

export default function BingoPatternsDisplay({ eventId }: BingoPatternsDisplayProps) {
    const [activeTab, setActiveTab] = useState<string>('0');
    const { data: patterns, isLoading } = useEventPatterns(eventId);

    // Resetear a la primera pestaña cuando cambian los patrones
    useEffect(() => {
        if (patterns && patterns.length > 0) {
            setActiveTab(String(0));
        }
    }, [patterns]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#7C3AED]"></div>
            </div>
        );
    }

    if (!patterns || patterns.length === 0) {
        return (
            <div className="p-4 bg-gray-50 rounded-md border border-gray-200 text-center">
                <p className="text-gray-500">No hay patrones configurados para este evento.</p>
            </div>
        );
    }

    return (
        <div className="bg-white shadow-sm rounded-md border border-gray-100 overflow-hidden">
            <Tabs
                defaultValue={activeTab}
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
            >
                <TabsList className="w-full border-b border-gray-100 px-2 py-1 bg-gray-50">
                    {patterns.map((pattern, index) => (
                        <TabsTrigger
                            key={pattern.id}
                            value={String(index)}
                            className="px-3 py-1.5 text-xs"
                        >
                            {pattern.name}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {patterns.map((pattern, index) => (
                    <TabsContent key={pattern.id} value={String(index)}>
                        <div className="p-4">
                            <div className="mb-2 text-center">
                                <h3 className="text-lg font-semibold">{pattern.name}</h3>
                                {pattern.description && (
                                    <p className="text-sm text-gray-500 mt-1">{pattern.description}</p>
                                )}
                            </div>

                            <div className="flex justify-center my-4">
                                <div className="grid grid-cols-5 gap-1.5 max-w-[200px] sm:max-w-[250px]">
                                    {pattern.pattern.flat().map((cell, index) => {
                                        const isCenterCell = index === 12; // Central cell (FREE)
                                        return (
                                            <div
                                                key={index}
                                                className={`
                                                    aspect-square flex items-center justify-center rounded-md text-xs
                                                    ${isCenterCell ? 'bg-amber-100 border-amber-300 border-2 text-amber-800' : ''}
                                                    ${cell && !isCenterCell ? 'bg-[#DDD6FE] border-[#7C3AED] border-2 shadow-sm' : ''}
                                                    ${!cell ? 'bg-gray-100 border border-gray-200' : ''}
                                                `}
                                            >
                                                {isCenterCell ? 'FREE' : ''}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="text-sm text-center text-muted-foreground mt-4">
                                Para ganar, debes marcar todos los números que forman este patrón.
                            </div>
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}
