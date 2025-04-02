import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useCurrentUser } from '@/hooks/api/useUsers';
import { FaHome, FaCoins, FaTicketAlt, FaUser, FaStore } from 'react-icons/fa';

export function DashboardNav() {
    const pathname = usePathname();
    const { data: user } = useCurrentUser();

    const navItems = [
        {
            title: 'Inicio',
            href: '/dashboard',
            icon: <FaHome className="mr-2 h-4 w-4" />
        },
        {
            title: 'Recargas',
            href: '/deposits',
            icon: <FaCoins className="mr-2 h-4 w-4" />
        },
        {
            title: 'Perfil',
            href: '/profile',
            icon: <FaUser className="mr-2 h-4 w-4" />
        }
    ];

    // Add seller link only for users with seller permissions
    if (user?.is_seller) {
        navItems.push({
            title: 'Vendedor',
            href: '/seller',
            icon: <FaStore className="mr-2 h-4 w-4" />
        });
    }

    return (
        <nav className="grid gap-2 p-2">
            {navItems.map((item) => (
                <Button
                    key={item.href}
                    variant={pathname === item.href ? "default" : "ghost"}
                    className={cn(
                        "flex items-center justify-start cursor-pointer",
                        pathname === item.href
                            ? "bg-[#7C3AED] hover:bg-[#6D28D9] text-white"
                            : "hover:bg-gray-100"
                    )}
                    asChild
                >
                    <Link href={item.href}>
                        {item.icon}
                        {item.title}
                    </Link>
                </Button>
            ))}
        </nav>
    );
}
