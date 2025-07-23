import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const PricingPage = () => {
  const { t, language } = useLanguage();
  const [showAccessCode, setShowAccessCode] = useState(false);
  const [accessCode, setAccessCode] = useState('');

  const plans = [
    {
      name: language === 'zh-TW' ? '免費客戶計劃' : 'Free Client Plan',
      price: 0,
      description: language === 'zh-TW' ? '適合開始使用平台的用戶' : 'Perfect for getting started',
      features: [
        language === 'zh-TW' ? '活動註冊' : 'Event Registration',
        language === 'zh-TW' ? '獎勵系統' : 'Rewards System',
        language === 'zh-TW' ? '基本內容創建' : 'Basic Content Creation',
        language === 'zh-TW' ? '代理升級路徑' : 'Agent Upgrade Path',
        language === 'zh-TW' ? '社區訪問' : 'Community Access',
        language === 'zh-TW' ? '積分系統' : 'Point System'
      ],
      cta: language === 'zh-TW' ? '立即開始' : 'Get Started',
      popular: false,
      type: 'client',
      icon: '👤'
    },
    {
      name: language === 'zh-TW' ? '付費代理計劃' : 'Paid Agent Plan',
      price: 10,
      description: language === 'zh-TW' ? 'HKD$10/月，適合金融專業人士' : 'HKD$10/month for financial professionals',
      features: [
        language === 'zh-TW' ? '客戶CRM系統' : 'Client CRM System',
        language === 'zh-TW' ? 'AI內容生成' : 'AI Content Generation',
        language === 'zh-TW' ? '自我營銷檔案' : 'Self-Marketing Profile',
        language === 'zh-TW' ? '活動管理' : 'Event Management',
        language === 'zh-TW' ? '佣金追蹤' : 'Commission Tracking',
        language === 'zh-TW' ? '高級分析' : 'Advanced Analytics',
        language === 'zh-TW' ? '優先支持' : 'Priority Support',
        language === 'zh-TW' ? '獨家功能' : 'Exclusive Features'
      ],
      cta: language === 'zh-TW' ? '開始付費計劃' : 'Start Paid Plan',
      popular: true,
      type: 'paid-agent',
      icon: '👨‍💼'
    },
    {
      name: language === 'zh-TW' ? '無限代理計劃' : 'Unlimited Agent Plan',
      price: 0,
      description: language === 'zh-TW' ? '管理員授予的免費無限訪問' : 'Free unlimited access (admin-granted)',
      features: [
        language === 'zh-TW' ? '所有代理功能' : 'All Agent Features',
        language === 'zh-TW' ? '無需付款' : 'No Payment Required',
        language === 'zh-TW' ? '管理員控制' : 'Admin Controlled',
        language === 'zh-TW' ? '即時激活' : 'Instant Activation',
        language === 'zh-TW' ? '訪問代碼支持' : 'Access Code Support',
        language === 'zh-TW' ? '戰略授權' : 'Strategic Grants'
      ],
      cta: language === 'zh-TW' ? '請求無限訪問' : 'Request Unlimited Access',
      popular: false,
      type: 'unlimited-agent',
      icon: '👑'
    }
  ];

  const handleAccessCodeSubmit = (e) => {
    e.preventDefault();
    // Handle access code validation and activation
    // Access code submitted
  };

  return (
    <div className="pt-16 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8 lg:py-12 text-center">
            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 lg:mb-6">
              💰 {language === 'zh-TW' ? '定價計劃' : 'Pricing Plans'}
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
              {language === 'zh-TW' 
                ? '選擇適合您的計劃，從免費客戶到付費代理，或請求無限訪問'
                : 'Choose the plan that fits you, from free client to paid agent, or request unlimited access'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Plans */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group hover:scale-105 ${
                plan.popular ? 'ring-2 ring-blue-600 shadow-xl' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-3 lg:py-4 text-sm lg:text-base font-semibold">
                  ⭐ {language === 'zh-TW' ? '最受歡迎' : 'Most Popular'}
                </div>
              )}

              <div className={`p-6 lg:p-8 ${plan.popular ? 'pt-16 lg:pt-20' : ''}`}>
                {/* Plan Header */}
                <div className="text-center mb-6 lg:mb-8">
                  <div className="text-4xl lg:text-5xl mb-4 lg:mb-6">{plan.icon}</div>
                  <h3 className="text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 mb-2 lg:mb-4">
                    {plan.name}
                  </h3>
                  <p className="text-base lg:text-lg text-gray-600 mb-6 lg:mb-8">
                    {plan.description}
                  </p>
                  <div className="mb-6 lg:mb-8">
                    <span className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900">
                      {plan.price === 0 ? (language === 'zh-TW' ? '免費' : 'Free') : `HKD$${plan.price}`}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-base lg:text-lg text-gray-500 ml-2">
                        {language === 'zh-TW' ? '/月' : '/month'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-4 lg:space-y-6 mb-8 lg:mb-10">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center">
                      <div className="flex-shrink-0 w-5 h-5 lg:w-6 lg:h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 lg:mr-4">
                        <svg className="w-3 h-3 lg:w-4 lg:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm lg:text-base text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <div className="text-center">
                  {plan.type === 'unlimited-agent' ? (
                    <button
                      onClick={() => setShowAccessCode(true)}
                      className={`w-full py-3 lg:py-4 px-6 lg:px-8 rounded-xl text-sm lg:text-base font-semibold transition-all duration-300 shadow-lg hover:shadow-xl ${
                        plan.popular
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                          : 'bg-gray-600 text-white hover:bg-gray-700'
                      }`}
                    >
                      {plan.cta}
                    </button>
                  ) : (
                    <Link
                      to={plan.type === 'client' ? '/register' : '/agent-matching'}
                      className={`inline-block w-full py-3 lg:py-4 px-6 lg:px-8 rounded-xl text-sm lg:text-base font-semibold transition-all duration-300 shadow-lg hover:shadow-xl ${
                        plan.popular
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {plan.cta}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Access Code Modal */}
        {showAccessCode && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 max-w-md w-full">
              <div className="text-center mb-6 lg:mb-8">
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2 lg:mb-4">
                  {language === 'zh-TW' ? '輸入訪問代碼' : 'Enter Access Code'}
                </h3>
                <p className="text-base lg:text-lg text-gray-600">
                  {language === 'zh-TW' 
                    ? '請輸入管理員提供的訪問代碼以獲得無限代理訪問權限'
                    : 'Please enter the access code provided by an administrator to get unlimited agent access'
                  }
                </p>
              </div>
              
              <form onSubmit={handleAccessCodeSubmit} className="space-y-6 lg:space-y-8">
                <div>
                  <label className="block text-sm lg:text-base font-medium text-gray-700 mb-2 lg:mb-3">
                    {language === 'zh-TW' ? '訪問代碼' : 'Access Code'}
                  </label>
                  <input
                    type="text"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    className="w-full px-4 py-3 lg:px-6 lg:py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base lg:text-lg"
                    placeholder={language === 'zh-TW' ? '輸入您的訪問代碼' : 'Enter your access code'}
                    required
                  />
                </div>
                
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowAccessCode(false)}
                    className="flex-1 py-3 lg:py-4 px-6 lg:px-8 bg-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-400 transition-all duration-300 text-sm lg:text-base"
                  >
                    {language === 'zh-TW' ? '取消' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 lg:py-4 px-6 lg:px-8 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl text-sm lg:text-base"
                  >
                    {language === 'zh-TW' ? '提交' : 'Submit'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* FAQ Section */}
        <div className="mt-16 lg:mt-20">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-4 lg:mb-6">
              ❓ {language === 'zh-TW' ? '常見問題' : 'Frequently Asked Questions'}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
              <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-4 lg:mb-6">
                {language === 'zh-TW' ? '如何升級到代理計劃？' : 'How do I upgrade to an agent plan?'}
              </h3>
              <p className="text-base lg:text-lg text-gray-600 leading-relaxed">
                {language === 'zh-TW'
                  ? '您可以通過點擊"開始付費計劃"按鈕來升級到代理計劃。我們會引導您完成整個過程。'
                  : 'You can upgrade to an agent plan by clicking the "Start Paid Plan" button. We\'ll guide you through the entire process.'
                }
              </p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
              <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-4 lg:mb-6">
                {language === 'zh-TW' ? '訪問代碼如何獲得？' : 'How do I get an access code?'}
              </h3>
              <p className="text-base lg:text-lg text-gray-600 leading-relaxed">
                {language === 'zh-TW'
                  ? '訪問代碼由管理員提供，通常用於戰略合作夥伴或特殊情況。請聯繫我們的管理團隊。'
                  : 'Access codes are provided by administrators, typically for strategic partners or special circumstances. Please contact our admin team.'
                }
              </p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
              <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-4 lg:mb-6">
                {language === 'zh-TW' ? '可以隨時取消訂閱嗎？' : 'Can I cancel my subscription anytime?'}
              </h3>
              <p className="text-base lg:text-lg text-gray-600 leading-relaxed">
                {language === 'zh-TW'
                  ? '是的，您可以隨時取消您的代理訂閱。取消後，您將保留客戶訪問權限。'
                  : 'Yes, you can cancel your agent subscription at any time. After cancellation, you\'ll retain client access.'
                }
              </p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
              <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-4 lg:mb-6">
                {language === 'zh-TW' ? '支持哪些付款方式？' : 'What payment methods are supported?'}
              </h3>
              <p className="text-base lg:text-lg text-gray-600 leading-relaxed">
                {language === 'zh-TW'
                  ? '我們支持信用卡、借記卡和各種電子支付方式。所有付款都通過安全的支付網關處理。'
                  : 'We support credit cards, debit cards, and various electronic payment methods. All payments are processed through secure payment gateways.'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-16 lg:mt-20">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 lg:p-12 text-white text-center">
            <h3 className="text-2xl lg:text-3xl xl:text-4xl font-bold mb-4 lg:mb-6">
              {language === 'zh-TW' ? '需要幫助？' : 'Need Help?'}
            </h3>
            <p className="text-lg lg:text-xl mb-8 lg:mb-10 opacity-90">
              {language === 'zh-TW'
                ? '我們的團隊隨時準備協助您選擇最適合的計劃'
                : 'Our team is ready to help you choose the perfect plan'
              }
            </p>
            <Link
              to="/contact"
              className="inline-block bg-white text-blue-600 px-8 py-4 lg:px-10 lg:py-5 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl text-base lg:text-lg"
            >
              {language === 'zh-TW' ? '聯繫我們' : 'Contact Us'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage; 