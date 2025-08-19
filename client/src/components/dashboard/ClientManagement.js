import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';

const ClientManagement = ({ onRefresh }) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [newClientData, setNewClientData] = useState({
    client_id: '',
    commission_rate: 0.10,
    notes: '',
    client_goals: { primary_goal: '', secondary_goals: [] },
    risk_tolerance: 'moderate',
    investment_horizon: 'medium_term'
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAgentClients();
      if (response.success) {
        setClients(response.relationships);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClient = async () => {
    try {
      await apiService.addClient(newClientData);
      setShowAddModal(false);
      setNewClientData({
        client_id: '',
        commission_rate: 0.10,
        notes: '',
        client_goals: { primary_goal: '', secondary_goals: [] },
        risk_tolerance: 'moderate',
        investment_horizon: 'medium_term'
      });
      fetchClients();
      onRefresh();
    } catch (error) {
      console.error('Error adding client:', error);
      alert('Failed to add client');
    }
  };

  const handleUpdateClient = async (clientId, updateData) => {
    try {
      await apiService.updateClient(clientId, updateData);
      setShowDetailsModal(false);
      setSelectedClient(null);
      fetchClients();
      onRefresh();
    } catch (error) {
      console.error('Error updating client:', error);
      alert('Failed to update client');
    }
  };

  const handleRemoveClient = async (clientId) => {
    if (!window.confirm('確定要移除這個客戶關係嗎？')) {
      return;
    }

    try {
      await apiService.removeClient(clientId);
      fetchClients();
      onRefresh();
    } catch (error) {
      console.error('Error removing client:', error);
      alert('Failed to remove client');
    }
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.client.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.client.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || client.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'HKD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('zh-TW');
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">客戶管理</h2>
          <p className="text-gray-600 mt-1">管理您的客戶關係和佣金</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + 新增客戶
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="搜尋客戶姓名或電子郵件..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">所有狀態</option>
          <option value="active">活躍</option>
          <option value="inactive">非活躍</option>
          <option value="pending">待處理</option>
        </select>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((relationship) => (
          <div key={relationship.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="p-6">
              {/* Client Info */}
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-lg font-semibold text-blue-600">
                    {relationship.client.first_name.charAt(0)}{relationship.client.last_name.charAt(0)}
                  </span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {relationship.client.first_name} {relationship.client.last_name}
                  </h3>
                  <p className="text-sm text-gray-500">{relationship.client.email}</p>
                </div>
              </div>

              {/* Status and Commission */}
              <div className="flex justify-between items-center mb-4">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  relationship.status === 'active' ? 'bg-green-100 text-green-800' :
                  relationship.status === 'inactive' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {relationship.status === 'active' ? '活躍' : 
                   relationship.status === 'inactive' ? '非活躍' : '待處理'}
                </span>
                <span className="text-sm font-medium text-gray-900">
                  佣金: {formatCurrency(relationship.total_commission)}
                </span>
              </div>

              {/* Relationship Details */}
              <div className="space-y-2 mb-4">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">佣金率:</span> {(relationship.commission_rate * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">開始日期:</span> {formatDate(relationship.relationship_start_date)}
                </div>
                {relationship.last_contact_date && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">最後聯繫:</span> {formatDate(relationship.last_contact_date)}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setSelectedClient(relationship);
                    setShowDetailsModal(true);
                  }}
                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                >
                  查看詳情
                </button>
                <button
                  onClick={() => handleRemoveClient(relationship.client.id)}
                  className="bg-red-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors"
                >
                  移除
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredClients.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm || filterStatus !== 'all' ? '沒有找到符合條件的客戶' : '暫無客戶'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || filterStatus !== 'all' ? '請嘗試調整搜尋條件' : '開始新增您的第一個客戶關係'}
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              新增客戶
            </button>
          </div>
        </div>
      )}

      {/* Add Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">新增客戶關係</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">客戶 ID</label>
                <input
                  type="text"
                  value={newClientData.client_id}
                  onChange={(e) => setNewClientData({...newClientData, client_id: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="輸入客戶 ID"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">佣金率 (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={newClientData.commission_rate * 100}
                  onChange={(e) => setNewClientData({...newClientData, commission_rate: parseFloat(e.target.value) / 100})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">備註</label>
                <textarea
                  value={newClientData.notes}
                  onChange={(e) => setNewClientData({...newClientData, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="客戶關係備註..."
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                取消
              </button>
              <button
                onClick={handleAddClient}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                新增
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Client Details Modal */}
      {showDetailsModal && selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {selectedClient.client.first_name} {selectedClient.client.last_name} - 詳細資料
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">基本資訊</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">姓名:</span> {selectedClient.client.first_name} {selectedClient.client.last_name}</div>
                  <div><span className="font-medium">電子郵件:</span> {selectedClient.client.email}</div>
                  <div><span className="font-medium">狀態:</span> {selectedClient.status}</div>
                  <div><span className="font-medium">佣金率:</span> {(selectedClient.commission_rate * 100).toFixed(1)}%</div>
                  <div><span className="font-medium">總佣金:</span> {formatCurrency(selectedClient.total_commission)}</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">關係資訊</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">開始日期:</span> {formatDate(selectedClient.relationship_start_date)}</div>
                  <div><span className="font-medium">最後聯繫:</span> {selectedClient.last_contact_date ? formatDate(selectedClient.last_contact_date) : '無'}</div>
                  <div><span className="font-medium">風險承受度:</span> {selectedClient.risk_tolerance}</div>
                  <div><span className="font-medium">投資期限:</span> {selectedClient.investment_horizon}</div>
                </div>
              </div>
            </div>

            {selectedClient.notes && (
              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-2">備註</h4>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {selectedClient.notes}
                </p>
              </div>
            )}

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                關閉
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientManagement; 