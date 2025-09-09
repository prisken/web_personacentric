import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import UserManagement from './superAdmin/UserManagement';
import PointManagement from './superAdmin/PointManagement';
import PaymentManagement from './superAdmin/PaymentManagement';
import AdminManagement from './superAdmin/AdminManagement';

const SuperAdminDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('users');

  // Verify super admin access
  useEffect(() => {
    if (user?.role !== 'super_admin') {
      window.location.href = '/';
    }
  }, [user]);

  return (
    <div className="super-admin-dashboard">
      <div className="dashboard-header">
        <h1>{t('superAdmin.dashboard.title')}</h1>
        <div className="role-badge super-admin">Super Admin</div>
      </div>
      
      <div className="dashboard-tabs">
        <button 
          className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          {t('superAdmin.tabs.users')}
        </button>
        <button 
          className={`tab-button ${activeTab === 'points' ? 'active' : ''}`}
          onClick={() => setActiveTab('points')}
        >
          {t('superAdmin.tabs.points')}
        </button>
        <button 
          className={`tab-button ${activeTab === 'payments' ? 'active' : ''}`}
          onClick={() => setActiveTab('payments')}
        >
          {t('superAdmin.tabs.payments')}
        </button>
        <button 
          className={`tab-button ${activeTab === 'admins' ? 'active' : ''}`}
          onClick={() => setActiveTab('admins')}
        >
          {t('superAdmin.tabs.admins')}
        </button>
      </div>
      
      <div className="dashboard-content">
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'points' && <PointManagement />}
        {activeTab === 'payments' && <PaymentManagement />}
        {activeTab === 'admins' && <AdminManagement />}
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
