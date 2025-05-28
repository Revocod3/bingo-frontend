'use client';

import { useEventPatterns } from '@/src/hooks/api/useWinningPatterns';
import BingoPatternVisualizer from '@/src/components/BingoPatternVisualizer';

export default function BingoPatternsDisplay({ eventId }: { eventId: string }) {
    const { data: patterns, isLoading } = useEventPatterns(eventId);

    if (isLoading) {
        return <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#7C3AED]"></div>
        </div>;
    }

    if (!patterns || patterns.length === 0) {
        return (
            <div className="rounded-lg backdrop-blur-md bg-black/20 border border-white/10 p-4 shadow-lg">
                <p className="text-lg font-semibold text-center text-white">Patrones ganadores para este evento</p>
                <p className="text-sm text-center text-gray-300 mt-2">No hay patrones configurados para este evento.</p>
            </div>
        );
    }

    return (
        <div>
            <p className="text-sm text-gray-300 mb-4">
                Todos los patrones disponibles para este evento.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 relative z-10">
                {patterns.map((pattern) => (
                    <div
                        key={pattern.id}
                        className="flex flex-col items-center p-3 rounded-lg backdrop-blur-md bg-black/20 border border-white/10 shadow-[0_0_8px_rgba(123,58,237,0.15)] transition-all hover:shadow-[0_0_12px_rgba(123,58,237,0.25)]"
                    >
                        <div className="my-2 text-center">
                            <h3 className="font-medium text-white">{pattern.name}</h3>
                            <p className="text-xs text-gray-300">{pattern.description}</p>
                        </div>
                        <BingoPatternVisualizer patternId={pattern.id} />
                    </div>
                ))}
            </div>
            <div className="text-sm text-center text-gray-300 mt-4">
                Para ganar, debes marcar todos los números que forman alguno de estos patrones.
            </div>
        </div>
    );
}
