import React from 'react';
import { BingoPattern, BINGO_PATTERNS } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface BingoPatternDisplayProps {
    pattern?: BingoPattern;
    patterns?: BingoPattern[]; // Añadida prop para recibir múltiples patrones
    showAllPatterns?: boolean;
    onSelectPattern?: (pattern: BingoPattern) => void;
    size?: 'sm' | 'md' | 'lg'; // Reincorporada la prop size
}

export const BingoPatternDisplay: React.FC<BingoPatternDisplayProps> = ({
    pattern,
    patterns,
    showAllPatterns = false,
    onSelectPattern,
    size = 'md'
}) => {
    // Usar patterns prop si está disponible, sino usar BINGO_PATTERNS predefinidos
    const patternsToShow = showAllPatterns
        ? patterns || Object.values(BINGO_PATTERNS)
        : pattern ? [pattern] : [];

    if (patternsToShow.length === 0) return null;

    // Definir tamaños según la prop size
    const cellSizes = {
        sm: 'w-3 h-3',
        md: 'w-4 h-4',
        lg: 'w-6 h-6'
    };

    const gridSizes = {
        sm: 'gap-0.5',
        md: 'gap-1',
        lg: 'gap-1.5'
    };

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
                        <div className={cn(
                            "grid grid-cols-5 aspect-square", 
                            gridSizes[size]
                        )}>
                            {Array.from({ length: 25 }).map((_, idx) => (
                                <div
                                    key={idx}
                                    className={cn(
                                        "aspect-square rounded-sm border border-gray-200",
                                        p.cells.includes(idx) && "bg-[#7C3AED]/20 border-[#7C3AED]",
                                        // Add visual cues for different pattern types
                                        p.cells.includes(idx) && getPatternTypeClass(p)
                                    )}
                                    aria-label={idx === 12 ? "Free space" : `Position ${idx}`}
                                    title={idx === 12 ? "Free space" : `Position ${Math.floor(idx / 5) + 1},${idx % 5 + 1}`}
                                />
                            ))}
                        </div>
                        {!showAllPatterns ? (
                            <p className="text-xs text-muted-foreground mt-2">{p.description}</p>
                        ) : (
                            <div className="flex items-center justify-center mt-2">
                                <span className={cn(
                                    "text-xs px-1.5 py-0.5 rounded-full",
                                    getPatternCategoryBadgeClass(p)
                                )}>
                                    {getPatternCategory(p)}
                                </span>
                            </div>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

// Helper functions to categorize and style patterns
function getPatternCategory(pattern: BingoPattern): string {
    const { cells } = pattern;
    
    // Check if it's a horizontal line
    for (let row = 0; row < 5; row++) {
        const rowCells = [row*5, row*5+1, row*5+2, row*5+3, row*5+4];
        if (rowCells.every(cell => cells.includes(cell))) {
            return 'Horizontal';
        }
    }
    
    // Check if it's a vertical line
    for (let col = 0; col < 5; col++) {
        const colCells = [col, col+5, col+10, col+15, col+20];
        if (colCells.every(cell => cells.includes(cell))) {
            return 'Vertical';
        }
    }
    
    // Check for diagonals
    const diag1 = [0, 6, 12, 18, 24];
    const diag2 = [4, 8, 12, 16, 20];
    if (diag1.every(cell => cells.includes(cell))) {
        return 'Diagonal';
    }
    if (diag2.every(cell => cells.includes(cell))) {
        return 'Diagonal';
    }
    
    // Check for corners
    const corners = [0, 4, 20, 24];
    if (corners.every(cell => cells.includes(cell)) && cells.length === 4) {
        return 'Corners';
    }
    
    // Full card
    if (cells.length === 25) {
        return 'Blackout';
    }
    
    // Default for other special patterns
    return 'Especial';
}

function getPatternCategoryBadgeClass(pattern: BingoPattern): string {
    const category = getPatternCategory(pattern);
    switch (category) {
        case 'Horizontal':
            return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
        case 'Vertical':
            return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
        case 'Diagonal':
            return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
        case 'Corners':
            return 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300';
        case 'Blackout':
            return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
        default:
            return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
    }
}

function getPatternTypeClass(pattern: BingoPattern): string {
    const category = getPatternCategory(pattern);
    switch (category) {
        case 'Horizontal':
            return 'bg-blue-100/50 border-blue-400 dark:bg-blue-900/50';
        case 'Vertical':
            return 'bg-green-100/50 border-green-400 dark:bg-green-900/50';
        case 'Diagonal':
            return 'bg-amber-100/50 border-amber-400 dark:bg-amber-900/50';
        case 'Corners':
            return 'bg-rose-100/50 border-rose-400 dark:bg-rose-900/50';
        case 'Blackout':
            return 'bg-gray-500/20 border-gray-500 dark:bg-gray-700/50';
        default:
            return 'bg-[#7C3AED]/20 border-[#7C3AED]';
    }
}

export default BingoPatternDisplay;
