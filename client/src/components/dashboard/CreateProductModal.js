import React, { useState } from 'react';

const CreateProductModal = ({ productTypes, onClose, onAddProduct }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = [
    { id: 'investment', name: '投資', icon: '📈', color: 'bg-green-500' },
    { id: 'saving', name: '儲蓄', icon: '💰', color: 'bg-blue-500' },
    { id: 'real_estate', name: '房地產', icon: '🏠', color: 'bg-purple-500' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">創建新產品</h2>
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
          {!selectedCategory ? (
            // Category Selection
            <div className="space-y-4">
              <p className="text-gray-600 mb-6">選擇產品類別：</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className="p-6 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-lg transition-all duration-300 group"
                  >
                    <div className="text-center">
                      <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <span className="text-2xl text-white">{category.icon}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.name}</h3>
                      <p className="text-sm text-gray-500">
                        {category.id === 'investment' && '基金、強積金等投資產品'}
                        {category.id === 'saving' && '儲蓄計劃、銀行、退休基金'}
                        {category.id === 'real_estate' && '自住、租賃、出租物業'}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            // Product Type Selection
            <div className="space-y-4">
              <div className="flex items-center space-x-3 mb-6">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  ← 返回
                </button>
                <h3 className="text-lg font-semibold text-gray-900">
                  選擇 {categories.find(c => c.id === selectedCategory)?.name} 產品類型
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {productTypes[selectedCategory]?.map((productType) => (
                  <button
                    key={productType.id}
                    onClick={() => onAddProduct(selectedCategory, productType.id)}
                    className="p-6 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-lg transition-all duration-300 group text-left"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <span className="text-xl">{productType.icon}</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{productType.name}</h4>
                        <p className="text-sm text-gray-500 mt-1">
                          {productType.id === 'funds' && '投資基金配置'}
                          {productType.id === 'mpf' && '強積金計劃'}
                          {productType.id === 'saving_plans' && '儲蓄保險計劃'}
                          {productType.id === 'bank' && '銀行儲蓄產品'}
                          {productType.id === 'retirement_funds' && '退休基金計劃'}
                          {productType.id === 'own_living' && '自住物業'}
                          {productType.id === 'renting' && '租賃物業'}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateProductModal; 