import React, { useState, useEffect } from 'react';
import apiService from '../services/api';

const ScrollingGifts = () => {
  const [gifts, setGifts] = useState([]);

  useEffect(() => {
    const fetchGifts = async () => {
      try {
        const response = await apiService.get('/gifts');
        // Filter only active gifts
        const activeGifts = response.filter(gift => gift.status === 'active');
        // Duplicate gifts for seamless scrolling
        const duplicatedGifts = [...activeGifts, ...activeGifts];
        setGifts(duplicatedGifts);
      } catch (error) {
        console.error('Error fetching gifts:', error);
        // Use placeholder data if API fails
        const placeholderGifts = [
          { id: 1, image_url: 'https://placehold.co/300x300/e2e8f0/475569?text=Gift', name: 'Loading...', points_required: 0 },
        ];
        setGifts([...placeholderGifts, ...placeholderGifts]);
      }
    };

    fetchGifts();
  }, []);

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
                    src={gift.image_url || gift.image}
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