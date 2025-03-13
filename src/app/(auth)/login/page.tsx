export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-6">Login</h1>
      <div className="w-full max-w-md">
        <form className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="block mb-1">Email</label>
            <input 
              type="email" 
              id="email"
              className="w-full p-2 border rounded" 
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-1">Password</label>
            <input 
              type="password" 
              id="password"
              className="w-full p-2 border rounded" 
            />
          </div>
          <button 
            type="submit"
            className="mt-2 p-2 bg-foreground text-background rounded"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
