import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
    DialogOverlay,
    DialogPortal,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

// Enhanced DialogContent with better small screen support
export function ResponsiveDialogContent({
    className,
    children,
    ...props
}: React.ComponentProps<typeof DialogContent>) {
    return (
        <DialogContent
            className={cn(
                // Improve padding for very small screens
                "xs:p-3 p-4 sm:p-6",
                // Adjust max width and width constraints
                "w-[calc(100%-16px)] max-h-[calc(100vh-16px)]",
                "xs:max-w-[95vw] sm:max-w-[425px]",
                // Add scrolling support for tall content
                "overflow-y-auto",
                // Additional text sizing for very small screens
                "xs:text-sm sm:text-base",
                className
            )}
            {...props}
        >
            {children}
        </DialogContent>
    );
}

// Enhanced DialogHeader with better small screen support
export function ResponsiveDialogHeader({
    className,
    children,
    ...props
}: React.ComponentProps<typeof DialogHeader>) {
    return (
        <DialogHeader
            className={cn(
                "xs:space-y-1 sm:space-y-2",
                "xs:pb-2 sm:pb-4",
                className
            )}
            {...props}
        >
            {children}
        </DialogHeader>
    );
}

// Enhanced DialogFooter with better small screen support
export function ResponsiveDialogFooter({
    className,
    children,
    ...props
}: React.ComponentProps<typeof DialogFooter>) {
    return (
        <DialogFooter
            className={cn(
                "xs:flex-col xs:space-y-2 sm:flex-row sm:space-y-0",
                "xs:mt-2 sm:mt-4",
                "gap-2",
                className
            )}
            {...props}
        >
            {children}
        </DialogFooter>
    );
}

// Re-export other Dialog components
export {
    Dialog,
    DialogTitle,
    DialogDescription,
    DialogOverlay,
    DialogPortal,
};
