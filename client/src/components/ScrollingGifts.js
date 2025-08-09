import React from 'react';

const ScrollingGifts = () => {
  // Sample gift images - replace with actual gift images
  const gifts = [
    { id: 1, image: 'https://placehold.co/300x300/e2e8f0/475569?text=Gift+1', name: 'Gift Card' },
    { id: 2, image: 'https://placehold.co/300x300/e2e8f0/475569?text=Gift+2', name: 'Premium Account' },
    { id: 3, image: 'https://placehold.co/300x300/e2e8f0/475569?text=Gift+3', name: 'Investment Course' },
    { id: 4, image: 'https://placehold.co/300x300/e2e8f0/475569?text=Gift+4', name: 'Financial Report' },
    { id: 5, image: 'https://placehold.co/300x300/e2e8f0/475569?text=Gift+5', name: 'Market Analysis' },
    // Duplicate for seamless scrolling
    { id: 6, image: 'https://placehold.co/300x300/e2e8f0/475569?text=Gift+1', name: 'Gift Card' },
    { id: 7, image: 'https://placehold.co/300x300/e2e8f0/475569?text=Gift+2', name: 'Premium Account' },
    { id: 8, image: 'https://placehold.co/300x300/e2e8f0/475569?text=Gift+3', name: 'Investment Course' },
    { id: 9, image: 'https://placehold.co/300x300/e2e8f0/475569?text=Gift+4', name: 'Financial Report' },
    { id: 10, image: 'https://placehold.co/300x300/e2e8f0/475569?text=Gift+5', name: 'Market Analysis' },
  ];

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl bg-white shadow-lg">
      {/* Gradient overlays for smooth fade effect */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white to-transparent z-10"></div>
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent z-10"></div>

      {/* Scrolling container */}
      <div className="animate-scroll-up">
        <div className="flex flex-col gap-4 py-4">
          {gifts.map((gift) => (
            <div
              key={gift.id}
              className="w-full px-4"
            >
              <div className="bg-gray-50 rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="aspect-square overflow-hidden rounded-lg mb-3">
                  <img
                    src={gift.image}
                    alt={gift.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-gray-800 font-medium text-center">{gift.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScrollingGifts;