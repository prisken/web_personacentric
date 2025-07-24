import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  const footerSections = [
    {
      title: t('footer.company'),
      links: [
        { label: t('footer.about'), path: '/about' },
        { label: t('footer.privacy'), path: '/help' },
        { label: t('footer.terms'), path: '/help' },
      ]
    },
    {
      title: t('footer.quickLinks'),
      links: [
        { label: t('nav.events'), path: '/events' },
        { label: t('nav.blogs'), path: '/blogs' },
        { label: t('nav.contests'), path: '/contests' },
        { label: t('nav.agentPairing'), path: '/agent-matching' },
      ]
    },
    {
      title: t('footer.support'),
      links: [
        { label: 'Help Center', path: '/help' },
        { label: 'Contact Support', path: '/help' },
        { label: 'FAQ', path: '/help' },
      ]
    },
    {
      title: t('footer.social'),
      links: [
        { label: 'Facebook', path: 'https://facebook.com', external: true },
        { label: 'Twitter', path: 'https://twitter.com', external: true },
        { label: 'LinkedIn', path: 'https://linkedin.com', external: true },
        { label: 'Instagram', path: 'https://instagram.com', external: true },
      ]
    }
  ];

  const socialIcons = [
    { name: 'Facebook', icon: '📘', url: 'https://facebook.com' },
    { name: 'Twitter', icon: '🐦', url: 'https://twitter.com' },
    { name: 'LinkedIn', icon: '💼', url: 'https://linkedin.com' },
    { name: 'Instagram', icon: '📷', url: 'https://instagram.com' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Mobile: Single column, Tablet: 2 columns, Desktop: 4 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4 sm:mb-6 lg:mb-8">
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg sm:rounded-xl flex items-center justify-center mr-3 sm:mr-4 transition-transform duration-200 hover:scale-110 shadow-lg">
                <span className="text-white text-sm sm:text-lg lg:text-xl font-bold">📈</span>
              </div>
              <span className="text-xl sm:text-2xl lg:text-3xl font-bold">Persona Centric</span>
            </div>
            <p className="text-gray-300 text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 lg:mb-8 leading-relaxed">
              {t('footer.description')}
            </p>
            <div className="flex space-x-3 sm:space-x-4 lg:space-x-6">
              {socialIcons.map((social) => (
                <a 
                  key={social.name}
                  href={social.url} 
                  className="text-gray-400 hover:text-white transition-all duration-200 transform hover:scale-110 text-lg sm:text-xl lg:text-2xl"
                  aria-label={social.name}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Footer Sections - Mobile: Stacked, Desktop: Grid */}
          {footerSections.map((section, index) => (
            <div key={index} className="space-y-3 sm:space-y-4 lg:space-y-6">
              <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-white mb-3 sm:mb-4 lg:mb-6">{section.title}</h3>
              <ul className="space-y-2 sm:space-y-3 lg:space-y-4">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    {link.external ? (
                      <a
                        href={link.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-300 hover:text-white transition-all duration-200 text-sm sm:text-base lg:text-lg hover:translate-x-1 inline-block group"
                      >
                        <span className="group-hover:underline">{link.label}</span>
                      </a>
                    ) : (
                      <Link
                        to={link.path}
                        className="text-gray-300 hover:text-white transition-all duration-200 text-sm sm:text-base lg:text-lg hover:translate-x-1 inline-block group"
                      >
                        <span className="group-hover:underline">{link.label}</span>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar - Mobile Optimized */}
        <div className="border-t border-gray-800 mt-8 sm:mt-12 lg:mt-16 pt-6 sm:pt-8 lg:pt-12">
          {/* Mobile: Stacked, Desktop: Row */}
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
            <p className="text-gray-400 text-xs sm:text-sm lg:text-base text-center sm:text-left">
              {t('footer.copyright')}
            </p>
            {/* Mobile: Single row, Desktop: Row */}
            <div className="flex flex-wrap justify-center sm:justify-end gap-4 sm:gap-6 lg:gap-8">
              <Link 
                to="/help" 
                className="text-gray-400 hover:text-white transition-all duration-200 text-xs sm:text-sm lg:text-base hover:translate-x-1 inline-block group"
              >
                <span className="group-hover:underline">{t('footer.privacyPolicy')}</span>
              </Link>
              <Link 
                to="/help" 
                className="text-gray-400 hover:text-white transition-all duration-200 text-xs sm:text-sm lg:text-base hover:translate-x-1 inline-block group"
              >
                <span className="group-hover:underline">{t('footer.termsOfService')}</span>
              </Link>
              <Link 
                to="/help" 
                className="text-gray-400 hover:text-white transition-all duration-200 text-xs sm:text-sm lg:text-base hover:translate-x-1 inline-block group"
              >
                <span className="group-hover:underline">{t('footer.cookiePolicy')}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 