'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface AuthGuardProps {
    children: React.ReactNode;
    adminOnly?: boolean;
}

export function AuthGuard({ children, adminOnly = false }: AuthGuardProps) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const isAdmin = session?.user?.is_staff === true;
    const isLoading = status === 'loading';

    useEffect(() => {
        if (!isLoading) {
            if (!session) {
                router.push('/auth/login');
            } else if (adminOnly && !isAdmin) {
                router.push('/dashboard');
            }
        }
    }, [session, status, isAdmin, adminOnly, router, isLoading]);

    if (isLoading) {
        return <div className="flex items-center justify-center h-screen">Cargando...</div>;
    }

    if (!session) {
        return null;
    }

    if (adminOnly && !isAdmin) {
        return null;
    }

    return <>{children}</>;
}
