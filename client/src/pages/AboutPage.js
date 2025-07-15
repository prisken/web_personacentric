import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const AboutPage = () => {
  const { t, language } = useLanguage();

  const teamMembers = [
    {
      name: 'David Chen',
      title: language === 'zh-TW' ? '執行長兼創始人' : 'CEO & Founder',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
      bio: language === 'zh-TW' 
        ? '前投資銀行家，在金融服務領域擁有15年以上經驗。'
        : 'Former investment banker with 15+ years of experience in financial services.'
    },
    {
      name: 'Sarah Wong',
      title: 'CTO',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
      bio: language === 'zh-TW'
        ? '技術領導者，專精於AI和金融平台。'
        : 'Technology leader with expertise in AI and financial platforms.'
    },
    {
      name: 'Michael Lee',
      title: language === 'zh-TW' ? '產品總監' : 'Head of Product',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
      bio: language === 'zh-TW'
        ? '產品策略師，專注於用戶體驗和市場增長。'
        : 'Product strategist focused on user experience and market growth.'
    }
  ];

  const values = [
    {
      title: language === 'zh-TW' ? '創新' : 'Innovation',
      description: language === 'zh-TW'
        ? '我們持續推動金融技術的邊界，提供尖端解決方案。'
        : 'We continuously push the boundaries of financial technology to deliver cutting-edge solutions.',
      icon: 'fas fa-lightbulb'
    },
    {
      title: language === 'zh-TW' ? '信任' : 'Trust',
      description: language === 'zh-TW'
        ? '通過透明度、安全性和可靠服務建立持久關係。'
        : 'Building lasting relationships through transparency, security, and reliable service.',
      icon: 'fas fa-shield-alt'
    },
    {
      title: language === 'zh-TW' ? '卓越' : 'Excellence',
      description: language === 'zh-TW'
        ? '致力於提供最高品質的財務顧問服務和平台體驗。'
        : 'Committed to delivering the highest quality financial advisory services and platform experience.',
      icon: 'fas fa-star'
    },
    {
      title: language === 'zh-TW' ? '社群' : 'Community',
      description: language === 'zh-TW'
        ? '培養顧問和客戶的支持網絡，實現共同成長和成功。'
        : 'Fostering a supportive network of advisors and clients for mutual growth and success.',
      icon: 'fas fa-users'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
            {t('about.title')}
          </h1>
          <p className="text-base md:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed">
            {language === 'zh-TW'
              ? '我們正在通過AI驅動的配對技術連接客戶與完美顧問，革新財務顧問行業。'
              : 'We\'re revolutionizing the financial advisory industry by connecting clients with the perfect advisors through AI-powered matching technology.'
            }
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 md:mb-6">
                {t('about.storyTitle')}
              </h2>
              <p className="text-base md:text-lg text-gray-600 mb-4 md:mb-6 leading-relaxed">
                {language === 'zh-TW'
                  ? 'Persona Centric 成立於2020年，源於一個簡單的觀察：找到合適的財務顧問太困難，而且過程往往效率低下且缺乏個性化。'
                  : 'Founded in 2020, Persona Centric was born from a simple observation: finding the right financial advisor was too difficult, and the process was often inefficient and impersonal.'
                }
              </p>
              <p className="text-base md:text-lg text-gray-600 mb-4 md:mb-6 leading-relaxed">
                {language === 'zh-TW'
                  ? '我們的創始人在技術和金融方面都有豐富經驗，他們看到了利用AI和數據科學創建更智能、更個性化配對系統的機會，這將使客戶和顧問都受益。'
                  : 'Our founders, experienced in both technology and finance, saw an opportunity to leverage AI and data science to create a more intelligent, personalized matching system that would benefit both clients and advisors.'
                }
              </p>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                {language === 'zh-TW'
                  ? '如今，我們已幫助數千名客戶找到他們完美的財務顧問，並使數百名顧問能夠更高效地發展他們的業務。'
                  : 'Today, we\'ve helped thousands of clients find their perfect financial advisors, and enabled hundreds of advisors to grow their practices more efficiently.'
                }
              </p>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
                alt={language === 'zh-TW' ? '我們的故事' : 'Our Story'}
                className="rounded-lg shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {t('about.missionTitle')}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
            <div className="bg-white rounded-lg p-6 md:p-8 shadow-lg">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">
                {language === 'zh-TW' ? '我們的使命' : 'Our Mission'}
              </h3>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                {language === 'zh-TW'
                  ? '通過讓客戶更容易找到合適的顧問，以及讓顧問更容易與需要其專業知識的客戶聯繫，來民主化優質財務建議的獲取。'
                  : 'To democratize access to quality financial advice by making it easier for clients to find the right advisors, and for advisors to connect with clients who need their expertise.'
                }
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 md:p-8 shadow-lg">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">
                {language === 'zh-TW' ? '我們的願景' : 'Our Vision'}
              </h3>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                {language === 'zh-TW'
                  ? '成為世界領先的財務顧問配對平台，由AI驅動，並由我們顧問和客戶社群的成功推動。'
                  : 'To become the world\'s leading platform for financial advisory matching, powered by AI and driven by the success of our community of advisors and clients.'
                }
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {t('about.valuesTitle')}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 bg-blue-600 rounded-lg flex items-center justify-center">
                  <i className={`${value.icon} text-white text-lg md:text-2xl`}></i>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {t('about.teamTitle')}
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-600">
              {language === 'zh-TW'
                ? '認識Persona Centric背後的熱情團隊'
                : 'Meet the passionate team behind Persona Centric'
              }
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-lg">
                <div className="h-48 md:h-64 overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 md:p-6">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1 md:mb-2">{member.name}</h3>
                  <p className="text-sm md:text-base text-blue-600 mb-3 md:mb-4">{member.title}</p>
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            {language === 'zh-TW' ? '準備開始了嗎？' : 'Ready to Get Started?'}
          </h2>
          <p className="text-xl mb-8">
            {language === 'zh-TW'
              ? '加入數千名信任Persona Centric的客戶和顧問'
              : 'Join thousands of clients and advisors who trust Persona Centric'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/agent-matching"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
            >
              {language === 'zh-TW' ? '找到您的顧問' : 'Find Your Advisor'}
            </a>
            <a
              href="/register"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-200"
            >
              {language === 'zh-TW' ? '成為顧問' : 'Become an Advisor'}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage; 