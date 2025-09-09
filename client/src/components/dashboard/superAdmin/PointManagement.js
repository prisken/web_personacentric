import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useAuth } from '../../../contexts/AuthContext';

const PointManagement = () => {
  const { t } = useTranslation();
  const { token } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAwardModal, setShowAwardModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [points, setPoints] = useState('');
  const [reason, setReason] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('/api/super-admin/points/transactions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransactions(response.data.transactions);
      setLoading(false);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to fetch transactions');
      setLoading(false);
    }
  };

  const handleAwardPoints = async () => {
    if (!selectedUser || !points || !reason) return;

    try {
      await axios.post('/api/super-admin/points/award', {
        userId: selectedUser.id,
        points: parseInt(points),
        reason
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowAwardModal(false);
      setSelectedUser(null);
      setPoints('');
      setReason('');
      fetchTransactions();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to award points');
    }
  };

  const handleDeductPoints = async () => {
    if (!selectedUser || !points || !reason) return;

    try {
      await axios.post('/api/super-admin/points/deduct', {
        userId: selectedUser.id,
        points: parseInt(points),
        reason
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowAwardModal(false);
      setSelectedUser(null);
      setPoints('');
      setReason('');
      fetchTransactions();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to deduct points');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="point-management">
      <h2>{t('superAdmin.points.title')}</h2>
      
      <button
        onClick={() => setShowAwardModal(true)}
        className="award-button"
      >
        {t('superAdmin.points.award')}
      </button>

      <div className="transaction-list">
        <table>
          <thead>
            <tr>
              <th>{t('superAdmin.points.user')}</th>
              <th>{t('superAdmin.points.amount')}</th>
              <th>{t('superAdmin.points.type')}</th>
              <th>{t('superAdmin.points.reason')}</th>
              <th>{t('superAdmin.points.date')}</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(transaction => (
              <tr key={transaction.id}>
                <td>{`${transaction.user.first_name} ${transaction.user.last_name}`}</td>
                <td className={transaction.points >= 0 ? 'positive' : 'negative'}>
                  {transaction.points}
                </td>
                <td>{transaction.transaction_type}</td>
                <td>{transaction.description}</td>
                <td>{new Date(transaction.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAwardModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{t('superAdmin.points.awardPoints')}</h3>
            <div className="form-group">
              <label>{t('superAdmin.points.selectUser')}</label>
              <select
                value={selectedUser?.id || ''}
                onChange={(e) => {
                  const user = transactions.find(t => t.user.id === e.target.value)?.user;
                  setSelectedUser(user);
                }}
              >
                <option value="">{t('superAdmin.points.selectUser')}</option>
                {Array.from(new Set(transactions.map(t => t.user.id))).map(userId => {
                  const user = transactions.find(t => t.user.id === userId)?.user;
                  return (
                    <option key={userId} value={userId}>
                      {`${user.first_name} ${user.last_name}`}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="form-group">
              <label>{t('superAdmin.points.points')}</label>
              <input
                type="number"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                min="0"
              />
            </div>
            <div className="form-group">
              <label>{t('superAdmin.points.reason')}</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
            <div className="button-group">
              <button onClick={handleAwardPoints}>
                {t('superAdmin.points.award')}
              </button>
              <button onClick={handleDeductPoints}>
                {t('superAdmin.points.deduct')}
              </button>
              <button onClick={() => setShowAwardModal(false)}>
                {t('common.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PointManagement;
