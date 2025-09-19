import React from 'react';

const EventDetails = () => {
  return (
    <div className="text-center">
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-8">
        Event Details
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Event Info */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <div className="text-4xl mb-4">📅</div>
          <h3 className="text-xl font-bold text-white mb-3">Date & Time</h3>
          <p className="text-white/80">
            Saturday, March 15th, 2024<br />
            7:00 PM - 10:00 PM
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <div className="text-4xl mb-4">📍</div>
          <h3 className="text-xl font-bold text-white mb-3">Location</h3>
          <p className="text-white/80">
            The Grand Ballroom<br />
            123 Main Street<br />
            Downtown District
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <div className="text-4xl mb-4">👥</div>
          <h3 className="text-xl font-bold text-white mb-3">Capacity</h3>
          <p className="text-white/80">
            Limited to 50 participants<br />
            Ages 25-40<br />
            Professional singles
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <div className="text-4xl mb-4">🍽️</div>
          <h3 className="text-xl font-bold text-white mb-3">Dining</h3>
          <p className="text-white/80">
            Gourmet 3-course dinner<br />
            Wine & cocktail service<br />
            Dietary accommodations available
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <div className="text-4xl mb-4">💝</div>
          <h3 className="text-xl font-bold text-white mb-3">What's Included</h3>
          <p className="text-white/80">
            Welcome cocktail<br />
            Speed dating sessions<br />
            Professional photography<br />
            Goodie bag
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <div className="text-4xl mb-4">🎯</div>
          <h3 className="text-xl font-bold text-white mb-3">Format</h3>
          <p className="text-white/80">
            5-minute conversations<br />
            Structured rotation<br />
            Ice-breaker activities<br />
            Match exchange system
          </p>
        </div>
      </div>

      {/* Event Description */}
      <div className="mt-12 max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
          <h3 className="text-2xl font-bold text-white mb-4">About This Event</h3>
          <p className="text-white/80 text-lg leading-relaxed mb-6">
            Join us for an exclusive speed dating experience like no other! "Food for Talk" combines 
            the excitement of meeting new people with the elegance of fine dining. Our carefully curated 
            event brings together successful professionals in a sophisticated atmosphere where meaningful 
            connections can flourish.
          </p>
          <p className="text-white/80 text-lg leading-relaxed">
            Each participant will have the opportunity to meet multiple potential matches through our 
            structured speed dating format, followed by an elegant dinner where you can continue 
            conversations with those who caught your interest. Our professional matchmaking team will 
            be on hand to facilitate connections and ensure everyone has a memorable experience.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
