import React from 'react';

const ChatHeader = ({ 
  title, 
  participantCount, 
  onBack, 
  onMenu, 
  showBack = true,
  showMenu = true 
}) => {
  return (
    <div className="bg-white/10 backdrop-blur-sm border-b border-white/20 px-4 py-3 flex items-center justify-between">
      {/* Left side - Back button and title */}
      <div className="flex items-center space-x-3">
        {showBack && (
          <button
            onClick={onBack}
            className="text-white/70 hover:text-white transition-colors p-1"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        
        <div>
          <h1 className="text-lg font-semibold text-white">{title}</h1>
          {participantCount && (
            <p className="text-xs text-white/70">{participantCount} participants</p>
          )}
        </div>
      </div>

      {/* Right side - Menu button */}
      {showMenu && (
        <button
          onClick={onMenu}
          className="text-white/70 hover:text-white transition-colors p-1"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ChatHeader;


















