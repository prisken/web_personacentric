import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const RegisterButton = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      to="/food-for-talk/register"
      className="group relative inline-flex items-center px-6 py-3 rounded-xl font-bold text-white transition-all duration-300 transform hover:scale-105"
      style={{
        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        boxShadow: '0 8px 32px rgba(245, 158, 11, 0.3)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="relative z-10 flex items-center">
        Register for Event
        <svg 
          className={`ml-2 w-5 h-5 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`}
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </span>
      
      {/* Hover effect overlay */}
      <div 
        className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      ></div>
    </Link>
  );
};

export default RegisterButton;
