import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '../LoadingSpinner';
import ImageUpload from '../ImageUpload';

const GiftManagement = () => {
  const { user } = useContext(UserContext);
  const [gifts, setGifts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedGift, setSelectedGift] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category_id: '',
    points_required: 0,
    stock_quantity: 0,
    status: 'active'
  });

  useEffect(() => {
    fetchGifts();
    fetchCategories();
  }, []);

  const fetchGifts = async () => {
    try {
      const response = await axios.get('/api/gifts');
      setGifts(response.data || []);
    } catch (error) {
      console.error('Error fetching gifts:', error);
      toast.error('Failed to fetch gifts');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/gifts/categories');
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to fetch categories');
    }
  };

  const handleCreateGift = async () => {
    try {
      await axios.post('/api/gifts', formData);
      toast.success('Gift created successfully');
      fetchGifts();
      setIsModalOpen(false);
      setFormData({
        name: '',
        description: '',
        category_id: '',
        points_required: 0,
        stock_quantity: 0,
        status: 'active'
      });
    } catch (error) {
      console.error('Error creating gift:', error);
      toast.error('Failed to create gift');
    }
  };

  const handleUpdateGift = async (id) => {
    try {
      await axios.put(`/api/gifts/${id}`, formData);
      toast.success('Gift updated successfully');
      fetchGifts();
      setIsModalOpen(false);
      setSelectedGift(null);
    } catch (error) {
      console.error('Error updating gift:', error);
      toast.error('Failed to update gift');
    }
  };

  const handleDeleteGift = async (id) => {
    if (window.confirm('Are you sure you want to delete this gift?')) {
      try {
        await axios.delete(`/api/gifts/${id}`);
        toast.success('Gift deleted successfully');
        fetchGifts();
      } catch (error) {
        console.error('Error deleting gift:', error);
        toast.error('Failed to delete gift');
      }
    }
  };

  const handleImageUpload = async (imageUrl) => {
    setFormData({ ...formData, image_url: imageUrl });
  };

  const handleSeedGifts = async () => {
    try {
      setLoading(true);
      await axios.post('/api/gifts/seed');
      toast.success('Gifts seeded successfully');
      fetchGifts();
    } catch (error) {
      console.error('Error seeding gifts:', error);
      toast.error('Failed to seed gifts');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => {
            setError(null);
            fetchGifts();
            fetchCategories();
          }}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          重試
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">禮品管理</h2>
        <div className="space-x-4">
          <button
            onClick={() => {
              setSelectedGift(null);
              setFormData({
                name: '',
                description: '',
                category_id: '',
                points_required: 0,
                stock_quantity: 0,
                status: 'active'
              });
              setIsModalOpen(true);
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            新增禮品
          </button>
          <button
            onClick={handleSeedGifts}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            生成示範禮品
          </button>
        </div>
      </div>

      {/* Gift Categories Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">禮品類別</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white p-4 rounded-lg shadow"
            >
              <h4 className="font-semibold">{category.name}</h4>
              <p className="text-gray-600">{category.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Gifts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gifts.map((gift) => (
          <div
            key={gift.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            {gift.image_url && (
              <img
                src={gift.image_url}
                alt={gift.name}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{gift.name}</h3>
              <p className="text-gray-600 mb-2">{gift.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-blue-500 font-semibold">
                  {gift.points_required} 點數
                </span>
                <span className={`px-2 py-1 rounded text-sm ${
                  gift.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {gift.status === 'active' ? '可兌換' : '已下架'}
                </span>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setSelectedGift(gift);
                    setFormData({
                      name: gift.name,
                      description: gift.description,
                      category_id: gift.category_id,
                      points_required: gift.points_required,
                      stock_quantity: gift.stock_quantity,
                      status: gift.status,
                      image_url: gift.image_url
                    });
                    setIsModalOpen(true);
                  }}
                  className="text-blue-500 hover:text-blue-600"
                >
                  編輯
                </button>
                <button
                  onClick={() => handleDeleteGift(gift.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  刪除
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Gift Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full">
            <h3 className="text-xl font-semibold mb-4">
              {selectedGift ? '編輯禮品' : '新增禮品'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  禮品名稱
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  描述
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows="3"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  類別
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) =>
                    setFormData({ ...formData, category_id: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">選擇類別</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  所需點數
                </label>
                <input
                  type="number"
                  value={formData.points_required}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      points_required: parseInt(e.target.value)
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  庫存數量
                </label>
                <input
                  type="number"
                  value={formData.stock_quantity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stock_quantity: parseInt(e.target.value)
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  狀態
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="active">可兌換</option>
                  <option value="inactive">已下架</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  禮品圖片
                </label>
                <ImageUpload
                  onUploadSuccess={handleImageUpload}
                  currentImage={formData.image_url}
                />
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  onClick={() =>
                    selectedGift
                      ? handleUpdateGift(selectedGift.id)
                      : handleCreateGift()
                  }
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  {selectedGift ? '更新' : '創建'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GiftManagement;