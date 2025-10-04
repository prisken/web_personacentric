import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import apiService from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';

const FoodForTalkSecretLoginPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passkey: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('Attempting secret login with:', formData.email);
      const response = await apiService.secretLoginToFoodForTalk(formData);
      console.log('Secret login response:', response);
      
      if (response.token) {
        // Store token for secret chat access
        localStorage.setItem('foodForTalkSecretToken', response.token);
        console.log('Secret token stored, navigating to secret chat');
        toast.success('Secret login successful! Welcome to the chat room.');
        navigate('/food-for-talk/secret-chat');
      } else {
        console.log('No token in secret login response:', response);
        toast.error(response.message || 'Secret login failed. Please try again.');
      }
    } catch (error) {
      console.error('Secret login error:', error);
      toast.error('Secret login failed. Please check your credentials and passkey.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link 
            to="/food-for-talk" 
            className="inline-flex items-center text-white/70 hover:text-white transition-colors mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t('foodForTalk.common.back')}
          </Link>
          <h2 className="text-3xl font-bold text-white mb-2">
            {t('foodForTalk.secretLogin.title')}
          </h2>
          <p className="text-white/80">
            {t('foodForTalk.secretLogin.subtitle')}
          </p>
        </div>

        {/* Secret Login Form */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text白色 font-medium mb-2">{t('foodForTalk.secretLogin.email')}</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                placeholder={t('foodForTalk.secretLogin.email')}
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">{t('foodForTalk.secretLogin.password')}</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                placeholder={t('foodForTalk.secretLogin.password')}
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">{t('foodForTalk.secretLogin.secretPasskey')}</label>
              <input
                type="text"
                name="passkey"
                value={formData.passkey}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                placeholder={t('foodForTalk.secretLogin.secretPasskey')}
              />
              <p className="text-white/60 text-sm mt-1">&nbsp;</p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold py-3 px-6 rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? t('common.loading') : t('foodForTalk.secretLogin.submit')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/70">
              Need to see participants first?{' '}
              <Link 
                to="/food-for-talk/login" 
                state={{ from: '/food-for-talk/participants' }}
                className="text-yellow-400 hover:text-yellow-300 font-medium"
              >
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodForTalkSecretLoginPage;
