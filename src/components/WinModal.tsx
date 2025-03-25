'use client';

import { useBingoStore } from '@/lib/stores/bingo';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
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
                    console.log("Winner state detected:", currentWinnerState);
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
            console.log("isWinner changed to true");
            setIsOpen(true);
        }
    }, [isWinner]);

    // Debug on every render
    console.log("WinModal rendering, isWinner:", isWinner, "isOpen:", isOpen);

    const handleClose = () => {
        setIsOpen(false);
        clearWinner();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            if (!open) handleClose();
            else setIsOpen(true);
        }}>
            <DialogContent className="sm:max-w-[500px] max-w-[95vw]">
                <DialogHeader className="flex items-center flex-col">
                    <FaTrophy className="text-yellow-400 text-5xl mb-4" />
                    <DialogTitle className="text-2xl text-center">¡BINGO!</DialogTitle>
                </DialogHeader>
                <div className="py-6 text-center">
                    <p className="text-lg mb-2">¡Felicidades, has completado un patrón ganador!</p>
                    <p className="text-sm text-gray-600">Tu victoria ha sido verificada y registrada.</p>
                </div>
                <DialogFooter>
                    <Button
                        onClick={handleClose}
                        className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-lg py-6"
                    >
                        ¡Genial!
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
