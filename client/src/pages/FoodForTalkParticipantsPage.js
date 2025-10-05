import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import apiService from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import ParticipantDetailsModal from '../components/food-for-talk/ParticipantDetailsModal';
import ParticipantProfileEditModal from '../components/food-for-talk/ParticipantProfileEditModal';

const FoodForTalkParticipantsPage = () => {
  const { t, toggleLanguage, language } = useLanguage();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [expanded, setExpanded] = useState({});
  const [selectedParticipantId, setSelectedParticipantId] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showProfileEditModal, setShowProfileEditModal] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  // Check if user is already authenticated
  useEffect(() => {
    const token = localStorage.getItem('foodForTalkToken');
    if (token) {
      // Set user info from token
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserInfo({
          email: payload.email,
          nickname: payload.nickname || 'Participant'
        });
      } catch (error) {
        console.error('Error parsing token:', error);
        setUserInfo({ email: 'Unknown', nickname: 'Participant' });
      }
      loadParticipants();
    }
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('foodForTalkToken');
    setIsAuthenticated(false);
    setUserInfo(null);
    setParticipants([]);
  };

  const loadParticipants = async () => {
    setLoading(true);
    try {
      const response = await apiService.getFoodForTalkParticipants();
      if (response.participants) {
        setIsAuthenticated(true);
        setParticipants(response.participants);
      } else {
        localStorage.removeItem('foodForTalkToken');
      }
    } catch (error) {
      localStorage.removeItem('foodForTalkToken');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const loginResponse = await apiService.loginToFoodForTalk(loginData);
      if (loginResponse.token) {
        localStorage.setItem('foodForTalkToken', loginResponse.token);
        // Set user info from token
        try {
          const payload = JSON.parse(atob(loginResponse.token.split('.')[1]));
          setUserInfo({
            email: payload.email,
            nickname: payload.nickname || 'Participant'
          });
        } catch (error) {
          console.error('Error parsing token:', error);
          setUserInfo({ email: 'Unknown', nickname: 'Participant' });
        }
        await loadParticipants();
        toast.success('Login successful!');
      } else {
        toast.error(loginResponse.message || 'Login failed');
        setLoading(false);
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
  };

  const handleViewDetails = (participantId) => {
    setSelectedParticipantId(participantId);
    setShowDetailsModal(true);
  };

  const handleProfileUpdated = (updatedProfile) => {
    // Update the userInfo with the new profile data
    setUserInfo(updatedProfile);
    // Optionally refresh the participants list to show updated data
    // fetchParticipants();
  };

  const handleCloseModal = () => {
    setShowDetailsModal(false);
    setSelectedParticipantId(null);
  };

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-12">
        {/* Language Toggle and Action Buttons */}
        <div className="fixed top-4 right-4 z-50 flex gap-2 items-center">
          <div className="px-3 py-1.5 rounded-md text-sm font-semibold text-white bg-green-500/40 border border-green-500/20 backdrop-blur-sm">
            👋 {userInfo?.nickname || 'User'}
          </div>
          <button
            type="button"
            onClick={() => setShowProfileEditModal(true)}
            className="px-3 py-1.5 rounded-md text-sm font-semibold text-white bg-blue-500/40 hover:bg-blue-500/60 border border-blue-500/20 backdrop-blur-sm"
            title="Edit your profile"
          >
            ✏️ Edit Profile
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-md text-sm font-semibold text-white bg-red-500/40 hover:bg-red-500/60 border border-red-500/20 backdrop-blur-sm"
            title={`Logged in as ${userInfo?.nickname || userInfo?.email}`}
          >
            登出 Logout
          </button>
          <button
            type="button"
            onClick={toggleLanguage}
            className="px-3 py-1.5 rounded-md text-sm font-semibold text-white bg-black/40 hover:bg-black/60 border border-white/20 backdrop-blur-sm"
          >
            {language === 'zh-TW' ? 'EN' : '中文'}
          </button>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8 pt-24 sm:pt-0">
            <Link to="/food-for-talk" className="inline-flex items-center text-white/70 hover:text-white transition-colors mb-4">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              {t('foodForTalk.common.back')}
            </Link>
            <img src="/images/High Tea or Me.png?v=3" alt="High Tea or Me Logo" className="mx-auto mb-4 h-18 sm:h-20 md:h-24 object-contain" />
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">{t('foodForTalk.participants.title')}</h1>
            <p className="text-xl text-white/80">{t('foodForTalk.participants.subtitle')}</p>
          </div>

          {/* Event Date Announcement */}
          <div className="text-center mb-12">
            <div className="relative inline-block">
              {/* Animated background glow */}
              <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400/30 via-orange-500/30 to-red-500/30 blur-2xl rounded-full animate-pulse"></div>
              
              {/* Main announcement card */}
              <div className="relative bg-gradient-to-r from-yellow-400/20 via-orange-500/20 to-red-500/20 backdrop-blur-sm border-2 border-yellow-400/40 rounded-3xl p-8 shadow-2xl">
                {/* Decorative elements */}
                <div className="absolute top-4 left-4 text-yellow-400 text-2xl">🎉</div>
                <div className="absolute top-4 right-4 text-orange-400 text-2xl">✨</div>
                <div className="absolute bottom-4 left-6 text-red-400 text-xl">💫</div>
                <div className="absolute bottom-4 right-6 text-yellow-300 text-xl">🌟</div>
                
                {/* Main text */}
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 mb-4 leading-tight">
                  See you on
                </h2>
                <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-2 tracking-wide">
                  1/11/2025
                </div>
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-8 h-0.5 bg-gradient-to-r from-transparent to-yellow-400"></div>
                  <span className="text-2xl sm:text-3xl font-bold text-yellow-300">@</span>
                  <div className="w-8 h-0.5 bg-gradient-to-r from-yellow-400 to-transparent"></div>
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
                  IPPAIKI
                </div>
                <p className="text-lg sm:text-xl text-white/90 font-medium">
                  Get ready for an amazing experience! 🍵
                </p>
              </div>
            </div>
          </div>

          {/* Participants Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {participants.map((participant, index) => (
              <div key={participant.id || index} className={`backdrop-blur-sm rounded-2xl p-6 border border-white/20 transition-all duration-300 ${participant.gender === 'Male' ? 'bg-blue-500/10 hover:bg-blue-500/15' : participant.gender === 'Female' ? 'bg-pink-500/10 hover:bg-pink-500/15' : 'bg-white/10 hover:bg-white/15'}`}>
                {/* Avatar */}
                <div className="text-center mb-4">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-2xl font-bold text-black">
                    {(participant.nickname || participant.firstName || 'A').charAt(0)}
                  </div>
                </div>

                {/* Participant Info */}
                <div className="space-y-3">
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-white">{participant.nickname || 'Anonymous'}</h3>
                    {participant.gender && (
                      <div className="text-white/70 text-sm mt-1">{participant.gender}</div>
                    )}
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-white/70">Age:</span><span className="text-white">{participant.age || 'N/A'}</span></div>

                    {(() => {
                      let interests = participant.interests;
                      if (typeof interests === 'string') {
                        try {
                          interests = JSON.parse(interests);
                        } catch (e) {
                          interests = [];
                        }
                      }
                      if (interests && Array.isArray(interests) && interests.length > 0) {
                        return (
                          <div>
                            <span className="text-white/70 block mb-1">Interests:</span>
                            <div className="flex flex-wrap gap-1">
                              {interests.slice(0, 3).map((interest, idx) => (
                                <span key={idx} className="px-2 py-1 bg-yellow-400/20 text-yellow-300 text-xs rounded-full">{interest}</span>
                              ))}
                              {interests.length > 3 && (
                                <span className="px-2 py-1 bg-white/20 text-white/70 text-xs rounded-full">+{interests.length - 3}</span>
                              )}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })()}

                    {participant.bio && (
                      <div>
                        <span className="text-white/70 block mb-1">Bio:</span>
                        <p className="text-white text-xs leading-relaxed">{expanded[participant.id] ? participant.bio : (participant.bio.length > 100 ? `${participant.bio.substring(0, 100)}...` : participant.bio)}</p>
                      </div>
                    )}

                    <button 
                      onClick={() => handleViewDetails(participant.id)} 
                      className="mt-2 w-full px-3 py-2 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 text-yellow-300 hover:text-yellow-200 border border-yellow-400/30 rounded-lg text-xs font-medium transition-all duration-300 hover:from-yellow-400/30 hover:to-orange-500/30"
                    >
                      View Full Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-12 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 inline-block">
              <h3 className="text-2xl font-bold text-white mb-2">{participants.length} Participants Registered</h3>
              <p className="text-white/80">Join us for an amazing speed dating experience!</p>
            </div>
          </div>
        </div>

        {/* Participant Details Modal */}
        <ParticipantDetailsModal
          participantId={selectedParticipantId}
          isOpen={showDetailsModal}
          onClose={handleCloseModal}
        />

        {/* Profile Edit Modal */}
        <ParticipantProfileEditModal
          isOpen={showProfileEditModal}
          onClose={() => setShowProfileEditModal(false)}
          onProfileUpdated={handleProfileUpdated}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center py-12">
      {/* Language Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <button
          type="button"
          onClick={toggleLanguage}
          className="px-3 py-1.5 rounded-md text-sm font-semibold text-white bg-black/40 hover:bg-black/60 border border-white/20 backdrop-blur-sm"
        >
          {language === 'zh-TW' ? 'EN' : '中文'}
        </button>
      </div>
      
      <div className="max-w-md w-full mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-0">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/food-for-talk" className="inline-flex items-center text-white/70 hover:text-white transition-colors mb-4">
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            {t('foodForTalk.common.back')}
          </Link>
          <img src="/images/High Tea or Me.png?v=3" alt="High Tea or Me Logo" className="mx-auto mb-4 h-16 object-contain" />
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">{t('foodForTalk.participants.title')}</h1>
          <p className="text-lg text-white/80">{t('foodForTalk.participants.subtitle')}</p>
        </div>

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-white font-medium mb-2">Email</label>
              <input type="email" name="email" value={loginData.email} onChange={handleInputChange} required className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent" placeholder="Enter your email" />
            </div>
            <div>
              <label className="block text-white font-medium mb-2">Password</label>
              <input type="password" name="password" value={loginData.password} onChange={handleInputChange} required className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent" placeholder="Enter your password" />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold py-3 px-6 rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">{loading ? 'Logging in...' : 'Login to View Participants'}</button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-white/70 text-sm">Don't have an account?{' '}<Link to="/food-for-talk/register" className="text-yellow-400 hover:text-yellow-300 transition-colors">Register for the event</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodForTalkParticipantsPage;
