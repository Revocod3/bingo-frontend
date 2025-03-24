'use client';

import { useMemo } from 'react';

interface PatternEditorProps {
    selectedPositions: number[];
    onTogglePosition: (position: number) => void;
}

export default function PatternEditor({ selectedPositions, onTogglePosition }: PatternEditorProps) {
    // Convertimos las posiciones lineales a una matriz 5x5
    const matrix = useMemo(() => {
        const grid = Array(5).fill(0).map(() => Array(5).fill(0));

        selectedPositions.forEach(pos => {
            const row = Math.floor(pos / 5);
            const col = pos % 5;
            grid[row][col] = 1;
        });

        return grid;
    }, [selectedPositions]);

    // Las letras y rangos de números para cada columna
    const columns = [
        { letter: 'B', range: [1, 15] },
        { letter: 'I', range: [16, 30] },
        { letter: 'N', range: [31, 45] },
        { letter: 'G', range: [46, 60] },
        { letter: 'O', range: [61, 75] }
    ];

    return (
        <div>
            <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Haz clic en las celdas para formar el patrón</h3>
                <div className="grid grid-cols-5 gap-1">
                    {columns.map((col, i) => (
                        <div key={i} className="bg-purple-100 text-center font-bold text-purple-800 py-1 rounded">
                            {col.letter}
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-5 gap-1">
                {matrix.flat().map((cell, index) => {
                    const row = Math.floor(index / 5);
                    const col = index % 5;
                    const isCenterCell = row === 2 && col === 2; // Celda central (FREE)

                    return (
                        <button
                            key={index}
                            type="button"
                            className={`
                                aspect-square flex items-center justify-center rounded-md 
                                text-sm font-medium transition-all
                                ${isCenterCell ? 'bg-amber-100 border-2 border-amber-300 cursor-default' : ''}
                                ${cell && !isCenterCell ? 'bg-purple-200 border-2 border-purple-400 text-purple-800' : ''}
                                ${!cell && !isCenterCell ? 'bg-gray-100 border border-gray-300 hover:bg-gray-200' : ''}
                            `}
                            onClick={() => !isCenterCell && onTogglePosition(index)}
                            disabled={isCenterCell}
                        >
                            {isCenterCell ? 'FREE' : ''}
                        </button>
                    );
                })}
            </div>

            <div className="mt-6 p-3 bg-gray-50 rounded-md border border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Posiciones seleccionadas:</h4>
                <div className="flex flex-wrap gap-1">
                    {selectedPositions.length > 0 ? (
                        selectedPositions.sort((a, b) => a - b).map(pos => (
                            <span
                                key={pos}
                                className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full"
                            >
                                {pos}
                            </span>
                        ))
                    ) : (
                        <span className="text-sm text-gray-500">Ninguna posición seleccionada</span>
                    )}
                </div>
            </div>

            <div className="mt-4">
                <p className="text-xs text-gray-500">
                    * La posición central (12) es siempre el espacio libre y no puede ser seleccionada.
                </p>
            </div>
        </div>
    );
}
