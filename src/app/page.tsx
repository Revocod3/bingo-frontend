import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8 text-center">
        <h1 className="text-4xl font-bold">Bingo Millonario</h1>
        <p className="text-lg">App demo para testear idea</p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link 
            href="/auth/login" 
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Login
          </Link>
          <Link 
            href="/auth/register" 
            className="px-6 py-3 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
          >
            Registro
          </Link>
        </div>
        
        <div className="mt-12">
          <Link 
            href="/cards" 
            className="text-blue-600 hover:underline"
          >
            Demo de cartones →
          </Link>
        </div>
      </div>
    </main>
  );
}