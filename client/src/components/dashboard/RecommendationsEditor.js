import React, { useState } from 'react';
import { useTranslation } from '../../contexts/LanguageContext';

const RecommendationsEditor = ({
  recommendations,
  onRecommendationsChange,
  isVisible,
  onClose
}) => {
  const { t } = useTranslation();
  const [localRecommendations, setLocalRecommendations] = useState([...recommendations]);

  const handleRecommendationChange = (index, value) => {
    const newRecommendations = [...localRecommendations];
    newRecommendations[index] = value;
    setLocalRecommendations(newRecommendations);
  };

  const addRecommendation = () => {
    setLocalRecommendations([...localRecommendations, '']);
  };

  const removeRecommendation = (index) => {
    const newRecommendations = localRecommendations.filter((_, i) => i !== index);
    setLocalRecommendations(newRecommendations);
  };

  const handleSave = () => {
    onRecommendationsChange(localRecommendations);
    onClose();
  };

  const handleCancel = () => {
    setLocalRecommendations([...recommendations]);
    onClose();
  };

  const resetToDefault = () => {
    const defaultRecommendations = [
      '定期檢視和調整您的投資組合以符合市場變化',
      '考慮增加退休儲蓄以確保退休後的生活品質',
      '多元化投資以分散風險並提高回報潛力',
      '定期與財務顧問會面以檢討和優化您的財務計劃'
    ];
    setLocalRecommendations(defaultRecommendations);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {t('financialPlanning.editRecommendations')}
          </h2>
          <div className="flex space-x-3">
            <button
              onClick={resetToDefault}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all duration-300 text-sm"
            >
              {t('financialPlanning.resetToDefault')}
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-all duration-300 text-sm"
            >
              {t('financialPlanning.cancel')}
            </button>
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 text-sm"
            >
              {t('financialPlanning.save')}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              {t('financialPlanning.recommendationsDescription')}
            </p>
          </div>

          {/* Recommendations List */}
          <div className="space-y-4">
            {localRecommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-2">
                  <span className="text-blue-600 font-bold">{index + 1}.</span>
                </div>
                <div className="flex-1">
                  <textarea
                    value={recommendation}
                    onChange={(e) => handleRecommendationChange(index, e.target.value)}
                    placeholder={t('financialPlanning.enterRecommendation')}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    rows="2"
                  />
                </div>
                <div className="flex-shrink-0">
                  <button
                    onClick={() => removeRecommendation(index)}
                    className="text-red-600 hover:text-red-800 transition-colors duration-200 p-1"
                    title={t('financialPlanning.removeRecommendation')}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add New Recommendation */}
          <div className="mt-6">
            <button
              onClick={addRecommendation}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all duration-300 flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>{t('financialPlanning.addRecommendation')}</span>
            </button>
          </div>

          {/* Preview */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t('financialPlanning.recommendationsPreview')}
            </h3>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <ul className="space-y-2">
                {localRecommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-yellow-600 mr-2">•</span>
                    <span className="text-sm text-gray-700">
                      {recommendation || t('financialPlanning.emptyRecommendation')}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationsEditor; 