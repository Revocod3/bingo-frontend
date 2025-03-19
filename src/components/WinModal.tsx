import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { confetti } from "@/lib/confetti"
import { useBingoStore } from "@/lib/stores/bingo"

export const WinModal = () => {
    const router = useRouter();
    const { isWinner, winnerInfo, clearWinner } = useBingoStore();
    const [open, setOpen] = useState(false);

    // Sync the open state with the isWinner state
    useEffect(() => {
        setOpen(isWinner);

        if (isWinner && winnerInfo?.isCurrentUser) {
            // Show confetti for the winner
            confetti();
        }
    }, [isWinner, winnerInfo]);

    const handleClose = () => {
        setOpen(false);
        clearWinner();
    };

    const goToDashboard = () => {
        handleClose();
        router.push('/dashboard');
    };

    if (!winnerInfo) return null;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md text-center">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                        {winnerInfo.isCurrentUser
                            ? "¡BINGO! ¡Has ganado!"
                            : "El juego ha terminado"
                        }
                    </DialogTitle>
                    <DialogDescription>
                        {winnerInfo.isCurrentUser ? (
                            <span className="text-lg text-green-600 font-semibold">
                                ¡Felicidades! Has ganado este juego de bingo.
                            </span>
                        ) : (
                            <span className="text-md">
                                El jugador <span className="font-bold">{winnerInfo.userName}</span> ha ganado este juego.
                            </span>
                        )}
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    {winnerInfo.isCurrentUser ? (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                            <p className="text-green-800">
                                Se ha transferido tu premio a tu cuenta. Puedes verificarlo en tu historial de transacciones.
                            </p>
                        </div>
                    ) : (
                        <p className="text-gray-500 mb-4">
                            Mejor suerte para la próxima ronda. Sigue jugando para aumentar tus posibilidades de ganar.
                        </p>
                    )}
                </div>

                <div className="flex justify-center gap-4 mt-2">
                    <Button variant="outline" onClick={handleClose}>
                        Seguir viendo
                    </Button>
                    <Button
                        className="bg-[#7C3AED] hover:bg-[#6D28D9]"
                        onClick={goToDashboard}
                    >
                        Volver al dashboard
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
