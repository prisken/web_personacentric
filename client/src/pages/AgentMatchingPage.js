import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import apiService from '../services/api';

const AgentMatchingPage = () => {
  const { t, language } = useLanguage();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [matchedAgents, setMatchedAgents] = useState([]);
  const [loadingResults, setLoadingResults] = useState(false);

  const questions = language === 'zh-TW' ? [
    {
      id: 1,
      question: "您的主要財務目標是什麼？",
      options: [
        { value: 'retirement', label: '退休規劃', icon: '🏖️' },
        { value: 'investment', label: '投資成長', icon: '📈' },
        { value: 'debt', label: '債務管理', icon: '💳' },
        { value: 'tax', label: '稅務優化', icon: '📊' }
      ]
    },
    {
      id: 2,
      question: "您的投資時間框架是？",
      options: [
        { value: 'short', label: '1-3年', icon: '⚡' },
        { value: 'medium', label: '3-10年', icon: '📅' },
        { value: 'long', label: '10年以上', icon: '🌱' },
        { value: 'flexible', label: '靈活', icon: '🔄' }
      ]
    },
    {
      id: 3,
      question: "您的風險承受度是？",
      options: [
        { value: 'conservative', label: '保守', icon: '🛡️' },
        { value: 'moderate', label: '適中', icon: '⚖️' },
        { value: 'aggressive', label: '積極', icon: '🚀' },
        { value: 'unsure', label: '不確定', icon: '❓' }
      ]
    },
    {
      id: 4,
      question: "您目前的財務狀況是？",
      options: [
        { value: 'beginner', label: '剛開始', icon: '🌱' },
        { value: 'established', label: '已建立', icon: '🏢' },
        { value: 'advanced', label: '進階', icon: '🎯' },
        { value: 'complex', label: '複雜需求', icon: '🧩' }
      ]
    },
    {
      id: 5,
      question: "您希望如何與顧問溝通？",
      options: [
        { value: 'in-person', label: '面對面會議', icon: '🤝' },
        { value: 'video', label: '視訊通話', icon: '📹' },
        { value: 'phone', label: '電話通話', icon: '📞' },
        { value: 'digital', label: '數位/文字', icon: '💬' }
      ]
    },
    {
      id: 6,
      question: "您希望顧問在哪個地區？",
      options: [
        { value: 'hong kong', label: '香港', icon: '🇭🇰' },
        { value: 'taipei', label: '台北', icon: '🇹🇼' },
        { value: 'singapore', label: '新加坡', icon: '🇸🇬' },
        { value: 'anywhere', label: '任何地方', icon: '🌍' }
      ]
    }
  ] : [
    {
      id: 1,
      question: "What is your primary financial goal?",
      options: [
        { value: 'retirement', label: 'Retirement Planning', icon: '🏖️' },
        { value: 'investment', label: 'Investment Growth', icon: '📈' },
        { value: 'debt', label: 'Debt Management', icon: '💳' },
        { value: 'tax', label: 'Tax Optimization', icon: '📊' }
      ]
    },
    {
      id: 2,
      question: "What is your investment timeline?",
      options: [
        { value: 'short', label: '1-3 years', icon: '⚡' },
        { value: 'medium', label: '3-10 years', icon: '📅' },
        { value: 'long', label: '10+ years', icon: '🌱' },
        { value: 'flexible', label: 'Flexible', icon: '🔄' }
      ]
    },
    {
      id: 3,
      question: "What is your risk tolerance?",
      options: [
        { value: 'conservative', label: 'Conservative', icon: '🛡️' },
        { value: 'moderate', label: 'Moderate', icon: '⚖️' },
        { value: 'aggressive', label: 'Aggressive', icon: '🚀' },
        { value: 'unsure', label: 'Not Sure', icon: '❓' }
      ]
    },
    {
      id: 4,
      question: "What is your current financial situation?",
      options: [
        { value: 'beginner', label: 'Just Starting Out', icon: '🌱' },
        { value: 'established', label: 'Established', icon: '🏢' },
        { value: 'advanced', label: 'Advanced', icon: '🎯' },
        { value: 'complex', label: 'Complex Needs', icon: '🧩' }
      ]
    },
    {
      id: 5,
      question: "How do you prefer to communicate with your advisor?",
      options: [
        { value: 'in-person', label: 'In-Person Meetings', icon: '🤝' },
        { value: 'video', label: 'Video Calls', icon: '📹' },
        { value: 'phone', label: 'Phone Calls', icon: '📞' },
        { value: 'digital', label: 'Digital/Text', icon: '💬' }
      ]
    },
    {
      id: 6,
      question: "Where would you prefer your advisor to be located?",
      options: [
        { value: 'hong kong', label: 'Hong Kong', icon: '🇭🇰' },
        { value: 'taipei', label: 'Taipei', icon: '🇹🇼' },
        { value: 'singapore', label: 'Singapore', icon: '🇸🇬' },
        { value: 'anywhere', label: 'Anywhere', icon: '🌍' }
      ]
    }
  ];

  const handleAnswer = (answer) => {
    setAnswers({ ...answers, [currentQuestion]: answer });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
  };

  // Matching algorithm: use backend matching endpoint
  const matchAgents = async () => {
    setLoadingResults(true);
    try {
      // Map quiz answers to the format expected by the backend
      const quizAnswers = {
        primary_goal: answers[0],
        investment_timeline: answers[1],
        risk_tolerance: answers[2],
        financial_situation: answers[3],
        communication_pref: answers[4],
        language_preference: language,
        location: answers[5] || 'anywhere'
      };

      // Call the backend matching endpoint
      const response = await apiService.post('/agents/match', quizAnswers);
      if (response.success && Array.isArray(response.data)) {
        setMatchedAgents(response.data);
      } else {
        setMatchedAgents([]);
      }
    } catch (error) {
      console.error('Error matching agents:', error);
      setMatchedAgents([]);
    }
    setLoadingResults(false);
  };

  // On showResults, run matching
  React.useEffect(() => {
    if (showResults) {
      matchAgents();
    }
    // eslint-disable-next-line
  }, [showResults]);

  if (showResults) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6">
              {language === 'zh-TW' ? '您的完美配對' : 'Your Perfect Matches'}
            </h1>
            <p className="text-xl max-w-3xl mx-auto">
              {language === 'zh-TW'
                ? '根據您的答案，以下是最適合幫助您實現財務目標的顧問。'
                : 'Based on your answers, here are the advisors best suited to help you achieve your financial goals.'
              }
            </p>
          </div>
        </section>

        {/* Results */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4">
            {loadingResults ? (
              <div className="text-center py-12 text-lg text-gray-500">配對中...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {matchedAgents.map((agent) => (
                  <div key={agent.id} className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300 border border-gray-100">
                    {/* Header with image and match score */}
                    <div className="relative">
                      <div className="h-56 bg-gradient-to-br from-blue-500 to-purple-600 relative overflow-hidden">
                        <img 
                          src={agent.profile_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(agent.name || agent.first_name || 'Agent')}&background=4F46E5&color=fff&size=200&font-size=0.6`}
                          alt={agent.name || agent.first_name}
                          className="w-full h-full object-cover opacity-90"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                        
                        {/* Match Score Badge */}
                        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-green-600 px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                            {agent.matchScore}% {language === 'zh-TW' ? '配對' : 'Match'}
                          </div>
                        </div>

                        {/* Agent Name and Title */}
                        <div className="absolute bottom-4 left-4 text-white">
                          <h3 className="text-2xl font-bold mb-1">{agent.name || agent.first_name + ' ' + agent.last_name}</h3>
                          <p className="text-blue-100 font-medium">{agent.areas_of_expertise?.[0] || 'Financial Advisor'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {/* Expertise Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {agent.areas_of_expertise?.slice(0, 3).map((expertise, index) => (
                          <span key={index} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                            {expertise}
                          </span>
                        ))}
                      </div>

                      {/* Bio */}
                      <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                        {agent.bio}
                      </p>

                      {/* Stats Row */}
                      <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-xl">
                        <div className="flex items-center">
                          <div className="flex items-center mr-4">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} className={`w-4 h-4 ${i < Math.floor(agent.rating || 4.5) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                            <span className="ml-2 text-sm font-semibold text-gray-700">{agent.rating || 4.5}</span>
                          </div>
                          <div className="text-sm text-gray-600">
                            <span className="font-semibold">{agent.experience_years || '8'}</span> {language === 'zh-TW' ? '年經驗' : 'yrs exp.'}
                          </div>
                        </div>
                      </div>

                      {/* Key Info Grid */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                          </svg>
                          <span className="truncate">{agent.languages?.[0] || 'English'}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="truncate">{agent.location}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <svg className="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          <span className="truncate">{agent.communication_modes?.[0] || 'Video'}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <svg className="w-4 h-4 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="truncate">{agent.availability?.split(' ')[0] || 'Mon-Fri'}</span>
                        </div>
                      </div>

                      {/* Match Details */}
                      {agent.matchDetails && (
                        <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-100">
                          <h4 className="text-sm font-bold text-green-800 mb-2 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            {language === 'zh-TW' ? '配對優勢' : 'Match Highlights'}
                          </h4>
                          <div className="space-y-1">
                            {Object.entries(agent.matchDetails).slice(0, 2).map(([key, value]) => (
                              <div key={key} className="text-xs text-green-700 flex items-center">
                                <div className="w-1 h-1 bg-green-500 rounded-full mr-2"></div>
                                <span className="capitalize">{key.replace('_', ' ')}:</span>
                                <span className="ml-1 font-medium">{value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="space-y-3">
                        <button className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-xl font-bold hover:from-green-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                          {language === 'zh-TW' ? '立即聯繫' : 'Contact Now'}
                        </button>
                        <button className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200 text-sm">
                          {language === 'zh-TW' ? '查看完整資料' : 'View Full Profile'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {/* CTA */}
            <div className="text-center mt-12">
              <button
                onClick={handleRestart}
                className="bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors duration-200 mr-4"
              >
                {t('matching.retake')}
              </button>
              <a
                href="/all-agents"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
              >
                {language === 'zh-TW' ? '查看所有顧問' : 'View All Agents'}
              </a>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="pt-16 bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            {t('matching.title')}
          </h1>
          <p className="text-xl max-w-3xl mx-auto">
            {t('matching.subtitle')}
          </p>
        </div>
      </section>

      {/* Quiz */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">
                  {language === 'zh-TW' ? `問題 ${currentQuestion + 1} / ${questions.length}` : `Question ${currentQuestion + 1} of ${questions.length}`}
                </span>
                <span className="text-sm text-gray-600">
                  {Math.round(((currentQuestion + 1) / questions.length) * 100)}% {language === 'zh-TW' ? '完成' : 'Complete'}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Question */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {questions[currentQuestion].question}
              </h2>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {questions[currentQuestion].options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(option.value)}
                  className={`p-6 rounded-lg border-2 transition-all duration-200 text-left ${
                    answers[currentQuestion] === option.value
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-300 hover:border-green-400 hover:bg-green-50'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-4">{option.icon}</span>
                    <span className="font-semibold text-gray-900">{option.label}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('matching.previous')}
              </button>
              
              <button
                onClick={handleNext}
                disabled={!answers[currentQuestion]}
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {currentQuestion === questions.length - 1 ? t('matching.finish') : t('matching.next')}
              </button>
            </div>
            <div className="text-center mt-8">
              <a
                href="/all-agents"
                className="inline-block bg-blue-100 text-blue-700 px-6 py-2 rounded-lg font-semibold hover:bg-blue-200 transition-colors duration-200"
              >
                {language === 'zh-TW' ? '查看所有顧問' : 'View All Agents'}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            {language === 'zh-TW' ? '為什麼使用我們的配對系統？' : 'Why Use Our Matching System?'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-bullseye text-white text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {language === 'zh-TW' ? '精確配對' : 'Precise Matching'}
              </h3>
              <p className="text-gray-600">
                {language === 'zh-TW'
                  ? 'AI驅動算法找到符合您特定需求和偏好的顧問'
                  : 'AI-powered algorithm finds advisors who match your specific needs and preferences'
                }
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-clock text-white text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {language === 'zh-TW' ? '節省時間' : 'Save Time'}
              </h3>
              <p className="text-gray-600">
                {language === 'zh-TW'
                  ? '跳過研究，在幾分鐘內與合格顧問配對'
                  : 'Skip the research and get matched with qualified advisors in minutes'
                }
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-star text-white text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {language === 'zh-TW' ? '驗證顧問' : 'Verified Advisors'}
              </h3>
              <p className="text-gray-600">
                {language === 'zh-TW'
                  ? '所有顧問都是經過驗證的專業人士，擁有證實的記錄'
                  : 'All advisors are verified professionals with proven track records'
                }
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AgentMatchingPage; 