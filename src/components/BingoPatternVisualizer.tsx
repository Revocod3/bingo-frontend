'use client';

import { useWinningPatternVisualization } from '@/src/hooks/api/useWinningPatterns';
import { cn } from '@/lib/utils';

interface BingoPatternVisualizerProps {
    patternId: number;
}

export default function BingoPatternVisualizer({ patternId }: BingoPatternVisualizerProps) {
    const { data: visualization, isLoading } = useWinningPatternVisualization(patternId);
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#7C3AED]"></div>
            </div>
        );
    }

    if (!visualization || !visualization.pattern) {
        return <div className="text-center text-gray-500">No se pudo cargar la visualización del patrón</div>;
    }

    // Columnas BINGO
    const columns = ['B', 'I', 'N', 'G', 'O'];
    const { positions } = visualization.pattern;

    // Create a 5x5 grid (25 cells)
    const cells = Array.from({ length: 25 }, (_, index) => {
        // Check if the position (index) is in the positions array
        // Position is 0-based index, representing cells from left to right, top to bottom
        return positions.includes(index);
    });

    return (
        <div className="max-w-[250px] w-full">
            {/* Encabezado del cartón */}
            <div className="grid grid-cols-5 bg-[#7C3AED] text-white rounded-t-md">
                {columns.map((letter, idx) => (
                    <div key={idx} className="text-center font-bold py-1 text-xs">
                        {letter}
                    </div>
                ))}
            </div>

            {/* Visualización del patrón */}
            <div className="grid grid-cols-5 gap-1 p-1 bg-gray-50 rounded-b-md">
                {cells.map((isMarked, index) => {
                    const row = Math.floor(index / 5);
                    const col = index % 5;
                    const isFreeCell = row === 2 && col === 2; // Center cell (FREE)

                    return (
                        <div
                            key={index}
                            className={cn(
                                "aspect-square flex items-center justify-center rounded-sm text-xs",
                                isMarked
                                    ? "bg-[#7C3AED] text-white"
                                    : isFreeCell
                                        ? "bg-green-100 text-green-800"
                                        : "bg-white"
                            )}
                        >
                            {isFreeCell ? 'FREE' : ''}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
