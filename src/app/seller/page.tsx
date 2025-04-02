'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/hooks/api/useUsers';
import SellerDashboard from '@/components/seller/SellerDashboard';

export default function SellerPage() {
    const { data: user, isLoading } = useCurrentUser();
    const router = useRouter();

    // Check if user is a seller
    useEffect(() => {
        if (!isLoading && user) {
            // If user is not a seller, redirect to dashboard
            if (!user.is_seller) {
                router.push('/dashboard');
            }
        }
    }, [user, isLoading, router]);

    // Show loading state while checking user
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7C3AED]"></div>
            </div>
        );
    }

    // If user is not authenticated, redirect to login
    if (!user) {
        router.push('/auth/login');
        return null;
    }

    // If user is not a seller, show message (this will be briefly shown before redirect)
    if (!user.is_seller) {
        return (
            <div className="container py-8 px-4 md:py-12 max-w-5xl mx-auto">
                <div className="bg-red-50 text-red-800 p-4 rounded-lg">
                    <h2 className="text-xl font-semibold mb-2">Acceso Restringido</h2>
                    <p>No tienes permisos de vendedor para acceder a esta página.</p>
                </div>
            </div>
        );
    }

    // User is a seller, show seller dashboard
    return <SellerDashboard />;
}
