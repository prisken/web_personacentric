import React from 'react';

const ChatMessage = ({ message, isOwn, isSystem, senderName, timestamp }) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (isSystem) {
    return (
      <div className="flex justify-center my-2">
        <div className="bg-yellow-400/20 text-yellow-300 text-sm px-3 py-1 rounded-full border border-yellow-400/30">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-3`}>
      <div className={`flex max-w-[85%] ${isOwn ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2`}>
        {/* Avatar for received messages */}
        {!isOwn && (
          <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-xs font-bold text-black flex-shrink-0">
            {senderName?.charAt(0) || '?'}
          </div>
        )}
        
        {/* Message bubble */}
        <div className={`relative px-4 py-2 rounded-2xl ${
          isOwn 
            ? 'bg-blue-500 text-white rounded-br-md' 
            : 'bg-white/20 text-white rounded-bl-md'
        }`}>
          {/* Sender name for received messages */}
          {!isOwn && senderName && (
            <div className="text-xs text-white/70 mb-1 font-medium">
              {senderName}
            </div>
          )}
          
          {/* Message content */}
          <div className="text-sm leading-relaxed break-words">
            {message.content}
          </div>
          
          {/* Timestamp */}
          <div className={`text-xs mt-1 ${
            isOwn ? 'text-blue-100' : 'text-white/70'
          }`}>
            {formatTime(timestamp)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;



