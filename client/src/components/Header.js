import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';
import apiService from '../services/api';

const Header = () => {
  const { t, language, toggleLanguage } = useLanguage();
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOverHero, setIsOverHero] = useState(false);
  const location = useLocation();
  const [agentProfileImage, setAgentProfileImage] = useState(null);

  useEffect(() => {
    // Fetch agent profile image for avatar
    const fetchAgentProfile = async () => {
      if (user && user.role === 'agent') {
        try {
          const response = await apiService.getMyAgentProfile();
          if (response.success && response.agent && response.agent.profile_image) {
            setAgentProfileImage(response.agent.profile_image);
          }
        } catch (e) {
          // ignore
        }
      } else {
        setAgentProfileImage(null);
      }
    };
    fetchAgentProfile();
    // Listen for agent profile image update events and re-fetch avatar
    const handleProfileImageUpdated = () => {
      fetchAgentProfile();
    };
    window.addEventListener('agent-profile-image-updated', handleProfileImageUpdated);
    return () => {
      window.removeEventListener('agent-profile-image-updated', handleProfileImageUpdated);
    };
  }, [user]);

  const navItems = [
    { key: 'nav.events', path: '/events', label: t('nav.events') },
    { key: 'nav.agentPairing', path: '/agent-matching', label: t('nav.agentPairing') },
    { key: 'nav.contentGenerator', path: '/ai-trial', label: t('nav.contentGenerator') },
    { key: 'nav.blogs', path: '/blogs', label: t('nav.blogs') },
    { key: 'nav.contests', path: '/contests', label: t('nav.contests') },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
      setIsOverHero(scrollTop < window.innerHeight);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check if we're on a dashboard page
  const isDashboardPage = location.pathname === '/dashboard';

  // Check if we're on a page with dark/gradient sections at the top
  const hasDarkTopSection = [
    '/',
    '/about',
    '/pricing',
    '/blogs',
    '/ai-trial',
    '/contests',
    '/events',
    '/agent-matching',
    '/help-center'
  ].includes(location.pathname);

  const headerClasses = `
    fixed top-0 w-full z-50 transition-all duration-300 backdrop-blur-sm
    ${isScrolled 
      ? 'bg-gray-900/95 shadow-lg' 
      : isOverHero && hasDarkTopSection && !isDashboardPage
        ? 'bg-transparent' 
        : 'bg-white/95 shadow-sm border-b border-gray-200'
    }
  `;

  const textClasses = `
    transition-colors duration-300
    ${isScrolled 
      ? 'text-white' 
      : isOverHero && hasDarkTopSection && !isDashboardPage
        ? 'text-white' 
        : 'text-gray-700'
    }
  `;

  const hoverClasses = `
    transition-colors duration-200
    ${isScrolled 
      ? 'hover:text-blue-300' 
      : isOverHero && hasDarkTopSection && !isDashboardPage
        ? 'hover:text-blue-200' 
        : 'hover:text-blue-600'
    }
  `;

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const getUserDisplayName = () => {
    if (!user) return '';
    return `${user.first_name} ${user.last_name}`;
  };

  const getUserRoleLabel = () => {
    if (!user) return '';
    switch (user.role) {
      case 'admin': return '👑 管理員';
      case 'agent': return '👨‍💼 顧問';
      case 'client': return '👤 客戶';
      default: return user.role;
    }
  };

  return (
    <header className={headerClasses}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <div className="w-8 h-8 lg:w-12 lg:h-12 bg-gradient-to-r from-blue-600 to-green-600 rounded-xl flex items-center justify-center mr-3 lg:mr-4 transition-transform duration-200 group-hover:scale-110 shadow-lg">
                <span className="text-white text-sm lg:text-lg font-bold">📈</span>
              </div>
              <span className={`text-xl lg:text-2xl xl:text-3xl font-bold ${textClasses} transition-colors duration-200`}>
                Persona Centric
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.key}
                to={item.path}
                className={`font-medium text-base lg:text-lg ${textClasses} ${hoverClasses} relative group px-2 py-1 rounded-lg transition-all duration-200 hover:bg-white/10`}
              >
                {item.label}
                <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-current transition-all duration-200 group-hover:w-full"></span>
              </Link>
            ))}
            {user && (
              <Link
                to="/dashboard"
                className={`font-medium text-base lg:text-lg ${textClasses} ${hoverClasses} relative group px-2 py-1 rounded-lg transition-all duration-200 hover:bg-white/10`}
              >
                📊 儀表板
                <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-current transition-all duration-200 group-hover:w-full"></span>
              </Link>
            )}
          </nav>

          {/* Language Switcher & Auth Buttons */}
          <div className="flex items-center space-x-3 lg:space-x-6">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className={`text-sm lg:text-base font-medium px-3 py-2 rounded-lg transition-all duration-200 ${textClasses} ${hoverClasses} hover:bg-white/10 border border-transparent hover:border-current/20`}
            >
              {language === 'zh-TW' ? 'EN' : '中文'}
            </button>

            {/* User Info & Auth Buttons */}
            {user ? (
              <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
                {user.role === 'agent' && agentProfileImage && (
                  <img
                    src={agentProfileImage}
                    alt="Profile"
                    className="w-10 h-10 lg:w-12 lg:h-12 rounded-full object-cover border-2 border-blue-500 shadow-lg transition-transform duration-200 hover:scale-110 ring-2 ring-white/20"
                  />
                )}
                <div className="text-right">
                  <div className={`text-sm lg:text-base font-semibold ${textClasses}`}>
                    {getUserDisplayName()}
                  </div>
                  <div className="text-xs lg:text-sm text-gray-400">
                    {getUserRoleLabel()}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className={`font-medium text-sm lg:text-base px-4 py-2 rounded-lg transition-all duration-200 ${textClasses} ${hoverClasses} hover:bg-white/10 border border-transparent hover:border-current/20`}
                >
                  登出
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
                <Link
                  to="/login"
                  className={`font-medium text-sm lg:text-base px-4 py-2 rounded-lg transition-all duration-200 ${textClasses} ${hoverClasses} hover:bg-white/10 border border-transparent hover:border-current/20`}
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  className={`px-4 py-2 lg:px-6 lg:py-3 rounded-lg font-medium text-sm lg:text-base transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl ${
                    isScrolled 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : isOverHero && hasDarkTopSection && !isDashboardPage
                        ? 'bg-white text-gray-900 hover:bg-gray-100' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {t('nav.register')}
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden p-2 rounded-lg transition-all duration-200 ${textClasses} ${hoverClasses} hover:bg-white/10`}
              aria-label="Toggle mobile menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden">
            <div className={`px-4 pt-4 pb-6 space-y-2 border-t transition-all duration-300 ${
              isScrolled 
                ? 'bg-gray-900/95 border-gray-700' 
                : isOverHero && hasDarkTopSection && !isDashboardPage
                  ? 'bg-black/50 border-gray-600' 
                  : 'bg-white/95 border-gray-200'
            }`}>
              {navItems.map((item) => (
                <Link
                  key={item.key}
                  to={item.path}
                  className={`block px-4 py-3 rounded-lg transition-all duration-200 text-base font-medium ${textClasses} ${hoverClasses} hover:bg-white/10`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              {user && (
                <Link
                  to="/dashboard"
                  className={`block px-4 py-3 rounded-lg transition-all duration-200 text-base font-medium ${textClasses} ${hoverClasses} hover:bg-white/10`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  📊 儀表板
                </Link>
              )}
              <div className="pt-4 border-t border-gray-300/30">
                {user ? (
                  <>
                    <div className={`px-4 py-3 text-sm ${textClasses}`}>
                      <div className="font-semibold text-base">{getUserDisplayName()}</div>
                      <div className="text-xs text-gray-400 mt-1">{getUserRoleLabel()}</div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className={`block w-full text-left px-4 py-3 rounded-lg transition-all duration-200 text-base font-medium ${textClasses} ${hoverClasses} hover:bg-white/10`}
                    >
                      登出
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className={`block px-4 py-3 rounded-lg transition-all duration-200 text-base font-medium ${textClasses} ${hoverClasses} hover:bg-white/10`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t('nav.login')}
                    </Link>
                    <Link
                      to="/register"
                      className={`block px-4 py-3 rounded-lg transition-all duration-200 text-base font-medium ${
                        isScrolled 
                          ? 'text-blue-400 hover:text-blue-300 hover:bg-white/10' 
                          : isOverHero && hasDarkTopSection && !isDashboardPage
                            ? 'text-blue-200 hover:text-blue-100 hover:bg-white/10' 
                            : 'text-blue-600 hover:text-blue-700 hover:bg-white/10'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t('nav.register')}
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 