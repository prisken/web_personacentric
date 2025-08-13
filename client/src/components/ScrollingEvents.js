import React, { useState, useEffect } from 'react';
import apiService from '../services/api';

const ScrollingEvents = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await apiService.get('/events');
        // Duplicate events for seamless scrolling
        const duplicatedEvents = [...response, ...response];
        setEvents(duplicatedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
        // Use placeholder data if API fails
        const placeholderEvents = [
          { id: 1, image_url: 'https://placehold.co/400x300/e2e8f0/475569?text=Event', name: 'Loading...', date: '' },
        ];
        setEvents([...placeholderEvents, ...placeholderEvents]);
      }
    };

    fetchEvents();
  }, []);

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
                    src={event.image_url || event.image}
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