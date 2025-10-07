import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import apiService from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';

const FoodForTalkLoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get the intended destination from location state
  const intendedDestination = location.state?.from || '/food-for-talk';

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
      console.log('Attempting login with:', formData.email);
      const response = await apiService.loginToFoodForTalk(formData);
      console.log('Login response:', response);
      
      if (response.token) {
        // Store token for future requests
        localStorage.setItem('foodForTalkToken', response.token);
        console.log('Token stored, navigating to:', intendedDestination);
        toast.success('Login successful!');
        navigate(intendedDestination);
      } else {
        console.log('No token in response:', response);
        toast.error(response.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please check your credentials.');
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
            {t('foodForTalk.login.title')}
          </h2>
          <p className="text-white/80">
            {t('foodForTalk.login.subtitle')}
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white font-medium mb-2">{t('foodForTalk.login.email')}</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                placeholder={t('foodForTalk.login.email')}
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">{t('foodForTalk.login.password')}</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                placeholder={t('foodForTalk.login.password')}
              />
            </div>
            <div className="text-right -mt-2">
              <Link to="/food-for-talk/forgot-password" className="text-yellow-300 hover:text-yellow-200 text-sm">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold py-3 px-6 rounded-xl hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? t('common.loading') : t('foodForTalk.login.submit')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/70">
              {t('register.haveAccount') ? '' : ''}
              <Link 
                to="/food-for-talk/register" 
                className="text-yellow-400 hover:text-yellow-300 font-medium"
              >
                {t('foodForTalk.register.title')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodForTalkLoginPage;
