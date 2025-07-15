import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const AITrialPage = () => {
  const { t, language } = useLanguage();
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [contentType, setContentType] = useState('');
  const [tone, setTone] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');

  const industries = language === 'zh-TW' 
    ? ['金融服務', '保險', '投資', '退休規劃', '房地產', '稅務規劃', '小企業', '個人財務']
    : ['Financial Services', 'Insurance', 'Investment', 'Retirement Planning', 'Real Estate', 'Tax Planning', 'Small Business', 'Personal Finance'];

  const contentTypes = language === 'zh-TW'
    ? ['社群媒體貼文', '部落格文章', '電子郵件通訊', '資訊圖表文字', '影片腳本', '播客大綱']
    : ['Social Media Post', 'Blog Article', 'Email Newsletter', 'Infographic Text', 'Video Script', 'Podcast Outline'];

  const tones = language === 'zh-TW'
    ? ['專業', '友善', '輕鬆', '教育性', '激勵性', '權威性']
    : ['Professional', 'Friendly', 'Casual', 'Educational', 'Motivational', 'Authoritative'];

  const handleGenerate = () => {
    // Simulate AI content generation
    const sampleContent = language === 'zh-TW'
      ? `這是為${selectedIndustry}行業生成的${contentType.toLowerCase()}樣本，採用${tone.toLowerCase()}語調：

**生成的內容樣本：**

${selectedIndustry === '投資' ? 
  '想要在2024年增加您的財富嗎？我們的專家顧問可以幫助您自信地駕馭市場。從傳統股票到另類投資，我們提供與您的財務目標一致的個性化策略。今天就開始您的投資之旅！' :
  selectedIndustry === '退休規劃' ?
  '退休規劃不必令人不知所措。我們的綜合方法通過戰略規劃、稅務優化和智能投資選擇幫助您建立安全的財務未來。讓我們一起創建您的退休路線圖。' :
  '通過量身定制的專家指導轉變您的財務未來。我們的專業團隊提供個性化解決方案，幫助您實現目標並建立持久財富。'
}

*這是生成的內容樣本。在完整版本中，您將根據您的具體要求獲得獨特的AI驅動內容。*`
      : `Here's a sample ${contentType.toLowerCase()} for the ${selectedIndustry} industry with a ${tone.toLowerCase()} tone:

**Sample Generated Content:**

${selectedIndustry === 'Investment' ? 
  'Looking to grow your wealth in 2024? Our expert advisors can help you navigate the market with confidence. From traditional stocks to alternative investments, we provide personalized strategies that align with your financial goals. Start your investment journey today!' :
  selectedIndustry === 'Retirement Planning' ?
  'Planning for retirement doesn\'t have to be overwhelming. Our comprehensive approach helps you build a secure financial future through strategic planning, tax optimization, and smart investment choices. Let\'s create your retirement roadmap together.' :
  'Transform your financial future with expert guidance tailored to your unique needs. Our team of professionals provides personalized solutions that help you achieve your goals and build lasting wealth.'
}

*This is a sample generated content. In the full version, you would get unique, AI-powered content based on your specific requirements.*`;

    setGeneratedContent(sampleContent);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            {t('aiTrial.title')}
          </h1>
          <p className="text-xl max-w-3xl mx-auto">
            {t('aiTrial.subtitle')}
          </p>
        </div>
      </section>

      {/* AI Content Generator */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              {language === 'zh-TW' ? '試用我們的AI內容生成器' : 'Try Our AI Content Generator'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Industry Selector */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('aiTrial.industry')}
                </label>
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">
                    {language === 'zh-TW' ? '選擇產業' : 'Select Industry'}
                  </option>
                  {industries.map((industry) => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>

              {/* Content Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('aiTrial.contentType')}
                </label>
                <select
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">
                    {language === 'zh-TW' ? '選擇內容類型' : 'Select Content Type'}
                  </option>
                  {contentTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Tone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {language === 'zh-TW' ? '語調' : 'Tone'}
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">
                    {language === 'zh-TW' ? '選擇語調' : 'Select Tone'}
                  </option>
                  {tones.map((toneOption) => (
                    <option key={toneOption} value={toneOption}>{toneOption}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Generate Button */}
            <div className="text-center mb-8">
              <button
                onClick={handleGenerate}
                disabled={!selectedIndustry || !contentType || !tone}
                className="bg-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-purple-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {t('aiTrial.generateButton')}
              </button>
            </div>

            {/* Generated Content */}
            {generatedContent && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {t('aiTrial.result')}
                </h3>
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <pre className="whitespace-pre-wrap text-gray-700 font-sans">{generatedContent}</pre>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <button className="text-purple-600 hover:text-purple-700 font-semibold">
                    <i className="fas fa-copy mr-2"></i>
                    {t('aiTrial.copy')}
                  </button>
                  <button className="text-purple-600 hover:text-purple-700 font-semibold">
                    <i className="fas fa-download mr-2"></i>
                    {t('aiTrial.download')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            {language === 'zh-TW' ? '為什麼選擇我們的AI內容生成器？' : 'Why Choose Our AI Content Generator?'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-bolt text-white text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {language === 'zh-TW' ? '極速生成' : 'Lightning Fast'}
              </h3>
              <p className="text-gray-600">
                {language === 'zh-TW' ? '在幾秒鐘內生成專業內容，而不是幾小時' : 'Generate professional content in seconds, not hours'}
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-brain text-white text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {language === 'zh-TW' ? 'AI驅動' : 'AI-Powered'}
              </h3>
              <p className="text-gray-600">
                {language === 'zh-TW' ? '先進算法創建引人入勝的相關內容' : 'Advanced algorithms create engaging, relevant content'}
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-customize text-white text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {language === 'zh-TW' ? '可自定義' : 'Customizable'}
              </h3>
              <p className="text-gray-600">
                {language === 'zh-TW' ? '根據您的行業、語調和風格定制內容' : 'Tailor content to your industry, tone, and style'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sample Outputs */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            {language === 'zh-TW' ? '樣本輸出' : 'Sample Outputs'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {language === 'zh-TW' ? '社群媒體貼文' : 'Social Media Post'}
              </h3>
              <p className="text-gray-600 mb-4">
                {language === 'zh-TW'
                  ? '"🚀 準備好掌控您的財務未來了嗎？我們的專家顧問隨時為您提供指導。從投資策略到退休規劃，我們為您提供全方位服務。今天就開始您的財務自由之旅！💰 #財務自由 #投資 #財富建設"'
                  : '"🚀 Ready to take control of your financial future? Our expert advisors are here to guide you every step of the way. From investment strategies to retirement planning, we\'ve got you covered. Start your journey to financial freedom today! 💰 #FinancialFreedom #Investment #WealthBuilding"'
                }
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded">
                  {language === 'zh-TW' ? '投資' : 'Investment'}
                </span>
                <span className="ml-2">
                  {language === 'zh-TW' ? '友善語調' : 'Friendly Tone'}
                </span>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {language === 'zh-TW' ? '部落格文章介紹' : 'Blog Article Intro'}
              </h3>
              <p className="text-gray-600 mb-4">
                {language === 'zh-TW'
                  ? '在當今快速發展的金融格局中，擁有穩固的投資策略比以往任何時候都更重要。無論您剛開始投資之旅還是希望優化現有投資組合，了解財富建設的基本原理對長期成功至關重要。'
                  : 'In today\'s rapidly evolving financial landscape, having a solid investment strategy is more important than ever. Whether you\'re just starting your investment journey or looking to optimize your existing portfolio, understanding the fundamentals of wealth building is crucial for long-term success.'
                }
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded">
                  {language === 'zh-TW' ? '金融服務' : 'Financial Services'}
                </span>
                <span className="ml-2">
                  {language === 'zh-TW' ? '專業語調' : 'Professional Tone'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            {language === 'zh-TW' ? '準備好轉變您的內容創作了嗎？' : 'Ready to Transform Your Content Creation?'}
          </h2>
          <p className="text-xl mb-8">
            {language === 'zh-TW'
              ? '加入數千名已經在使用我們AI內容生成器的專業人士'
              : 'Join thousands of professionals who are already using our AI content generator'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-purple-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors duration-200">
              {language === 'zh-TW' ? '開始免費試用' : 'Start Free Trial'}
            </button>
            <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors duration-200">
              {language === 'zh-TW' ? '查看價格' : 'View Pricing'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AITrialPage; 