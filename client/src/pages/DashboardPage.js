import React, { useEffect, useState } from 'react';
import { useTranslation } from '../contexts/LanguageContext';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import AgentDashboard from '../components/dashboard/AgentDashboard';
import ClientDashboard from '../components/dashboard/ClientDashboard';
import LoadingSpinner from '../components/LoadingSpinner';
import apiService from '../services/api';

const DashboardPage = () => {
  const { t } = useTranslation();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getDashboard();
      setDashboardData(response.data);
    } catch (error) {
      console.error('Dashboard error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {t('dashboard.error')}
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            {t('common.retry')}
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {t('dashboard.noData')}
          </h2>
        </div>
      </div>
    );
  }

  // Render role-specific dashboard
  const renderDashboard = () => {
    switch (dashboardData.user.role) {
      case 'admin':
        return <AdminDashboard data={dashboardData} onRefresh={fetchDashboardData} />;
      case 'agent':
        return <AgentDashboard data={dashboardData} onRefresh={fetchDashboardData} />;
      case 'client':
        return <ClientDashboard data={dashboardData} onRefresh={fetchDashboardData} />;
      default:
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t('dashboard.unknownRole')}
            </h2>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderDashboard()}
    </div>
  );
};

export default DashboardPage; 