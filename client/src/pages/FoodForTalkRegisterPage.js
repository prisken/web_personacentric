import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import apiService from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import { isValidEmail, isValidPhoneNumber, validateForm, VALIDATION_RULES } from '../utils/validation';

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
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    // Basic Info
    firstName: '',
    lastName: '',
    nickname: '',
    age: '',
    gender: '',
    // Contact
    email: '',
    whatsappPhone: '',
    password: '',
    // Additional Info
    occupation: '',
    dietaryRestrictions: '',
    // Fun Self-intro
    expectPersonType: '',
    dreamFirstDate: '',
    dreamFirstDateOther: '',
    interests: [],
    interestsOther: '',
    attractiveTraits: [],
    attractiveTraitsOther: '',
    japaneseFoodPreference: '',
    quickfireMagicItemChoice: '',
    quickfireDesiredOutcome: '',
    // Optional
    bio: '',
    profilePhoto: null,
    consentAccepted: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const ageOptions = Array.from({ length: 40 - 20 + 1 }, (_, i) => 20 + i);

  // Localized option lists
  const funTypes = language === 'zh-TW'
    ? ['愛玩愛笑派', '文青知性派', '運動健將派', '美食探索家', '旅遊冒險派', '神秘未知派']
    : ['Fun & Laughs', 'Chill & Artsy', 'Sporty', 'Foodie', 'Globe-trotter', 'Surprise me!'];

  const dreamDates = language === 'zh-TW'
    ? ['一齊去日式餐廳開餐', '一起行山', '去睇演唱會/音樂會', '夜遊維港', '咖啡店慢談', '其他']
    : ['Japanese restaurant dinner', 'Hiking together', 'Concert / Live music', 'Harbour night walk', 'Cafe slow talk', 'Other'];

  const interestChoices = language === 'zh-TW'
    ? ['煮食', '運動', '追劇/電影', '旅行', '畫畫/手作', '唱歌/音樂', '電玩/桌遊', '寫作/閱讀', '其他']
    : ['Cooking', 'Sports', 'Movies/Series', 'Travel', 'Art/Handcraft', 'Singing/Music', 'Gaming/Board games', 'Writing/Reading', 'Other'];

  const traitChoices = language === 'zh-TW'
    ? ['幽默感', '傾偈', '做嘢認真', '有創意', '有同理心', '組織力強', '運動細胞發達', '廚藝高手', '藝術天分', '其他']
    : ['Funny & witty', 'Great conversationalist', 'Hardworking & focused', 'Creative thinker', 'Empathetic & caring', 'Organized & reliable', 'Athletic', 'Great cook', 'Artistic talent', 'Other'];

  const japaneseFoods = language === 'zh-TW'
    ? ['壽司', '刺身', '天婦羅', '拉麵', '日式甜品', '清酒/飲品']
    : ['Sushi', 'Sashimi', 'Tempura', 'Ramen', 'Japanese dessert', 'Sake/Drinks'];

  const quickMagic = language === 'zh-TW'
    ? ['隱形', '超大力', '讀心術', '瞬間移動']
    : ['Invisible', 'Super strength', 'Mind reading', 'Teleport'];

  const quickOutcome = language === 'zh-TW'
    ? ['新朋友', '脫單機會', '笑到肚痛的回憶', '靚相打卡', '一段特別的故事']
    : ['New friends', 'Chance to find a match', 'Laugh-out-loud memories', 'Nice photos', 'A special story'];

  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'firstName':
        // No validation required for first name per latest requirement
        error = '';
        break;
      case 'lastName':
        // No validation required for last name per latest requirement
        error = '';
        break;
      case 'email':
        if (!value.trim()) {
          error = language === 'zh-TW' ? '請輸入電子郵件' : 'Email is required';
        } else if (!isValidEmail(value)) {
          error = language === 'zh-TW' ? '請輸入有效的電子郵件格式' : 'Please enter a valid email address';
        }
        break;
      case 'whatsappPhone':
        if (!value.trim()) {
          error = language === 'zh-TW' ? '請輸入手機號碼' : 'Phone number is required';
        } else if (!isValidPhoneNumber(value)) {
          error = language === 'zh-TW' ? '請輸入有效的手機號碼格式 (例如: +85212345678 或 12345678)' : 'Please enter a valid phone number (e.g., +85212345678 or 12345678)';
        }
        break;
      case 'password':
        if (!value.trim()) {
          error = language === 'zh-TW' ? '請輸入密碼' : 'Password is required';
        } else if (value.length < 6) {
          error = language === 'zh-TW' ? '密碼至少需要6個字符' : 'Password must be at least 6 characters';
        }
        break;
      case 'age':
        if (!value) {
          error = language === 'zh-TW' ? '請選擇年齡' : 'Age is required';
        } else if (isNaN(value) || value < 20 || value > 40) {
          error = language === 'zh-TW' ? '年齡必須在20-40歲之間' : 'Age must be between 20-40';
        }
        break;
      default:
        break;
    }
    
    setValidationErrors(prev => ({
      ...prev,
      [name]: error
    }));
    
    return error === '';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Validate the field in real-time
    validateField(name, value);
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
    
    // Validate all required fields for event registration (email, phone, password, age)
    const requiredFields = ['email', 'whatsappPhone', 'password', 'age'];
    let hasErrors = false;
    
    requiredFields.forEach(field => {
      if (!validateField(field, formData[field])) {
        hasErrors = true;
      }
    });
    
    
    if (hasErrors) {
      toast.error(language === 'zh-TW' ? '請修正表單中的錯誤' : 'Please fix the errors in the form');
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Create FormData for file upload
      const submitData = new FormData();

      // Required fields
      submitData.append('email', formData.email);
      submitData.append('password', formData.password);
      submitData.append('whatsappPhone', formData.whatsappPhone);
      submitData.append('age', formData.age);

      // Basic info fields
      submitData.append('firstName', formData.firstName);
      submitData.append('lastName', formData.lastName);
      submitData.append('nickname', formData.nickname);
      submitData.append('gender', formData.gender);
      
      // Additional info fields
      submitData.append('occupation', formData.occupation || '');
      submitData.append('dietaryRestrictions', formData.dietaryRestrictions || '');
      
      // Fun self-intro fields
      submitData.append('expectPersonType', formData.expectPersonType);
      submitData.append('dreamFirstDate', formData.dreamFirstDate);
      submitData.append('dreamFirstDateOther', formData.dreamFirstDateOther);
      submitData.append('interests', JSON.stringify(formData.interests));
      submitData.append('interestsOther', formData.interestsOther);
      submitData.append('attractiveTraits', JSON.stringify(formData.attractiveTraits));
      submitData.append('attractiveTraitsOther', formData.attractiveTraitsOther);
      submitData.append('japaneseFoodPreference', formData.japaneseFoodPreference);
      submitData.append('quickfireMagicItemChoice', formData.quickfireMagicItemChoice || '');
      submitData.append('quickfireDesiredOutcome', formData.quickfireDesiredOutcome || '');
      submitData.append('consentAccepted', String(formData.consentAccepted));
      submitData.append('bio', formData.bio || '');

      // Optional profile photo
      if (formData.profilePhoto) {
        submitData.append('profilePhoto', formData.profilePhoto);
      }

      const response = await apiService.registerForFoodForTalk(submitData);

      if (response?.token) {
        // Store FFT participant token to keep user logged in immediately
        localStorage.setItem('foodForTalkToken', response.token);
        toast.success('Registration successful! You are now logged in.');
        navigate('/food-for-talk');
      } else if (response?.message && response.message.toLowerCase().includes('registration successful')) {
        // Fallback success case without token (should not happen after server update)
        toast.success('Registration successful! Please log in.');
        navigate('/food-for-talk/login');
      } else {
        toast.error(response?.message || 'Registration failed. Please try again.');
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
          <img src="/images/High Tea or Me.png?v=3" alt="High Tea or Me Logo" className="mx-auto mb-4 h-20 sm:h-28 md:h-36 lg:h-40 object-contain" />
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
                  <label className="block text-white font-medium mb-2">姓名 First Name</label>
                  <input 
                    type="text" 
                    name="firstName" 
                    value={formData.firstName} 
                    onChange={handleInputChange} 
                    required 
                    className={`w-full px-4 py-3 rounded-lg bg-white/20 border text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent ${
                      validationErrors.firstName ? 'border-red-400' : 'border-white/30'
                    }`}
                    placeholder="請輸入您的姓名" 
                  />
                  {validationErrors.firstName && (
                    <p className="text-red-300 text-sm mt-1">{validationErrors.firstName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">姓氏 Last Name</label>
                  <input 
                    type="text" 
                    name="lastName" 
                    value={formData.lastName} 
                    onChange={handleInputChange} 
                    required 
                    className={`w-full px-4 py-3 rounded-lg bg-white/20 border text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent ${
                      validationErrors.lastName ? 'border-red-400' : 'border-white/30'
                    }`}
                    placeholder="請輸入您的姓氏" 
                  />
                  {validationErrors.lastName && (
                    <p className="text-red-300 text-sm mt-1">{validationErrors.lastName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">暱稱（公開給其他參加者）Nickname</label>
                  <input type="text" name="nickname" value={formData.nickname} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent" placeholder="其他參加者會看到這個暱稱" />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">{t('foodForTalk.form.age')}</label>
                  <select 
                    name="age" 
                    value={formData.age} 
                    onChange={handleInputChange} 
                    className={`w-full px-4 py-3 rounded-lg bg-white/20 border text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent ${
                      validationErrors.age ? 'border-red-400' : 'border-white/30'
                    }`}
                  >
                    <option value="">{t('foodForTalk.form.selectAge')}</option>
                    {ageOptions.map(a => (<option key={a} value={a}>{a}</option>))}
                  </select>
                  {validationErrors.age && (
                    <p className="text-red-300 text-sm mt-1">{validationErrors.age}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-white font-medium mb-2">{t('foodForTalk.form.gender')}</label>
                  <div className="flex flex-wrap gap-3">
                    {[t('foodForTalk.form.gender.male'), t('foodForTalk.form.gender.female'), t('foodForTalk.form.gender.other')].map(opt => (
                      <button key={opt} type="button" onClick={() => setFormData(prev => ({...prev, gender: opt}))} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${formData.gender===opt ? 'bg-yellow-400 text-black' : 'bg-white/20 text-white border border-white/30 hover:bg-white/30'}`}>{opt}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">職業 Occupation</label>
                  <input type="text" name="occupation" value={formData.occupation} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent" placeholder="請輸入您的職業" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-white font-medium mb-2">飲食限制 Dietary Restrictions</label>
                  <textarea name="dietaryRestrictions" value={formData.dietaryRestrictions} onChange={handleInputChange} rows="3" className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent" placeholder="請告訴我們任何飲食限制或過敏" />
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
                  {formData.dreamFirstDate === (language === 'zh-TW' ? '其他' : 'Other') && (
                    <input type="text" name="dreamFirstDateOther" value={formData.dreamFirstDateOther} onChange={handleInputChange} className="mt-3 w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent" placeholder={t('foodForTalk.form.other')} />
                  )}
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">{t('foodForTalk.form.interests')} (最多選3項)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
                    {interestChoices.map(opt => (
                      <button 
                        key={opt} 
                        type="button" 
                        onClick={() => {
                          if (formData.interests.includes(opt)) {
                            // Remove if already selected
                            setFormData(prev => ({ 
                              ...prev, 
                              interests: prev.interests.filter(item => item !== opt)
                            }));
                          } else if (formData.interests.length < 3) {
                            // Add if not at limit
                            setFormData(prev => ({ 
                              ...prev, 
                              interests: [...prev.interests, opt]
                            }));
                          }
                        }}
                        className={`px-4 py-3 rounded-lg text-sm font-medium transition-all text-center ${
                          formData.interests.includes(opt)
                            ? 'bg-yellow-400 text-black border-2 border-yellow-400'
                            : 'bg-white/20 text-white border border-white/30 hover:bg-white/30'
                        } ${formData.interests.length >= 3 && !formData.interests.includes(opt) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        disabled={formData.interests.length >= 3 && !formData.interests.includes(opt)}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  <div className="text-white/70 text-sm mb-2">
                    已選擇: {formData.interests.length}/3
                  </div>
                  {formData.interests.includes(language === 'zh-TW' ? '其他' : 'Other') && (
                    <input type="text" name="interestsOther" value={formData.interestsOther} onChange={handleInputChange} className="mt-3 w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent" placeholder={t('foodForTalk.form.interestsOther')} />
                  )}
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">{t('foodForTalk.form.traits')} (最多選2項)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-3">
                    {traitChoices.map(opt => (
                      <button 
                        key={opt} 
                        type="button" 
                        onClick={() => {
                          if (formData.attractiveTraits.includes(opt)) {
                            // Remove if already selected
                            setFormData(prev => ({ 
                              ...prev, 
                              attractiveTraits: prev.attractiveTraits.filter(item => item !== opt)
                            }));
                          } else if (formData.attractiveTraits.length < 2) {
                            // Add if not at limit
                            setFormData(prev => ({ 
                              ...prev, 
                              attractiveTraits: [...prev.attractiveTraits, opt]
                            }));
                          }
                        }}
                        className={`px-3 py-3 rounded-lg text-sm font-medium transition-all text-center ${
                          formData.attractiveTraits.includes(opt)
                            ? 'bg-yellow-400 text-black border-2 border-yellow-400'
                            : 'bg-white/20 text-white border border-white/30 hover:bg-white/30'
                        } ${formData.attractiveTraits.length >= 2 && !formData.attractiveTraits.includes(opt) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        disabled={formData.attractiveTraits.length >= 2 && !formData.attractiveTraits.includes(opt)}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  <div className="text-white/70 text-sm mb-2">
                    已選擇: {formData.attractiveTraits.length}/2
                  </div>
                  {formData.attractiveTraits.includes(language === 'zh-TW' ? '其他' : 'Other') && (
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
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleInputChange} 
                    required 
                    className={`w-full px-4 py-3 rounded-lg bg-white/20 border text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent ${
                      validationErrors.email ? 'border-red-400' : 'border-white/30'
                    }`}
                    placeholder="Email" 
                  />
                  {validationErrors.email && (
                    <p className="text-red-300 text-sm mt-1">{validationErrors.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">{t('foodForTalk.form.whatsappPhone')}</label>
                  <input 
                    type="tel" 
                    name="whatsappPhone" 
                    value={formData.whatsappPhone} 
                    onChange={handleInputChange} 
                    required 
                    className={`w-full px-4 py-3 rounded-lg bg-white/20 border text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent ${
                      validationErrors.whatsappPhone ? 'border-red-400' : 'border-white/30'
                    }`}
                    placeholder="Phone (e.g., +85212345678 or 12345678)" 
                  />
                  {validationErrors.whatsappPhone && (
                    <p className="text-red-300 text-sm mt-1">{validationErrors.whatsappPhone}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-white font-medium mb-2">{t('foodForTalk.form.password')}</label>
                  <input 
                    type="password" 
                    name="password" 
                    value={formData.password} 
                    onChange={handleInputChange} 
                    required 
                    minLength="6" 
                    className={`w-full px-4 py-3 rounded-lg bg-white/20 border text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent ${
                      validationErrors.password ? 'border-red-400' : 'border-white/30'
                    }`}
                    placeholder="Create a password (min 6 characters)" 
                  />
                  {validationErrors.password && (
                    <p className="text-red-300 text-sm mt-1">{validationErrors.password}</p>
                  )}
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

            {/* Profile Photo (optional) */}
            <div>
              <label className="block text-white font-medium mb-2">{t('foodForTalk.form.profilePhoto')}</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
              <p className="text-white/60 text-sm mt-2">{language === 'zh-TW' ? '上傳個人照片（可選，大小上限 5MB）' : 'Upload a profile photo (optional, max 5MB)'}</p>
            </div>

            {/* Bio (optional) */}
            <div>
              <label className="block text-white font-medium mb-2">{t('foodForTalk.form.bio')}</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={5}
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                placeholder={t('foodForTalk.form.bioPlaceholder')}
              />
            </div>

            {/* Disclaimer */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="text-lg font-bold text-white mb-2">{t('foodForTalk.disclaimer.title')}</div>
              <div className="text-white/75 space-y-3 text-sm leading-relaxed">
                <p>{t('foodForTalk.disclaimer.intro')}</p>
                <ol className="list-decimal pl-5 space-y-2 text-white/80">
                  <li>{t('foodForTalk.disclaimer.item1')}</li>
                  <li>{t('foodForTalk.disclaimer.item2')}</li>
                  <li>{t('foodForTalk.disclaimer.item3')}</li>
                  <li>{t('foodForTalk.disclaimer.item4')}</li>
                  <li>{t('foodForTalk.disclaimer.item5')}</li>
                </ol>
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
