export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 bg-foreground/5">
        <div className="container mx-auto">
          <h2 className="text-xl font-bold">Authentication</h2>
        </div>
      </header>
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
}
