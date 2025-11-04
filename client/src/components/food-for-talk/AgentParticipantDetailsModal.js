import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import apiService from '../../services/api';
import { useLanguage } from '../../contexts/LanguageContext';

const AgentParticipantDetailsModal = ({ participantId, isOpen, onClose, onParticipantUpdated }) => {
  const { language } = useLanguage();
  const [participant, setParticipant] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen && participantId) {
      loadDetails();
    }
  }, [isOpen, participantId]);

  const loadDetails = async () => {
    setLoading(true);
    try {
      const res = await apiService.get(`/food-for-talk/agent/participants/${participantId}`);
      if (res.success && res.participant) {
        setParticipant(res.participant);
        setEditData(res.participant);
      }
    } catch (e) {
      console.error(e);
      toast.error('Failed to load participant details');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
    setEditData(participant);
  };

  const handleCancel = () => {
    setEditing(false);
    setEditData(participant);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Prepare payload: only send fields editable by agent
      const payload = { ...editData };
      delete payload.email; // agent cannot change email
      delete payload.isVerified;
      delete payload.isActive;
      delete payload.registrationDate;
      delete payload.lastLogin;
      delete payload.profilePhotoUrl;
      const res = await apiService.put(`/food-for-talk/agent/participants/${participantId}`, payload);
      if (res.success) {
        toast.success('Participant updated');
        setEditing(false);
        await loadDetails();
        if (onParticipantUpdated) onParticipantUpdated();
      }
    } catch (e) {
      console.error(e);
      toast.error(e.message || 'Failed to update participant');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayToggle = (field, value, maxSelections = null) => {
    setEditData(prev => {
      const current = Array.isArray(prev[field]) ? prev[field] : [];
      const exists = current.includes(value);
      let next = exists ? current.filter(i => i !== value) : [...current, value];
      if (maxSelections && next.length > maxSelections) {
        return prev; // ignore if exceeds max
      }
      return { ...prev, [field]: next };
    });
  };

  if (!isOpen) return null;

  const genderOptions = language === 'zh-TW' ? ['男 Male', '女 Female', '其他 Other'] : ['Male', 'Female', 'Other'];
  const expectPersonTypeOptions = language === 'zh-TW'
    ? ['愛玩愛笑派', '文青知性派', '運動健將派', '美食探索家', '旅遊冒險派', '神秘未知派']
    : ['Fun & Laughs', 'Chill & Artsy', 'Sporty', 'Foodie', 'Globe-trotter', 'Surprise me!'];
  const dreamFirstDateOptions = language === 'zh-TW'
    ? ['一齊去日式餐廳開餐', '一起行山', '去睇演唱會/音樂會', '夜遊維港', '咖啡店慢談', '其他']
    : ['Japanese restaurant dinner', 'Hiking together', 'Concert / Live music', 'Harbour night walk', 'Cafe slow talk', 'Other'];
  const japaneseFoodOptions = language === 'zh-TW'
    ? ['壽司', '刺身', '天婦羅', '拉麵', '日式甜品', '清酒/飲品']
    : ['Sushi', 'Sashimi', 'Tempura', 'Ramen', 'Japanese dessert', 'Sake/Drinks'];
  const magicItemOptions = language === 'zh-TW'
    ? ['用嚟表白', '當護身符', '偷偷收埋', '送俾最有緣嗰位']
    : ['Confess love', 'Keep as amulet', 'Hide it secretly', 'Gift to the fated one'];
  const desiredOutcomeOptions = language === 'zh-TW'
    ? ['新朋友', '脫單機會', '笑到肚痛的回憶', '靚相打卡', '一段特別的故事']
    : ['New friends', 'Chance to find a match', 'Laugh-out-loud memories', 'Nice photos', 'A special story'];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-2xl border border-white/20 max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <h2 className="text-2xl font-bold text-white">{editing ? 'Edit Participant Details' : 'Participant Details'}</h2>
          <div className="flex gap-2">
            {editing ? (
              <>
                <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-green-500/40 hover:bg-green-500/60 text-white rounded-lg transition-colors disabled:opacity-50">{saving ? 'Saving...' : 'Save'}</button>
                <button onClick={handleCancel} disabled={saving} className="px-4 py-2 bg-gray-500/40 hover:bg-gray-500/60 text-white rounded-lg transition-colors">Cancel</button>
              </>
            ) : (
              <button onClick={handleEdit} className="px-4 py-2 bg-blue-500/40 hover:bg-blue-500/60 text-white rounded-lg transition-colors">Edit</button>
            )}
            <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
              <span className="ml-3 text-white">Loading details...</span>
            </div>
          ) : participant ? (
            <div className="space-y-6">
              <div className="bg-red-500/10 backdrop-blur-sm rounded-xl p-4 border border-red-500/20">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/70 text-sm block mb-1">Email:</label>
                    <input type="email" value={editData.email || ''} disabled className="w-full px-3 py-2 bg-white/10 border border-white/20 text-white rounded-lg" />
                  </div>
                  <div>
                    <label className="text-white/70 text-sm block mb-1">WhatsApp:</label>
                    {editing ? (
                      <input type="tel" value={editData.whatsappPhone || ''} onChange={(e) => handleInputChange('whatsappPhone', e.target.value)} className="w-full px-3 py-2 bg-white/20 border border-white/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400" />
                    ) : (
                      <input type="tel" value={participant.whatsappPhone || ''} disabled className="w-full px-3 py-2 bg-white/10 border border-white/20 text-white rounded-lg" />
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center"><svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['firstName','lastName','nickname','occupation'].map((f) => (
                    <div key={f}>
                      <label className="text-white/70 text-sm block mb-1">{f}</label>
                      {editing ? (
                        <input type="text" value={editData[f] || ''} onChange={(e) => handleInputChange(f, e.target.value)} className="w-full px-3 py-2 bg-white/20 border border-white/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400" />
                      ) : (
                        <p className="text-white font-medium">{participant[f] || ''}</p>
                      )}
                    </div>
                  ))}
                  <div>
                    <label className="text-white/70 text-sm block mb-1">Gender</label>
                    {editing ? (
                      <select value={editData.gender || ''} onChange={(e)=>handleInputChange('gender', e.target.value)} className="w-full px-3 py-2 bg-white/20 border border-white/30 text-white rounded-lg">
                        <option value="">Select...</option>
                        {genderOptions.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : (
                      <p className="text-white font-medium">{participant.gender || ''}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-white/70 text-sm block mb-1">Age</label>
                    {editing ? (
                      <input type="number" value={editData.age || ''} onChange={(e)=>handleInputChange('age', e.target.value)} className="w-full px-3 py-2 bg-white/20 border border-white/30 text-white rounded-lg" />
                    ) : (
                      <p className="text-white font-medium">{participant.age || ''}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center"><svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>About & Interests</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-white/70 text-sm block mb-1">Bio</label>
                    {editing ? (
                      <textarea rows={3} value={editData.bio || ''} onChange={(e)=>handleInputChange('bio', e.target.value)} className="w-full px-3 py-2 bg-white/20 border border-white/30 text-white rounded-lg" />
                    ) : (
                      <p className="text-white">{participant.bio || ''}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center"><svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" /></svg>Dating Preferences</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-white/70 text-sm block mb-1">Looking for</label>
                    {editing ? (
                      <select value={editData.expectPersonType || ''} onChange={(e)=>handleInputChange('expectPersonType', e.target.value)} className="w-full px-3 py-2 bg-white/20 border border-white/30 text-white rounded-lg">
                        <option value="">Select...</option>
                        {expectPersonTypeOptions.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : (
                      <p className="text-white">{participant.expectPersonType || ''}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-white/70 text-sm block mb-1">Dream first date</label>
                    {editing ? (
                      <select value={editData.dreamFirstDate || ''} onChange={(e)=>handleInputChange('dreamFirstDate', e.target.value)} className="w-full px-3 py-2 bg-white/20 border border-white/30 text-white rounded-lg">
                        <option value="">Select...</option>
                        {dreamFirstDateOptions.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : (
                      <p className="text-white">{participant.dreamFirstDate || ''}</p>
                    )}
                  </div>
                  {((language === 'zh-TW' && (editData.dreamFirstDate === '其他' || participant.dreamFirstDate === '其他')) || (language !== 'zh-TW' && (editData.dreamFirstDate === 'Other' || participant.dreamFirstDate === 'Other'))) && (
                    <div>
                      <label className="text-white/70 text-sm block mb-1">Dream first date (other)</label>
                      {editing ? (
                        <input type="text" value={editData.dreamFirstDateOther || ''} onChange={(e)=>handleInputChange('dreamFirstDateOther', e.target.value)} className="w-full px-3 py-2 bg-white/20 border border-white/30 text-white rounded-lg" />
                      ) : (
                        <p className="text-white">{participant.dreamFirstDateOther || ''}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center"><svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>Food Preferences</h3>
                <div>
                  <label className="text-white/70 text-sm block mb-1">Japanese food preference</label>
                  {editing ? (
                    <select value={editData.japaneseFoodPreference || ''} onChange={(e)=>handleInputChange('japaneseFoodPreference', e.target.value)} className="w-full px-3 py-2 bg-white/20 border border-white/30 text-white rounded-lg">
                      <option value="">Select...</option>
                      {japaneseFoodOptions.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : (
                    <p className="text-white">{participant.japaneseFoodPreference || ''}</p>
                  )}
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center"><svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>Quickfire Fun</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-white/70 text-sm block mb-1">Magic item choice</label>
                    {editing ? (
                      <select value={editData.quickfireMagicItemChoice || ''} onChange={(e)=>handleInputChange('quickfireMagicItemChoice', e.target.value)} className="w-full px-3 py-2 bg-white/20 border border-white/30 text-white rounded-lg">
                        <option value="">Select...</option>
                        {magicItemOptions.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : (
                      <p className="text-white">{participant.quickfireMagicItemChoice || ''}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-white/70 text-sm block mb-1">Desired outcome</label>
                    {editing ? (
                      <select value={editData.quickfireDesiredOutcome || ''} onChange={(e)=>handleInputChange('quickfireDesiredOutcome', e.target.value)} className="w-full px-3 py-2 bg-white/20 border border-white/30 text-white rounded-lg">
                        <option value="">Select...</option>
                        {desiredOutcomeOptions.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : (
                      <p className="text-white">{participant.quickfireDesiredOutcome || ''}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {editing ? (
                      <input type="checkbox" checked={!!editData.consentAccepted} onChange={(e)=>handleInputChange('consentAccepted', e.target.checked)} className="w-4 h-4 text-yellow-400 bg-white/20 border-white/30 rounded focus:ring-yellow-400 focus:ring-2" />
                    ) : (
                      <input type="checkbox" checked={!!participant.consentAccepted} readOnly className="w-4 h-4 text-yellow-400 bg-white/20 border-white/30 rounded" />
                    )}
                    <label className="text-white/70 text-sm">Consent Accepted</label>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center"><svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>Registration Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-white/70 text-sm">Registration Date:</span>
                    <p className="text-white font-medium">{participant.registrationDate ? new Date(participant.registrationDate).toLocaleDateString() : '-'}</p>
                  </div>
                  <div>
                    <span className="text-white/70 text-sm">Last Login:</span>
                    <p className="text-white font-medium">{participant.lastLogin ? new Date(participant.lastLogin).toLocaleDateString() : 'Never'}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8"><p className="text-white/70">Failed to load participant details</p></div>
          )}
        </div>

        <div className="flex justify-end p-6 border-t border-white/20">
          <button onClick={onClose} className="px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-300">Close</button>
        </div>
      </div>
    </div>
  );
};

export default AgentParticipantDetailsModal;


