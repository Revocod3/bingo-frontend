'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBingoStore } from '@/lib/stores/bingo';
import BingoCard from '@/components/BingoCard';
import { BingoCard as BingoCardType } from '@/lib/api/types';

interface CardCarouselProps {
  cards: BingoCardType[];
  eventId: string;
}

const CardCarousel = ({ cards }: CardCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const { currentNumber, calledNumbers } = useBingoStore();

  // Get card numbers from the BingoCardType
  const getCardNumbers = (card: BingoCardType): number[] => {
    // This depends on your actual data structure
    // Assuming the card.numbers is an object with values or a direct array
    if (!card.numbers) return Array(25).fill(0);

    if (Array.isArray(card.numbers)) {
      return card.numbers;
    }

    // If numbers is an object with positions as keys
    return Object.values(card.numbers)
      .flatMap(n => typeof n === 'object' && n !== null ? Object.values(n) : [n])
      .map(Number);
  };

  const scrollToCard = (index: number) => {
    if (carouselRef.current && cards[index]) {
      setActiveIndex(index);

      const container = carouselRef.current;
      const cardElement = container.children[index] as HTMLElement;

      if (cardElement) {
        const scrollPosition = cardElement.offsetLeft - (container.offsetWidth / 2) + (cardElement.offsetWidth / 2);
        container.scrollTo({ left: scrollPosition, behavior: 'smooth' });
      }
    }
  };

  const handleNext = () => {
    if (activeIndex < cards.length - 1) {
      scrollToCard(activeIndex + 1);
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      scrollToCard(activeIndex - 1);
    }
  };

  // Auto-scroll to card if it contains current number
  useEffect(() => {
    if (!currentNumber) return;

    // Find a card that contains the current number
    const cardWithCurrentIndex = cards.findIndex(card => {
      const numbers = getCardNumbers(card);
      return numbers.includes(currentNumber);
    });

    if (cardWithCurrentIndex !== -1 && cardWithCurrentIndex !== activeIndex) {
      scrollToCard(cardWithCurrentIndex);
    }
  }, [currentNumber, cards, activeIndex]);

  // Check for potential winning cards when numbers are called
  useEffect(() => {
    if (calledNumbers.length < 5) return; // Need at least 5 numbers for a win

    cards.forEach((card, idx) => {
      const numbers = getCardNumbers(card);

      // Simple check for potential win (this is just visual feedback, real validation happens server-side)
      const matchedCount = numbers.filter(num => calledNumbers.includes(num)).length;

      // If many matches found, highlight this card as a potential winner
      if (matchedCount >= 20 && idx !== activeIndex) { // Arbitrary threshold, real bingo rules would be more complex
        scrollToCard(idx);
      }
    });
  }, [calledNumbers, cards, activeIndex]);

  if (cards.length === 0) {
    return (
      <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg text-center">
        <p className="text-lg text-gray-700">No tienes cartones para este evento</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Card counter indicator */}
      <div className="mb-2 text-center">
        <span className="bg-[#1E1B4B] text-white px-3 py-1 rounded-full text-sm">
          Carton {activeIndex + 1} de {cards.length}
        </span>
      </div>

      {/* Carousel navigation */}
      <div className="flex items-center">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrev}
          disabled={activeIndex === 0}
          className="mr-2"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </Button>

        <div
          className="flex-1 overflow-x-auto hide-scrollbar scroll-smooth"
          ref={carouselRef}
        >
          <div className="flex gap-4 p-2 snap-x">
            {cards.map((card, index) => (
              <div
                key={card.id}
                className="min-w-[300px] snap-center"
                onClick={() => scrollToCard(index)}
              >
                <BingoCard
                  cardId={card.id}
                  numbers={getCardNumbers(card)}
                  active={index === activeIndex}
                />
              </div>
            ))}
          </div>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={handleNext}
          disabled={activeIndex === cards.length - 1}
          className="ml-2"
        >
          <ChevronRightIcon className="w-5 h-5" />
        </Button>
      </div>

      {/* Current number indicator */}
      {currentNumber && (
        <div className="mt-4 text-center">
          <div className="inline-block bg-[#7C3AED] text-white px-4 py-2 rounded-full font-bold text-xl">
            Número actual: {currentNumber}
          </div>
        </div>
      )}
    </div>
  );
};

export default CardCarousel;
