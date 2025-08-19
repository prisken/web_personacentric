import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';

const AgentRelationshipManagement = () => {
  const [relationships, setRelationships] = useState([]);
  const [clientId, setClientId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRelationships();
  }, []);

  const fetchRelationships = async () => {
    try {
      setLoading(true);
      const response = await apiService.getClientRelationships();
      if (response.success) {
        setRelationships(response.relationships);
        setClientId(response.client_id);
      }
    } catch (error) {
      console.error('Error fetching relationships:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmRelationship = async (relationshipId) => {
    try {
      const response = await apiService.confirmRelationship(relationshipId);
      if (response.success) {
        fetchRelationships(); // Refresh the list
        alert('已成功確認代理人關係！');
      }
    } catch (error) {
      console.error('Error confirming relationship:', error);
      alert('確認關係失敗，請稍後再試。');
    }
  };

  const handleRejectRelationship = async (relationshipId) => {
    if (!window.confirm('確定要拒絕這個代理人關係嗎？')) {
      return;
    }

    try {
      const response = await apiService.rejectRelationship(relationshipId);
      if (response.success) {
        fetchRelationships(); // Refresh the list
        alert('已拒絕代理人關係。');
      }
    } catch (error) {
      console.error('Error rejecting relationship:', error);
      alert('拒絕關係失敗，請稍後再試。');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { text: '待確認', color: 'bg-yellow-100 text-yellow-800' },
      active: { text: '已確認', color: 'bg-green-100 text-green-800' },
      rejected: { text: '已拒絕', color: 'bg-red-100 text-red-800' },
      inactive: { text: '已停用', color: 'bg-gray-100 text-gray-800' }
    };

    const config = statusConfig[status] || statusConfig.inactive;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const copyClientId = () => {
    if (clientId) {
      navigator.clipboard.writeText(clientId);
      alert('邀請碼已複製到剪貼板！');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const pendingRelationships = relationships.filter(r => r.status === 'pending');
  const activeRelationships = relationships.filter(r => r.status === 'active');
  const otherRelationships = relationships.filter(r => !['pending', 'active'].includes(r.status));

  return (
    <div className="space-y-6">
      {/* Client ID Display */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">您的邀請碼</h3>
        <div className="flex items-center space-x-3">
          <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 font-mono text-lg font-bold">
            {clientId || '尚未生成'}
          </div>
          {clientId && (
            <button
              onClick={copyClientId}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              📋 複製
            </button>
          )}
        </div>
        <p className="text-sm text-gray-600 mt-2">
          將此邀請碼提供給您的代理人，他們可以使用此碼建立代理關係。
        </p>
      </div>

      {/* Pending Requests */}
      {pendingRelationships.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
            待確認的代理人關係 ({pendingRelationships.length})
          </h3>
          <div className="space-y-4">
            {pendingRelationships.map((relationship) => (
              <div
                key={relationship.id}
                className="border border-yellow-200 rounded-lg p-4 bg-yellow-50"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      {relationship.agent.first_name} {relationship.agent.last_name}
                    </h4>
                    <p className="text-sm text-gray-600">{relationship.agent.email}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      申請時間: {new Date(relationship.requested_at).toLocaleString('zh-TW')}
                    </p>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleConfirmRelationship(relationship.id)}
                      className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
                    >
                      確認
                    </button>
                    <button
                      onClick={() => handleRejectRelationship(relationship.id)}
                      className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                    >
                      拒絕
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Relationships */}
      {activeRelationships.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
            活躍的代理人關係 ({activeRelationships.length})
          </h3>
          <div className="space-y-4">
            {activeRelationships.map((relationship) => (
              <div
                key={relationship.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">
                        {relationship.agent.first_name} {relationship.agent.last_name}
                      </h4>
                      {getStatusBadge(relationship.status)}
                    </div>
                    <p className="text-sm text-gray-600">{relationship.agent.email}</p>
                    <div className="text-xs text-gray-500 mt-1 grid grid-cols-2 gap-2">
                      <span>開始時間: {new Date(relationship.relationship_start_date).toLocaleDateString('zh-TW')}</span>
                      <span>佣金率: {(relationship.commission_rate * 100).toFixed(1)}%</span>
                    </div>
                    {relationship.notes && (
                      <p className="text-sm text-gray-700 mt-2 bg-gray-100 p-2 rounded">
                        {relationship.notes}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Other Relationships (Rejected/Inactive) */}
      {otherRelationships.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">歷史記錄</h3>
          <div className="space-y-2">
            {otherRelationships.map((relationship) => (
              <div
                key={relationship.id}
                className="border border-gray-200 rounded-lg p-3 bg-gray-50"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium text-gray-700">
                      {relationship.agent.first_name} {relationship.agent.last_name}
                    </span>
                    <span className="text-sm text-gray-500 ml-2">
                      ({relationship.agent.email})
                    </span>
                  </div>
                  {getStatusBadge(relationship.status)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {relationships.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🤝</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">暂无代理人關係</h3>
          <p className="text-gray-500">
            將您的邀請碼分享給代理人，他們可以申請建立代理關係。
          </p>
        </div>
      )}
    </div>
  );
};

export default AgentRelationshipManagement;