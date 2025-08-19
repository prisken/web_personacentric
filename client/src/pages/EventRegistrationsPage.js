import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';
import apiService from '../services/api';

const EventRegistrationsPage = () => {
  const { t, language } = useLanguage();
  const { user } = useUser();
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    // Check if user is admin
    if (user && user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }

    if (id) {
      fetchEventDetails();
      fetchEventRegistrations();
    }
  }, [user, id, navigate]);

  const fetchEventDetails = async () => {
    try {
      const response = await apiService.getEvent(id);
      if (response.success) {
        setEvent(response.event);
      }
    } catch (error) {
      console.error('Failed to fetch event details:', error);
    }
  };

  const fetchEventRegistrations = async () => {
    try {
      setLoading(true);
      const response = await apiService.get(`/events/${id}/registrations`);
      if (response.success) {
        setRegistrations(response.registrations || []);
      }
    } catch (error) {
      console.error('Failed to fetch event registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(language === 'zh-TW' ? 'zh-TW' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      registered: { color: 'bg-green-100 text-green-800', text: '已註冊' },
      cancelled: { color: 'bg-red-100 text-red-800', text: '已取消' },
      attended: { color: 'bg-blue-100 text-blue-800', text: '已參加' },
      no_show: { color: 'bg-yellow-100 text-yellow-800', text: '未出席' }
    };
    
    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', text: status };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      client: { color: 'bg-purple-100 text-purple-800', text: '客戶' },
      agent: { color: 'bg-blue-100 text-blue-800', text: '顧問' },
      admin: { color: 'bg-red-100 text-red-800', text: '管理員' }
    };
    
    const config = roleConfig[role] || { color: 'bg-gray-100 text-gray-800', text: role };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="pt-16 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="pt-16 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">活動不存在</h1>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              返回儀表板
            </button>
          </div>
        </div>
      </div>
    );
  }

  const clientRegistrations = registrations.filter(reg => reg.user?.role === 'client');
  const agentRegistrations = registrations.filter(reg => reg.user?.role === 'agent');

  return (
    <div className="pt-16 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => navigate('/dashboard')}
                className="text-blue-600 hover:text-blue-800 mb-4 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                返回儀表板
              </button>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">活動註冊詳情</h1>
              <p className="text-lg text-gray-600">{event.title}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">總註冊數</p>
              <p className="text-2xl font-bold text-blue-600">{registrations.length}</p>
            </div>
          </div>
        </div>

        {/* Event Details Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">活動資訊</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>日期：</strong>{formatDate(event.start_date)}</p>
                <p><strong>地點：</strong>{event.location || '未指定'}</p>
                <p><strong>類型：</strong>{event.event_type}</p>
                <p><strong>狀態：</strong>{event.status}</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">註冊統計</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>客戶註冊：</strong>{clientRegistrations.length}</p>
                <p><strong>顧問註冊：</strong>{agentRegistrations.length}</p>
                <p><strong>容量：</strong>{event.current_participants || 0} / {event.max_participants || '無限制'}</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">獎勵資訊</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>價格：</strong>{event.price === 0 ? '免費' : `HKD ${event.price}`}</p>
                <p><strong>積分獎勵：</strong>{event.points_reward || 0} 積分</p>
              </div>
            </div>
          </div>
        </div>

        {/* Registrations List */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">註冊列表</h2>
          </div>
          
          {registrations.length === 0 ? (
            <div className="p-8 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-gray-500">暫無註冊記錄</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      用戶
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      角色
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      註冊狀態
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      註冊時間
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      出席狀態
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      評分
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {registrations.map((registration) => (
                    <tr key={registration.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-700">
                                {registration.user?.first_name?.charAt(0) || 'U'}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {registration.user?.first_name} {registration.user?.last_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {registration.user?.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getRoleBadge(registration.user?.role)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(registration.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(registration.registration_date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {registration.attendance_date ? (
                          <span className="text-green-600 text-sm">已出席</span>
                        ) : (
                          <span className="text-gray-400 text-sm">未記錄</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {registration.rating ? (
                          <div className="flex items-center">
                            <span className="text-sm text-gray-900 mr-1">{registration.rating}</span>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <svg
                                  key={star}
                                  className={`h-4 w-4 ${
                                    star <= registration.rating ? 'text-yellow-400' : 'text-gray-300'
                                  }`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">未評分</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventRegistrationsPage; 