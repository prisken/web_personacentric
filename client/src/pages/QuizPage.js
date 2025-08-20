import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';
import apiService from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const QuizPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, isAuthenticated } = useUser();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userAttempt, setUserAttempt] = useState(null);

  useEffect(() => {
    fetchQuiz();
    if (isAuthenticated) {
      fetchUserAttempt();
    }
  }, [id, isAuthenticated]);

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      const response = await apiService.get(`/quizzes/${id}`);
      if (response.success) {
        setQuiz(response.quiz);
      } else {
        setError('Quiz not found');
      }
    } catch (error) {
      console.error('Fetch quiz error:', error);
      setError('Failed to load quiz');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserAttempt = async () => {
    try {
      const response = await apiService.get('/quizzes/user/attempts');
      if (response.success) {
        const attempt = response.attempts.find(a => a.quiz_id === parseInt(id));
        setUserAttempt(attempt);
      }
    } catch (error) {
      console.error('Fetch user attempt error:', error);
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

  const handleStartQuiz = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { redirect: `/quiz/${id}` } });
      return;
    }
    navigate(`/quiz/${id}/take`);
  };

  const handleViewResults = () => {
    navigate(`/quiz/${id}/results`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Quiz Not Found</h1>
          <p className="text-gray-600 mb-6">The quiz you're looking for doesn't exist.</p>
          <Link
            to="/dashboard"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Quiz Info */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(quiz.difficulty)}`}>
                  {getDifficultyText(quiz.difficulty)}
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-20">
                  {quiz.category}
                </span>
              </div>
              
              <h1 className="text-4xl font-bold mb-4">{quiz.title}</h1>
              <p className="text-xl mb-6 opacity-90">{quiz.description}</p>
              
              {/* Quiz Stats */}
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold">{quiz.max_points}</div>
                  <div className="text-sm opacity-80">最大積分</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">
                    {quiz.time_limit ? `${quiz.time_limit}分鐘` : '無限制'}
                  </div>
                  <div className="text-sm opacity-80">時間限制</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{quiz.questions?.length || 0}</div>
                  <div className="text-sm opacity-80">題目數量</div>
                </div>
              </div>

              {/* User Status */}
              {isAuthenticated && user && (
                <div className="bg-white bg-opacity-10 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      <span className="text-lg font-semibold">
                        {user.first_name?.charAt(0) || user.email?.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold">
                        歡迎回來，{user.first_name || user.email}！
                      </div>
                      <div className="text-sm opacity-80">
                        準備好賺取積分了嗎？
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {userAttempt && userAttempt.completed ? (
                <div className="space-y-4">
                  <div className="bg-green-500 bg-opacity-20 rounded-lg p-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold mb-2">🎉 測驗已完成！</div>
                      <div className="text-2xl font-bold text-green-300 mb-2">
                        獲得 {userAttempt.points_earned} 積分
                      </div>
                      <div className="text-sm opacity-80">
                        得分：{userAttempt.score}/{userAttempt.max_score} ({Math.round(userAttempt.percentage)}%)
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleViewResults}
                    className="w-full bg-white text-blue-600 py-3 px-6 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    查看詳細結果
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {!isAuthenticated ? (
                    <div className="bg-yellow-500 bg-opacity-20 rounded-lg p-4 mb-4">
                      <div className="text-center">
                        <div className="text-lg font-semibold mb-2">💡 登入賺取積分！</div>
                        <div className="text-sm opacity-80 mb-4">
                          完成測驗即可獲得積分獎勵，積分可用於兌換禮品或升級服務。
                        </div>
                        <div className="space-y-2">
                          <button
                            onClick={() => navigate('/register', { state: { redirect: `/quiz/${id}` } })}
                            className="w-full bg-white text-blue-600 py-3 px-6 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                          >
                            立即註冊
                          </button>
                          <button
                            onClick={() => navigate('/login', { state: { redirect: `/quiz/${id}` } })}
                            className="w-full bg-transparent border-2 border-white text-white py-3 px-6 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                          >
                            已有帳號？登入
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={handleStartQuiz}
                      className="w-full bg-white text-blue-600 py-4 px-8 rounded-lg text-xl font-bold hover:bg-gray-100 transition-colors"
                    >
                      開始測驗
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Quiz Image */}
            <div className="relative">
              {quiz.image_url ? (
                <img
                  src={quiz.image_url}
                  alt={quiz.title}
                  className="w-full h-96 object-cover rounded-lg shadow-2xl"
                />
              ) : (
                <div className="w-full h-96 bg-white bg-opacity-10 rounded-lg shadow-2xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📊</div>
                    <div className="text-xl font-semibold">知識測驗</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Instructions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">測驗說明</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 mb-6">{quiz.instructions}</p>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-4">測驗規則：</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• 測驗包含 {quiz.questions?.length || 0} 道題目</li>
                  <li>• 每題都有固定的分值</li>
                  <li>• 達到 {quiz.passing_score}% 即可獲得積分</li>
                  <li>• 測驗時間：{quiz.time_limit ? `${quiz.time_limit}分鐘` : '無限制'}</li>
                  <li>• 完成後可查看詳細結果和正確答案</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quiz Stats Card */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">測驗統計</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">難度：</span>
                  <span className={`px-2 py-1 rounded text-sm ${getDifficultyColor(quiz.difficulty)}`}>
                    {getDifficultyText(quiz.difficulty)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">類別：</span>
                  <span className="font-medium">{quiz.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">最大積分：</span>
                  <span className="font-medium">{quiz.max_points}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">及格分數：</span>
                  <span className="font-medium">{quiz.passing_score}%</span>
                </div>
              </div>
            </div>

            {/* Benefits Card */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">🎁 完成測驗的好處</h3>
              <ul className="space-y-2 text-sm">
                <li>• 獲得積分獎勵</li>
                <li>• 提升財務知識</li>
                <li>• 獲得成就徽章</li>
                <li>• 解鎖更多測驗</li>
                <li>• 兌換精美禮品</li>
              </ul>
            </div>

            {/* Back to Dashboard */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <Link
                to="/dashboard"
                className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors text-center block"
              >
                ← 返回儀表板
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
