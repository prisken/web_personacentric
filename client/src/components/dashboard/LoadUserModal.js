import React from 'react';

const LoadUserModal = ({ savedUsers, onClose, onLoadUser }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">載入已保存的用戶資料</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {savedUsers.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📂</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">暫無保存的用戶資料</h3>
              <p className="text-gray-500">請先創建並保存用戶的理財產品配置</p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-600 mb-6">選擇要載入的用戶資料：</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-300 cursor-pointer"
                    onClick={() => onLoadUser(user)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-xl">👤</span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                          <p className="text-sm text-gray-500">用戶 ID: {user.id}</p>
                        </div>
                      </div>
                      <button className="text-blue-600 hover:text-blue-800 transition-colors">
                        載入 →
                      </button>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>產品數量:</span>
                        <span className="font-medium">{user.products?.length || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>退休年齡:</span>
                        <span className="font-medium">{user.retirementAge || 65} 歲</span>
                      </div>
                      <div className="flex justify-between">
                        <span>通脹率:</span>
                        <span className="font-medium">{user.inflationRate || 2}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>當前資產:</span>
                        <span className="font-medium">
                          {new Intl.NumberFormat('zh-TW', {
                            style: 'currency',
                            currency: 'HKD'
                          }).format(user.currentAssets || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>保存時間:</span>
                        <span className="font-medium">{formatDate(user.savedAt)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoadUserModal; 