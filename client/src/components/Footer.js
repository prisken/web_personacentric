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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-blue-600 to-green-600 rounded-xl flex items-center justify-center mr-4 transition-transform duration-200 hover:scale-110">
                <i className="fas fa-chart-line text-white text-lg lg:text-xl"></i>
              </div>
              <span className="text-2xl lg:text-3xl font-bold">Persona Centric</span>
            </div>
            <p className="text-gray-300 text-base lg:text-lg mb-6 leading-relaxed">
              Your trusted financial platform for agent matching, AI content creation, and investment growth.
            </p>
            <div className="flex space-x-4 lg:space-x-6">
              <a 
                href="https://facebook.com" 
                className="text-gray-400 hover:text-white transition-all duration-200 transform hover:scale-110"
                aria-label="Facebook"
              >
                <i className="fab fa-facebook text-xl lg:text-2xl"></i>
              </a>
              <a 
                href="https://twitter.com" 
                className="text-gray-400 hover:text-white transition-all duration-200 transform hover:scale-110"
                aria-label="Twitter"
              >
                <i className="fab fa-twitter text-xl lg:text-2xl"></i>
              </a>
              <a 
                href="https://linkedin.com" 
                className="text-gray-400 hover:text-white transition-all duration-200 transform hover:scale-110"
                aria-label="LinkedIn"
              >
                <i className="fab fa-linkedin text-xl lg:text-2xl"></i>
              </a>
              <a 
                href="https://instagram.com" 
                className="text-gray-400 hover:text-white transition-all duration-200 transform hover:scale-110"
                aria-label="Instagram"
              >
                <i className="fab fa-instagram text-xl lg:text-2xl"></i>
              </a>
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section, index) => (
            <div key={index} className="space-y-4">
              <h3 className="text-lg lg:text-xl font-semibold text-white mb-4 lg:mb-6">{section.title}</h3>
              <ul className="space-y-3 lg:space-y-4">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    {link.external ? (
                      <a
                        href={link.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-300 hover:text-white transition-all duration-200 text-base lg:text-lg hover:translate-x-1 inline-block"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.path}
                        className="text-gray-300 hover:text-white transition-all duration-200 text-base lg:text-lg hover:translate-x-1 inline-block"
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
        <div className="border-t border-gray-800 mt-12 lg:mt-16 pt-8 lg:pt-12 flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
          <p className="text-gray-400 text-sm lg:text-base text-center lg:text-left">
            © 2024 Persona Centric. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center lg:justify-end space-x-6 lg:space-x-8">
            <Link 
              to="/help" 
              className="text-gray-400 hover:text-white transition-all duration-200 text-sm lg:text-base hover:translate-x-1 inline-block"
            >
              Privacy Policy
            </Link>
            <Link 
              to="/help" 
              className="text-gray-400 hover:text-white transition-all duration-200 text-sm lg:text-base hover:translate-x-1 inline-block"
            >
              Terms of Service
            </Link>
            <Link 
              to="/help" 
              className="text-gray-400 hover:text-white transition-all duration-200 text-sm lg:text-base hover:translate-x-1 inline-block"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 