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

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-3 md:mb-4">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center mr-2">
                <i className="fas fa-chart-line text-white text-xs md:text-sm"></i>
              </div>
              <span className="text-lg md:text-xl font-bold">Persona Centric</span>
            </div>
            <p className="text-gray-400 text-xs md:text-sm mb-3 md:mb-4 leading-relaxed">
              Your trusted financial platform for agent matching, AI content creation, and investment growth.
            </p>
            <div className="flex space-x-3 md:space-x-4">
              <a href="https://facebook.com" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-facebook text-base md:text-lg"></i>
              </a>
              <a href="https://twitter.com" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-twitter text-base md:text-lg"></i>
              </a>
              <a href="https://linkedin.com" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-linkedin text-base md:text-lg"></i>
              </a>
              <a href="https://instagram.com" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-instagram text-base md:text-lg"></i>
              </a>
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">{section.title}</h3>
              <ul className="space-y-1.5 md:space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    {link.external ? (
                      <a
                        href={link.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white transition-colors text-xs md:text-sm"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.path}
                        className="text-gray-400 hover:text-white transition-colors text-xs md:text-sm"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-6 md:mt-8 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-xs md:text-sm text-center md:text-left">
            © 2024 Persona Centric. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center md:justify-end space-x-4 md:space-x-6 mt-3 md:mt-0">
            <Link to="/help" className="text-gray-400 hover:text-white transition-colors text-xs md:text-sm">
              Privacy Policy
            </Link>
            <Link to="/help" className="text-gray-400 hover:text-white transition-colors text-xs md:text-sm">
              Terms of Service
            </Link>
            <Link to="/help" className="text-gray-400 hover:text-white transition-colors text-xs md:text-sm">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 