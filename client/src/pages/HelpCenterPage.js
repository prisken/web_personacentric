import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const HelpCenterPage = () => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState('faq');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqData = [
    {
      question: t('help.getStarted'),
      answer: t('help.getStartedAnswer')
    },
    {
      question: t('help.aiContent'),
      answer: t('help.aiContentAnswer')
    },
    {
      question: t('help.agentCost'),
      answer: t('help.agentCostAnswer')
    },
    {
      question: t('help.contests'),
      answer: t('help.contestsAnswer')
    },
    {
      question: t('help.security'),
      answer: t('help.securityAnswer')
    },
    {
      question: t('help.support'),
      answer: t('help.supportAnswer')
    }
  ];

  const supportChannels = [
    {
      icon: 'fas fa-envelope',
      title: t('help.emailSupport'),
      description: t('help.responseTime'),
      contact: 'support@personacentric.com'
    },
    {
      icon: 'fas fa-phone',
      title: t('help.phoneSupport'),
      description: t('help.workingHours'),
      contact: '+1 (555) 123-4567'
    },
    {
      icon: 'fas fa-comments',
      title: t('help.liveChat'),
      description: t('help.instantResponse'),
      contact: t('help.clickToStartChat')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t('help.title')}
            </h1>
            <p className="text-xl opacity-90">
              {t('help.subtitle')}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center mb-8">
          <button
            onClick={() => setActiveTab('faq')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors duration-200 ${
              activeTab === 'faq' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {t('help.faq')}
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors duration-200 ${
              activeTab === 'contact' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {t('help.contactSupport')}
          </button>
          <button
            onClick={() => setActiveTab('legal')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors duration-200 ${
              activeTab === 'legal' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {t('help.legal')}
          </button>
        </div>

        {/* FAQ Section */}
        {activeTab === 'faq' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              {language === 'zh-TW' ? '常見問題' : 'Frequently Asked Questions'}
            </h2>
            <div className="space-y-4">
              {faqData.map((faq, index) => (
                <div key={index} className="border border-gray-200 rounded-lg">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
                  >
                    <span className="font-semibold text-gray-900">{faq.question}</span>
                    <i className={`fas fa-chevron-${expandedFaq === index ? 'up' : 'down'} text-gray-500`}></i>
                  </button>
                  {expandedFaq === index && (
                    <div className="px-6 pb-4">
                      <p className="text-gray-700">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact Support Section */}
        {activeTab === 'contact' && (
          <div className="space-y-8">
            {/* Support Channels */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                {language === 'zh-TW' ? '聯繫方式' : 'Contact Channels'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {supportChannels.map((channel, index) => (
                  <div key={index} className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200">
                    <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                      <i className={`${channel.icon} text-2xl text-blue-600`}></i>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{channel.title}</h3>
                    <p className="text-gray-600 mb-4">{channel.description}</p>
                    <p className="text-blue-600 font-medium">{channel.contact}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                {language === 'zh-TW' ? '發送消息' : 'Send Message'}
              </h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input
                    type="text"
                    placeholder={language === 'zh-TW' ? '姓名' : 'Name'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="email"
                    placeholder={language === 'zh-TW' ? '電子郵件' : 'Email'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>{language === 'zh-TW' ? '選擇問題類型' : 'Select Issue Type'}</option>
                  <option>{language === 'zh-TW' ? '技術問題' : 'Technical Issue'}</option>
                  <option>{language === 'zh-TW' ? '帳戶問題' : 'Account Issue'}</option>
                  <option>{language === 'zh-TW' ? '付款問題' : 'Payment Issue'}</option>
                  <option>{language === 'zh-TW' ? '一般查詢' : 'General Inquiry'}</option>
                </select>
                <textarea
                  placeholder={language === 'zh-TW' ? '請描述您的問題...' : 'Please describe your issue...'}
                  rows="6"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
                <div className="text-center">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
                  >
                    {language === 'zh-TW' ? '發送消息' : 'Send Message'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Legal Section */}
        {activeTab === 'legal' && (
          <div className="space-y-8">
            {/* Privacy Policy */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {language === 'zh-TW' ? '隱私政策' : 'Privacy Policy'}
              </h2>
              <div className="prose max-w-none text-gray-700">
                <p className="mb-4">
                  {language === 'zh-TW' 
                    ? '我們重視您的隱私。本隱私政策說明了我們如何收集、使用和保護您的個人信息。'
                    : 'We value your privacy. This privacy policy explains how we collect, use, and protect your personal information.'
                  }
                </p>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {language === 'zh-TW' ? '信息收集' : 'Information Collection'}
                </h3>
                <p className="mb-4">
                  {language === 'zh-TW'
                    ? '我們收集您自願提供的信息，包括姓名、電子郵件地址和聯繫方式。我們還可能收集使用數據以改善服務。'
                    : 'We collect information you voluntarily provide, including name, email address, and contact details. We may also collect usage data to improve our services.'
                  }
                </p>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {language === 'zh-TW' ? '信息使用' : 'Information Usage'}
                </h3>
                <p className="mb-4">
                  {language === 'zh-TW'
                    ? '您的信息用於提供服務、改善用戶體驗和發送相關通知。我們不會與第三方共享您的個人信息。'
                    : 'Your information is used to provide services, improve user experience, and send relevant notifications. We do not share your personal information with third parties.'
                  }
                </p>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {language === 'zh-TW' ? '數據安全' : 'Data Security'}
                </h3>
                <p>
                  {language === 'zh-TW'
                    ? '我們採用行業標準的安全措施保護您的數據，包括加密和安全的數據存儲。'
                    : 'We employ industry-standard security measures to protect your data, including encryption and secure data storage.'
                  }
                </p>
              </div>
            </div>

            {/* Terms of Service */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {language === 'zh-TW' ? '使用條款' : 'Terms of Service'}
              </h2>
              <div className="prose max-w-none text-gray-700">
                <p className="mb-4">
                  {language === 'zh-TW'
                    ? '使用我們的服務即表示您同意這些條款。請仔細閱讀以下條款和條件。'
                    : 'By using our services, you agree to these terms. Please read the following terms and conditions carefully.'
                  }
                </p>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {language === 'zh-TW' ? '服務使用' : 'Service Usage'}
                </h3>
                <p className="mb-4">
                  {language === 'zh-TW'
                    ? '您同意僅將我們的服務用於合法目的，並遵守所有適用的法律和法規。'
                    : 'You agree to use our services only for lawful purposes and to comply with all applicable laws and regulations.'
                  }
                </p>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {language === 'zh-TW' ? '帳戶責任' : 'Account Responsibility'}
                </h3>
                <p className="mb-4">
                  {language === 'zh-TW'
                    ? '您負責維護帳戶安全，包括保護密碼和及時報告任何未經授權的使用。'
                    : 'You are responsible for maintaining account security, including protecting passwords and promptly reporting any unauthorized use.'
                  }
                </p>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {language === 'zh-TW' ? '服務變更' : 'Service Changes'}
                </h3>
                <p>
                  {language === 'zh-TW'
                    ? '我們保留隨時修改或終止服務的權利，並會提前通知用戶任何重大變更。'
                    : 'We reserve the right to modify or terminate services at any time and will notify users of any significant changes in advance.'
                  }
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HelpCenterPage; 