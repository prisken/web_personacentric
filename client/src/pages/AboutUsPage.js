import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const AboutUsPage = () => {
  const { t, language } = useLanguage();

  return (
    <div className="pt-16 bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-green-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            {t('about.hero.title')}
          </h1>
          <p className="text-xl md:text-2xl max-w-4xl mx-auto mb-8 leading-relaxed">
            {t('about.hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              {t('about.hero.cta')}
            </Link>
            <Link
              to="/agent-matching"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300"
            >
              {t('about.hero.learnMore')}
            </Link>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t('about.mission.title')}
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              {t('about.mission.subtitle')}
            </p>
            <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
              {t('about.mission.description')}
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t('about.coreValues.title')}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl text-white group-hover:scale-110 transition-transform duration-300">
                🎯
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {t('about.coreValues.personalized')}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t('about.coreValues.personalizedDesc')}
              </p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl text-white group-hover:scale-110 transition-transform duration-300">
                🤝
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {t('about.coreValues.trust')}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t('about.coreValues.trustDesc')}
              </p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl text-white group-hover:scale-110 transition-transform duration-300">
                🎁
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {t('about.coreValues.engagement')}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t('about.coreValues.engagementDesc')}
              </p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl text-white group-hover:scale-110 transition-transform duration-300">
                📊
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {t('about.coreValues.transparency')}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t('about.coreValues.transparencyDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t('about.features.title')}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center mb-6 text-2xl text-white">
                🔍
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {t('about.features.matching.title')}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t('about.features.matching.desc')}
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center mb-6 text-2xl text-white">
                🎪
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {t('about.features.events.title')}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t('about.features.events.desc')}
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center mb-6 text-2xl text-white">
                🏆
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {t('about.features.points.title')}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t('about.features.points.desc')}
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center mb-6 text-2xl text-white">
                📱
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {t('about.features.dashboard.title')}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t('about.features.dashboard.desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t('about.howItWorks.title')}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl text-white font-bold">
                01
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {t('about.howItWorks.step1.title')}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t('about.howItWorks.step1.desc')}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl text-white font-bold">
                02
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {t('about.howItWorks.step2.title')}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t('about.howItWorks.step2.desc')}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl text-white font-bold">
                03
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {t('about.howItWorks.step3.title')}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t('about.howItWorks.step3.desc')}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl text-white font-bold">
                04
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {t('about.howItWorks.step4.title')}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t('about.howItWorks.step4.desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Member Benefits */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t('about.benefits.title')}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mb-6 text-2xl text-white">
                🎯
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {t('about.benefits.personalized.title')}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t('about.benefits.personalized.desc')}
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mb-6 text-2xl text-white">
                🎪
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {t('about.benefits.exclusive.title')}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t('about.benefits.exclusive.desc')}
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mb-6 text-2xl text-white">
                🏆
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {t('about.benefits.rewards.title')}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t('about.benefits.rewards.desc')}
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mb-6 text-2xl text-white">
                💬
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {t('about.benefits.support.title')}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t('about.benefits.support.desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              {t('about.stats.title')}
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-2">👨‍💼</div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-lg opacity-90">{t('about.stats.advisors')}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">👥</div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-lg opacity-90">{t('about.stats.members')}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🎉</div>
              <div className="text-4xl font-bold mb-2">200+</div>
              <div className="text-lg opacity-90">{t('about.stats.events')}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">⭐</div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-lg opacity-90">{t('about.stats.satisfaction')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            {t('about.cta.title')}
          </h2>
          <p className="text-xl mb-8 opacity-90">
            {t('about.cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
            >
              {t('about.cta.register')}
            </Link>
            <Link
              to="/agent-matching"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-gray-900 transition-all duration-300"
            >
              {t('about.cta.learnMore')}
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            {language === 'zh-TW' ? '保持更新' : 'Stay Updated'}
          </h2>
          <p className="text-xl mb-8">
            {language === 'zh-TW' 
              ? '獲取最新的財務規劃資訊和獨家活動通知'
              : 'Get the latest financial planning insights and exclusive event notifications'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder={language === 'zh-TW' ? '輸入您的電子郵件' : 'Enter your email'}
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-white focus:outline-none"
            />
            <button className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200">
              {language === 'zh-TW' ? '訂閱' : 'Subscribe'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;
