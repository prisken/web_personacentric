import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import ScrollingGifts from '../components/ScrollingGifts';

const GiftsPage = () => {
  const { t, language } = useLanguage();

  return (
    <div className="pt-16 bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            🎁 {language === 'zh-TW' ? '禮品兌換中心' : 'Gift Exchange Center'}
          </h1>
          <p className="text-xl md:text-2xl max-w-4xl mx-auto mb-8 leading-relaxed">
            {language === 'zh-TW' 
              ? '用您的積分兌換精美禮品和禮品卡'
              : 'Redeem your points for beautiful gifts and gift cards'
            }
          </p>
        </div>
      </section>

      {/* Gift System Info */}
      <section className="py-16 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('about.giftSystem.title')}
            </h2>
            <p className="text-xl text-gray-600">
              {t('about.giftSystem.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
              <div className="text-4xl mb-4">🎁</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {t('about.giftSystem.signup.title')}
              </h3>
              <p className="text-2xl font-bold text-green-600 mb-2">
                {t('about.giftSystem.signup.points')}
              </p>
              <p className="text-gray-600">
                {t('about.giftSystem.signup.desc')}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
              <div className="text-4xl mb-4">⭐</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {t('about.giftSystem.earn.title')}
              </h3>
              <p className="text-2xl font-bold text-blue-600 mb-2">
                {t('about.giftSystem.earn.points')}
              </p>
              <p className="text-gray-600">
                {language === 'zh-TW' 
                  ? '完成問卷、參加活動、推薦朋友'
                  : 'Complete surveys, attend events, refer friends'
                }
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {t('about.giftSystem.redeem.title')}
              </h3>
              <p className="text-gray-600">
                {t('about.giftSystem.redeem.desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Live Gift Showcase */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {language === 'zh-TW' ? '🎁 即時禮品展示' : '🎁 Live Gift Showcase'}
            </h2>
            <p className="text-xl text-gray-600">
              {language === 'zh-TW' 
                ? '看看其他會員正在兌換什麼禮品'
                : 'See what gifts other members are redeeming'
              }
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl shadow-xl overflow-hidden">
            <div className="h-96">
              <ScrollingGifts />
            </div>
          </div>
        </div>
      </section>

      {/* How to Earn Points */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {language === 'zh-TW' ? '如何賺取積分' : 'How to Earn Points'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {t('about.giftSystem.earn.quiz')}
              </h3>
              <p className="text-gray-600">
                {language === 'zh-TW' ? '完成財務健康問卷' : 'Complete financial health surveys'}
              </p>
              <p className="text-lg font-bold text-green-600 mt-2">+500 積分</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
              <div className="text-4xl mb-4">🎪</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {t('about.giftSystem.earn.event')}
              </h3>
              <p className="text-gray-600">
                {language === 'zh-TW' ? '參加財務教育活動' : 'Attend financial education events'}
              </p>
              <p className="text-lg font-bold text-green-600 mt-2">+1,000 積分</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {t('about.giftSystem.earn.referral')}
              </h3>
              <p className="text-gray-600">
                {language === 'zh-TW' ? '推薦朋友加入平台' : 'Refer friends to join the platform'}
              </p>
              <p className="text-lg font-bold text-green-600 mt-2">+2,000 積分</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {language === 'zh-TW' ? '完成任務' : 'Complete Tasks'}
              </h3>
              <p className="text-gray-600">
                {language === 'zh-TW' ? '參與各種平台活動' : 'Participate in various platform activities'}
              </p>
              <p className="text-lg font-bold text-green-600 mt-2">+200-800 積分</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-purple-600 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            {language === 'zh-TW' 
              ? '準備好開始賺取積分了嗎？'
              : 'Ready to start earning points?'
            }
          </h2>
          <p className="text-xl mb-8 opacity-90">
            {language === 'zh-TW'
              ? '立即註冊，獲得10,000積分獎勵！'
              : 'Register now and get 10,000 points bonus!'
            }
          </p>
          <a
            href="/register"
            className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-2xl inline-block"
          >
            {language === 'zh-TW' ? '立即註冊' : 'Register Now'}
          </a>
        </div>
      </section>
    </div>
  );
};

export default GiftsPage; 