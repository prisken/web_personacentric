import React, { useState, useEffect } from 'react';
import apiService from '../services/api';

const ScrollingGifts = () => {
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGifts = async () => {
      try {
        setLoading(true);
        const response = await apiService.get('/public/gifts');
        if (response) {
          // Filter only active gifts
          const activeGifts = response.filter(gift => gift.status === 'active');
          // Duplicate gifts for seamless scrolling
          const duplicatedGifts = [...activeGifts, ...activeGifts];
          setGifts(duplicatedGifts);
        }
      } catch (error) {
        console.error('Error fetching gifts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGifts();
  }, []);

  if (loading) {
    return (
      <div className="relative h-full w-full overflow-hidden rounded-2xl bg-white shadow-lg">
        <div className="flex justify-center items-center h-48 sm:h-64">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 lg:h-16 lg:w-16 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

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
              <div className="bg-gray-50 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="h-32 sm:h-40 lg:h-48 xl:h-56 overflow-hidden">
                  <img 
                    src={gift.image_url || 'https://res.cloudinary.com/personacentric/image/upload/v1/gifts/gift-card.jpg'}
                    alt={gift.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-gray-800 font-medium text-center">{gift.name}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScrollingGifts;