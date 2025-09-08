import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';

const LoginPage = () => {
  const { t } = useLanguage();
  const { login } = useUser();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const result = await login(formData);
      
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (email, password) => {
    setLoading(true);
    setError('');
    
    try {
      const result = await login({ email, password, rememberMe: false });
      
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (error) {
      console.error('Quick login error:', error);
      setError(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
            <i className="fas fa-chart-line text-white text-lg"></i>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          {t('login.title')}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {t('login.noAccount')}{' '}
          <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
            {t('login.register')}
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Quick Login Section */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3 text-center">
              🧪 測試帳號快速登入
            </h3>
            <div className="space-y-2">
              {/* Super Admin Login */}
              <button
                onClick={() => handleQuickLogin('superadmin@personacentric.com', 'superadmin123')}
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-red-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:from-purple-700 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                <span className="flex items-center justify-center">
                  <span className="mr-2">👑</span>
                  <span className="font-semibold">超級管理員</span>
                  <span className="ml-2 text-xs opacity-90">(superadmin@personacentric.com)</span>
                </span>
              </button>
              
              {/* Admin Login */}
              <button
                onClick={() => handleQuickLogin('admin@personacentric.com', 'admin123')}
                disabled={loading}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="flex items-center justify-center">
                  <span className="mr-2">👑</span>
                  <span>管理員</span>
                  <span className="ml-2 text-xs opacity-90">(admin@personacentric.com)</span>
                </span>
              </button>
              
              {/* Agent Login */}
              <button
                onClick={() => handleQuickLogin('agent1@personacentric.com', 'agent123')}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="flex items-center justify-center">
                  <span className="mr-2">👨‍💼</span>
                  <span>顧問</span>
                  <span className="ml-2 text-xs opacity-90">(agent1@personacentric.com)</span>
                </span>
              </button>
              
              {/* Client Login */}
              <button
                onClick={() => handleQuickLogin('client1@personacentric.com', 'client123')}
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="flex items-center justify-center">
                  <span className="mr-2">👤</span>
                  <span>客戶</span>
                  <span className="ml-2 text-xs opacity-90">(client1@personacentric.com)</span>
                </span>
              </button>
            </div>
            
            {/* Role Information */}
            <div className="mt-3 p-3 bg-gray-50 rounded-md">
              <h4 className="text-xs font-medium text-gray-600 mb-2">角色權限說明：</h4>
              <div className="text-xs text-gray-500 space-y-1">
                <div className="flex items-center">
                  <span className="mr-2">👑</span>
                  <span className="font-medium">超級管理員：</span>
                  <span>完整系統管理權限（用戶、積分、付款、內容）</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">👑</span>
                  <span className="font-medium">管理員：</span>
                  <span>內容管理權限（活動、部落格、測驗）</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">👨‍💼</span>
                  <span className="font-medium">顧問：</span>
                  <span>活動管理與客戶關係</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">👤</span>
                  <span className="font-medium">客戶：</span>
                  <span>基本存取權限（查看內容、參與活動）</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">或手動輸入</span>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                {t('login.email')}
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                {t('login.password')}
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  {t('login.rememberMe')}
                </label>
              </div>

              <div className="text-sm">
                <button 
                  type="button"
                  className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:underline"
                  onClick={() => {
                    // TODO: Implement forgot password functionality
                    console.log('Forgot password clicked');
                  }}
                >
                  {t('login.forgotPassword')}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center">
                {error}
              </div>
            )}
            
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Logging in...' : t('login.submit')}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">{t('login.or')}</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div>
                <button
                  type="button"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => {
                    // TODO: Implement Google OAuth
                    console.log('Google login clicked');
                  }}
                >
                  <i className="fab fa-google text-red-500"></i>
                  <span className="ml-2">{t('login.google')}</span>
                </button>
              </div>

              <div>
                <button
                  type="button"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => {
                    // TODO: Implement Facebook OAuth
                    console.log('Facebook login clicked');
                  }}
                >
                  <i className="fab fa-facebook text-blue-600"></i>
                  <span className="ml-2">{t('login.facebook')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 