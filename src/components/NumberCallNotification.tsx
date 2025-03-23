import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { formatBingoNumber } from '@/lib/utils';

interface NumberCallNotificationProps {
  number: number | null;
  previousNumber: number | null;
}

export function NumberCallNotification({ number, previousNumber }: NumberCallNotificationProps) {
  const [showNotification, setShowNotification] = useState(false);

  // Show notification when a new number is called
  useEffect(() => {
    if (number !== null && previousNumber !== number) {
      setShowNotification(true);

      // Auto-hide the notification after 5 seconds
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [number, previousNumber]);

  // Only render if we have a number
  if (!number) return null;

  return (
    <Dialog open={showNotification} onOpenChange={setShowNotification}>
      <DialogContent className="max-w-[300px] sm:max-w-md p-0 gap-0 overflow-hidden rounded-xl border-0 shadow-xl">
        <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 p-4 text-center text-white">
          <DialogHeader className="pb-2 pt-2 sm:py-3">
            <DialogTitle className="text-lg sm:text-xl text-white font-bold">
              ¡Nuevo número llamado!
            </DialogTitle>
          </DialogHeader>

          <div className="mt-2 sm:mt-4 mb-4 sm:mb-6 flex items-center justify-center">
            <div className="relative">
              {/* Previous number (smaller) */}
              {previousNumber && (
                <div className="absolute -left-14 sm:-left-20 top-1/2 -translate-y-1/2">
                  <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-white/20 flex items-center justify-center shadow-md">
                    <span className="text-white text-lg sm:text-xl font-medium">
                      {previousNumber}
                    </span>
                  </div>
                </div>
              )}

              {/* Main number (larger) */}
              <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-white flex items-center justify-center shadow-lg animate-pulse">
                <span className="text-purple-700 text-4xl sm:text-5xl font-bold">
                  {number}
                </span>
              </div>
            </div>
          </div>

          <div className="text-sm sm:text-base mb-2 sm:mb-3 text-white/90">
            {formatBingoNumber ? formatBingoNumber(number) : number}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
