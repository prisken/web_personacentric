import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useUser } from '../../../contexts/UserContext';

const PointManagement = () => {
  const { token } = useUser();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAwardModal, setShowAwardModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [points, setPoints] = useState('');
  const [reason, setReason] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

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
      <h2>Points Management</h2>
      
      <button
        onClick={() => setShowAwardModal(true)}
        className="award-button"
      >
        Award Points
      </button>

      <div className="transaction-list">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Reason</th>
              <th>Date</th>
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
            <h3>Award Points</h3>
            <div className="form-group">
              <label>Select User</label>
              <select
                value={selectedUser?.id || ''}
                onChange={(e) => {
                  const user = transactions.find(t => t.user.id === e.target.value)?.user;
                  setSelectedUser(user);
                }}
              >
                <option value="">Select User</option>
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
              <label>Points</label>
              <input
                type="number"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                min="0"
              />
            </div>
            <div className="form-group">
              <label>Reason</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
            <div className="button-group">
              <button onClick={handleAwardPoints}>
                Award Points
              </button>
              <button onClick={handleDeductPoints}>
                Deduct
              </button>
              <button onClick={() => setShowAwardModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PointManagement;
