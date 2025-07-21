import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import apiService from '../../services/api';

const RecommendationGame = () => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  const [recommendations, setRecommendations] = useState([]);
  const [badges, setBadges] = useState({ userBadges: [], allBadges: [] });
  const [leaderboard, setLeaderboard] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);
  const [formData, setFormData] = useState({
    category: 'movie',
    name: '',
    description: '',
    why_recommend: '',
    link: '',
    location: '',
    photo_url: ''
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      if (activeTab === 'overview' || activeTab === 'recommendations') {
        const recResponse = await apiService.getMyRecommendations();
        if (recResponse.success) {
          setRecommendations(recResponse.recommendations);
        }
      }

      if (activeTab === 'overview' || activeTab === 'badges') {
        const badgeResponse = await apiService.getRecommendationBadges();
        if (badgeResponse.success) {
          setBadges(badgeResponse);
        }
      }

      if (activeTab === 'leaderboard') {
        const leaderboardResponse = await apiService.getRecommendationLeaderboard();
        if (leaderboardResponse.success) {
          setLeaderboard(leaderboardResponse.leaderboard);
        }
      }

      if (activeTab === 'stats') {
        const statsResponse = await apiService.getRecommendationStats();
        if (statsResponse.success) {
          setStats(statsResponse);
        }
      }
    } catch (error) {
      console.error('Failed to fetch recommendation data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateRecommendation = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const response = await apiService.createRecommendation(formData);
      if (response.success) {
        alert(language === 'zh-TW' ? '推薦創建成功！' : 'Recommendation created successfully!');
        setShowCreateModal(false);
        setFormData({
          category: 'movie',
          name: '',
          description: '',
          why_recommend: '',
          link: '',
          location: '',
          photo_url: ''
        });
        fetchData();
      }
    } catch (error) {
      alert(language === 'zh-TW' ? '創建推薦失敗：' + error.message : 'Failed to create recommendation: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRecommendation = async (id) => {
    if (!window.confirm(language === 'zh-TW' ? '確定要刪除此推薦嗎？' : 'Are you sure you want to delete this recommendation?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await apiService.deleteRecommendation(id);
      if (response.success) {
        alert(language === 'zh-TW' ? '推薦刪除成功！' : 'Recommendation deleted successfully!');
        fetchData();
      }
    } catch (error) {
      alert(language === 'zh-TW' ? '刪除推薦失敗：' + error.message : 'Failed to delete recommendation: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const copyShareLink = (shareCode) => {
    const shareUrl = `${window.location.origin}/recommendation/${shareCode}`;
    navigator.clipboard.writeText(shareUrl);
    alert(language === 'zh-TW' ? '分享連結已複製！' : 'Share link copied!');
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

  const tabs = [
    { id: 'overview', label: language === 'zh-TW' ? '總覽' : 'Overview', icon: '📊' },
    { id: 'recommendations', label: language === 'zh-TW' ? '我的推薦' : 'My Recommendations', icon: '💡' },
    { id: 'badges', label: language === 'zh-TW' ? '徽章' : 'Badges', icon: '🏆' },
    { id: 'leaderboard', label: language === 'zh-TW' ? '排行榜' : 'Leaderboard', icon: '📈' },
    { id: 'stats', label: language === 'zh-TW' ? '統計' : 'Statistics', icon: '📊' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              {language === 'zh-TW' ? '推薦遊戲' : 'Recommendation Game'}
            </h2>
            <p className="mt-2 opacity-90">
              {language === 'zh-TW' 
                ? '分享你喜歡的東西，獲得積分和徽章！' 
                : 'Share what you love and earn points and badges!'
              }
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
          >
            {language === 'zh-TW' ? '新增推薦' : 'Add Recommendation'}
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">
                {language === 'zh-TW' ? '載入中...' : 'Loading...'}
              </p>
            </div>
          ) : (
            <>
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
                      <div className="text-2xl font-bold">{recommendations.length}</div>
                      <div className="text-sm opacity-90">
                        {language === 'zh-TW' ? '總推薦數' : 'Total Recommendations'}
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
                      <div className="text-2xl font-bold">
                        {recommendations.reduce((sum, rec) => sum + (rec.total_engagements || 0), 0)}
                      </div>
                      <div className="text-sm opacity-90">
                        {language === 'zh-TW' ? '總互動數' : 'Total Engagements'}
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-4 text-white">
                      <div className="text-2xl font-bold">
                        {recommendations.reduce((sum, rec) => sum + (rec.total_signups || 0), 0)}
                      </div>
                      <div className="text-sm opacity-90">
                        {language === 'zh-TW' ? '總註冊數' : 'Total Signups'}
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
                      <div className="text-2xl font-bold">{badges.userBadges.length}</div>
                      <div className="text-sm opacity-90">
                        {language === 'zh-TW' ? '獲得徽章' : 'Badges Earned'}
                      </div>
                    </div>
                  </div>

                  {/* Recent Recommendations */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {language === 'zh-TW' ? '最近的推薦' : 'Recent Recommendations'}
                    </h3>
                    <div className="space-y-4">
                      {recommendations.slice(0, 3).map((rec) => (
                        <div key={rec.id} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl">{getCategoryIcon(rec.category)}</span>
                              <div>
                                <h4 className="font-semibold text-gray-900">{rec.name}</h4>
                                <p className="text-sm text-gray-600">{getCategoryLabel(rec.category)}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-600">
                                {rec.total_engagements || 0} {language === 'zh-TW' ? '互動' : 'engagements'}
                              </div>
                              <button
                                onClick={() => copyShareLink(rec.share_code)}
                                className="text-purple-600 hover:text-purple-800 text-sm"
                              >
                                {language === 'zh-TW' ? '分享' : 'Share'}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Badges */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {language === 'zh-TW' ? '最近的徽章' : 'Recent Badges'}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {badges.userBadges.slice(0, 4).map((userBadge) => (
                        <div key={userBadge.id} className="bg-yellow-50 rounded-lg p-4 text-center">
                          <div className="text-3xl mb-2">{userBadge.badge.icon}</div>
                          <div className="text-sm font-semibold text-gray-900">{userBadge.badge.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Recommendations Tab */}
              {activeTab === 'recommendations' && (
                <div className="space-y-4">
                  {recommendations.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-4xl mb-4">💡</div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {language === 'zh-TW' ? '還沒有推薦' : 'No Recommendations Yet'}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {language === 'zh-TW' 
                          ? '開始分享你喜歡的東西來獲得積分！' 
                          : 'Start sharing what you love to earn points!'
                        }
                      </p>
                      <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
                      >
                        {language === 'zh-TW' ? '創建第一個推薦' : 'Create First Recommendation'}
                      </button>
                    </div>
                  ) : (
                    recommendations.map((rec) => (
                      <div key={rec.id} className="bg-white border rounded-lg p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <div className="text-3xl">{getCategoryIcon(rec.category)}</div>
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900">{rec.name}</h3>
                              <p className="text-sm text-gray-600 mb-2">{getCategoryLabel(rec.category)}</p>
                              <p className="text-gray-700 mb-2">{rec.description}</p>
                              <p className="text-sm text-gray-600">
                                <strong>{language === 'zh-TW' ? '為什麼推薦：' : 'Why recommend: '}</strong>
                                {rec.why_recommend}
                              </p>
                              {rec.location && (
                                <p className="text-sm text-gray-600">
                                  📍 {rec.location}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-600 mb-2">
                              {rec.total_views || 0} {language === 'zh-TW' ? '瀏覽' : 'views'}
                            </div>
                            <div className="text-sm text-gray-600 mb-2">
                              {rec.total_engagements || 0} {language === 'zh-TW' ? '互動' : 'engagements'}
                            </div>
                            <div className="space-y-2">
                              <button
                                onClick={() => copyShareLink(rec.share_code)}
                                className="block w-full bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
                              >
                                {language === 'zh-TW' ? '分享' : 'Share'}
                              </button>
                              <button
                                onClick={() => handleDeleteRecommendation(rec.id)}
                                className="block w-full bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                              >
                                {language === 'zh-TW' ? '刪除' : 'Delete'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Badges Tab */}
              {activeTab === 'badges' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {language === 'zh-TW' ? '已獲得的徽章' : 'Earned Badges'}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {badges.userBadges.map((userBadge) => (
                        <div key={userBadge.id} className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 text-center">
                          <div className="text-4xl mb-2">{userBadge.badge.icon}</div>
                          <div className="font-semibold text-gray-900 mb-1">{userBadge.badge.name}</div>
                          <div className="text-sm text-gray-600">{userBadge.badge.description}</div>
                          <div className="text-xs text-gray-500 mt-2">
                            {new Date(userBadge.earned_at).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {language === 'zh-TW' ? '可獲得的徽章' : 'Available Badges'}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {badges.allBadges
                        .filter(badge => !badges.userBadges.some(ub => ub.badge_id === badge.id))
                        .map((badge) => (
                          <div key={badge.id} className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 text-center opacity-60">
                            <div className="text-4xl mb-2">{badge.icon}</div>
                            <div className="font-semibold text-gray-900 mb-1">{badge.name}</div>
                            <div className="text-sm text-gray-600">{badge.description}</div>
                            <div className="text-xs text-gray-500 mt-2">
                              {badge.requirement_value} {badge.requirement_type}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Leaderboard Tab */}
              {activeTab === 'leaderboard' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {language === 'zh-TW' ? '推薦排行榜' : 'Recommendation Leaderboard'}
                  </h3>
                  <div className="space-y-4">
                    {leaderboard.map((entry, index) => (
                      <div key={entry.user_id} className="bg-white border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                              {index + 1}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">
                                {entry.user.first_name} {entry.user.last_name}
                              </div>
                              <div className="text-sm text-gray-600">
                                {entry.recommendation_count} {language === 'zh-TW' ? '推薦' : 'recommendations'}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-purple-600">
                              {entry.total_engagements || 0}
                            </div>
                            <div className="text-sm text-gray-600">
                              {language === 'zh-TW' ? '總互動' : 'Total Engagements'}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Stats Tab */}
              {activeTab === 'stats' && stats && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {language === 'zh-TW' ? '總體統計' : 'Overall Statistics'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="text-2xl font-bold text-blue-600">{stats.totalStats.total_recommendations || 0}</div>
                        <div className="text-sm text-gray-600">
                          {language === 'zh-TW' ? '總推薦數' : 'Total Recommendations'}
                        </div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="text-2xl font-bold text-green-600">{stats.totalStats.total_views || 0}</div>
                        <div className="text-sm text-gray-600">
                          {language === 'zh-TW' ? '總瀏覽數' : 'Total Views'}
                        </div>
                      </div>
                      <div className="bg-yellow-50 rounded-lg p-4">
                        <div className="text-2xl font-bold text-yellow-600">{stats.totalStats.total_engagements || 0}</div>
                        <div className="text-sm text-gray-600">
                          {language === 'zh-TW' ? '總互動數' : 'Total Engagements'}
                        </div>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-4">
                        <div className="text-2xl font-bold text-purple-600">{stats.totalStats.total_signups || 0}</div>
                        <div className="text-sm text-gray-600">
                          {language === 'zh-TW' ? '總註冊數' : 'Total Signups'}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {language === 'zh-TW' ? '分類統計' : 'Category Statistics'}
                    </h3>
                    <div className="space-y-4">
                      {stats.categoryStats.map((stat) => (
                        <div key={stat.category} className="bg-white border rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl">{getCategoryIcon(stat.category)}</span>
                              <div>
                                <div className="font-semibold text-gray-900">{getCategoryLabel(stat.category)}</div>
                                <div className="text-sm text-gray-600">
                                  {stat.count} {language === 'zh-TW' ? '推薦' : 'recommendations'}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-purple-600">
                                {stat.total_engagements || 0}
                              </div>
                              <div className="text-sm text-gray-600">
                                {language === 'zh-TW' ? '互動' : 'Engagements'}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Create Recommendation Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {language === 'zh-TW' ? '創建新推薦' : 'Create New Recommendation'}
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRecommendation} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'zh-TW' ? '類別 *' : 'Category *'}
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="movie">{language === 'zh-TW' ? '電影/電視' : 'Movie/TV'}</option>
                    <option value="restaurant">{language === 'zh-TW' ? '餐廳/咖啡廳' : 'Restaurant/Café'}</option>
                    <option value="gift">{language === 'zh-TW' ? '禮物/產品' : 'Gift/Product'}</option>
                    <option value="book">{language === 'zh-TW' ? '書籍/漫畫' : 'Book/Comic'}</option>
                    <option value="event">{language === 'zh-TW' ? '活動/體驗' : 'Event/Experience'}</option>
                    <option value="app">{language === 'zh-TW' ? '應用/工具' : 'App/Tool'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'zh-TW' ? '名稱 *' : 'Name *'}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder={language === 'zh-TW' ? '輸入推薦項目名稱' : 'Enter recommendation name'}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'zh-TW' ? '描述 *' : 'Description *'}
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder={language === 'zh-TW' ? '簡短描述這個推薦項目' : 'Brief description of the recommendation'}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'zh-TW' ? '為什麼推薦 *' : 'Why Recommend *'}
                </label>
                <textarea
                  name="why_recommend"
                  value={formData.why_recommend}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder={language === 'zh-TW' ? '分享你為什麼推薦這個項目' : 'Share why you recommend this item'}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'zh-TW' ? '連結 (可選)' : 'Link (Optional)'}
                  </label>
                  <input
                    type="url"
                    name="link"
                    value={formData.link}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'zh-TW' ? '地點 (可選)' : 'Location (Optional)'}
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder={language === 'zh-TW' ? '實體地點或地址' : 'Physical location or address'}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'zh-TW' ? '照片連結 (可選)' : 'Photo URL (Optional)'}
                </label>
                <input
                  type="url"
                  name="photo_url"
                  value={formData.photo_url}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="https://..."
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
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
                    ? (language === 'zh-TW' ? '創建中...' : 'Creating...')
                    : (language === 'zh-TW' ? '創建推薦' : 'Create Recommendation')
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecommendationGame; 