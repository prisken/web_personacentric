import React, { useState, useEffect } from 'react';
import apiService from '../services/api';
import LoadingSpinner from './LoadingSpinner';

const GiftRedemptionOverlay = ({ isOpen, onClose, userPoints, onPointsUpdate }) => {
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchGifts();
    }
  }, [isOpen]);

  const fetchGifts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getPublicGifts();
      setGifts(response || []);
    } catch (error) {
      console.error('Error fetching gifts:', error);
      setError('Failed to load gifts');
    } finally {
      setLoading(false);
    }
  };

  const handleRedeemGift = async (giftId, pointsRequired) => {
    if (userPoints < pointsRequired) {
      alert('積分不足，無法兌換此禮品');
      return;
    }

    if (!window.confirm(`確定要使用 ${pointsRequired} 積分兌換此禮品嗎？`)) {
      return;
    }

    try {
      setRedeeming(true);
      await apiService.redeemGift(giftId);
      alert('禮品兌換成功！');
      onPointsUpdate(); // Refresh points in parent component
      fetchGifts(); // Refresh gifts list
    } catch (error) {
      console.error('Error redeeming gift:', error);
      alert('兌換失敗，請重試');
    } finally {
      setRedeeming(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-blue-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold">🎁 禮品兌換</h2>
              <p className="text-lg lg:text-xl opacity-90 mt-1">
                您目前有 <span className="font-bold">{userPoints}</span> 積分
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl lg:text-3xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 text-lg">{error}</p>
              <button
                onClick={fetchGifts}
                className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
              >
                重試
              </button>
            </div>
          ) : gifts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎁</div>
              <p className="text-gray-500 text-lg">暫無可兌換的禮品</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gifts.map((gift) => (
                <div
                  key={gift.id}
                  className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  {gift.image_url && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={gift.image_url}
                        alt={gift.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-2">
                      {gift.name}
                    </h3>
                    <p className="text-gray-600 text-sm lg:text-base mb-3">
                      {gift.description}
                    </p>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-purple-600 font-bold text-lg">
                        {gift.points_required} 積分
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        gift.stock_quantity > 0
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {gift.stock_quantity > 0 ? `庫存: ${gift.stock_quantity}` : '缺貨'}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRedeemGift(gift.id, gift.points_required)}
                      disabled={redeeming || gift.stock_quantity <= 0 || userPoints < gift.points_required}
                      className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                        userPoints >= gift.points_required && gift.stock_quantity > 0
                          ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white hover:from-purple-600 hover:to-blue-700 transform hover:scale-105'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {redeeming ? '兌換中...' : 
                       gift.stock_quantity <= 0 ? '缺貨' :
                       userPoints < gift.points_required ? '積分不足' : '立即兌換'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GiftRedemptionOverlay; 