import { BingoCard } from '@/src/lib/api/types';
import { getCardNumbers } from '@/src/lib/utils';
import { cn } from '@/lib/utils';
import { FaStar } from 'react-icons/fa';

interface CardPreviewProps {
    card: BingoCard;
    isCompact?: boolean;
}

export default function CardPreview({ card, isCompact = false }: CardPreviewProps) {
    const cardMatrix = getCardNumbers(card);
    const columns = ['B', 'I', 'N', 'G', 'O'];
    const cardIdentifier = card.correlative_id || card.id;

    return (
        <div className={cn(
            "rounded-xl overflow-hidden transition-all relative",
            "backdrop-blur-md bg-black/30 border border-white/10",
            "shadow-[0_0_15px_rgba(123,58,237,0.2)] hover:shadow-[0_0_25px_rgba(123,58,237,0.4)]",
            isCompact ? "max-w-[200px]" : "max-w-[250px]"
        )}>
            {/* Background glow effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-indigo-900/20 z-0"></div>

            {/* Card Header with ID */}
            <div className="relative z-10 bg-gradient-to-r from-purple-700 to-indigo-700 text-white text-center py-2 px-2">
                <p className={cn("font-medium", isCompact ? "text-xs" : "text-sm")}>
                    Cartón #{cardIdentifier.toString()}
                </p>
            </div>

            {/* Bingo Header Row */}
            <div className="grid grid-cols-5 relative z-10 bg-gradient-to-r from-purple-700 to-indigo-700 shadow-md">
                {columns.map((letter, idx) => (
                    <div key={idx} className={cn(
                        "text-center font-bold py-2 text-white",
                        isCompact ? "text-xs" : "text-sm"
                    )}>
                        <span className="inline-block bg-gradient-to-b from-white to-purple-200 bg-clip-text text-transparent drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]">
                            {letter}
                        </span>
                    </div>
                ))}
            </div>

            {/* Card Numbers */}
            <div className={cn(
                "grid grid-cols-5 gap-1 p-2 bg-black/20 backdrop-blur-sm relative z-10",
                isCompact ? "gap-0.5 p-1" : "gap-1 p-2"
            )}>
                {cardMatrix.map((row, rowIdx) => (
                    row.map((num, colIdx) => {
                        const isFree = num === 'N0';

                        return (
                            <div
                                key={`${rowIdx}-${colIdx}`}
                                className={cn(
                                    "aspect-square flex items-center justify-center rounded-lg font-medium",
                                    "transition-all duration-200 backdrop-blur-sm shadow-sm",
                                    "border border-white/5",
                                    isCompact ? "text-xs" : "text-sm",
                                    isFree
                                        ? "bg-gradient-to-br from-green-400/30 to-emerald-500/30 text-emerald-300 border-emerald-400/20"
                                        : "bg-white/10 text-gray-200"
                                )}
                            >
                                {isFree ? <FaStar className={isCompact ? "h-2 w-2" : "h-3 w-3"} /> : num.substring(1)}
                            </div>
                        );
                    })
                ))}
            </div>
        </div>
    );
}
