"use client"

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { LogoutIcon } from '@/components/ui/logout';
import { useAuthStatus } from '@/hooks/useAuthStatus';
import { useLogout } from '../hooks/api';
import { signOut } from 'next-auth/react';
import { SettingsGearIcon } from './ui/settings-gear';
import { UserIcon } from './ui/user';
import { CircleDollarSignIcon } from './ui/circle-dollar-sign';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, isAdmin, isSeller } = useAuthStatus();
  const logoutAPI = useLogout(); // Renamed to avoid confusion

  // Check if current route is an auth page
  const isHome = () => {
    return pathname === '/'
  };

  // Navigation links array
  const navigationLinks = [
    { name: 'Características', href: '#features' },
    { name: 'Como jugar', href: '#how-to-play' },
    { name: 'Contacto', href: 'https://wa.me/+57322031537' },
  ];

  // Toggle menu for mobile
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    try {
      // First, call our API logout if needed
      if (typeof logoutAPI === 'function') {
        await logoutAPI();
      }

      // Then use NextAuth's signOut for proper session cleanup
      await signOut({ redirect: true, callbackUrl: '/' });

      // Note: The redirect is handled by NextAuth, so we don't need to manually redirect
    } catch (error) {
      console.error('Error during logout:', error);
      // Fallback redirect in case of error
      window.location.href = '/';
    }
  };

  return (
    <header className="bg-[#1F1A4B] shadow-sm sticky top-0 z-50 text-white">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-26">
        <div className="flex justify-between h-16 items-center">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <Link href={
              isAuthenticated ? '/dashboard' : '/'
            } className="font-bold text-xl">
              <Image src="/logo.svg" alt="Logo" width={140} height={40} />
            </Link>
          </div>

          {/* Mobile menu button - positioned to the far right */}
          {isHome() && (
            <div className="flex md:hidden ml-auto">
              <button
                type="button"
                className="text-white cursor-pointer"
                onClick={toggleMenu}
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          )}

          {/* Desktop Navigation */}
          {isHome() && (
            <div className="hidden md:flex md:items-center">
              <nav className="flex space-x-4">
                {navigationLinks.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    className="text-white hover:text-gray-200 transition-colors font-regular"
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </div>
          )}


          {/* Mostrar diferentes opciones según autenticación */}
          <div className="flex items-center space-x-1 md:space-x-4">
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="flex items-center space-x-1 text-white hover:bg-white/2 transition-colors cursor-pointer rounded-lg md:pl-2 md:px-4"
                  >
                    <SettingsGearIcon size={18} />
                    <span className='hidden md:block'>Admin</span>
                  </Link>
                )}
                {
                  isSeller && (
                    <Link
                      href="/seller"
                      className="flex items-center space-x-1 text-white hover:bg-white/2 transition-colors cursor-pointer rounded-lg md:pl-2 md:px-4"
                    >
                      <CircleDollarSignIcon size={18} />
                      <span className='hidden md:block'>Vender</span>
                    </Link>
                  )
                }
                {
                  <Link
                    href="/profile"
                    className="flex items-center space-x-1 text-white hover:bg-white/2 transition-colors cursor-pointer rounded-lg md:pl-2 md:px-4"
                  >
                    <UserIcon size={18} />
                    <span className='hidden md:block'>Perfil</span>
                  </Link>
                }
                {/* Corregido: Ahora usa handleLogout en lugar de logout directamente */}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-white hover:bg-white/2 transition-colors cursor-pointer rounded-lg md:pl-2 md:px-4"
                  type="button"
                >
                  <LogoutIcon size={18} />
                  <span className='hidden md:block'>Salir</span>
                </button>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="hidden md:block bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-4 py-2 rounded-full font-medium transition-colors"
              >
                Jugar Ahora
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu (Expanded) */}
        {isMenuOpen && isHome() && (
          <div className="absolute left-0 right-0 md:hidden py-2 space-y-2 z-50 bg-[#1F1A4B] shadow-lg px-4">
            {navigationLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="block text-white hover:bg-[#2D2658] px-3 py-2 rounded-full"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}

            <Link
              href="/auth/login"
              className="block bg-[#7C3AED] text-white text-center px-3 py-2 rounded-full font-medium my-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Jugar Ahora
            </Link>
          </div>
        )}
      </div>
    </header >
  );
}