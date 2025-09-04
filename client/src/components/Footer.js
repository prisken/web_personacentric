import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  const { t } = useLanguage();

  const essentialLinks = [
    { label: t('footer.about'), path: '/about' },
    { label: t('footer.privacy'), path: '/help' },
    { label: t('footer.terms'), path: '/help' },
  ];

  const socialLinks = [
    { 
      icon: FaFacebook, 
      url: 'https://www.facebook.com/profile.php?id=61572397062919', 
      label: t('footer.socialMedia.facebook'),
      color: 'hover:text-blue-500'
    },
    { 
      icon: FaInstagram, 
      url: 'https://www.instagram.com/personacentric/', 
      label: t('footer.socialMedia.instagram'),
      color: 'hover:text-pink-500'
    },
    { 
      icon: FaLinkedin, 
      url: 'https://www.linkedin.com/company/persona-centric/about/', 
      label: t('footer.socialMedia.linkedin'),
      color: 'hover:text-blue-600'
    },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col items-center space-y-4">
          {/* Logo */}
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center mr-3 transition-transform duration-200 hover:scale-110 shadow-lg">
              <span className="text-white text-sm font-bold">📈</span>
            </div>
            <span className="text-xl font-bold">Persona Centric</span>
          </div>

          {/* Social Media Links */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="text-sm font-medium text-gray-400">{t('footer.followUs')}:</span>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-gray-400 ${social.color} transition-all duration-200 hover:scale-110`}
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Essential Links */}
          <div className="flex flex-wrap justify-center gap-6">
            {essentialLinks.map((link, index) => (
              <Link
                key={index}
                to={link.path}
                className="text-gray-300 hover:text-white transition-all duration-200 text-sm hover:translate-x-1 inline-block"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-gray-400 text-sm text-center">
            © 2024 Persona Centric. {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;