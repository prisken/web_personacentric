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
    { key: 'nav.blogs', path: '/blogs', label: t('nav.blogs') },
    { key: 'nav.about', path: '/about', label: t('nav.about') },
    { key: 'actions.allAgents', path: '/all-agents', label: t('actions.allAgents'), comingSoon: true },
    { key: 'nav.agentPairing', path: '/agent-matching', label: t('nav.agentPairing'), comingSoon: true },
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
  // Only include pages that actually have dark hero sections
  const hasDarkTopSection = [
    '/',
    '/about',
    '/pricing',
    '/help-center'
  ].includes(location.pathname);


  // Improved header background logic
  const getHeaderBackground = () => {
    if (isScrolled) {
      return 'bg-gray-900/95 shadow-lg';
    }
    if (isOverHero && hasDarkTopSection && !isDashboardPage) {
      return 'bg-transparent';
    }
    return 'bg-white/95 shadow-sm border-b border-gray-200';
  };

  // Improved text color logic with better contrast
  const getTextColor = () => {
    if (isScrolled) {
      return 'text-white';
    }
    if (isOverHero && hasDarkTopSection && !isDashboardPage) {
      return 'text-white';
    }
    // Default to dark text for light backgrounds
    return 'text-gray-800';
  };

  // Improved hover color logic
  const getHoverColor = () => {
    if (isScrolled) {
      return 'hover:text-blue-300';
    }
    if (isOverHero && hasDarkTopSection && !isDashboardPage) {
      return 'hover:text-blue-200';
    }
    return 'hover:text-blue-600';
  };

  const headerClasses = `fixed top-0 w-full z-50 transition-all duration-300 backdrop-blur-sm ${getHeaderBackground()}`;
  const textClasses = `transition-colors duration-300 ${getTextColor()}`;
  const hoverClasses = `transition-colors duration-200 ${getHoverColor()}`;

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
      case 'admin': return t('roles.admin.emoji');
      case 'agent': return t('roles.agent.emoji');
      case 'client': return t('roles.client.emoji');
      case 'super_admin': return '👑';
      default: return user.role;
    }
  };

  return (
    <header className={headerClasses}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 lg:h-16">
          {/* Logo - Left aligned for all users */}
          <div className="flex items-center">
            <Link to={user ? '/dashboard' : '/'} className="flex items-center group">
              <div className="w-7 h-7 lg:w-8 lg:h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center mr-2 lg:mr-3 transition-transform duration-200 group-hover:scale-110 shadow-lg">
                <span className="text-white text-xs lg:text-sm font-bold">📈</span>
              </div>
              <span className={`text-lg lg:text-xl xl:text-2xl font-bold ${textClasses} transition-colors duration-200`}>
                Persona Centric
              </span>
            </Link>
          </div>

          {/* Desktop Navigation - Always shown */}
          <nav className="hidden lg:flex items-center space-x-4 xl:space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.key}
                to={item.path}
                className={`font-medium text-sm lg:text-base ${textClasses} ${item.comingSoon ? 'text-gray-400 cursor-not-allowed' : hoverClasses} relative group px-2 py-1 rounded-lg transition-all duration-200 ${item.comingSoon ? '' : 'hover:bg-white/10'}`}
                onClick={item.comingSoon ? (e) => e.preventDefault() : undefined}
              >
                {item.label}
                {item.comingSoon && <span className="text-xs ml-1">(即將推出)</span>}
                {!item.comingSoon && <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-current transition-all duration-200 group-hover:w-full"></span>}
              </Link>
            ))}
            {user?.role === 'super_admin' && (
              <Link
                to="/super-admin"
                className={`font-medium text-sm lg:text-base ${textClasses} ${hoverClasses} relative group px-2 py-1 rounded-lg transition-all duration-200 hover:bg-white/10`}
              >
                <span className="nav-icon">👑</span>
                Super Admin
                <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-current transition-all duration-200 group-hover:w-full"></span>
              </Link>
            )}
          </nav>

          {/* Right Side: Language Switcher & Auth Buttons */}
          <div className="flex items-center space-x-2 lg:space-x-4 min-w-[200px] justify-end">
            {user ? (
              <div className="hidden md:flex items-center space-x-3">
                {/* Language Toggle */}
                <button
                  onClick={toggleLanguage}
                  className={`text-xs lg:text-sm font-medium px-2 py-1.5 rounded-md transition-all duration-200 ${textClasses} ${hoverClasses} hover:bg-white/10 border border-transparent hover:border-current/20`}
                >
                  {language === 'zh-TW' ? 'EN' : '中文'}
                </button>
                {user.role === 'agent' && agentProfileImage && (
                  <img
                    src={agentProfileImage}
                    alt="Profile"
                    className="w-8 h-8 lg:w-9 lg:h-9 rounded-full object-cover border-2 border-blue-500 shadow-lg transition-transform duration-200 hover:scale-110 ring-1 ring-white/20"
                  />
                )}
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <div className={`text-xs lg:text-sm font-semibold ${textClasses} leading-tight`}>
                      {getUserDisplayName()}
                    </div>
                    <div className={`text-xs ${isScrolled ? 'text-gray-300' : 'text-gray-500'} leading-tight`}>
                      {getUserRoleLabel()}
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className={`font-medium text-xs lg:text-sm px-2 py-1.5 rounded-md transition-all duration-200 ${textClasses} ${hoverClasses} hover:bg-white/10 border border-transparent hover:border-current/20`}
                  >
                    {t('actions.logout')}
                  </button>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2 lg:space-x-3">
                {/* Language Toggle */}
                <button
                  onClick={toggleLanguage}
                  className={`text-xs lg:text-sm font-medium px-2 py-1.5 rounded-md transition-all duration-200 ${textClasses} ${hoverClasses} hover:bg-white/10 border border-transparent hover:border-current/20`}
                >
                  {language === 'zh-TW' ? 'EN' : '中文'}
                </button>
                <Link
                  to="/login"
                  className={`font-medium text-xs lg:text-sm px-2 py-1.5 rounded-md transition-all duration-200 ${textClasses} ${hoverClasses} hover:bg-white/10 border border-transparent hover:border-current/20`}
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  className={`px-2 py-1.5 lg:px-3 lg:py-2 rounded-md font-medium text-xs lg:text-sm transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl ${
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
              className={`lg:hidden p-1.5 rounded-md transition-all duration-200 ${textClasses} ${hoverClasses} hover:bg-white/10`}
              aria-label="Toggle mobile menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <div className={`px-3 pt-3 pb-4 space-y-1 border-t transition-all duration-300 ${
              isScrolled 
                ? 'bg-gray-900/95 border-gray-700' 
                : isOverHero && hasDarkTopSection && !isDashboardPage
                  ? 'bg-black/80 backdrop-blur-sm border-gray-600' 
                  : 'bg-white/95 border-gray-200'
            }`}>
              {/* Navigation Links - Always shown */}
              {navItems.map((item) => (
                <Link
                  key={item.key}
                  to={item.path}
                  className={`block px-3 py-2 rounded-md transition-all duration-200 text-sm font-medium ${textClasses} ${item.comingSoon ? 'text-gray-400 cursor-not-allowed' : hoverClasses} ${item.comingSoon ? '' : 'hover:bg-white/10'}`}
                  onClick={item.comingSoon ? (e) => { e.preventDefault(); setIsMobileMenuOpen(false); } : () => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                  {item.comingSoon && <span className="text-xs ml-1">(即將推出)</span>}
                </Link>
              ))}
              {user?.role === 'super_admin' && (
                <Link
                  to="/super-admin"
                  className={`block px-3 py-2 rounded-md transition-all duration-200 text-sm font-medium ${textClasses} ${hoverClasses} hover:bg-white/10`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="nav-icon">👑</span> Super Admin
                </Link>
              )}

              <div className="pt-3 border-t border-gray-300/30">
                {/* Language Toggle */}
                <button
                  onClick={toggleLanguage}
                  className={`block w-full text-left px-3 py-2 rounded-md transition-all duration-200 text-sm font-medium ${textClasses} ${hoverClasses} hover:bg-white/10`}
                >
                  {language === 'zh-TW' ? 'EN' : '中文'}
                </button>

                {user ? (
                  <>
                    <div className={`px-3 py-2 text-xs ${textClasses}`}>
                      <div className="font-semibold text-sm">{getUserDisplayName()}</div>
                      <div className={`text-xs mt-0.5 ${isScrolled ? 'text-gray-300' : 'text-gray-500'}`}>{getUserRoleLabel()}</div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className={`block w-full text-left px-3 py-2 rounded-md transition-all duration-200 text-sm font-medium ${textClasses} ${hoverClasses} hover:bg-white/10`}
                    >
                      {t('actions.logout')}
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className={`block px-3 py-2 rounded-md transition-all duration-200 text-sm font-medium ${textClasses} ${hoverClasses} hover:bg-white/10`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t('nav.login')}
                    </Link>
                    <Link
                      to="/register"
                      className={`block px-3 py-2 rounded-md transition-all duration-200 text-sm font-medium ${
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