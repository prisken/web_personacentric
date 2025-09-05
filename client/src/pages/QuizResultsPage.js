import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import apiService from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const QuizResultsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useUser();
  const [quiz, setQuiz] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Get data from location state or fetch it
    if (location.state?.attempt && location.state?.quiz) {
      setAttempt(location.state.attempt);
      setQuiz(location.state.quiz);
      setLoading(false);
    } else {
      fetchResults();
    }
  }, [id, isAuthenticated]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const [quizResponse, attemptsResponse] = await Promise.all([
        apiService.get(`/quizzes/${id}`),
        apiService.get('/quizzes/user/attempts')
      ]);

      if (quizResponse.success) {
        setQuiz(quizResponse.quiz);
      }

      if (attemptsResponse.success) {
        const userAttempt = attemptsResponse.attempts.find(a => a.quiz_id === parseInt(id));
        setAttempt(userAttempt);
      }
    } catch (error) {
      console.error('Fetch results error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = (percentage) => {
    if (percentage >= 90) return '🎉 優秀！你的表現非常出色！';
    if (percentage >= 80) return '👍 很好！你對這個主題有很好的理解！';
    if (percentage >= 70) return '✅ 不錯！你已經掌握了大部分內容！';
    if (percentage >= 60) return '📚 及格！還有進步空間，繼續加油！';
    return '💪 需要努力！建議重新學習這個主題！';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!quiz || !attempt) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Results Not Found</h1>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">測驗結果</h1>
            <p className="text-xl opacity-90">{quiz.title}</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Score Summary */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="text-center mb-8">
            <div className={`text-6xl font-bold mb-4 ${getScoreColor(attempt.percentage)}`}>
              {Math.round(attempt.percentage)}%
            </div>
            <div className="text-xl text-gray-700 mb-2">
              {getScoreMessage(attempt.percentage)}
            </div>
            <div className="text-lg text-gray-600">
              得分：{attempt.score} / {attempt.max_score}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {attempt.points_earned}
              </div>
              <div className="text-gray-600">獲得積分</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {Math.round(attempt.percentage)}%
              </div>
              <div className="text-gray-600">正確率</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {attempt.time_taken ? Math.floor(attempt.time_taken / 60) : 0}分
              </div>
              <div className="text-gray-600">用時</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>及格線：{quiz.passing_score}%</span>
              <span>你的得分：{Math.round(attempt.percentage)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-1000 ${
                  attempt.percentage >= quiz.passing_score ? 'bg-green-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(attempt.percentage, 100)}%` }}
              ></div>
            </div>
          </div>

          {attempt.percentage >= quiz.passing_score ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <div className="text-green-800 font-semibold">🎉 恭喜通過測驗！</div>
              <div className="text-green-600 text-sm">
                你已獲得 {attempt.points_earned} 積分獎勵
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
              <div className="text-yellow-800 font-semibold">📚 未達及格標準</div>
              <div className="text-yellow-600 text-sm">
                建議重新學習後再次挑戰
              </div>
            </div>
          )}
        </div>

        {/* Question Review */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">題目回顧</h2>
          <div className="space-y-6">
            {quiz.questions.map((question, index) => {
              const userAnswer = attempt.answers[index];
              const isCorrect = userAnswer === question.correct_answer;
              
              return (
                <div key={index} className="border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-semibold text-gray-900">
                      問題 {index + 1}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded text-sm ${
                        isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {isCorrect ? '✓ 正確' : '✗ 錯誤'}
                      </span>
                      <span className="text-sm text-gray-600">
                        {question.points || 1} 分
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-900 mb-4">{question.question_text}</p>
                  
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className={`p-3 rounded-lg border-2 ${
                          option === question.correct_answer
                            ? 'border-green-500 bg-green-50'
                            : option === userAnswer && !isCorrect
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-200'
                        }`}
                      >
                        <div className="flex items-center">
                          {option === question.correct_answer && (
                            <span className="text-green-600 mr-2">✓</span>
                          )}
                          {option === userAnswer && !isCorrect && (
                            <span className="text-red-600 mr-2">✗</span>
                          )}
                          <span className={option === question.correct_answer ? 'font-semibold text-green-800' : ''}>
                            {option}
                          </span>
                          {option === question.correct_answer && (
                            <span className="ml-auto text-sm text-green-600 font-medium">正確答案</span>
                          )}
                          {option === userAnswer && !isCorrect && (
                            <span className="ml-auto text-sm text-red-600 font-medium">你的答案</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link
            to="/dashboard"
            className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg text-center hover:bg-gray-700 transition-colors"
          >
            返回儀表板
          </Link>
          <Link
            to={`/quiz/${id}`}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg text-center hover:bg-blue-700 transition-colors"
          >
            重新測驗
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuizResultsPage;
