import React from 'react';

const ParticipantsList = ({ 
  participants, 
  currentUser, 
  onStartPrivateChat, 
  onViewProfile,
  onClose 
}) => {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20 p-4 flex-shrink-0">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">
            Participants ({participants.length})
          </h2>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors p-1"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Participants list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {participants.map((participant) => (
          <div
            key={participant.id}
            className="bg-white/10 rounded-xl p-4 hover:bg-white/20 transition-colors"
          >
            <div className="flex items-center space-x-3">
              {/* Avatar */}
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-sm font-bold text-black">
                {participant.blurredName?.charAt(0) || '?'}
              </div>
              
              {/* User info */}
              <div className="flex-1 min-w-0">
                <div className="text-white font-medium truncate">
                  {participant.blurredName}
                </div>
                <div className="text-white/70 text-sm">
                  Online
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={() => onStartPrivateChat(participant.id)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                >
                  Chat
                </button>
                <button
                  onClick={() => onViewProfile(participant.id)}
                  className="bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                >
                  Profile
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParticipantsList;
