'use client';

import { useState } from 'react';
import Link from 'next/link';

// Dummy data for initial card
const generateInitialCard = () => {
  const card = [];
  // Create a 5x5 grid
  for (let i = 0; i < 5; i++) {
    const row = [];
    for (let j = 0; j < 5; j++) {
      // Make the center spot a free space
      if (i === 2 && j === 2) {
        row.push({ value: '$$$', selected: true });
      } else {
        const value = Math.floor(Math.random() * 75) + 1;
        row.push({ value: value.toString(), selected: false });
      }
    }
    card.push(row);
  }
  return card;
};

export default function CardsPage() {
  const [card, setCard] = useState(generateInitialCard());
  
  // Toggle selection of a cell
  const toggleCell = (rowIndex: number, colIndex: number) => {
    const newCard = [...card];
    newCard[rowIndex][colIndex] = {
      ...newCard[rowIndex][colIndex],
      selected: !newCard[rowIndex][colIndex].selected,
    };
    setCard(newCard);
  };
  
  // Generate a new random card
  const generateNewCard = () => {
    setCard(generateInitialCard());
  };
  
  return (
    <div className="flex min-h-screen flex-col items-center p-6">
      <div className="w-full max-w-lg">
        <header className="mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Carton de prueba</h1>
          <Link href="/" className="text-blue-600 hover:underline">
            Volver atrás          
          </Link>
        </header>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Card Header */}
          <div className="bg-blue-600 text-white p-4 text-center">
            <h2 className="text-2xl font-bold">BINGO</h2>
          </div>
          
          {/* Bingo Card Grid */}
          <div className="p-4">
            <div className="grid grid-cols-5 gap-2">
              {['B', 'I', 'N', 'G', 'O'].map((letter, i) => (
                <div key={i} className="bg-blue-600 text-white text-center p-2 font-bold rounded">
                  {letter}
                </div>
              ))}
              
              {card.map((row, rowIndex) => (
                row.map((cell, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`aspect-square border ${
                      cell.selected ? 'bg-blue-100 border-blue-600' : 'border-gray-300'
                    } rounded flex items-center justify-center cursor-pointer transition-colors`}
                    onClick={() => toggleCell(rowIndex, colIndex)}
                  >
                    <span className="text-lg font-medium">{cell.value}</span>
                  </div>
                ))
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex justify-center">
          <button
            onClick={generateNewCard}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Generar un nuevo carton
          </button>
        </div>
      </div>
    </div>
  );
}
