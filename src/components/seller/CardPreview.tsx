import { BingoCard } from '@/src/lib/api/types';
import { getCardNumbers } from '@/src/lib/utils';
import { cn } from '@/lib/utils';

interface CardPreviewProps {
    card: BingoCard;
    isCompact?: boolean;
}

export default function CardPreview({ card, isCompact = false }: CardPreviewProps) {
    const cardMatrix = getCardNumbers(card);
    const columns = ['B', 'I', 'N', 'G', 'O'];
    const cardSize = isCompact ? 'text-xs' : 'text-sm';
    const cellSize = isCompact ? 'w-6 h-6' : 'w-8 h-8';

    // Removed unnecessary console.log statement
    const cardIdentifier = card.correlative_id || card.id;

    return (
        <div className="bg-white rounded-md shadow-sm overflow-hidden w-fit mx-auto">
            {/* Card Header with ID */}
            <div className="bg-[#7C3AED] text-white text-center py-1 px-2">
                <p className={cn("font-medium", isCompact ? "text-xs" : "text-sm")}>
                    Cartón #{cardIdentifier.toString()}
                </p>
            </div>

            {/* Bingo Header Row */}
            <div className="grid grid-cols-5 bg-[#7C3AED]/90 text-white">
                {columns.map((letter, idx) => (
                    <div key={idx} className={cn("text-center font-bold py-1", cardSize)}>
                        {letter}
                    </div>
                ))}
            </div>

            {/* Card Numbers */}
            <div className="grid grid-cols-5 gap-1 p-1 bg-gray-50">
                {cardMatrix.map((row, rowIdx) => (
                    row.map((num, colIdx) => {
                        const isFree = num === 'N0';

                        return (
                            <div
                                key={`${rowIdx}-${colIdx}`}
                                className={cn(
                                    "flex items-center justify-center rounded-sm",
                                    cellSize,
                                    cardSize,
                                    "font-medium",
                                    isFree ? "bg-green-100 text-green-800" : "bg-white"
                                )}
                            >
                                {isFree ? 'FREE' : num.substring(1)}
                            </div>
                        );
                    })
                ))}
            </div>
        </div>
    );
}
