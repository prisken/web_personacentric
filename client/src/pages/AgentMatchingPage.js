import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const AgentMatchingPage = () => {
  const { t, language } = useLanguage();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

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
    }
  ];

  const matchedAgents = [
    {
      id: 1,
      name: 'Sarah Johnson',
      specialty: language === 'zh-TW' ? '退休規劃' : 'Retirement Planning',
      experience: '15+ years',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
      matchScore: 95,
      description: language === 'zh-TW' 
        ? '退休規劃專家，專注於稅務效率策略。'
        : 'Expert in retirement planning with a focus on tax-efficient strategies.'
    },
    {
      id: 2,
      name: 'Michael Chen',
      specialty: language === 'zh-TW' ? '投資管理' : 'Investment Management',
      experience: '12+ years',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
      matchScore: 92,
      description: language === 'zh-TW'
        ? '專精於長期財富建設的成長導向投資策略。'
        : 'Specializes in growth-oriented investment strategies for long-term wealth building.'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      specialty: language === 'zh-TW' ? '稅務規劃' : 'Tax Planning',
      experience: '10+ years',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
      matchScore: 88,
      description: language === 'zh-TW'
        ? '稅務優化專家，幫助客戶最大化財務效率。'
        : 'Tax optimization expert helping clients maximize their financial efficiency.'
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {matchedAgents.map((agent) => (
                <div key={agent.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="relative">
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={agent.image} 
                        alt={agent.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {agent.matchScore}% {language === 'zh-TW' ? '配對' : 'Match'}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{agent.name}</h3>
                    <p className="text-blue-600 font-semibold mb-2">{agent.specialty}</p>
                    <p className="text-gray-600 mb-4">{agent.description}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <i key={i} className={`fas fa-star ${i < Math.floor(agent.rating) ? 'text-yellow-400' : 'text-gray-300'}`}></i>
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">{agent.rating}</span>
                      </div>
                      <span className="text-sm text-gray-500">{agent.experience}</span>
                    </div>
                    
                    <button className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200">
                      {t('matching.contact')}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="text-center mt-12">
              <button
                onClick={handleRestart}
                className="bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors duration-200 mr-4"
              >
                {t('matching.retake')}
              </button>
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200">
                {language === 'zh-TW' ? '查看所有顧問' : 'View All Advisors'}
              </button>
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