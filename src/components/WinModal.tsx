'use client';

import { useBingoStore } from '@/lib/stores/bingo';
import {
    Dialog,
    ResponsiveDialogContent,
    ResponsiveDialogHeader,
    ResponsiveDialogFooter,
    DialogTitle
} from '@/components/ui/responsive-dialog';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { FaTrophy } from 'react-icons/fa';

export function WinModal() {
    // Get direct reference to the raw state for debugging
    const isWinner = useBingoStore(state => state.isWinner);
    const clearWinner = useBingoStore(state => state.clearWinner);
    const [isOpen, setIsOpen] = useState(false);

    // Force check the store state frequently in development
    useEffect(() => {
        let checkInterval: NodeJS.Timeout;

        // Check if we're in development environment
        if (process.env.NODE_ENV === 'development') {
            // Check isWinner state every second and log it
            checkInterval = setInterval(() => {
                const currentWinnerState = useBingoStore.getState().isWinner;
                if (currentWinnerState) {
                    setIsOpen(true);
                }
            }, 1000);
        }

        return () => {
            if (checkInterval) clearInterval(checkInterval);
        };
    }, []);

    useEffect(() => {
        if (isWinner) {
            setIsOpen(true);
        }
    }, [isWinner]);

    const handleClose = () => {
        setIsOpen(false);
        clearWinner();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            if (!open) handleClose();
            else setIsOpen(true);
        }}>
            <ResponsiveDialogContent>
                <ResponsiveDialogHeader className="flex items-center flex-col">
                    <FaTrophy className="text-yellow-400 xs:text-3xl sm:text-5xl mb-4" />
                    <DialogTitle className="xs:text-xl sm:text-2xl text-center">¡BINGO!</DialogTitle>
                </ResponsiveDialogHeader>
                <div className="py-4 xs:py-2 text-center">
                    <p className="xs:text-base sm:text-lg mb-2">¡Felicidades, has completado un patrón ganador!</p>
                    <p className="xs:text-xs sm:text-sm text-gray-600">Tu victoria ha sido verificada y registrada.</p>
                </div>
                <ResponsiveDialogFooter>
                    <Button
                        onClick={handleClose}
                        className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white xs:text-base xs:py-3 sm:text-lg sm:py-6"
                    >
                        ¡Genial!
                    </Button>
                </ResponsiveDialogFooter>
            </ResponsiveDialogContent>
        </Dialog>
    );
}
