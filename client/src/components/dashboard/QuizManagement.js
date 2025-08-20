import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../contexts/LanguageContext';
import apiService from '../../services/api';
import QuizImageUpload from '../QuizImageUpload';

const QuizManagement = () => {
  const { t } = useTranslation();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    max_points: 100,
    time_limit: '',
    difficulty: 'medium',
    image_url: '',
    instructions: '',
    passing_score: 70,
    scoring_rules: {},
    quiz_type: 'internal',
    external_quiz_url: '',
    external_quiz_id: '',
    point_calculation_method: 'percentage',
    min_score_for_points: 70
  });

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const response = await apiService.get('/quizzes/admin');
      if (response.success) {
        setQuizzes(response.quizzes);
      }
    } catch (error) {
      console.error('Fetch quizzes error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuiz = async () => {
    try {
      setLoading(true);
      const response = await apiService.post('/quizzes', formData);
      if (response.success) {
        setShowCreateModal(false);
        setFormData({
          title: '',
          description: '',
          category: '',
          max_points: 100,
          time_limit: '',
          difficulty: 'medium',
          image_url: '',
          instructions: '',
          passing_score: 70,
          questions: [],
          scoring_rules: {},
          quiz_type: 'internal',
          external_quiz_url: '',
          external_quiz_id: '',
          point_calculation_method: 'percentage',
          min_score_for_points: 70
        });
        await fetchQuizzes();
      }
    } catch (error) {
      console.error('Create quiz error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditQuiz = async () => {
    try {
      setLoading(true);
      const response = await apiService.put(`/quizzes/${selectedQuiz.id}`, formData);
      if (response.success) {
        setShowEditModal(false);
        setSelectedQuiz(null);
        await fetchQuizzes();
      }
    } catch (error) {
      console.error('Update quiz error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUploaded = (imageData) => {
    setFormData(prev => ({
      ...prev,
      image_url: imageData.url
    }));
  };

  const handleDeleteQuiz = async (quizId) => {
    if (window.confirm('確定要刪除此測驗嗎？此操作無法撤銷。')) {
      try {
        setLoading(true);
        await apiService.delete(`/quizzes/${quizId}`);
        await fetchQuizzes();
      } catch (error) {
        console.error('Delete quiz error:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const openEditModal = (quiz) => {
    setSelectedQuiz(quiz);
    setFormData({
      title: quiz.title,
      description: quiz.description,
      category: quiz.category,
      max_points: quiz.max_points,
      time_limit: quiz.time_limit || '',
      difficulty: quiz.difficulty,
      image_url: quiz.image_url || '',
      instructions: quiz.instructions || '',
      passing_score: quiz.passing_score,
      scoring_rules: quiz.scoring_rules || {},
      is_active: quiz.is_active,
      quiz_type: quiz.quiz_type || 'internal',
      external_quiz_url: quiz.external_quiz_url || '',
      external_quiz_id: quiz.external_quiz_id || '',
      point_calculation_method: quiz.point_calculation_method || 'percentage',
      min_score_for_points: quiz.min_score_for_points || 70
    });
    setShowEditModal(true);
  };



  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyText = (difficulty) => {
    switch (difficulty) {
      case 'easy': return '簡單';
      case 'medium': return '中等';
      case 'hard': return '困難';
      default: return difficulty;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">測驗管理</h3>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              新增測驗
            </button>
          </div>
        </div>
      </div>

      {/* Quizzes List */}
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  測驗資訊
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  類別
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  難度
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  積分
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  狀態
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {quizzes.map((quiz) => (
                <tr key={quiz.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {quiz.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {quiz.description}
                      </div>
                      <div className="text-xs text-gray-400">
                        {quiz.quiz_type === 'external' ? (
                          <span className="text-purple-600">外部測驗</span>
                        ) : (
                          <span className="text-blue-600">內部測驗</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                      {quiz.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(quiz.difficulty)}`}>
                      {getDifficultyText(quiz.difficulty)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {quiz.max_points} 積分
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      quiz.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {quiz.is_active ? '啟用' : '停用'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEditModal(quiz)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        編輯
                      </button>
                      <button
                        onClick={() => handleDeleteQuiz(quiz.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        刪除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Quiz Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">新增測驗</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">標題</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">類別</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">最大積分</label>
                  <input
                    type="number"
                    value={formData.max_points}
                    onChange={(e) => setFormData(prev => ({ ...prev, max_points: parseInt(e.target.value) }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">時間限制 (分鐘)</label>
                  <input
                    type="number"
                    value={formData.time_limit}
                    onChange={(e) => setFormData(prev => ({ ...prev, time_limit: e.target.value }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="留空表示無限制"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">難度</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="easy">簡單</option>
                    <option value="medium">中等</option>
                    <option value="hard">困難</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">及格分數 (%)</label>
                  <input
                    type="number"
                    value={formData.passing_score}
                    onChange={(e) => setFormData(prev => ({ ...prev, passing_score: parseInt(e.target.value) }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">測驗類型</label>
                  <select
                    value={formData.quiz_type}
                    onChange={(e) => setFormData(prev => ({ ...prev, quiz_type: e.target.value }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="internal">內部測驗</option>
                    <option value="external">外部測驗</option>
                  </select>
                </div>
              </div>

              {formData.quiz_type === 'external' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">外部測驗網址</label>
                    <input
                      type="url"
                      value={formData.external_quiz_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, external_quiz_url: e.target.value }))}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="https://example.com/quiz"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">外部測驗ID</label>
                    <input
                      type="text"
                      value={formData.external_quiz_id}
                      onChange={(e) => setFormData(prev => ({ ...prev, external_quiz_id: e.target.value }))}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="external_quiz_123"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">積分計算方式</label>
                    <select
                      value={formData.point_calculation_method}
                      onChange={(e) => setFormData(prev => ({ ...prev, point_calculation_method: e.target.value }))}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="percentage">按百分比計算</option>
                      <option value="fixed">固定積分</option>
                      <option value="custom">自定義計算</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">最低得分要求 (%)</label>
                    <input
                      type="number"
                      value={formData.min_score_for_points}
                      onChange={(e) => setFormData(prev => ({ ...prev, min_score_for_points: parseInt(e.target.value) }))}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">描述</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">說明</label>
                <textarea
                  value={formData.instructions}
                  onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="測驗開始前的說明文字"
                />
              </div>

              <QuizImageUpload
                currentImageUrl={formData.image_url}
                onImageUploaded={handleImageUploaded}
              />

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  取消
                </button>
                <button
                  onClick={handleCreateQuiz}
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? '創建中...' : '創建測驗'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Quiz Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">編輯測驗</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">標題</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">類別</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">最大積分</label>
                  <input
                    type="number"
                    value={formData.max_points}
                    onChange={(e) => setFormData(prev => ({ ...prev, max_points: parseInt(e.target.value) }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">時間限制 (分鐘)</label>
                  <input
                    type="number"
                    value={formData.time_limit}
                    onChange={(e) => setFormData(prev => ({ ...prev, time_limit: e.target.value }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="留空表示無限制"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">難度</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="easy">簡單</option>
                    <option value="medium">中等</option>
                    <option value="hard">困難</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">及格分數 (%)</label>
                  <input
                    type="number"
                    value={formData.passing_score}
                    onChange={(e) => setFormData(prev => ({ ...prev, passing_score: parseInt(e.target.value) }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">狀態</label>
                  <select
                    value={formData.is_active}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.value === 'true' }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value={true}>啟用</option>
                    <option value={false}>停用</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">測驗類型</label>
                  <select
                    value={formData.quiz_type}
                    onChange={(e) => setFormData(prev => ({ ...prev, quiz_type: e.target.value }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="internal">內部測驗</option>
                    <option value="external">外部測驗</option>
                  </select>
                </div>
              </div>

              {formData.quiz_type === 'external' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">外部測驗網址</label>
                    <input
                      type="url"
                      value={formData.external_quiz_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, external_quiz_url: e.target.value }))}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="https://example.com/quiz"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">外部測驗ID</label>
                    <input
                      type="text"
                      value={formData.external_quiz_id}
                      onChange={(e) => setFormData(prev => ({ ...prev, external_quiz_id: e.target.value }))}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="external_quiz_123"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">積分計算方式</label>
                    <select
                      value={formData.point_calculation_method}
                      onChange={(e) => setFormData(prev => ({ ...prev, point_calculation_method: e.target.value }))}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="percentage">按百分比計算</option>
                      <option value="fixed">固定積分</option>
                      <option value="custom">自定義計算</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">最低得分要求 (%)</label>
                    <input
                      type="number"
                      value={formData.min_score_for_points}
                      onChange={(e) => setFormData(prev => ({ ...prev, min_score_for_points: parseInt(e.target.value) }))}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">描述</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">說明</label>
                <textarea
                  value={formData.instructions}
                  onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="測驗開始前的說明文字"
                />
              </div>

              <QuizImageUpload
                currentImageUrl={formData.image_url}
                onImageUploaded={handleImageUploaded}
              />

              

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  取消
                </button>
                <button
                  onClick={handleEditQuiz}
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? '更新中...' : '更新測驗'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizManagement; 