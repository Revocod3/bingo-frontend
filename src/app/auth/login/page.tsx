import Link from 'next/link';

export default function LoginPage() {
  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Login</h1>
        <p className="text-gray-600">Sign in to your account</p>
      </div>
      
      <form className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="w-full px-3 py-2 border rounded-md"
            placeholder="your@email.com"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className="w-full px-3 py-2 border rounded-md"
            placeholder="••••••••"
            required
          />
        </div>
        
        <div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Sign in
          </button>
        </div>
      </form>
      
      <div className="mt-4 text-center text-sm">
        <span>Don&apos;t have an account? </span>
        <Link href="/auth/register" className="text-blue-600 hover:underline">
          Register
        </Link>
      </div>
      
      <div className="mt-8 text-center">
        <Link href="/" className="text-sm text-gray-600 hover:underline">
          Back to home
        </Link>
      </div>
    </>
  );
}
