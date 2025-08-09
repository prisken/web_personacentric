import React from 'react';

const ScrollingEvents = () => {
  // Sample event images - replace with actual event images
  const events = [
    { id: 1, image: 'https://placehold.co/400x300/e2e8f0/475569?text=Investment+Seminar', name: 'Investment Seminar', date: '2024-03-15' },
    { id: 2, image: 'https://placehold.co/400x300/e2e8f0/475569?text=Financial+Workshop', name: 'Financial Workshop', date: '2024-03-20' },
    { id: 3, image: 'https://placehold.co/400x300/e2e8f0/475569?text=Retirement+Planning', name: 'Retirement Planning', date: '2024-03-25' },
    { id: 4, image: 'https://placehold.co/400x300/e2e8f0/475569?text=Market+Analysis', name: 'Market Analysis', date: '2024-04-01' },
    { id: 5, image: 'https://placehold.co/400x300/e2e8f0/475569?text=Wealth+Management', name: 'Wealth Management', date: '2024-04-05' },
    // Duplicate for seamless scrolling
    { id: 6, image: 'https://placehold.co/400x300/e2e8f0/475569?text=Investment+Seminar', name: 'Investment Seminar', date: '2024-03-15' },
    { id: 7, image: 'https://placehold.co/400x300/e2e8f0/475569?text=Financial+Workshop', name: 'Financial Workshop', date: '2024-03-20' },
    { id: 8, image: 'https://placehold.co/400x300/e2e8f0/475569?text=Retirement+Planning', name: 'Retirement Planning', date: '2024-03-25' },
    { id: 9, image: 'https://placehold.co/400x300/e2e8f0/475569?text=Market+Analysis', name: 'Market Analysis', date: '2024-04-01' },
    { id: 10, image: 'https://placehold.co/400x300/e2e8f0/475569?text=Wealth+Management', name: 'Wealth Management', date: '2024-04-05' },
  ];

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl bg-white shadow-lg">
      {/* Gradient overlays for smooth fade effect */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white to-transparent z-10"></div>
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent z-10"></div>

      {/* Scrolling container */}
      <div className="animate-scroll-up">
        <div className="flex flex-col gap-4 py-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="w-full px-4"
            >
              <div className="bg-gray-50 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-gray-800 font-medium">{event.name}</h3>
                  <p className="text-gray-500 text-sm mt-1">{event.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScrollingEvents;