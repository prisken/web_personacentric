import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const RegisterButton = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      to="/food-for-talk/register"
      className="group relative inline-flex items-center w-auto mx-auto sm:mx-0 px-5 py-2.5 sm:px-8 sm:py-4 rounded-2xl font-extrabold text-white text-base sm:text-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
      style={{
        background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
        boxShadow: '0 12px 40px rgba(245, 158, 11, 0.4)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="relative z-10 flex items-center">
        Register for Event
        <svg 
          className={`ml-3 w-6 h-6 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`}
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </span>
      
      {/* Hover effect overlay */}
      <div 
        className="absolute inset-0 bg-gradient-to-r from-yellow-300/20 via-yellow-400/20 to-orange-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      ></div>
    </Link>
  );
};

export default RegisterButton;
