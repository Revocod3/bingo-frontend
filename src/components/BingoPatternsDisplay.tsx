'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define different bingo winning patterns
const patterns = [
    {
        id: 'line',
        name: 'Línea',
        description: 'Completar una línea horizontal, vertical o diagonal.',
        pattern: [
            [1, 1, 1, 1, 1],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0]
        ]
    },
    {
        id: 'tpattern',
        name: 'Letra T',
        description: 'Completar la primera fila y la columna central.',
        pattern: [
            [1, 1, 1, 1, 1],
            [0, 0, 1, 0, 0],
            [0, 0, 1, 0, 0],
            [0, 0, 1, 0, 0],
            [0, 0, 1, 0, 0]
        ]
    },
    {
        id: 'xpattern',
        name: 'Letra X',
        description: 'Completar ambas diagonales.',
        pattern: [
            [1, 0, 0, 0, 1],
            [0, 1, 0, 1, 0],
            [0, 0, 1, 0, 0],
            [0, 1, 0, 1, 0],
            [1, 0, 0, 0, 1]
        ]
    },
    {
        id: 'fullcard',
        name: 'Cartón Completo',
        description: 'Completar todos los números del cartón.',
        pattern: [
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1]
        ]
    }
];

export default function BingoPatternsDisplay() {
    return (
        <div className="w-full">
            <Tabs defaultValue="line" className="w-full">
                {/* Make tabs list more responsive */}
                <TabsList className="w-full justify-start mb-4 overflow-x-auto flex-nowrap">
                    {patterns.map((pattern) => (
                        <TabsTrigger
                            key={pattern.id}
                            value={pattern.id}
                            className="px-3 py-1 whitespace-nowrap flex-shrink-0"
                        >
                            {pattern.name}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {/* Improve the content display for each pattern */}
                {patterns.map((pattern) => (
                    <TabsContent key={pattern.id} value={pattern.id} className="mt-4 animate-in fade-in-50">
                        <div className="space-y-3">
                            <h3 className="text-lg font-medium">{pattern.name}</h3>
                            <p className="text-sm text-gray-500">{pattern.description}</p>

                            <div className="flex justify-center my-6">
                                <div className="grid grid-cols-5 gap-1.5 max-w-[200px] sm:max-w-[250px]">
                                    {pattern.pattern.flat().map((cell, index) => (
                                        <div
                                            key={index}
                                            className={`
                                                aspect-square flex items-center justify-center rounded-md text-xs
                                                ${cell
                                                    ? 'bg-[#DDD6FE] border-[#7C3AED] border-2 shadow-sm'
                                                    : 'bg-gray-100 border border-gray-200'
                                                }
                                            `}
                                        >
                                            {cell === 1 && index === 12 ? 'FREE' : ''}
                                        </div>
                                    ))}
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
