import React from 'react';
import { BingoPattern, BINGO_PATTERNS } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface BingoPatternDisplayProps {
    pattern?: BingoPattern;
    showAllPatterns?: boolean;
    onSelectPattern?: (pattern: BingoPattern) => void;
}

export const BingoPatternDisplay: React.FC<BingoPatternDisplayProps> = ({
    pattern,
    showAllPatterns = false,
    onSelectPattern
}) => {
    const patternsToShow = showAllPatterns
        ? Object.values(BINGO_PATTERNS)
        : pattern ? [pattern] : [];

    if (patternsToShow.length === 0) return null;

    return (
        <div className={showAllPatterns ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" : ""}>
            {patternsToShow.map((p) => (
                <Card
                    key={p.name}
                    className={cn(
                        "overflow-hidden transition-all",
                        onSelectPattern && "cursor-pointer hover:border-[#7C3AED] hover:shadow-md",
                        pattern?.name === p.name && "border-[#7C3AED] ring-1 ring-[#7C3AED]"
                    )}
                    onClick={() => onSelectPattern?.(p)}
                >
                    <CardHeader className="p-3">
                        <CardTitle className="text-sm">{p.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-0">
                        <div className="grid grid-cols-5 gap-1 aspect-square">
                            {Array.from({ length: 25 }).map((_, idx) => (
                                <div
                                    key={idx}
                                    className={cn(
                                        "aspect-square w-full rounded-sm border border-gray-200",
                                        p.cells.includes(idx) && "bg-[#7C3AED]/20 border-[#7C3AED]"
                                    )}
                                />
                            ))}
                        </div>
                        {!showAllPatterns && (
                            <p className="text-xs text-muted-foreground mt-2">{p.description}</p>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default BingoPatternDisplay;
