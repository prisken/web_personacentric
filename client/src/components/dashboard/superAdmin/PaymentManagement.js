import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useUser } from '../../../contexts/UserContext';

const PaymentManagement = () => {
  const { token } = useUser();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [refundReason, setRefundReason] = useState('');

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/super-admin/payments/transactions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Ensure transactions is always an array
      const transactionsData = response.data?.transactions || [];
      setTransactions(Array.isArray(transactionsData) ? transactionsData : []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setError(error.response?.data?.error || 'Failed to fetch transactions');
      setTransactions([]); // Set empty array on error
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleRefund = async () => {
    if (!selectedTransaction || !refundReason) return;

    try {
      await axios.post('/api/super-admin/payments/refund', {
        transactionId: selectedTransaction.id,
        reason: refundReason
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowRefundModal(false);
      setSelectedTransaction(null);
      setRefundReason('');
      fetchTransactions();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to process refund');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="payment-management">
      <h2>Payment Management</h2>
      
      <div className="transaction-list">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {(transactions || []).map(transaction => (
              <tr key={transaction.id}>
                <td>{`${transaction.user.first_name} ${transaction.user.last_name}`}</td>
                <td>{transaction.amount}</td>
                <td>{transaction.status}</td>
                <td>{new Date(transaction.created_at).toLocaleDateString()}</td>
                <td>
                  {transaction.status === 'COMPLETED' && (
                    <button
                      onClick={() => {
                        setSelectedTransaction(transaction);
                        setShowRefundModal(true);
                      }}
                      className="refund-button"
                    >
                      Refund
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showRefundModal && selectedTransaction && (
        <div className="modal">
          <div className="modal-content">
            <h3>Process Refund</h3>
            <div className="transaction-details">
              <p>
                <strong>User:</strong>
                {` ${selectedTransaction.user.first_name} ${selectedTransaction.user.last_name}`}
              </p>
              <p>
                <strong>Amount:</strong>
                {` ${selectedTransaction.amount}`}
              </p>
              <p>
                <strong>Date:</strong>
                {` ${new Date(selectedTransaction.created_at).toLocaleDateString()}`}
              </p>
            </div>
            <div className="form-group">
              <label>Refund Reason</label>
              <textarea
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                required
              />
            </div>
            <div className="button-group">
              <button 
                onClick={handleRefund}
                disabled={!refundReason}
              >
                Confirm Refund
              </button>
              <button onClick={() => setShowRefundModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentManagement;
