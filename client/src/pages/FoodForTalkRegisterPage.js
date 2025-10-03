import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import apiService from '../services/api';

const FoodForTalkRegisterPage = () => {
  const navigate = useNavigate();
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-12">
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
            Back to Event
          </Link>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Register for Food for Talk
          </h1>
          <p className="text-xl text-white/80">
            Join our exclusive speed dating event
          </p>
        </div>

        {/* Registration Form */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* 1. 基本資料 Basic Info */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">1. 基本資料 Basic Info</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-medium mb-2">暱稱 Nickname (公開給其他參加者)</label>
                  <input type="text" name="nickname" value={formData.nickname} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent" placeholder="Your nickname" />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">年齡 Age</label>
                  <select name="age" value={formData.age} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent">
                    <option value="">Select age</option>
                    {ageOptions.map(a => (<option key={a} value={a}>{a}</option>))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-white font-medium mb-2">性別 Gender</label>
                  <div className="flex flex-wrap gap-3">
                    {['男 Male','女 Female','其他 Others'].map(opt => (
                      <button key={opt} type="button" onClick={() => setFormData(prev => ({...prev, gender: opt}))} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${formData.gender===opt ? 'bg-yellow-400 text-black' : 'bg-white/20 text-white border border-white/30 hover:bg-white/30'}`}>{opt}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. 有趣自我 Fun Self-intro */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">2. 有趣自我 Fun Self-intro</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-white font-medium mb-2">你最期待在活動中遇到的人是哪種？(Choose one!)</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {funTypes.map(opt => (
                      <button key={opt} type="button" onClick={() => setFormData(prev=>({...prev, expectPersonType: opt}))} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${formData.expectPersonType===opt ? 'bg-yellow-400 text-black' : 'bg-white/20 text-white border border-white/30 hover:bg-white/30'}`}>{opt}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">你最想帶對方去邊度玩？(Pick your dream first date!)</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {dreamDates.map(opt => (
                      <button key={opt} type="button" onClick={() => setFormData(prev=>({...prev, dreamFirstDate: opt}))} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${formData.dreamFirstDate===opt ? 'bg-yellow-400 text-black' : 'bg-white/20 text-white border border-white/30 hover:bg-white/30'}`}>{opt}</button>
                    ))}
                  </div>
                  {formData.dreamFirstDate==='其他' && (
                    <input type="text" name="dreamFirstDateOther" value={formData.dreamFirstDateOther} onChange={handleInputChange} className="mt-3 w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent" placeholder="Other (please specify)" />
                  )}
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">你最愛的興趣/專長係咩？(可選多項) (Pick up to 3!)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {interestChoices.map(opt => (
                      <button key={opt} type="button" onClick={() => handleInterestToggle(opt)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${formData.interests.includes(opt) ? 'bg-yellow-400 text-black' : 'bg-white/20 text-white border border-white/30 hover:bg-white/30'}`} disabled={!formData.interests.includes(opt) && formData.interests.length>=3}>{opt}</button>
                    ))}
                  </div>
                  {formData.interests.includes('其他') && (
                    <input type="text" name="interestsOther" value={formData.interestsOther} onChange={handleInputChange} className="mt-3 w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border透明" placeholder="Other (please specify)" />
                  )}
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">你最吸引人或最擅長的是咩？(選擇最多2項，可自填)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {traitChoices.map(opt => (
                      <button key={opt} type="button" onClick={() => handleTraitToggle(opt)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${formData.attractiveTraits.includes(opt) ? 'bg-yellow-400 text-black' : 'bg-white/20 text-white border border-white/30 hover:bg-white/30'}`} disabled={!formData.attractiveTraits.includes(opt) && formData.attractiveTraits.length>=2}>{opt}</button>
                    ))}
                  </div>
                  {formData.attractiveTraits.includes('其他') && (
                    <input type="text" name="attractiveTraitsOther" value={formData.attractiveTraitsOther} onChange={handleInputChange} className="mt-3 w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border透明" placeholder="Other (please specify)" />
                  )}
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">你食日式料理一定要點咩？</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {japaneseFoods.map(opt => (
                      <button key={opt} type="button" onClick={() => setFormData(prev=>({...prev, japaneseFoodPreference: opt}))} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${formData.japaneseFoodPreference===opt ? 'bg-yellow-400 text-black' : 'bg-white/20 text-white border border-white/30 hover:bg-white/30'}`}>{opt}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. 神秘快問快答 Quickfire Fun! */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">3. 神秘快問快答 Quickfire Fun!</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-medium mb-2">如果你有一隻魔法金戒指／金髮夾，你會...</label>
                  <div className="flex flex-wrap gap-3">
                    {quickMagic.map(opt => (
                      <button key={opt} type="button" onClick={() => setFormData(prev=>({...prev, quickfireMagicItemChoice: opt}))} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${formData.quickfireMagicItemChoice===opt ? 'bg-yellow-400 text-black' : 'bg-white/20 text-white border border-white/30 hover:bg-white/30'}`}>{opt}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">你最想喺速配活動攞到咩？</label>
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
              <h2 className="text-2xl font-bold text-white mb-4">4. 聯絡方式 Contact Info</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-medium mb-2">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent" placeholder="Email" />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Whatsapp/Phone</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent" placeholder="Phone (for notifications only)" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-white font-medium mb-2">Password</label>
                  <input type="password" name="password" value={formData.password} onChange={handleInputChange} required minLength="6" className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent" placeholder="Create a password (min 6 characters)" />
                </div>
              </div>
            </div>

            {/* Consent */}
            <div>
              <label className="inline-flex items-start gap-3 text-white">
                <input type="checkbox" checked={formData.consentAccepted} onChange={(e)=>setFormData(prev=>({...prev, consentAccepted: e.target.checked}))} className="mt-1" />
                <span>
                  我同意讓我的暱稱、年齡、性別、興趣等資料公開俾其他入選參加者瀏覽。
                  <span className="block text-white/70 text-sm">I agree to share my nickname, age, gender, and selected interests with other shortlisted participants.</span>
                </span>
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

            {/* Interests */}
            <div>
              <label className="block text-white font-medium mb-3">Interests (Select up to 5)</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {interests.map(interest => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => handleInterestToggle(interest)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      formData.interests.includes(interest)
                        ? 'bg-yellow-400 text-black'
                        : 'bg-white/20 text-white border border-white/30 hover:bg-white/30'
                    }`}
                    disabled={!formData.interests.includes(interest) && formData.interests.length >= 5}
                  >
                    {interest}
                  </button>
                ))}
              </div>
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
                {isSubmitting ? 'Registering...' : '立即報名 Join the Fun!'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FoodForTalkRegisterPage;
