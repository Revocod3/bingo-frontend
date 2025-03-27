"use client"

import { SessionProvider } from "next-auth/react";
import { QueryProvider } from './QueryProvider';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <QueryProvider>
                {children}
            </QueryProvider>
        </SessionProvider>
    );
}
