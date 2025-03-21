'use client';

import { useBingoStore } from "@/lib/stores/bingo";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

// Define the shape of your number objects
interface NumberObject {
    id: string;
    value: number;
    called_at: string;
    drawn: boolean;
    event: string;
}

// Helper function to get number value regardless of format
const getNumberValue = (num: number | NumberObject): number => {
    return typeof num === 'number' ? num : num.value;
};

const getBingoColumn = (number: number | NumberObject): string => {
    const value = getNumberValue(number);
    if (value <= 15) return 'B';
    if (value <= 30) return 'I';
    if (value <= 45) return 'N';
    if (value <= 60) return 'G';
    return 'O';
};

const CalledNumbersSidebar = () => {
    const { calledNumbers, currentNumber, lastCalledAt } = useBingoStore();

    // Organize numbers by column for display
    const numbersByColumn = calledNumbers.reduce<Record<string, (number | NumberObject)[]>>(
        (acc, num) => {
            const column = getBingoColumn(num);
            if (!acc[column]) acc[column] = [];
            acc[column].push(num);
            return acc;
        },
        { 'B': [], 'I': [], 'N': [], 'G': [], 'O': [] }
    );

    // Format the relative time since the last number was called
    const getRelativeTime = () => {
        // Use the currentNumber's called_at if it's an object
        const timestamp = currentNumber && typeof currentNumber === 'object'
            ? (currentNumber as NumberObject).called_at
            : lastCalledAt;

        if (!timestamp) return '';

        try {
            return formatDistanceToNow(new Date(timestamp), {
                addSuffix: true,
                locale: es
            });
        } catch (error) {
            return String(error);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    <span>Números llamados</span>
                    <span className="text-sm font-normal text-muted-foreground">
                        {calledNumbers.length}/75
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                {/* Current Number Display */}
                {currentNumber && (
                    <div className="mb-4 text-center">
                        <div className="text-4xl font-bold mb-1 text-[#7C3AED]">
                            {getBingoColumn(currentNumber)}-{getNumberValue(currentNumber)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                            Llamado {getRelativeTime()}
                        </div>
                    </div>
                )}

                {/* Column-organized numbers */}
                <div className="flex gap-2">
                    {Object.entries(numbersByColumn).map(([column, numbers]) => (
                        <div key={column} className="flex-1">
                            <div className="bg-[#7C3AED] text-white text-center py-1 rounded-t-md font-bold">
                                {column}
                            </div>
                            <div className="border border-t-0 rounded-b-md p-1">
                                <div className="grid grid-cols-1 gap-1">
                                    {numbers
                                        .sort((a, b) => getNumberValue(a) - getNumberValue(b))
                                        .map(num => {
                                            const value = getNumberValue(num);
                                            const key = typeof num === 'object' ? num.id : value;

                                            return (
                                                <div
                                                    key={key}
                                                    className={`
                                                        text-center py-1 text-sm rounded-sm
                                                        ${currentNumber && getNumberValue(currentNumber) === value
                                                            ? 'bg-[#7C3AED]/20 font-bold'
                                                            : 'bg-gray-100'}
                                                    `}
                                                >
                                                    {value}
                                                </div>
                                            );
                                        })}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {calledNumbers.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        No hay números llamados aún
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default CalledNumbersSidebar;