import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import apiService from '../../services/api';
import { useLanguage } from '../../contexts/LanguageContext';

const SuperAdminParticipantDetailsModal = ({ participantId, isOpen, onClose }) => {
  const { t, language } = useLanguage();
  const [participant, setParticipant] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen && participantId) {
      loadParticipantDetails();
    }
  }, [isOpen, participantId]);

  const loadParticipantDetails = async () => {
    setLoading(true);
    try {
      const response = await apiService.getFoodForTalkAdminParticipantDetails(participantId);
      if (response.participant) {
        setParticipant(response.participant);
        setEditData(response.participant);
      }
    } catch (error) {
      console.error('Error loading participant details:', error);
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
      const response = await apiService.updateFoodForTalkAdminParticipant(participantId, editData);
      setParticipant(response.participant);
      setEditing(false);
      toast.success('Participant details updated successfully');
    } catch (error) {
      console.error('Error updating participant:', error);
      toast.error(error.message || 'Failed to update participant details');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field, value, index) => {
    setEditData(prev => {
      const newArray = [...(prev[field] || [])];
      if (index !== undefined) {
        newArray[index] = value;
      } else {
        if (newArray.includes(value)) {
          return { ...prev, [field]: newArray.filter(item => item !== value) };
        } else {
          newArray.push(value);
        }
      }
      return { ...prev, [field]: newArray };
    });
  };

  const renderEditableField = (label, field, type = 'text', options = null) => {
    if (editing) {
      if (type === 'select') {
        return (
          <div>
            <label className="text-white/70 text-sm block mb-1">{label}:</label>
            <select
              value={editData[field] || ''}
              onChange={(e) => handleInputChange(field, e.target.value)}
              className="w-full px-3 py-2 bg-white/20 border border-white/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="">Select...</option>
              {options?.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        );
      } else if (type === 'textarea') {
        return (
          <div>
            <label className="text-white/70 text-sm block mb-1">{label}:</label>
            <textarea
              value={editData[field] || ''}
              onChange={(e) => handleInputChange(field, e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-white/20 border border-white/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
        );
      } else if (type === 'checkbox') {
        return (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={editData[field] || false}
              onChange={(e) => handleInputChange(field, e.target.checked)}
              className="w-4 h-4 text-yellow-400 bg-white/20 border-white/30 rounded focus:ring-yellow-400 focus:ring-2"
            />
            <label className="text-white/70 text-sm">{label}</label>
          </div>
        );
      } else {
        return (
          <div>
            <label className="text-white/70 text-sm block mb-1">{label}:</label>
            <input
              type={type}
              value={editData[field] || ''}
              onChange={(e) => handleInputChange(field, e.target.value)}
              className="w-full px-3 py-2 bg-white/20 border border-white/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
        );
      }
    } else {
      return (
        <div>
          <span className="text-white/70 text-sm">{label}:</span>
          <p className="text-white font-medium">{participant?.[field] || 'Not specified'}</p>
        </div>
      );
    }
  };

  const renderArrayField = (label, field, options, maxSelections = null) => {
    if (editing) {
      return (
        <div>
          <label className="text-white/70 text-sm block mb-2">{label}:</label>
          <div className="grid grid-cols-2 gap-2 mb-2">
            {options.map(option => (
              <button
                key={option}
                type="button"
                onClick={() => handleArrayChange(field, option)}
                disabled={maxSelections && editData[field]?.length >= maxSelections && !editData[field]?.includes(option)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  editData[field]?.includes(option)
                    ? 'bg-yellow-400 text-black border-2 border-yellow-400'
                    : 'bg-white/20 text-white border border-white/30 hover:bg-white/30'
                } ${maxSelections && editData[field]?.length >= maxSelections && !editData[field]?.includes(option) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {option}
              </button>
            ))}
          </div>
          {maxSelections && (
            <div className="text-white/70 text-sm">
              Selected: {editData[field]?.length || 0}/{maxSelections}
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div>
          <span className="text-white/70 text-sm block mb-2">{label}:</span>
          {participant?.[field] && participant[field].length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {participant[field].map((item, idx) => (
                <span key={idx} className="px-3 py-1 bg-yellow-400/20 text-yellow-300 text-sm rounded-full border border-yellow-400/30">
                  {item}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-white/70">Not specified</p>
          )}
        </div>
      );
    }
  };

  if (!isOpen) return null;

  // Use bilingual options that match the registration form
  const genderOptions = language === 'zh-TW' 
    ? ['男 Male', '女 Female', '其他 Other'] 
    : ['Male', 'Female', 'Other'];
  
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
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <h2 className="text-2xl font-bold text-white">
            {editing ? 'Edit Participant Details' : 'Participant Details (Admin View)'}
          </h2>
          <div className="flex gap-2">
            {editing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 bg-green-500/40 hover:bg-green-500/60 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={saving}
                  className="px-4 py-2 bg-gray-500/40 hover:bg-gray-500/60 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-blue-500/40 hover:bg-blue-500/60 text-white rounded-lg transition-colors"
              >
                Edit
              </button>
            )}
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
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
              {/* Contact Information */}
              <div className="bg-red-500/10 backdrop-blur-sm rounded-xl p-4 border border-red-500/20">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Contact Information (Admin Only)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderEditableField('Email', 'email', 'email')}
                  {renderEditableField('Phone', 'phone', 'tel')}
                  {renderEditableField('WhatsApp', 'whatsappPhone', 'tel')}
                  {renderEditableField('Emergency Contact Name', 'emergencyContactName', 'text')}
                  {renderEditableField('Emergency Contact Phone', 'emergencyContactPhone', 'tel')}
                </div>
              </div>

              {/* Basic Information */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderEditableField('First Name', 'firstName', 'text')}
                  {renderEditableField('Last Name', 'lastName', 'text')}
                  {renderEditableField('Nickname', 'nickname', 'text')}
                  {renderEditableField('Gender', 'gender', 'select', genderOptions)}
                  {renderEditableField('Age', 'age', 'number')}
                  {renderEditableField('Occupation', 'occupation', 'text')}
                  {renderEditableField('Account Active', 'isActive', 'checkbox')}
                  {renderEditableField('Verified', 'isVerified', 'checkbox')}
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
                <div className="space-y-4">
                  {renderEditableField('Bio', 'bio', 'textarea')}
                  {renderArrayField('Interests', 'interests', language === 'zh-TW' 
                    ? ['煮食', '運動', '追劇/電影', '旅行', '畫畫/手作', '唱歌/音樂', '電玩/桌遊', '寫作/閱讀', '其他']
                    : ['Cooking', 'Sports', 'Movies/Series', 'Travel', 'Art/Handcraft', 'Singing/Music', 'Gaming/Board games', 'Writing/Reading', 'Other'], 3)}
                  {renderEditableField('Other Interests', 'interestsOther', 'text')}
                  {renderEditableField('Dietary Restrictions', 'dietaryRestrictions', 'textarea')}
                </div>
              </div>

              {/* Dating Preferences */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                  Dating Preferences
                </h3>
                <div className="space-y-4">
                  {renderEditableField('Looking for', 'expectPersonType', 'select', expectPersonTypeOptions)}
                  {renderEditableField('Dream first date', 'dreamFirstDate', 'select', dreamFirstDateOptions)}
                  {renderEditableField('Dream first date (other)', 'dreamFirstDateOther', 'text')}
                  {renderArrayField('Attractive traits', 'attractiveTraits', language === 'zh-TW'
                    ? ['好有幽默感', '很會聊天', '做嘢認真專注', '好有創意', '好有同理心', '組織力強', '運動細胞發達', '廚藝高手', '藝術天分', '其他']
                    : ['Funny & witty', 'Great conversationalist', 'Hardworking & focused', 'Creative thinker', 'Empathetic & caring', 'Organized & reliable', 'Athletic', 'Great cook', 'Artistic talent', 'Other'], 2)}
                  {renderEditableField('Other attractive traits', 'attractiveTraitsOther', 'text')}
                </div>
              </div>

              {/* Food Preferences */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Food Preferences
                </h3>
                {renderEditableField('Japanese food preference', 'japaneseFoodPreference', 'select', japaneseFoodOptions)}
              </div>

              {/* Quickfire Questions */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Quickfire Fun
                </h3>
                <div className="space-y-4">
                  {renderEditableField('Magic item choice', 'quickfireMagicItemChoice', 'select', magicItemOptions)}
                  {renderEditableField('Desired outcome', 'quickfireDesiredOutcome', 'select', desiredOutcomeOptions)}
                  {renderEditableField('Consent Accepted', 'consentAccepted', 'checkbox')}
                </div>
              </div>

              {/* Registration Details (Read-only) */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Registration Details (Read-only)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-white/70 text-sm">Registration Date:</span>
                    <p className="text-white font-medium">{new Date(participant.registrationDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-white/70 text-sm">Last Login:</span>
                    <p className="text-white font-medium">{participant.lastLogin ? new Date(participant.lastLogin).toLocaleDateString() : 'Never'}</p>
                  </div>
                  <div>
                    <span className="text-white/70 text-sm">Profile Photo:</span>
                    <p className="text-white font-medium">{participant.profilePhotoUrl ? 'Uploaded' : 'Not uploaded'}</p>
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

export default SuperAdminParticipantDetailsModal;