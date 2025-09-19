import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const FoodForTalkParticipantsPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/food-for-talk/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
      });

      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(true);
        setParticipants(data.participants);
        toast.success('Login successful!');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Event Participants
            </h1>
            <p className="text-xl text-white/80">
              Meet your fellow speed dating participants
            </p>
          </div>

          {/* Participants Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {participants.map((participant, index) => (
              <div key={participant.id || index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                {/* Profile Photo */}
                <div className="text-center mb-4">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-2xl font-bold text-black">
                    {participant.firstName?.charAt(0) || '?'}
                  </div>
                </div>

                {/* Participant Info (excluding name and contact) */}
                <div className="space-y-3">
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-white">
                      {participant.firstName ? `${participant.firstName} ${participant.lastName?.charAt(0)}.` : 'Anonymous'}
                    </h3>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/70">Age:</span>
                      <span className="text-white">{participant.age || 'N/A'}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-white/70">Occupation:</span>
                      <span className="text-white">{participant.occupation || 'N/A'}</span>
                    </div>

                    {participant.interests && participant.interests.length > 0 && (
                      <div>
                        <span className="text-white/70 block mb-1">Interests:</span>
                        <div className="flex flex-wrap gap-1">
                          {participant.interests.slice(0, 3).map((interest, idx) => (
                            <span key={idx} className="px-2 py-1 bg-yellow-400/20 text-yellow-300 text-xs rounded-full">
                              {interest}
                            </span>
                          ))}
                          {participant.interests.length > 3 && (
                            <span className="px-2 py-1 bg-white/20 text-white/70 text-xs rounded-full">
                              +{participant.interests.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {participant.bio && (
                      <div>
                        <span className="text-white/70 block mb-1">Bio:</span>
                        <p className="text-white text-xs leading-relaxed">
                          {participant.bio.length > 100 
                            ? `${participant.bio.substring(0, 100)}...` 
                            : participant.bio
                          }
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-12 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 inline-block">
              <h3 className="text-2xl font-bold text-white mb-2">
                {participants.length} Participants Registered
              </h3>
              <p className="text-white/80">
                Join us for an amazing speed dating experience!
              </p>
            </div>
          </div>
        </div>
      </div>
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
            View Participants
          </h1>
          <p className="text-lg text-white/80">
            Login to see who's attending the event
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-white font-medium mb-2">Email</label>
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
              <label className="block text-white font-medium mb-2">Password</label>
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold py-3 px-6 rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login to View Participants'}
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

export default FoodForTalkParticipantsPage;
