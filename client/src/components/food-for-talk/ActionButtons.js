import React from 'react';
import { Link } from 'react-router-dom';

const ActionButtons = () => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
      {/* See Participants Button */}
      <Link
        to="/food-for-talk/login"
        state={{ from: '/food-for-talk/participants' }}
        className="group relative w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-white transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.8) 0%, rgba(37, 99, 235, 0.8) 100%)',
          border: '2px solid rgba(59, 130, 246, 0.6)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
        }}
      >
        <span className="relative z-10 flex items-center">
          <svg className="mr-3 w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          See Participants
          <svg 
            className="ml-3 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
        
        {/* Hover effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </Link>

      {/* Enter Secret Chat Room Button */}
      <Link
        to="/food-for-talk/secret-login"
        className="group relative w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-white transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.8) 0%, rgba(147, 51, 234, 0.8) 100%)',
          border: '2px solid rgba(168, 85, 247, 0.6)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(168, 85, 247, 0.3)',
        }}
      >
        <span className="relative z-10 flex items-center">
          <svg className="mr-3 w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Enter Secret Chat Room
          <svg 
            className="ml-3 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
        
        {/* Hover effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-violet-400/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </Link>
    </div>
  );
};

export default ActionButtons;
