import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import apiService from '../services/api';

const RecommendationViewPage = () => {
  const { language } = useLanguage();
  const { shareCode } = useParams();
  const navigate = useNavigate();
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEngagementModal, setShowEngagementModal] = useState(false);
  const [engagementData, setEngagementData] = useState({
    engagement_type: 'view',
    visitor_email: '',
    visitor_name: '',
    comment: ''
  });

  useEffect(() => {
    fetchRecommendation();
  }, [shareCode]);

  const fetchRecommendation = async () => {
    try {
      setLoading(true);
      const response = await apiService.getRecommendationByShareCode(shareCode);
      if (response.success) {
        setRecommendation(response.recommendation);
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Failed to fetch recommendation:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleEngagement = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const response = await apiService.engageWithRecommendation(shareCode, engagementData);
      if (response.success) {
        alert(
          language === 'zh-TW' 
            ? `感謝您的參與！您獲得了 ${response.points_awarded} 積分。` 
            : `Thank you for engaging! You earned ${response.points_awarded} points.`
        );
        setShowEngagementModal(false);
        setEngagementData({
          engagement_type: 'view',
          visitor_email: '',
          visitor_name: '',
          comment: ''
        });
      }
    } catch (error) {
      alert(
        language === 'zh-TW' 
          ? '參與失敗：' + error.message 
          : 'Engagement failed: ' + error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEngagementData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getCategoryLabel = (category) => {
    const labels = {
      movie: language === 'zh-TW' ? '電影/電視' : 'Movie/TV',
      restaurant: language === 'zh-TW' ? '餐廳/咖啡廳' : 'Restaurant/Café',
      gift: language === 'zh-TW' ? '禮物/產品' : 'Gift/Product',
      book: language === 'zh-TW' ? '書籍/漫畫' : 'Book/Comic',
      event: language === 'zh-TW' ? '活動/體驗' : 'Event/Experience',
      app: language === 'zh-TW' ? '應用/工具' : 'App/Tool'
    };
    return labels[category] || category;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      movie: '🎬',
      restaurant: '🍽️',
      gift: '🎁',
      book: '📚',
      event: '🎪',
      app: '📱'
    };
    return icons[category] || '📌';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">
              {language === 'zh-TW' ? '載入中...' : 'Loading...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!recommendation) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              {language === 'zh-TW' ? '推薦不存在' : 'Recommendation Not Found'}
            </h1>
            <p className="mt-2 text-gray-600">
              {language === 'zh-TW' ? '此推薦連結可能已失效' : 'This recommendation link may have expired'}
            </p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
            >
              {language === 'zh-TW' ? '返回首頁' : 'Go Home'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {language === 'zh-TW' ? '朋友推薦' : 'Friend Recommendation'}
              </h1>
              <p className="text-gray-600 mt-2">
                {language === 'zh-TW' 
                  ? `${recommendation.user.first_name} ${recommendation.user.last_name} 推薦給您`
                  : `Recommended by ${recommendation.user.first_name} ${recommendation.user.last_name}`
                }
              </p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              {language === 'zh-TW' ? '返回首頁' : 'Go Home'}
            </button>
          </div>
        </div>

        {/* Recommendation Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header with category */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{getCategoryIcon(recommendation.category)}</div>
              <div>
                <h2 className="text-2xl font-bold">{recommendation.name}</h2>
                <p className="text-purple-100">{getCategoryLabel(recommendation.category)}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Photo if available */}
            {recommendation.photo_url && (
              <div className="mb-6">
                <img 
                  src={recommendation.photo_url} 
                  alt={recommendation.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            )}

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {language === 'zh-TW' ? '描述' : 'Description'}
              </h3>
              <p className="text-gray-700 leading-relaxed">{recommendation.description}</p>
            </div>

            {/* Why recommend */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {language === 'zh-TW' ? '為什麼推薦' : 'Why Recommend'}
              </h3>
              <p className="text-gray-700 leading-relaxed">{recommendation.why_recommend}</p>
            </div>

            {/* Additional info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {recommendation.location && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-1">
                    📍 {language === 'zh-TW' ? '地點' : 'Location'}
                  </h4>
                  <p className="text-gray-700">{recommendation.location}</p>
                </div>
              )}
              
              {recommendation.link && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-1">
                    🔗 {language === 'zh-TW' ? '連結' : 'Link'}
                  </h4>
                  <a 
                    href={recommendation.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:text-purple-800 break-all"
                  >
                    {recommendation.link}
                  </a>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="bg-purple-50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-purple-600">
                    {recommendation.total_views || 0}
                  </div>
                  <div className="text-sm text-gray-600">
                    {language === 'zh-TW' ? '瀏覽' : 'Views'}
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">
                    {recommendation.total_engagements || 0}
                  </div>
                  <div className="text-sm text-gray-600">
                    {language === 'zh-TW' ? '互動' : 'Engagements'}
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">
                    {recommendation.total_signups || 0}
                  </div>
                  <div className="text-sm text-gray-600">
                    {language === 'zh-TW' ? '註冊' : 'Signups'}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setEngagementData(prev => ({ ...prev, engagement_type: 'tried' }))}
                className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 font-semibold"
              >
                {language === 'zh-TW' ? '我試過了！' : 'I Tried It!'}
              </button>
              <button
                onClick={() => setShowEngagementModal(true)}
                className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 font-semibold"
              >
                {language === 'zh-TW' ? '留下評論' : 'Leave Comment'}
              </button>
              <button
                onClick={() => navigate('/register')}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 font-semibold"
              >
                {language === 'zh-TW' ? '加入我們' : 'Join Us'}
              </button>
            </div>
          </div>
        </div>

        {/* Engagement Modal */}
        {showEngagementModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {language === 'zh-TW' ? '留下評論' : 'Leave Comment'}
                </h3>
                <button
                  onClick={() => setShowEngagementModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleEngagement} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'zh-TW' ? '您的姓名' : 'Your Name'}
                  </label>
                  <input
                    type="text"
                    name="visitor_name"
                    value={engagementData.visitor_name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'zh-TW' ? '您的電子郵件' : 'Your Email'}
                  </label>
                  <input
                    type="email"
                    name="visitor_email"
                    value={engagementData.visitor_email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'zh-TW' ? '您的評論' : 'Your Comment'}
                  </label>
                  <textarea
                    name="comment"
                    value={engagementData.comment}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder={language === 'zh-TW' ? '分享您的想法...' : 'Share your thoughts...'}
                    required
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEngagementModal(false)}
                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
                  >
                    {language === 'zh-TW' ? '取消' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
                  >
                    {loading 
                      ? (language === 'zh-TW' ? '提交中...' : 'Submitting...')
                      : (language === 'zh-TW' ? '提交評論' : 'Submit Comment')
                    }
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendationViewPage; 