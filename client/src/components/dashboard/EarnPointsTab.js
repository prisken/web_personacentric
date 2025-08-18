import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../contexts/LanguageContext';
import apiService from '../../services/api';

const EarnPointsTab = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userAttempts, setUserAttempts] = useState([]);

  useEffect(() => {
    fetchQuizzes();
    fetchUserAttempts();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const response = await apiService.get('/quizzes/active');
      if (response.success) {
        setQuizzes(response.quizzes);
      }
    } catch (error) {
      console.error('Fetch quizzes error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserAttempts = async () => {
    try {
      const response = await apiService.get('/quizzes/user/attempts');
      if (response.success) {
        setUserAttempts(response.attempts);
      }
    } catch (error) {
      console.error('Fetch user attempts error:', error);
    }
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

  const hasCompletedQuiz = (quizId) => {
    return userAttempts.some(attempt => attempt.quiz_id === quizId && attempt.completed);
  };

  const getQuizAttempt = (quizId) => {
    return userAttempts.find(attempt => attempt.quiz_id === quizId);
  };

  const handleStartQuiz = (quiz) => {
    navigate(`/quiz/${quiz.id}`);
  };

  const handleViewResults = (quiz) => {
    const attempt = getQuizAttempt(quiz.id);
    if (attempt) {
      navigate(`/quiz/${quiz.id}/results`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">賺取積分</h2>
        <p className="text-gray-600">
          完成測驗來賺取積分！每個測驗都有不同的積分獎勵，根據你的表現來獲得積分。
        </p>
      </div>

      {/* Quiz Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => {
          const completed = hasCompletedQuiz(quiz.id);
          const attempt = getQuizAttempt(quiz.id);

          return (
            <div key={quiz.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              {/* Quiz Image */}
              {quiz.image_url && (
                <div className="h-48 bg-gray-200 overflow-hidden">
                  <img
                    src={quiz.image_url}
                    alt={quiz.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}

              {/* Quiz Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {quiz.title}
                  </h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(quiz.difficulty)}`}>
                    {getDifficultyText(quiz.difficulty)}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {quiz.description}
                </p>

                {/* Quiz Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="text-center">
                    <div className="font-semibold text-gray-900">{quiz.max_points}</div>
                    <div className="text-gray-500">最大積分</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-gray-900">
                      {quiz.time_limit ? `${quiz.time_limit}分鐘` : '無限制'}
                    </div>
                    <div className="text-gray-500">時間限制</div>
                  </div>
                </div>

                {/* Category */}
                <div className="mb-4">
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                    {quiz.category}
                  </span>
                </div>

                {/* Action Button */}
                {completed ? (
                  <div className="space-y-2">
                    <div className="text-center">
                      <div className="text-sm text-gray-600">已完成</div>
                      {attempt && (
                        <div className="text-sm font-semibold text-green-600">
                          獲得 {attempt.points_earned} 積分
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleViewResults(quiz)}
                      className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      查看結果
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleStartQuiz(quiz)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    開始測驗
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {quizzes.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">暫無可用測驗</h3>
          <p className="text-gray-500">目前沒有可用的測驗，請稍後再來查看。</p>
        </div>
      )}

      {/* Progress Summary */}
      {userAttempts.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">測驗進度</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {userAttempts.filter(a => a.completed).length}
              </div>
              <div className="text-sm text-gray-600">已完成測驗</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {userAttempts.reduce((sum, a) => sum + a.points_earned, 0)}
              </div>
              <div className="text-sm text-gray-600">總積分獲得</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {quizzes.length - userAttempts.filter(a => a.completed).length}
              </div>
              <div className="text-sm text-gray-600">剩餘測驗</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EarnPointsTab; 