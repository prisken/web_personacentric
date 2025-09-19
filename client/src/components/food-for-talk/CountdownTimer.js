import React from 'react';

const CountdownTimer = ({ timeLeft }) => {
  const { days, hours, minutes, seconds } = timeLeft;

  return (
    <div className="mb-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
        Event Starts In
      </h2>
      <div className="flex justify-center space-x-4 sm:space-x-6 lg:space-x-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 min-w-[80px] sm:min-w-[100px]">
          <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-yellow-400 mb-2">
            {days.toString().padStart(2, '0')}
          </div>
          <div className="text-sm sm:text-base text-white/80 uppercase tracking-wide">
            Days
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 min-w-[80px] sm:min-w-[100px]">
          <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-yellow-400 mb-2">
            {hours.toString().padStart(2, '0')}
          </div>
          <div className="text-sm sm:text-base text-white/80 uppercase tracking-wide">
            Hours
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 min-w-[80px] sm:min-w-[100px]">
          <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-yellow-400 mb-2">
            {minutes.toString().padStart(2, '0')}
          </div>
          <div className="text-sm sm:text-base text-white/80 uppercase tracking-wide">
            Minutes
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 min-w-[80px] sm:min-w-[100px]">
          <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-yellow-400 mb-2">
            {seconds.toString().padStart(2, '0')}
          </div>
          <div className="text-sm sm:text-base text-white/80 uppercase tracking-wide">
            Seconds
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
