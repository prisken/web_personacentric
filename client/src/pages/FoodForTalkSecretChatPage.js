import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useLanguage } from '../contexts/LanguageContext';
import apiService from '../services/api';
import ModernChatInterface from '../components/food-for-talk/ModernChatInterface';

const FoodForTalkSecretChatPage = () => {
  const { t } = useLanguage();
  const [, setIsAuthenticated] = useState(false);
  const [isInChat, setIsInChat] = useState(false);
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    passkey: ''
  });
  const [currentUser, setCurrentUser] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [privateMessages, setPrivateMessages] = useState({});
  const [activePrivateConversations, setActivePrivateConversations] = useState([]);
  const [activeTab, setActiveTab] = useState('public'); // 'public' or conversation ID
  const [loading, setLoading] = useState(false);
  const wsRef = useRef(null);

  // Check if user is already authenticated
  useEffect(() => {
    const token = localStorage.getItem('foodForTalkSecretToken');
    if (token) {
      // User is already authenticated, set states and load participants
      setIsAuthenticated(true);
      setIsInChat(true);
      
      // Set a basic currentUser from token (we'll decode the JWT to get user info)
      try {
        // Simple base64 decoding for JWT payload
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(atob(base64));
        const userData = {
          id: payload.userId,
          email: payload.email,
          blurredName: payload.email.charAt(0) + '***'
        };
        setCurrentUser(userData);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
      
      // Try to load chat participants with existing token
      loadChatParticipants();
    }
  }, []);


  useEffect(() => {
    if (isInChat && currentUser && !wsRef.current) {
      // Initialize WebSocket connection for real-time chat
      const wsUrl = process.env.NODE_ENV === 'production' 
        ? 'wss://webpersonacentric-personacentric.up.railway.app'
        : 'ws://localhost:5001';
      wsRef.current = new WebSocket(`${wsUrl}/food-for-talk-chat`);
      
      wsRef.current.onopen = () => {
        console.log('WebSocket connection opened, currentUser:', currentUser);
        // Send join message when connection is established
        if (currentUser && currentUser.id) {
          const joinMessage = {
            type: 'join',
            userId: currentUser.id,
            userInfo: {
              id: currentUser.id,
              firstName: currentUser.blurredName || 'User',
              lastName: '',
              email: currentUser.email
            }
          };
          console.log('Sending join message:', joinMessage);
          wsRef.current.send(JSON.stringify(joinMessage));
        } else {
          console.log('No currentUser available for join message');
        }
      };

      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        if (data.type === 'message') {
          setMessages(prev => {
            // Check if message already exists to prevent duplicates
            const messageExists = prev.some(msg => msg.id === data.message.id);
            if (messageExists) {
              return prev;
            }
            return [...prev, data.message];
          });
        } else if (data.type === 'private_message') {
          setPrivateMessages(prev => {
            const conversationId = data.conversationId;
            const existingMessages = prev[conversationId] || [];
            // Check if message already exists to prevent duplicates
            const messageExists = existingMessages.some(msg => msg.id === data.message.id);
            if (messageExists) {
              return prev;
            }
            return {
              ...prev,
              [conversationId]: [...existingMessages, data.message]
            };
          });

          // Update active conversations for incoming private messages
          setActivePrivateConversations(prev => {
            const existingConv = prev.find(conv => conv.id === data.conversationId);
            if (existingConv) {
              // Update last message
              return prev.map(conv => 
                conv.id === data.conversationId 
                  ? { ...conv, lastMessage: data.message.content, timestamp: data.message.timestamp }
                  : conv
              );
            } else {
              // Add new conversation
              const participant = participants.find(p => p.id === data.message.senderId);
              return [...prev, {
                id: data.conversationId,
                userId: data.message.senderId,
                participantName: participant?.blurredName || 'Unknown',
                lastMessage: data.message.content,
                timestamp: data.message.timestamp
              }];
            }
          });
        } else if (data.type === 'user_joined') {
          setParticipants(prev => {
            // Check if user already exists to prevent duplicates
            const userExists = prev.some(p => p.id === data.user.id);
            if (userExists) {
              return prev;
            }
            return [...prev, data.user];
          });
          setMessages(prev => {
            const systemMessage = {
              id: Date.now(),
              type: 'system',
              content: `${data.user.blurredName} joined the chat`,
              timestamp: new Date().toISOString()
            };
            // Check if system message already exists
            const messageExists = prev.some(msg => 
              msg.type === 'system' && 
              msg.content === systemMessage.content &&
              Math.abs(new Date(msg.timestamp) - new Date(systemMessage.timestamp)) < 1000
            );
            if (messageExists) {
              return prev;
            }
            return [...prev, systemMessage];
          });
        } else if (data.type === 'user_left') {
          setParticipants(prev => prev.filter(p => p.id !== data.userId));
          setMessages(prev => {
            const systemMessage = {
              id: Date.now(),
              type: 'system',
              content: 'A participant left the chat',
              timestamp: new Date().toISOString()
            };
            // Check if system message already exists
            const messageExists = prev.some(msg => 
              msg.type === 'system' && 
              msg.content === systemMessage.content &&
              Math.abs(new Date(msg.timestamp) - new Date(systemMessage.timestamp)) < 1000
            );
            if (messageExists) {
              return prev;
            }
            return [...prev, systemMessage];
          });
        }
      };

      wsRef.current.onclose = () => {
        wsRef.current = null; // Reset reference when connection closes
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    }

    return () => {
      // Only close WebSocket when component unmounts, not on every re-render
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [isInChat, currentUser?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiService.secretLoginToFoodForTalk(loginData);
      
      if (response.token) {
        // Store the secret token for future requests
        localStorage.setItem('foodForTalkSecretToken', response.token);
        
        setCurrentUser(response.user);
        setIsAuthenticated(true);
        setIsInChat(true);
        toast.success('Welcome to the secret chat room!');
        
        // Load participants for the chat room
        await loadChatParticipants();
      } else {
        toast.error(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('Secret login error:', error);
      toast.error('Secret login failed. Please check your credentials and passkey.');
    } finally {
      setLoading(false);
    }
  };

  const loadChatParticipants = async () => {
    try {
      // Get participants for chat room (with blurred names)
      const response = await apiService.getFoodForTalkChatParticipants();
      if (response.participants) {
        setParticipants(response.participants);
      }
    } catch (error) {
      console.error('Failed to load chat participants:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !wsRef.current) return;

    if (!currentUser) {
      console.error('currentUser is null, cannot send message');
      toast.error('User not authenticated. Please refresh the page.');
      return;
    }

    const message = {
      id: Date.now(),
      userId: currentUser.id,
      blurredName: currentUser.blurredName,
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      type: 'public'
    };
    
    console.log('Sending message:', message);
    console.log('WebSocket ready state:', wsRef.current.readyState);
    
    if (wsRef.current.readyState === WebSocket.OPEN) {
      const sendData = {
        type: 'send_message',
        message
      };
      console.log('Sending WebSocket data:', sendData);
      wsRef.current.send(JSON.stringify(sendData));
    } else {
      console.error('WebSocket is not open. Ready state:', wsRef.current.readyState);
      toast.error('Connection lost. Please refresh the page.');
    }

    setNewMessage('');
  };

  const sendPrivateMessage = async (recipientId, content) => {
    if (!content.trim() || !wsRef.current) return;

    const message = {
      id: Date.now(),
      senderId: currentUser.id,
      recipientId,
      senderBlurredName: currentUser.blurredName,
      content: content.trim(),
      timestamp: new Date().toISOString(),
      type: 'private'
    };

    const conversationId = [currentUser.id, recipientId].sort().join('-');
    
    wsRef.current.send(JSON.stringify({
      type: 'send_private_message',
      message,
      conversationId
    }));

    setPrivateMessages(prev => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), message]
    }));

    // Add to active conversations if not already there
    setActivePrivateConversations(prev => {
      if (!prev.find(conv => conv.id === conversationId)) {
        const participant = participants.find(p => p.id === recipientId);
        return [...prev, {
          id: conversationId,
          userId: recipientId,
          participantName: participant?.blurredName || 'Unknown',
          lastMessage: content.trim(),
          timestamp: new Date().toISOString()
        }];
      } else {
        // Update last message
        return prev.map(conv => 
          conv.id === conversationId 
            ? { ...conv, lastMessage: content.trim(), timestamp: new Date().toISOString() }
            : conv
        );
      }
    });

    // Switch to this conversation tab
    setActiveTab(conversationId);
  };

  const startPrivateConversation = (userId) => {
    const conversationId = [currentUser.id, userId].sort().join('-');
    const participant = participants.find(p => p.id === userId);
    
    // Add to active conversations if not already there
    setActivePrivateConversations(prev => {
      if (!prev.find(conv => conv.id === conversationId)) {
        return [...prev, {
          id: conversationId,
          userId,
          participantName: participant?.blurredName || 'Unknown',
          lastMessage: '',
          timestamp: new Date().toISOString()
        }];
      }
      return prev;
    });

    // Switch to this conversation tab
    setActiveTab(conversationId);
  };

  const closePrivateConversation = (conversationId) => {
    setActivePrivateConversations(prev => prev.filter(conv => conv.id !== conversationId));
    
    // If we're closing the active tab, switch to public chat
    if (activeTab === conversationId) {
      setActiveTab('public');
    }
  };

  const viewUserProfile = async (userId) => {
    try {
      const response = await fetch(`/api/food-for-talk/view-profile/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: currentUser.id })
      });

      if (response.ok) {
        await response.json();
        toast.success('Profile viewed! Your passkey has been revoked.');
        setIsInChat(false);
        setIsAuthenticated(false);
        setCurrentUser(null);
        setParticipants([]);
        setMessages([]);
        setPrivateMessages({});
        if (wsRef.current) {
          wsRef.current.close();
        }
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to view profile');
      }
    } catch (error) {
      console.error('View profile error:', error);
      toast.error('Failed to view profile');
    }
  };

  if (isInChat) {
    return (
      <ModernChatInterface
        messages={messages}
        participants={participants}
        currentUser={currentUser}
        onSendMessage={sendMessage}
        onSendPrivateMessage={sendPrivateMessage}
        onStartPrivateChat={startPrivateConversation}
        onViewProfile={viewUserProfile}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        privateMessages={privateMessages}
        activePrivateConversations={activePrivateConversations}
        onClosePrivateConversation={closePrivateConversation}
        t={t}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center py-12">
      <div className="max-w-md w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link 
            to="/food-for-talk" 
            className="inline-flex items-center text-white/70 hover:text-white transition-colors mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Event
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {t('foodForTalk.secretLogin.title')}
          </h1>
          <p className="text-lg text-white/80">
            {t('foodForTalk.secretLogin.subtitle')}
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-white font-medium mb-2">{t('foodForTalk.secretLogin.email')}</label>
              <input
                type="email"
                name="email"
                value={loginData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">{t('foodForTalk.secretLogin.password')}</label>
              <input
                type="password"
                name="password"
                value={loginData.password}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">{t('foodForTalk.secretLogin.secretPasskey')}</label>
              <input
                type="password"
                name="passkey"
                value={loginData.passkey}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                placeholder="Enter your secret passkey"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold py-3 px-6 rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('foodForTalk.common.loading') : t('foodForTalk.secretLogin.submit')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/70 text-sm">
              Don't have an account?{' '}
              <Link to="/food-for-talk/register" className="text-yellow-400 hover:text-yellow-300 transition-colors">
                Register for the event
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodForTalkSecretChatPage;
