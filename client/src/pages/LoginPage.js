import React, { useState, useEffect } from 'react';
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
  const [users, setUsers] = useState({
    super_admin: [],
    admin: [],
    agent: [],
    client: []
  });
  const [usersLoading, setUsersLoading] = useState(true);

  // Set static users for quick login (no dynamic fetching)
  useEffect(() => {
    setUsers({
      super_admin: [
        { id: 1, email: 'superadmin@personacentric.com', first_name: 'Super', last_name: 'Admin', role: 'super_admin' }
      ],
      admin: [
        { id: 2, email: 'admin@personacentric.com', first_name: 'Admin', last_name: 'User', role: 'admin' }
      ],
      agent: [
        { id: 3, email: 'agent1@personacentric.com', first_name: '張', last_name: '顧問', role: 'agent' },
        { id: 4, email: 'agent2@personacentric.com', first_name: '李', last_name: '顧問', role: 'agent' },
        { id: 5, email: 'sarah.johnson@personacentric.com', first_name: 'Sarah', last_name: 'Johnson', role: 'agent' }
      ],
      client: [
        { id: 6, email: 'client1@personacentric.com', first_name: '王', last_name: '客戶', role: 'client' },
        { id: 7, email: 'client2@personacentric.com', first_name: '陳', last_name: '客戶', role: 'client' }
      ]
    });
    setUsersLoading(false);
  }, []);

  // Get default password based on role
  const getDefaultPassword = (role) => {
    switch (role) {
      case 'super_admin':
        return 'superadmin123';
      case 'admin':
        return 'admin123';
      case 'agent':
        return 'agent123';
      case 'client':
        return 'client123';
      default:
        return 'password123';
    }
  };

  // Get role display name
  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'super_admin':
        return '超級管理員';
      case 'admin':
        return '管理員';
      case 'agent':
        return '顧問';
      case 'client':
        return '客戶';
      default:
        return role;
    }
  };

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

  const handleQuickLogin = async (user) => {
    setLoading(true);
    setError('');
    
    try {
      const password = getDefaultPassword(user.role);
      const result = await login({ email: user.email, password, rememberMe: false });
      
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
              🚀 快速登入 - 所有系統用戶
            </h3>
            
            {usersLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-sm text-gray-500 mt-2">載入用戶中...</p>
              </div>
            ) : (
              <>
                {/* Super Admin */}
                {users.super_admin.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-xs font-semibold text-gray-600 mb-2 flex items-center">
                      <span className="mr-1">👑</span>
                      {getRoleDisplayName('super_admin')} ({users.super_admin.length}位)
                    </h4>
                    {users.super_admin.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => handleQuickLogin(user)}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-purple-600 to-red-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:from-purple-700 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md mb-2"
                      >
                        <span className="flex items-center justify-center">
                          <span className="mr-2">👑</span>
                          <span className="font-semibold">{user.first_name} {user.last_name}</span>
                          <span className="ml-2 text-xs opacity-90">({user.email})</span>
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Admin */}
                {users.admin.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-xs font-semibold text-gray-600 mb-2 flex items-center">
                      <span className="mr-1">👑</span>
                      {getRoleDisplayName('admin')} ({users.admin.length}位)
                    </h4>
                    {users.admin.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => handleQuickLogin(user)}
                        disabled={loading}
                        className="w-full bg-red-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed mb-2"
                      >
                        <span className="flex items-center justify-center">
                          <span className="mr-2">👑</span>
                          <span>{user.first_name} {user.last_name}</span>
                          <span className="ml-2 text-xs opacity-90">({user.email})</span>
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Agents */}
                {users.agent.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-xs font-semibold text-gray-600 mb-2 flex items-center">
                      <span className="mr-1">👨‍💼</span>
                      {getRoleDisplayName('agent')} ({users.agent.length}位)
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {users.agent.map((user) => (
                        <button
                          key={user.id}
                          onClick={() => handleQuickLogin(user)}
                          disabled={loading}
                          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="flex items-center justify-center">
                            <span className="mr-2">👨‍💼</span>
                            <span>{user.first_name} {user.last_name}</span>
                            <span className="ml-2 text-xs opacity-90">({user.email})</span>
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Clients */}
                {users.client.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-xs font-semibold text-gray-600 mb-2 flex items-center">
                      <span className="mr-1">👤</span>
                      {getRoleDisplayName('client')} ({users.client.length}位)
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {users.client.map((user) => (
                        <button
                          key={user.id}
                          onClick={() => handleQuickLogin(user)}
                          disabled={loading}
                          className="w-full bg-green-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="flex items-center justify-center">
                            <span className="mr-2">👤</span>
                            <span>{user.first_name} {user.last_name}</span>
                            <span className="ml-2 text-xs opacity-90">({user.email})</span>
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
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
                      <span className="mr-2">👨‍💼👩‍💼</span>
                      <span className="font-medium">顧問：</span>
                      <span>活動管理與客戶關係</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">👤</span>
                      <span className="font-medium">客戶：</span>
                      <span>基本存取權限（查看內容、參與活動）</span>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-400">
                    <strong>密碼：</strong> 超級管理員/管理員/顧問 = superadmin123/admin123/agent123，客戶 = client123
                  </div>
                  <div className="mt-2 text-xs text-blue-600">
                    <strong>總計：</strong> {users.super_admin.length + users.admin.length + users.agent.length + users.client.length} 位用戶
                  </div>
                </div>
              </>
            )}
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
                <Link 
                  to="/forgot-password"
                  className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:underline"
                >
                  {t('login.forgotPassword')}
                </Link>
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
                    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
                    // Remove trailing slash and /api if present to avoid double /api
                    const baseUrl = apiUrl.replace(/\/api\/?$/, '');
                    window.location.href = `${baseUrl}/api/auth/google`;
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
                    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
                    // Remove trailing slash and /api if present to avoid double /api
                    const baseUrl = apiUrl.replace(/\/api\/?$/, '');
                    window.location.href = `${baseUrl}/api/auth/facebook`;
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