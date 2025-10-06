import React, { useState, useEffect, useRef } from 'react';
import ChatHeader from './ChatHeader';
import ChatMessage from './ChatMessage';
import MessageInput from './MessageInput';
import ParticipantsList from './ParticipantsList';

const ModernChatInterface = ({
  messages,
  participants,
  currentUser,
  onSendMessage,
  onSendPrivateMessage,
  onStartPrivateChat,
  onViewProfile,
  activeTab,
  setActiveTab,
  privateMessages,
  activePrivateConversations,
  onClosePrivateConversation,
  t
}) => {
  const [showParticipants, setShowParticipants] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, privateMessages]);

  const handleSendMessage = (messageContent) => {
    if (activeTab === 'public') {
      onSendMessage(messageContent);
    } else {
      const conversation = activePrivateConversations.find(conv => conv.id === activeTab);
      if (conversation) {
        onSendPrivateMessage(conversation.userId, messageContent);
      }
    }
  };

  const getCurrentMessages = () => {
    if (activeTab === 'public') {
      return messages;
    } else {
      return privateMessages[activeTab] || [];
    }
  };

  const getChatTitle = () => {
    if (activeTab === 'public') {
      return t('foodForTalk.chat.publicChat');
    } else {
      const conversation = activePrivateConversations.find(conv => conv.id === activeTab);
      return conversation ? `💬 ${conversation.participantName}` : 'Private Chat';
    }
  };

  const currentMessages = getCurrentMessages();

  return (
    <div className="h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col">
      {/* Chat Header */}
      <ChatHeader
        title={getChatTitle()}
        participantCount={activeTab === 'public' ? participants.length : undefined}
        onBack={() => window.history.back()}
        onMenu={() => setShowParticipants(true)}
        showBack={true}
        showMenu={true}
      />

      {/* Tab Navigation */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10 flex-shrink-0">
        <div className="flex overflow-x-auto scrollbar-hide">
          {/* Public Chat Tab */}
          <button
            onClick={() => setActiveTab('public')}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors flex-shrink-0 ${
              activeTab === 'public'
                ? 'border-yellow-400 text-yellow-400 bg-yellow-400/10'
                : 'border-transparent text-white/70 hover:text-white hover:border-white/30'
            }`}
          >
            🌐 {t('foodForTalk.chat.publicChat')}
          </button>
          
          {/* Private Conversation Tabs */}
          {activePrivateConversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => setActiveTab(conversation.id)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors flex items-center space-x-2 flex-shrink-0 ${
                activeTab === conversation.id
                  ? 'border-blue-400 text-blue-400 bg-blue-400/10'
                  : 'border-transparent text-white/70 hover:text-white hover:border-white/30'
              }`}
            >
              <span>💬 {conversation.participantName}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClosePrivateConversation(conversation.id);
                }}
                className="ml-1 text-white/50 hover:text-white/80 transition-colors"
              >
                ×
              </button>
            </button>
          ))}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {currentMessages.length === 0 ? (
          <div className="text-center text-white/70 mt-8">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-lg font-medium">
              {activeTab === 'public' ? t('foodForTalk.chat.noMessages') : t('foodForTalk.chat.noPrivateMessages')}
            </p>
            <p className="text-sm mt-2">
              {activeTab === 'public' ? 'Start the conversation!' : 'Send your first message!'}
            </p>
          </div>
        ) : (
          currentMessages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              isOwn={message.userId === currentUser?.id || message.senderId === currentUser?.id}
              isSystem={message.type === 'system'}
              senderName={message.blurredName || message.senderBlurredName || message.displayName || message.senderDisplayName}
              timestamp={message.timestamp}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput
        onSendMessage={handleSendMessage}
        placeholder={
          activeTab === 'public' 
            ? t('foodForTalk.chat.typeMessage') 
            : t('foodForTalk.chat.typePrivateMessage')
        }
      />

      {/* Participants Drawer */}
      {showParticipants && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowParticipants(false)}
          />
          
          {/* Drawer */}
          <div className="absolute right-0 top-0 h-full w-80 bg-white/10 backdrop-blur-sm border-l border-white/20">
            <ParticipantsList
              participants={participants}
              currentUser={currentUser}
              onStartPrivateChat={(userId) => {
                onStartPrivateChat(userId);
                setShowParticipants(false);
              }}
              onViewProfile={(userId) => {
                onViewProfile(userId);
                setShowParticipants(false);
              }}
              onClose={() => setShowParticipants(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ModernChatInterface;
