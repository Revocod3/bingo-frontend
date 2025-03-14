import { BingoCard } from '../components/BingoCard';
import { GameControls } from '../components/GameControls';

export default function Home() {
    const cartones = [
        [2,22,44,55,75]
    ]
  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-4xl font-bold text-bingo-primary mb-8">Bingo Online</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cartones.map((carton, index) => (
          <BingoCard key={index} numbers={carton} />
        ))}
      </div>
      
      <GameControls />
    </main>
  );
}