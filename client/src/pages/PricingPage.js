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
      type: 'client'
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
      type: 'paid-agent'
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
      type: 'unlimited-agent'
    }
  ];

  const handleAccessCodeSubmit = (e) => {
    e.preventDefault();
    // Handle access code validation and activation
    console.log('Access code submitted:', accessCode);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            {language === 'zh-TW' ? '定價計劃' : 'Pricing Plans'}
          </h1>
          <p className="text-xl max-w-3xl mx-auto">
            {language === 'zh-TW' 
              ? '選擇適合您的計劃，從免費客戶到付費代理，或請求無限訪問'
              : 'Choose the plan that fits you, from free client to paid agent, or request unlimited access'
            }
          </p>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-lg shadow-lg overflow-hidden ${
                  plan.popular ? 'ring-2 ring-blue-600' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-blue-600 text-white text-center py-2 text-sm font-semibold">
                    {language === 'zh-TW' ? '最受歡迎' : 'Most Popular'}
                  </div>
                )}
                
                <div className="p-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-6">{plan.description}</p>
                    
                    <div className="mb-4">
                      {plan.price > 0 ? (
                        <>
                          <span className="text-4xl font-bold text-gray-900">
                            HKD${plan.price}
                          </span>
                          <span className="text-gray-600">/month</span>
                        </>
                      ) : (
                        <span className="text-4xl font-bold text-gray-900">
                          {language === 'zh-TW' ? '免費' : 'Free'}
                        </span>
                      )}
                    </div>
                    
                    {plan.type === 'paid-agent' && (
                      <div className="text-sm text-green-600 font-semibold mb-2">
                        {language === 'zh-TW' ? '每次付款獲得500積分' : '500 points per successful payment'}
                      </div>
                    )}
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <i className="fas fa-check text-green-500 mt-1 mr-3"></i>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.type === 'unlimited-agent' ? (
                    <button
                      onClick={() => setShowAccessCode(true)}
                      className="block w-full text-center py-3 px-6 rounded-lg font-semibold bg-gray-100 text-gray-900 hover:bg-gray-200 transition-colors duration-200"
                    >
                      {plan.cta}
                    </button>
                  ) : (
                    <Link
                      to={plan.type === 'client' ? '/register' : '/register'}
                      className={`block w-full text-center py-3 px-6 rounded-lg font-semibold transition-colors duration-200 ${
                        plan.popular
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                    >
                      {plan.cta}
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Access Code Modal */}
      {showAccessCode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {language === 'zh-TW' ? '輸入訪問代碼' : 'Enter Access Code'}
            </h3>
            <p className="text-gray-600 mb-6">
              {language === 'zh-TW' 
                ? '請輸入6位數訪問代碼以獲得無限代理訪問權限'
                : 'Please enter your 6-digit access code to get unlimited agent access'
              }
            </p>
            <form onSubmit={handleAccessCodeSubmit}>
              <input
                type="text"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                placeholder={language === 'zh-TW' ? '輸入6位數代碼' : 'Enter 6-digit code'}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
                maxLength="6"
              />
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
                >
                  {language === 'zh-TW' ? '激活' : 'Activate'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAccessCode(false)}
                  className="flex-1 bg-gray-200 text-gray-900 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-200"
                >
                  {language === 'zh-TW' ? '取消' : 'Cancel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Methods Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            {language === 'zh-TW' ? '支付方式' : 'Payment Methods'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <i className="fas fa-credit-card text-2xl text-blue-600"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {language === 'zh-TW' ? '信用卡/借記卡' : 'Credit/Debit Cards'}
              </h3>
              <p className="text-gray-600">
                {language === 'zh-TW' ? 'Visa, MasterCard, American Express' : 'Visa, MasterCard, American Express'}
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <i className="fas fa-wallet text-2xl text-green-600"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {language === 'zh-TW' ? '數字錢包' : 'Digital Wallets'}
              </h3>
              <p className="text-gray-600">
                {language === 'zh-TW' ? 'PayPal, Apple Pay, Google Pay' : 'PayPal, Apple Pay, Google Pay'}
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                <i className="fas fa-university text-2xl text-purple-600"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {language === 'zh-TW' ? '銀行轉帳' : 'Bank Transfer'}
              </h3>
              <p className="text-gray-600">
                {language === 'zh-TW' ? 'ACH, SEPA (國際)' : 'ACH, SEPA (International)'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            {language === 'zh-TW' ? '常見問題' : 'Frequently Asked Questions'}
          </h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {language === 'zh-TW' ? '我可以隨時更改計劃嗎？' : 'Can I change my plan at any time?'}
              </h3>
              <p className="text-gray-600">
                {language === 'zh-TW' 
                  ? '是的，您可以隨時升級或降級您的計劃。變更將在您的下一個計費週期生效。'
                  : 'Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.'
                }
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {language === 'zh-TW' ? '付款失敗會發生什麼？' : 'What happens if payment fails?'}
              </h3>
              <p className="text-gray-600">
                {language === 'zh-TW' 
                  ? '我們提供3個月的寬限期。如果連續3個月付款失敗，您的帳戶將被暫停。'
                  : 'We provide a 3-month grace period. If payment fails for 3 consecutive months, your account will be suspended.'
                }
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {language === 'zh-TW' ? '如何獲得無限訪問權限？' : 'How do I get unlimited access?'}
              </h3>
              <p className="text-gray-600">
                {language === 'zh-TW' 
                  ? '您可以請求管理員授予無限訪問權限，或使用6位數訪問代碼立即激活。'
                  : 'You can request admin-granted unlimited access, or use a 6-digit access code for immediate activation.'
                }
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {language === 'zh-TW' ? '積分獎勵如何運作？' : 'How do point rewards work?'}
              </h3>
              <p className="text-gray-600">
                {language === 'zh-TW' 
                  ? '每次成功的HKD$10付款都會獲得500積分。管理員授予的訪問權限不提供積分。'
                  : 'Each successful HKD$10 payment awards 500 points. Admin-granted access does not provide points.'
                }
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise CTA */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            {language === 'zh-TW' ? '需要自定義解決方案？' : 'Need a Custom Solution?'}
          </h2>
          <p className="text-xl mb-8">
            {language === 'zh-TW' 
              ? '我們為大型組織提供企業計劃，具有自定義功能和專用支持。'
              : 'We offer enterprise plans for large organizations with custom features and dedicated support.'
            }
          </p>
          <Link
            to="/help"
            className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
          >
            {language === 'zh-TW' ? '聯繫銷售' : 'Contact Sales'}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default PricingPage; 