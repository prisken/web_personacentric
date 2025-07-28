import React from 'react';
import ProductCard from './ProductCard';
import CreateProductModal from './CreateProductModal';
import LoadUserModal from './LoadUserModal';

const ProductConfigurationPage = ({
  products,
  productTypes,
  showCreateModal,
  setShowCreateModal,
  showLoadModal,
  setShowLoadModal,
  savedUsers,
  addProduct,
  updateProduct,
  removeProduct,
  duplicateProduct,
  saveCurrentUser,
  loadUser,
  currentUser
}) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'HKD'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header with action buttons */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">理財產品配置</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
          >
            ➕ 創建
          </button>
          <button
            onClick={() => setShowLoadModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
          >
            📂 載入已保存
          </button>
          <button
            onClick={saveCurrentUser}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
          >
            💾 保存
          </button>
        </div>
      </div>

      {/* Current user info */}
      {currentUser && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 font-medium">
            當前用戶: 用戶 {currentUser}
          </p>
        </div>
      )}

      {/* Products grid */}
      {products.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">💰</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">開始配置理財產品</h3>
          <p className="text-gray-500 mb-6">點擊「創建」按鈕開始添加您的第一個理財產品</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold text-lg"
          >
            ➕ 創建第一個產品
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              updateProduct={updateProduct}
              removeProduct={removeProduct}
              duplicateProduct={duplicateProduct}
            />
          ))}
        </div>
      )}

      {/* Product count info */}
      {products.length > 0 && (
        <div className="text-center text-gray-500">
          已配置 {products.length}/30 個產品
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <CreateProductModal
          productTypes={productTypes}
          onClose={() => setShowCreateModal(false)}
          onAddProduct={addProduct}
        />
      )}

      {showLoadModal && (
        <LoadUserModal
          savedUsers={savedUsers}
          onClose={() => setShowLoadModal(false)}
          onLoadUser={loadUser}
        />
      )}
    </div>
  );
};

export default ProductConfigurationPage; 