import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const ContestsPage = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('current');

  const currentContest = {
    title: 'Financial Content Creation Challenge',
    description: 'Create compelling financial content that educates and inspires. Share your expertise and win amazing prizes!',
    deadline: 'March 31, 2024',
    prizes: [
      { place: '1st Place', reward: '$1,000 + Featured on Platform' },
      { place: '2nd Place', reward: '$500 + Recognition Badge' },
      { place: '3rd Place', reward: '$250 + Premium Membership' }
    ],
    categories: [
      'Social Media Post',
      'Blog Article',
      'Infographic',
      'Video Content',
      'Email Campaign',
      'Podcast Script'
    ],
    rules: [
      'Content must be original and not previously published',
      'Must be related to financial topics',
      'Maximum 1000 words for written content',
      'Videos must be under 5 minutes',
      'All content must be family-friendly'
    ]
  };

  const pastWinners = [
    {
      id: 1,
      name: 'Sarah Johnson',
      title: 'Investment Strategies for Beginners',
      category: 'Blog Article',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      date: 'February 2024',
      prize: '$1,000',
      excerpt: 'A comprehensive guide to getting started with investing, covering everything from basic concepts to advanced strategies.'
    },
    {
      id: 2,
      name: 'Michael Chen',
      title: 'Retirement Planning Infographic',
      category: 'Infographic',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
      date: 'January 2024',
      prize: '$500',
      excerpt: 'Visual guide to retirement planning with clear timelines and actionable steps for different age groups.'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      title: 'Tax Tips for Small Business',
      category: 'Social Media Post',
      image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80',
      date: 'December 2023',
      prize: '$250',
      excerpt: 'Engaging social media content with practical tax-saving tips for small business owners.'
    }
  ];

  return (
    <div className="pt-16 bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            {t('contest.title')}
          </h1>
          <p className="text-xl max-w-3xl mx-auto">
            Showcase your financial expertise and win amazing prizes in our monthly content creation challenges.
          </p>
        </div>
      </section>

      {/* Tabs */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center mb-8">
            <div className="bg-gray-200 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('current')}
                className={`px-6 py-2 rounded-md transition-colors duration-200 ${
                  activeTab === 'current'
                    ? 'bg-orange-600 text-white'
                    : 'text-gray-700 hover:bg-gray-300'
                }`}
              >
                {t('contest.current')}
              </button>
              <button
                onClick={() => setActiveTab('winners')}
                className={`px-6 py-2 rounded-md transition-colors duration-200 ${
                  activeTab === 'winners'
                    ? 'bg-orange-600 text-white'
                    : 'text-gray-700 hover:bg-gray-300'
                }`}
              >
                {t('contest.pastWinners')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Current Contest */}
      {activeTab === 'current' && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contest Details */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  {currentContest.title}
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  {currentContest.description}
                </p>

                {/* Deadline */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8">
                  <h3 className="text-lg font-semibold text-orange-800 mb-2">Deadline</h3>
                  <p className="text-orange-700">{currentContest.deadline}</p>
                </div>

                {/* Prizes */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{t('contest.prizes')}</h3>
                  <div className="space-y-3">
                    {currentContest.prizes.map((prize, index) => (
                      <div key={index} className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm">
                        <span className="font-semibold text-gray-900">{prize.place}</span>
                        <span className="text-green-600 font-semibold">{prize.reward}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Member Benefits */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                  <h3 className="text-lg font-semibold text-blue-800 mb-4">{t('contest.memberBenefits')}</h3>
                  <ul className="space-y-2 text-blue-700">
                    <li className="flex items-center">
                      <i className="fas fa-check mr-2"></i>
                      {t('contest.exclusiveAccess')}
                    </li>
                    <li className="flex items-center">
                      <i className="fas fa-check mr-2"></i>
                      {t('contest.winPoints')}
                    </li>
                    <li className="flex items-center">
                      <i className="fas fa-check mr-2"></i>
                      Build your professional portfolio
                    </li>
                  </ul>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-4">
                  <Link
                    to="/register"
                    className="block w-full bg-orange-600 text-white py-4 rounded-lg text-center font-semibold hover:bg-orange-700 transition-colors duration-200"
                  >
                    {t('contest.becomeMember')}
                  </Link>
                  <Link
                    to="/login"
                    className="block w-full bg-transparent border-2 border-orange-600 text-orange-600 py-4 rounded-lg text-center font-semibold hover:bg-orange-600 hover:text-white transition-colors duration-200"
                  >
                    {t('contest.alreadyMember')}
                  </Link>
                </div>
              </div>

              {/* Contest Rules & Categories */}
              <div className="space-y-8">
                {/* Categories */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Contest Categories</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {currentContest.categories.map((category, index) => (
                      <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                        <span className="font-medium text-gray-900">{category}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rules */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{t('contest.rules')}</h3>
                  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <ul className="space-y-3">
                      {currentContest.rules.map((rule, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-orange-600 mr-2">•</span>
                          <span className="text-gray-700">{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* How to Participate */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{t('contest.howToParticipate')}</h3>
                  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <ol className="space-y-3">
                      <li className="flex items-start">
                        <span className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">1</span>
                        <span className="text-gray-700">Create your account and become a member</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">2</span>
                        <span className="text-gray-700">Choose your preferred content category</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">3</span>
                        <span className="text-gray-700">Create and submit your original content</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">4</span>
                        <span className="text-gray-700">Get votes from the community</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">5</span>
                        <span className="text-gray-700">Win prizes and recognition!</span>
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Past Winners */}
      {activeTab === 'winners' && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              {t('contest.pastWinners')}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pastWinners.map((winner) => (
                <div key={winner.id} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-200">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={winner.image} 
                      alt={winner.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 bg-orange-100 text-orange-600 text-sm rounded-full">
                        {winner.category}
                      </span>
                      <span className="text-sm text-gray-500">{winner.date}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{winner.title}</h3>
                    <p className="text-gray-600 mb-4">{winner.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">{winner.name}</p>
                        <p className="text-sm text-gray-500">Winner</p>
                      </div>
                      <div className="text-right">
                        <p className="text-green-600 font-bold">{winner.prize}</p>
                        <p className="text-xs text-gray-500">Prize</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* View All Winners CTA */}
            <div className="text-center mt-12">
              <button className="bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors duration-200">
                View All Winners
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Signup */}
      <section className="py-16 bg-orange-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Stay Updated
          </h2>
          <p className="text-xl mb-8">
            Get notified about new contests and exclusive opportunities
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-white focus:outline-none"
            />
            <button className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContestsPage; 