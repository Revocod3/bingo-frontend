import Link from 'next/link';

export default function RegisterPage() {
  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Create an Account</h1>
        <p className="text-gray-600">Sign up to get started</p>
      </div>
      
      <form className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium">
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            className="w-full px-3 py-2 border rounded-md"
            placeholder="John Doe"
            required
          />
        </div>
        
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
            Create Account
          </button>
        </div>
      </form>
      
      <div className="mt-4 text-center text-sm">
        <span>Already have an account? </span>
        <Link href="/auth/login" className="text-blue-600 hover:underline">
          Login
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
