import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import apiService from '../../services/api';
import { useLanguage } from '../../contexts/LanguageContext';

const ParticipantDetailsModal = ({ participantId, isOpen, onClose }) => {
  const { t, language } = useLanguage();
  const [participant, setParticipant] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && participantId) {
      loadParticipantDetails();
    }
  }, [isOpen, participantId]);

  const loadParticipantDetails = async () => {
    setLoading(true);
    try {
      const response = await apiService.getFoodForTalkParticipantDetails(participantId);
      if (response.participant) {
        setParticipant(response.participant);
      }
    } catch (error) {
      console.error('Error loading participant details:', error);
      toast.error('Failed to load participant details');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-2xl border border-white/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <h2 className="text-2xl font-bold text-white">Participant Details</h2>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
              <span className="ml-3 text-white">Loading details...</span>
            </div>
          ) : participant ? (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-white/70 text-sm">Nickname:</span>
                    <p className="text-white font-medium">{participant.nickname || 'Anonymous'}</p>
                  </div>
                  <div>
                    <span className="text-white/70 text-sm">Gender:</span>
                    <p className="text-white font-medium">{participant.gender || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="text-white/70 text-sm">Age:</span>
                    <p className="text-white font-medium">{participant.age || 'Not specified'}</p>
                  </div>
                </div>
              </div>

              {/* About & Interests */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  About & Interests
                </h3>
                
                {participant.bio && (
                  <div className="mb-4">
                    <span className="text-white/70 text-sm block mb-2">Bio:</span>
                    <p className="text-white leading-relaxed">{participant.bio}</p>
                  </div>
                )}

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
                      <div className="mb-4">
                        <span className="text-white/70 text-sm block mb-2">Interests:</span>
                        <div className="flex flex-wrap gap-2">
                          {interests.map((interest, idx) => (
                            <span key={idx} className="px-3 py-1 bg-yellow-400/20 text-yellow-300 text-sm rounded-full border border-yellow-400/30">
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}

                {participant.interestsOther && (
                  <div>
                    <span className="text-white/70 text-sm block mb-2">Other Interests:</span>
                    <p className="text-white">{participant.interestsOther}</p>
                  </div>
                )}
              </div>

              {/* Dating Preferences */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                  Dating Preferences
                </h3>
                
                {participant.expectPersonType && (
                  <div className="mb-4">
                    <span className="text-white/70 text-sm block mb-2">Looking for:</span>
                    <p className="text-white font-medium">{participant.expectPersonType}</p>
                  </div>
                )}

                {participant.dreamFirstDate && (
                  <div className="mb-4">
                    <span className="text-white/70 text-sm block mb-2">Dream first date:</span>
                    <p className="text-white font-medium">{participant.dreamFirstDate}</p>
                    {participant.dreamFirstDateOther && (
                      <p className="text-white/80 text-sm mt-1">({participant.dreamFirstDateOther})</p>
                    )}
                  </div>
                )}

                {(() => {
                  let attractiveTraits = participant.attractiveTraits;
                  if (typeof attractiveTraits === 'string') {
                    try {
                      attractiveTraits = JSON.parse(attractiveTraits);
                    } catch (e) {
                      attractiveTraits = [];
                    }
                  }
                  if (attractiveTraits && Array.isArray(attractiveTraits) && attractiveTraits.length > 0) {
                    return (
                      <div className="mb-4">
                        <span className="text-white/70 text-sm block mb-2">Attractive traits:</span>
                        <div className="flex flex-wrap gap-2">
                          {attractiveTraits.map((trait, idx) => (
                            <span key={idx} className="px-3 py-1 bg-pink-400/20 text-pink-300 text-sm rounded-full border border-pink-400/30">
                              {trait}
                            </span>
                          ))}
                        </div>
                        {participant.attractiveTraitsOther && (
                          <p className="text-white/80 text-sm mt-2">Other: {participant.attractiveTraitsOther}</p>
                        )}
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>

              {/* Food Preferences */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Food Preferences
                </h3>
                <p className="text-white font-medium">{participant.japaneseFoodPreference || 'Not specified'}</p>
              </div>

              {/* Quickfire Questions */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Quickfire Fun
                </h3>
                
                {participant.quickfireMagicItemChoice && (
                  <div className="mb-4">
                    <span className="text-white/70 text-sm block mb-2">Magic item choice:</span>
                    <p className="text-white font-medium">{participant.quickfireMagicItemChoice}</p>
                  </div>
                )}

                {participant.quickfireDesiredOutcome && (
                  <div>
                    <span className="text-white/70 text-sm block mb-2">Desired outcome:</span>
                    <p className="text-white font-medium">{participant.quickfireDesiredOutcome}</p>
                  </div>
                )}
              </div>

              {/* Registration Details */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Registration Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-white/70 text-sm">Registration Date:</span>
                    <p className="text-white font-medium">{new Date(participant.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-white/70 text-sm">Consent Accepted:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      participant.consentAccepted ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                    }`}>
                      {participant.consentAccepted ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-white/70">Failed to load participant details</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-white/20">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParticipantDetailsModal;
