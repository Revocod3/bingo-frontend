'use client';

import { useBingoStore } from '@/lib/stores/bingo';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { toast } from 'sonner';

export function WinModal() {
    const { isWinner, clearWinner } = useBingoStore();

    useEffect(() => {
        if (isWinner) {
            toast.success('¡Felicidades, has ganado!');
        }
    }, [isWinner]);

    return (
        <Dialog open={isWinner} onOpenChange={(open) => { if (!open) clearWinner(); }}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>¡BINGO!</DialogTitle>
                </DialogHeader>
                <div className="py-4 text-center">
                    <p className="text-lg">¡Felicidades, has completado un patrón ganador!</p>
                </div>
                <DialogFooter>
                    <Button onClick={() => clearWinner()} className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white">
                        Cerrar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
