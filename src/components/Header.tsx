import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link href="/" className="font-bold text-xl">
              Bingo Millonario
            </Link>
          </div>
          
          <nav className="flex space-x-6">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              Inicio
            </Link>
            <Link href="/cards" className="text-gray-600 hover:text-gray-900">
              Cartones
            </Link>
            <Link href="/auth/login" className="text-gray-600 hover:text-gray-900">
              Login
            </Link>
            <Link href="/auth/register" className="text-gray-600 hover:text-gray-900">
              Registro
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
