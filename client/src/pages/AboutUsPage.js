import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import ScrollingGifts from '../components/ScrollingGifts';

const AboutUsPage = () => {
  const { t, language } = useLanguage();
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('mission');

  // Live activity data
  const activities = [
    t('about.liveActivity.member1'),
    t('about.liveActivity.member2'),
    t('about.liveActivity.member3'),
    t('about.liveActivity.member4'),
    t('about.liveActivity.member5'),
    t('about.liveActivity.member6'),
  ];

  // Rotate through activities
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentActivityIndex((prev) => (prev + 1) % activities.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [activities.length]);

  return (
    <div className="pt-16 bg-white min-h-screen">
      {/* Hero Section - Inspired by Airbnb/Notion */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-green-600 text-white overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full animate-bounce"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-white rounded-full animate-pulse"></div>
          <div className="absolute bottom-32 left-1/3 w-20 h-20 bg-white rounded-full animate-spin"></div>
          <div className="absolute bottom-20 right-20 w-28 h-28 bg-white rounded-full animate-bounce"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="text-center">
            <div className="mb-8">
              <span className="inline-block bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full text-sm font-medium mb-6">
                {language === 'zh-TW' ? '🌟 超過1,000名滿意客戶' : '🌟 Trusted by 1,000+ clients'}
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 sm:mb-8 leading-tight">
              {t('about.hero.title')}
            </h1>
            
            <p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl max-w-4xl mx-auto mb-8 sm:mb-12 leading-relaxed opacity-90">
              {t('about.hero.subtitle')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-12 sm:mb-16">
              <Link
                to="/register"
                className="bg-white text-blue-600 px-8 py-4 sm:px-10 sm:py-5 rounded-2xl font-bold text-lg sm:text-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-2xl"
              >
                {t('about.hero.cta')}
              </Link>
              <Link
                to="/agent-matching"
                className="border-2 border-white text-white px-8 py-4 sm:px-10 sm:py-5 rounded-2xl font-bold text-lg sm:text-xl hover:bg-white hover:text-blue-600 transition-all duration-300"
              >
                {t('about.hero.learnMore')}
              </Link>
            </div>

            {/* Social proof - Inspired by Dropbox */}
            <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 opacity-80">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold">50+</div>
                <div className="text-xs sm:text-sm">{t('about.stats.advisors')}</div>
              </div>
              <div className="w-px h-6 sm:h-8 bg-white/30"></div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold">1,000+</div>
                <div className="text-xs sm:text-sm">{t('about.stats.members')}</div>
              </div>
              <div className="w-px h-6 sm:h-8 bg-white/30"></div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold">98%</div>
                <div className="text-xs sm:text-sm">{t('about.stats.satisfaction')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Live Activity Feed - Inspired by Discord/Twitch */}
      <section className="py-6 bg-gradient-to-r from-orange-500 to-red-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center space-x-4 mb-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="text-lg font-semibold">{t('about.liveActivity.title')}</span>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </div>
          <div className="text-center">
            <p className="text-sm opacity-90 animate-fade-in">
              {activities[currentActivityIndex]}
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Values - Inspired by Notion */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              {language === 'zh-TW' ? '使命與價值觀' : 'Mission & Values'}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {language === 'zh-TW' 
                ? '每個人的財務規劃需求都不一樣，建立長期的信任關係'
                : 'We believe everyone deserves personalized financial planning services and long-term trust relationships'
              }
            </p>
          </div>

          {/* Tab Navigation - Inspired by Linear */}
          <div className="flex justify-center mb-12">
            <div className="bg-gray-100 rounded-2xl p-2 flex">
              {[
                { id: 'mission', label: language === 'zh-TW' ? '使命' : 'Mission' },
                { id: 'values', label: language === 'zh-TW' ? '價值觀' : 'Values' },
                { id: 'impact', label: language === 'zh-TW' ? '影響力' : 'Impact' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-8 py-3 rounded-xl font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-white text-gray-900 shadow-lg'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="max-w-4xl mx-auto">
            {activeTab === 'mission' && (
              <div className="text-center">
                <div className="text-6xl mb-8">🎯</div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">
                  {t('about.mission.title')}
                </h3>
                <p className="text-xl text-gray-600 leading-relaxed">
                  {t('about.mission.description')}
                </p>
              </div>
            )}

            {activeTab === 'values' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { icon: '🎯', title: t('about.coreValues.personalized'), desc: t('about.coreValues.personalizedDesc') },
                  { icon: '🤝', title: t('about.coreValues.trust'), desc: t('about.coreValues.trustDesc') },
                  { icon: '🎁', title: t('about.coreValues.engagement'), desc: t('about.coreValues.engagementDesc') },
                  { icon: '📊', title: t('about.coreValues.transparency'), desc: t('about.coreValues.transparencyDesc') }
                ].map((value, index) => (
                  <div key={index} className="bg-gray-50 rounded-2xl p-8 hover:bg-gray-100 transition-colors duration-300">
                    <div className="text-4xl mb-4">{value.icon}</div>
                    <h4 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h4>
                    <p className="text-gray-600 leading-relaxed">{value.desc}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'impact' && (
              <div className="text-center">
                <div className="text-6xl mb-8">🌟</div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">
                  {language === 'zh-TW' ? '影響力' : 'Our Impact'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">1,000+</div>
                    <div className="text-gray-600">{language === 'zh-TW' ? '會員獲得財務建議' : 'Members receiving financial advice'}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">200+</div>
                    <div className="text-gray-600">{language === 'zh-TW' ? '成功舉辦的活動' : 'Successful events hosted'}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-purple-600 mb-2">98%</div>
                    <div className="text-gray-600">{language === 'zh-TW' ? '會員滿意度' : 'Member satisfaction rate'}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Gift System Showcase - Inspired by Apple/Spotify */}
      <section className="py-24 bg-gradient-to-br from-purple-50 to-pink-50 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-30 -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-30 translate-y-40 -translate-x-40"></div>
        
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-medium mb-6">
              {language === 'zh-TW' ? '🎁 獨家獎勵' : '🎁 Exclusive Reward System'}
            </span>
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              {t('about.giftSystem.title')}
            </h2>
            <p className="text-2xl text-gray-600 max-w-3xl mx-auto">
              {t('about.giftSystem.subtitle')}
            </p>
          </div>

          {/* Feature Cards - Inspired by Stripe */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
              <div className="relative bg-white rounded-3xl p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-6xl mb-6">🎁</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('about.giftSystem.signup.title')}</h3>
                <div className="text-4xl font-bold text-green-600 mb-4">{t('about.giftSystem.signup.points')}</div>
                <p className="text-gray-600 leading-relaxed">{t('about.giftSystem.signup.desc')}</p>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
              <div className="relative bg-white rounded-3xl p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-6xl mb-6">⭐</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('about.giftSystem.earn.title')}</h3>
                <div className="space-y-3 text-left mb-4">
                  <div className="flex items-center">
                    <span className="mr-3">📝</span>
                    <span>{t('about.giftSystem.earn.quiz')}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-3">🎪</span>
                    <span>{t('about.giftSystem.earn.event')}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-3">👥</span>
                    <span>{t('about.giftSystem.earn.referral')}</span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-blue-600">{t('about.giftSystem.earn.points')}</div>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
              <div className="relative bg-white rounded-3xl p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-6xl mb-6">🎯</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('about.giftSystem.redeem.title')}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{t('about.giftSystem.redeem.desc')}</p>
                <Link
                  to="/gifts"
                  className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
                >
                  {t('about.giftSystem.cta')}
                </Link>
              </div>
            </div>
          </div>

          {/* Featured Gifts Grid - Inspired by Apple Store */}
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-8">{t('about.giftSystem.featured.title')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: '🎧', name: t('about.giftSystem.featured.airpods'), points: '50,000', color: 'from-blue-500 to-purple-600' },
                { icon: '☕', name: t('about.giftSystem.featured.coffee'), points: '60,000', color: 'from-green-500 to-blue-600' },
                { icon: '💳', name: t('about.giftSystem.featured.giftcard'), points: '5,000', color: 'from-orange-500 to-red-600' }
              ].map((gift, index) => (
                <div key={index} className="group">
                  <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                    <div className={`w-24 h-24 bg-gradient-to-br ${gift.color} rounded-2xl flex items-center justify-center mx-auto mb-4 text-4xl group-hover:scale-110 transition-transform duration-300`}>
                      {gift.icon}
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">{gift.name}</h4>
                    <p className="text-gray-600 font-semibold">{gift.points} {language === 'zh-TW' ? '積分' : 'points'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Gift Showcase */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-8 text-center border-b border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {language === 'zh-TW' ? '🎁 即時禮品展示' : '🎁 Live Gift Showcase'}
              </h3>
              <p className="text-gray-600">
                {language === 'zh-TW' 
                  ? '看看其他會員正在兌換什麼禮品'
                  : 'See what gifts other members are redeeming'
                }
              </p>
            </div>
            <div className="h-96">
              <ScrollingGifts />
            </div>
          </div>
        </div>
      </section>

      {/* Team Section - Inspired by Linear/Stripe */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              {t('about.team.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('about.team.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: t('about.team.member1.name'), role: t('about.team.member1.role'), bio: t('about.team.member1.bio'), emoji: '👨‍💼', color: 'from-blue-500 to-purple-600' },
              { name: t('about.team.member2.name'), role: t('about.team.member2.role'), bio: t('about.team.member2.bio'), emoji: '👩‍💻', color: 'from-purple-500 to-pink-600' },
              { name: t('about.team.member3.name'), role: t('about.team.member3.role'), bio: t('about.team.member3.bio'), emoji: '👨‍💼', color: 'from-green-500 to-blue-600' },
              { name: t('about.team.member4.name'), role: t('about.team.member4.role'), bio: t('about.team.member4.bio'), emoji: '👩‍💼', color: 'from-orange-500 to-red-600' }
            ].map((member, index) => (
              <div key={index} className="group text-center">
                <div className="relative mb-6">
                  <div className={`w-32 h-32 bg-gradient-to-br ${member.color} rounded-3xl flex items-center justify-center mx-auto text-4xl text-white group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    {member.emoji}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm animate-pulse shadow-lg">
                    🟢
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-gray-600 font-semibold mb-3">
                  {member.role}
                </p>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Enhanced Statistics - Inspired by Stripe */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">
              {t('about.stats.title')}
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: '👨‍💼', number: '50+', label: t('about.stats.advisors') },
              { icon: '👥', number: '1,000+', label: t('about.stats.members') },
              { icon: '🎉', number: '200+', label: t('about.stats.events') },
              { icon: '⭐', number: '98%', label: t('about.stats.satisfaction') }
            ].map((stat, index) => (
              <div key={index} className="group text-center">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <div className="text-5xl font-bold mb-2 animate-count-up">
                  {stat.number}
                </div>
                <div className="text-lg opacity-90">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section - Inspired by Linear */}
      <section className="py-24 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-6">
            {t('about.cta.title')}
          </h2>
          <p className="text-2xl mb-8 opacity-90">
            {t('about.cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/register"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-5 rounded-2xl font-bold text-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl"
            >
              {t('about.cta.register')}
            </Link>
            <Link
              to="/agent-matching"
              className="border-2 border-white text-white px-12 py-5 rounded-2xl font-bold text-xl hover:bg-white hover:text-gray-900 transition-all duration-300"
            >
              {t('about.cta.learnMore')}
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Signup - Inspired by ConvertKit */}
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
              className="flex-1 px-6 py-4 rounded-xl text-gray-900 focus:ring-2 focus:ring-white focus:outline-none text-lg"
            />
            <button className="bg-white text-green-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-200 text-lg">
              {language === 'zh-TW' ? '訂閱' : 'Subscribe'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;
