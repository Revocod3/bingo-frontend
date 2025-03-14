"use client"

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  
  // Check if current route is an auth page
  const isAuthPage = () => {
    return pathname === '/auth/login' || pathname === '/auth/register';
  };
  
  // Navigation links array
  const navigationLinks = [
    { name: 'Características', href: '#features' },
    { name: 'Como jugar', href: '#how-to-play' },
    { name: 'Premios', href: '#prizes' },
  ];
  
  // Toggle menu for mobile
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-[#1F1A4B] shadow-sm sticky top-0 z-50 text-white">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-26">
        <div className="flex justify-between h-16 items-center">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <Link href="/" className="font-bold text-xl">
              Bingo
              {' '} 
              <span className='text-[#8B5CF6]'>EnVivo</span>
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button 
              type="button" 
              className="text-white"
              onClick={toggleMenu}
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
          
          {/* Desktop Navigation */}
          {!isAuthPage() && (
            <div className="hidden md:flex md:items-center">
              <nav className="flex space-x-4">
                {navigationLinks.map((link, index) => (
                  <Link 
                    key={index} 
                    href={link.href} 
                    className="text-white hover:text-gray-200 transition-colors font-regular"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </div>
          )}
          
          <div className="hidden md:flex md:items-center">
            {/* Contact and CTA */}
            <div className="flex items-center space-x-4">
              {!isAuthPage() && (
                <Link href="/contact" className="text-white hover:text-gray-200 transition-colors">
                  Contacto
                </Link>
              )}
              <Link 
                href="/auth/login"
                className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-4 py-2 rounded-full font-medium transition-colors"
              >
                Jugar Ahora
              </Link>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu (Expanded) */}
        {isMenuOpen && !isAuthPage() && (
          <div className="md:hidden py-2 space-y-2">
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
              href="/contact" 
              className="block text-white hover:bg-[#2D2658] px-3 py-2 rounded-full"
              onClick={() => setIsMenuOpen(false)}
            >
              Contacto
            </Link>
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
    </header>
  );
}
