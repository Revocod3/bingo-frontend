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
            <Tabs defaultValue="line">
                <TabsList className="grid w-full grid-cols-4">
                    {patterns.map((pattern) => (
                        <TabsTrigger key={pattern.id} value={pattern.id}>
                            {pattern.name}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {patterns.map((pattern) => (
                    <TabsContent key={pattern.id} value={pattern.id} className="mt-4">
                        <h3 className="text-lg font-medium mb-2">{pattern.name}</h3>
                        <p className="text-sm text-gray-500 mb-4">{pattern.description}</p>

                        <div className="grid grid-cols-5 gap-1 max-w-xs mx-auto">
                            {pattern.pattern.flat().map((cell, index) => (
                                <div
                                    key={index}
                                    className={`aspect-square flex items-center justify-center rounded-md ${cell
                                            ? 'bg-[#DDD6FE] border-[#7C3AED] border-2'
                                            : 'bg-gray-100 border border-gray-200'
                                        }`}
                                >
                                    {cell === 1 && index === 12 ? 'FREE' : ''}
                                </div>
                            ))}
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}
