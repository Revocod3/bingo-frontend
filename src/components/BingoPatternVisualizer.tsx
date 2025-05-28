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
            <div className="grid grid-cols-5 bg-gradient-to-r from-purple-700 to-indigo-700 text-white rounded-t-md shadow-md">
                {columns.map((letter, idx) => (
                    <div key={idx} className="text-center font-bold py-1 text-xs">
                        <span className="inline-block bg-gradient-to-b from-white to-purple-200 bg-clip-text text-transparent drop-shadow-[0_0_1px_rgba(255,255,255,0.5)]">
                            {letter}
                        </span>
                    </div>
                ))}
            </div>

            {/* Visualización del patrón */}
            <div className="grid grid-cols-5 gap-1 p-2 bg-black/20 backdrop-blur-sm rounded-b-md">
                {cells.map((isMarked, index) => {
                    const row = Math.floor(index / 5);
                    const col = index % 5;
                    const isFreeCell = row === 2 && col === 2; // Center cell (FREE)

                    return (
                        <div
                            key={index}
                            className={cn(
                                "aspect-square flex items-center justify-center rounded-lg text-xs transition-all duration-200 backdrop-blur-sm shadow-sm border border-white/5",
                                isMarked
                                    ? "bg-purple-500/30 text-white border-purple-500/30 shadow-[0_0_10px_rgba(139,92,246,0.3)]"
                                    : isFreeCell
                                        ? "bg-gradient-to-br from-green-400/30 to-emerald-500/30 text-emerald-300 border-emerald-400/20"
                                        : "bg-white/10 text-gray-300",
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
