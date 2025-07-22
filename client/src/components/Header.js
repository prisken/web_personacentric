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
    // Listen for profile image update events
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
    fixed top-0 w-full z-50 transition-all duration-300
    ${isScrolled 
      ? 'bg-gray-900 shadow-lg' 
      : isOverHero && hasDarkTopSection && !isDashboardPage
        ? 'bg-transparent' 
        : 'bg-white shadow-sm border-b border-gray-200'
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
        <div className="flex justify-between items-center h-14 md:h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center mr-2">
                <i className="fas fa-chart-line text-white text-xs md:text-sm"></i>
              </div>
              <span className={`text-lg md:text-xl font-bold ${textClasses}`}>
                Persona Centric
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.key}
                to={item.path}
                className={`font-medium text-sm lg:text-base ${textClasses} ${hoverClasses}`}
              >
                {item.label}
              </Link>
            ))}
            {user && (
              <Link
                to="/dashboard"
                className={`font-medium text-sm lg:text-base ${textClasses} ${hoverClasses}`}
              >
                📊 儀表板
              </Link>
            )}
          </nav>

          {/* Language Switcher & Auth Buttons */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className={`text-xs md:text-sm font-medium ${textClasses} ${hoverClasses}`}
            >
              {language === 'zh-TW' ? 'EN' : '中文'}
            </button>

            {/* User Info & Auth Buttons */}
            {user ? (
              <div className="hidden sm:flex items-center space-x-3">
                {user.role === 'agent' && agentProfileImage && (
                  <img
                    src={agentProfileImage}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover border-2 border-blue-500 shadow mr-2"
                  />
                )}
                <div className="text-right">
                  <div className={`text-sm font-medium ${textClasses}`}>
                    {getUserDisplayName()}
                  </div>
                  <div className="text-xs text-gray-500">
                    {getUserRoleLabel()}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className={`font-medium text-sm ${textClasses} ${hoverClasses}`}
                >
                  登出
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                <Link
                  to="/login"
                  className={`font-medium text-sm ${textClasses} ${hoverClasses}`}
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-medium text-sm transition-colors duration-200 ${
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
              className={`md:hidden p-1.5 rounded-md ${textClasses} ${hoverClasses}`}
            >
              <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-lg`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className={`px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t ${
              isScrolled 
                ? 'bg-gray-900 border-gray-700' 
                : isOverHero && hasDarkTopSection && !isDashboardPage
                  ? 'bg-black bg-opacity-50 border-gray-600' 
                  : 'bg-white border-gray-200'
            }`}>
              {navItems.map((item) => (
                <Link
                  key={item.key}
                  to={item.path}
                  className={`block px-3 py-3 rounded-md transition-colors duration-200 text-base ${textClasses} ${hoverClasses}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              {user && (
                <Link
                  to="/dashboard"
                  className={`block px-3 py-3 rounded-md transition-colors duration-200 text-base ${textClasses} ${hoverClasses}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  📊 儀表板
                </Link>
              )}
              <div className="pt-4 border-t border-gray-200">
                {user ? (
                  <>
                    <div className={`px-3 py-2 text-sm ${textClasses}`}>
                      <div className="font-medium">{getUserDisplayName()}</div>
                      <div className="text-xs text-gray-500">{getUserRoleLabel()}</div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className={`block w-full text-left px-3 py-3 rounded-md transition-colors duration-200 text-base ${textClasses} ${hoverClasses}`}
                    >
                      登出
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className={`block px-3 py-3 rounded-md transition-colors duration-200 text-base ${textClasses} ${hoverClasses}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t('nav.login')}
                    </Link>
                    <Link
                      to="/register"
                      className={`block px-3 py-3 rounded-md transition-colors duration-200 text-base ${
                        isScrolled 
                          ? 'text-blue-400 hover:text-blue-300' 
                          : isOverHero && hasDarkTopSection && !isDashboardPage
                            ? 'text-blue-200 hover:text-blue-100' 
                            : 'text-blue-600 hover:text-blue-700'
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