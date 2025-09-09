import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useAuth } from '../../../contexts/AuthContext';

const PaymentManagement = () => {
  const { t } = useTranslation();
  const { token } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [refundReason, setRefundReason] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('/api/super-admin/payments/transactions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransactions(response.data.transactions);
      setLoading(false);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to fetch transactions');
      setLoading(false);
    }
  };

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
      <h2>{t('superAdmin.payments.title')}</h2>
      
      <div className="transaction-list">
        <table>
          <thead>
            <tr>
              <th>{t('superAdmin.payments.user')}</th>
              <th>{t('superAdmin.payments.amount')}</th>
              <th>{t('superAdmin.payments.status')}</th>
              <th>{t('superAdmin.payments.date')}</th>
              <th>{t('superAdmin.payments.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(transaction => (
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
                      {t('superAdmin.payments.refund')}
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
            <h3>{t('superAdmin.payments.processRefund')}</h3>
            <div className="transaction-details">
              <p>
                <strong>{t('superAdmin.payments.user')}:</strong>
                {` ${selectedTransaction.user.first_name} ${selectedTransaction.user.last_name}`}
              </p>
              <p>
                <strong>{t('superAdmin.payments.amount')}:</strong>
                {` ${selectedTransaction.amount}`}
              </p>
              <p>
                <strong>{t('superAdmin.payments.date')}:</strong>
                {` ${new Date(selectedTransaction.created_at).toLocaleDateString()}`}
              </p>
            </div>
            <div className="form-group">
              <label>{t('superAdmin.payments.refundReason')}</label>
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
                {t('superAdmin.payments.confirmRefund')}
              </button>
              <button onClick={() => setShowRefundModal(false)}>
                {t('common.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentManagement;
