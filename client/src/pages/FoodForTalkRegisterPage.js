import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import apiService from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';

// Local floating language toggle for pages without header
const LanguageFloatingToggle = () => {
  const { language, toggleLanguage } = useLanguage();
  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className="fixed top-4 right-4 z-50 px-3 py-1.5 rounded-md text-sm font-semibold text-white bg-black/40 hover:bg-black/60 border border-white/20 backdrop-blur-sm"
    >
      {language === 'zh-TW' ? 'EN' : '中文'}
    </button>
  );
};

const FoodForTalkRegisterPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    // Basic Info
    nickname: '',
    age: '',
    gender: '',
    // Contact
    email: '',
    phone: '',
    password: '',
    // Fun Self-intro
    expectPersonType: '',
    dreamFirstDate: '',
    dreamFirstDateOther: '',
    interests: [],
    interestsOther: '',
    attractiveTraits: [],
    attractiveTraitsOther: '',
    japaneseFoodPreference: '',
    // Bio
    bio: '',
    // Compatibility fields (not shown to user)
    firstName: 'Anonymous',
    lastName: 'Participant',
    occupation: '',
    dietaryRestrictions: '',
    emergencyContact: '',
    emergencyPhone: '',
    profilePhoto: null,
    consentAccepted: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const ageOptions = Array.from({ length: 38 - 23 + 1 }, (_, i) => 23 + i);
  const funTypes = [
    '愛玩愛笑派（Fun & Laughs）',
    '文青知性派（Chill & Artsy）',
    '運動健將派（Sporty）',
    '美食探索家（Foodie）',
    '旅遊冒險派（Globe-trotter）',
    '神秘未知派（Surprise me!）'
  ];
  const dreamDates = [
    '一齊去日式餐廳開餐',
    '一起行山',
    '去睇演唱會/音樂會',
    '夜遊維港',
    '咖啡店慢談',
    '其他'
  ];
  const interestChoices = [
    '煮食','運動','追劇/電影','旅行','畫畫/手作','唱歌/音樂','電玩/桌遊','寫作/閱讀','其他'
  ];
  const traitChoices = [
    '好有幽默感（Funny & witty）','很會聊天（Great conversationalist）','做嘢認真專注（Hardworking & focused）','好有創意（Creative thinker）','好有同理心（Empathetic & caring）','組織力強（Organized & reliable）','運動細胞發達（Athletic）','廚藝高手（Great cook）','藝術天分（Artistic talent）','其他'
  ];
  const japaneseFoods = ['壽司 Sushi','刺身 Sashimi','天婦羅 Tempura','拉麵 Ramen','日式甜品 Japanese Dessert','清酒/飲品 Sake/Drinks'];
  const quickMagic = ['用嚟表白','當護身符','偷偷收埋','送俾最有緣嗰位'];
  const quickOutcome = ['新朋友','脫單機會','笑到肚痛的回憶','靚相打卡','一段特別的故事'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInterestToggle = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleTraitToggle = (trait) => {
    setFormData(prev => ({
      ...prev,
      attractiveTraits: prev.attractiveTraits.includes(trait)
        ? prev.attractiveTraits.filter(t => t !== trait)
        : [...prev.attractiveTraits, trait]
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        profilePhoto: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      
      // Add all form fields
      submitData.append('firstName', formData.firstName);
      submitData.append('lastName', formData.lastName);
      submitData.append('email', formData.email);
      submitData.append('password', formData.password);
      submitData.append('phone', formData.phone);
      submitData.append('age', formData.age);
      submitData.append('occupation', formData.occupation);
      submitData.append('bio', formData.bio);
      submitData.append('dietaryRestrictions', formData.dietaryRestrictions);
      submitData.append('emergencyContact', formData.emergencyContact);
      submitData.append('emergencyPhone', formData.emergencyPhone);
      submitData.append('interests', JSON.stringify(formData.interests));
      // New fields
      submitData.append('nickname', formData.nickname);
      submitData.append('gender', formData.gender);
      submitData.append('expectPersonType', formData.expectPersonType);
      submitData.append('dreamFirstDate', formData.dreamFirstDate);
      submitData.append('dreamFirstDateOther', formData.dreamFirstDateOther);
      submitData.append('interestsOther', formData.interestsOther);
      submitData.append('attractiveTraits', JSON.stringify(formData.attractiveTraits));
      submitData.append('attractiveTraitsOther', formData.attractiveTraitsOther);
      submitData.append('japaneseFoodPreference', formData.japaneseFoodPreference);
      submitData.append('quickfireMagicItemChoice', formData.quickfireMagicItemChoice);
      submitData.append('quickfireDesiredOutcome', formData.quickfireDesiredOutcome);
      submitData.append('consentAccepted', String(formData.consentAccepted));
      
      // Add profile photo if provided
      if (formData.profilePhoto) {
        submitData.append('profilePhoto', formData.profilePhoto);
      }

      console.log('Submitting Food for Talk registration...');

      const response = await apiService.registerForFoodForTalk(submitData);
      
      if (response.message && response.message.includes('successful')) {
        toast.success('Registration successful! You will receive a confirmation email shortly.');
        navigate('/food-for-talk');
      } else {
        toast.error(response.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-12 relative">
      <LanguageFloatingToggle />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link 
            to="/food-for-talk" 
            className="inline-flex items-center text-white/70 hover:text-white transition-colors mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t('foodForTalk.common.back')}
          </Link>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">{t('foodForTalk.register.title')}</h1>
          <p className="text-xl text-white/80">{t('foodForTalk.register.subtitle')}</p>
        </div>

        {/* Registration Form */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* 1. 基本資料 Basic Info */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">{t('foodForTalk.sections.basicInfo')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-medium mb-2">{t('foodForTalk.form.nickname')}</label>
                  <input type="text" name="nickname" value={formData.nickname} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent" placeholder={t('foodForTalk.form.nicknamePlaceholder')} />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">{t('foodForTalk.form.age')}</label>
                  <select name="age" value={formData.age} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent">
                    <option value="">{t('foodForTalk.form.selectAge')}</option>
                    {ageOptions.map(a => (<option key={a} value={a}>{a}</option>))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-white font-medium mb-2">{t('foodForTalk.form.gender')}</label>
                  <div className="flex flex-wrap gap-3">
                    {[t('foodForTalk.form.gender.male'), t('foodForTalk.form.gender.female'), t('foodForTalk.form.gender.other')].map(opt => (
                      <button key={opt} type="button" onClick={() => setFormData(prev => ({...prev, gender: opt}))} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${formData.gender===opt ? 'bg-yellow-400 text-black' : 'bg-white/20 text-white border border-white/30 hover:bg-white/30'}`}>{opt}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. 有趣自我 Fun Self-intro */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">{t('foodForTalk.sections.funIntro')}</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-white font-medium mb-2">{t('foodForTalk.form.expectPersonType')}</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {funTypes.map(opt => (
                      <button key={opt} type="button" onClick={() => setFormData(prev=>({...prev, expectPersonType: opt}))} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${formData.expectPersonType===opt ? 'bg-yellow-400 text-black' : 'bg-white/20 text-white border border-white/30 hover:bg-white/30'}`}>{opt}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">{t('foodForTalk.form.dreamFirstDate')}</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {dreamDates.map(opt => (
                      <button key={opt} type="button" onClick={() => setFormData(prev=>({...prev, dreamFirstDate: opt}))} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${formData.dreamFirstDate===opt ? 'bg-yellow-400 text-black' : 'bg-white/20 text-white border border-white/30 hover:bg-white/30'}`}>{opt}</button>
                    ))}
                  </div>
                  {formData.dreamFirstDate==='其他' && (
                    <input type="text" name="dreamFirstDateOther" value={formData.dreamFirstDateOther} onChange={handleInputChange} className="mt-3 w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent" placeholder={t('foodForTalk.form.other')} />
                  )}
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">{t('foodForTalk.form.interests')}</label>
                  <select
                    multiple
                    name="interests"
                    value={formData.interests}
                    onChange={(e) => {
                      const selected = Array.from(e.target.selectedOptions).map(o => o.value);
                      setFormData(prev => ({ ...prev, interests: selected.slice(0, 3) }));
                    }}
                    className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  >
                    {interestChoices.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  {formData.interests.includes('其他') && (
                    <input type="text" name="interestsOther" value={formData.interestsOther} onChange={handleInputChange} className="mt-3 w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent" placeholder={t('foodForTalk.form.interestsOther')} />
                  )}
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">{t('foodForTalk.form.traits')}</label>
                  <select
                    multiple
                    name="attractiveTraits"
                    value={formData.attractiveTraits}
                    onChange={(e) => {
                      const selected = Array.from(e.target.selectedOptions).map(o => o.value);
                      setFormData(prev => ({ ...prev, attractiveTraits: selected.slice(0, 2) }));
                    }}
                    className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  >
                    {traitChoices.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  {formData.attractiveTraits.includes('其他') && (
                    <input type="text" name="attractiveTraitsOther" value={formData.attractiveTraitsOther} onChange={handleInputChange} className="mt-3 w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent" placeholder={t('foodForTalk.form.traitsOther')} />
                  )}
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">{t('foodForTalk.form.japaneseFood')}</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {japaneseFoods.map(opt => (
                      <button key={opt} type="button" onClick={() => setFormData(prev=>({...prev, japaneseFoodPreference: opt}))} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${formData.japaneseFoodPreference===opt ? 'bg-yellow-400 text-black' : 'bg-white/20 text-white border border-white/30 hover:bg-white/30'}`}>{opt}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. 神秘快問快答 Quickfire Fun */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">{t('foodForTalk.sections.quickfire')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-medium mb-2">{t('foodForTalk.form.magicItem')}</label>
                  <div className="flex flex-wrap gap-3">
                    {quickMagic.map(opt => (
                      <button key={opt} type="button" onClick={() => setFormData(prev=>({...prev, quickfireMagicItemChoice: opt}))} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${formData.quickfireMagicItemChoice===opt ? 'bg-yellow-400 text-black' : 'bg-white/20 text-white border border-white/30 hover:bg-white/30'}`}>{opt}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">{t('foodForTalk.form.desiredOutcome')}</label>
                  <div className="flex flex-wrap gap-3">
                    {quickOutcome.map(opt => (
                      <button key={opt} type="button" onClick={() => setFormData(prev=>({...prev, quickfireDesiredOutcome: opt}))} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${formData.quickfireDesiredOutcome===opt ? 'bg-yellow-400 text-black' : 'bg-white/20 text-white border border-white/30 hover:bg-white/30'}`}>{opt}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 4. 聯絡方式 Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">{t('foodForTalk.sections.contactInfo')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-medium mb-2">{t('foodForTalk.form.email')}</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent" placeholder="Email" />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">{t('foodForTalk.form.whatsappPhone')}</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent" placeholder="Phone (for notifications only)" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-white font-medium mb-2">{t('foodForTalk.form.password')}</label>
                  <input type="password" name="password" value={formData.password} onChange={handleInputChange} required minLength="6" className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent" placeholder="Create a password (min 6 characters)" />
                </div>
              </div>
            </div>

            {/* Consent */}
            <div>
              <label className="inline-flex items-start gap-3 text-white">
                <input type="checkbox" checked={formData.consentAccepted} onChange={(e)=>setFormData(prev=>({...prev, consentAccepted: e.target.checked}))} className="mt-1" />
                <span>{t('foodForTalk.form.consent')}</span>
              </label>
            </div>
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-medium mb-2">First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="Enter your first name"
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-medium mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">Password *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  minLength="6"
                  className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="Create a password (min 6 characters)"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-medium mb-2">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="Enter your phone number"
                />
              </div>
              <div>
                {/* Empty div for grid layout */}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-medium mb-2">Age *</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  required
                  min="25"
                  max="40"
                  className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="Enter your age"
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">Occupation *</label>
                <input
                  type="text"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="Enter your occupation"
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-white font-medium mb-2">Bio *</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                placeholder="Tell us about yourself (hobbies, interests, what you're looking for...)"
              />
            </div>

            {/* Profile Photo */}
            <div>
              <label className="block text-white font-medium mb-2">Profile Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-yellow-400 file:text-black hover:file:bg-yellow-500"
              />
            </div>

            

            {/* Dietary Restrictions */}
            <div>
              <label className="block text-white font-medium mb-2">Dietary Restrictions</label>
              <input
                type="text"
                name="dietaryRestrictions"
                value={formData.dietaryRestrictions}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                placeholder="Any dietary restrictions or allergies?"
              />
            </div>

            {/* Emergency Contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-medium mb-2">Emergency Contact Name *</label>
                <input
                  type="text"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="Emergency contact name"
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">Emergency Contact Phone *</label>
                <input
                  type="tel"
                  name="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="Emergency contact phone"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold py-4 px-8 rounded-xl hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? t('common.loading') : t('foodForTalk.submit')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FoodForTalkRegisterPage;
