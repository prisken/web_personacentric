# Payment Reward System

## 🎁 **System Overview**

### **Payment Reward Feature**
- **Reward Amount**: 500 points per successful payment
- **Trigger**: Automatic upon payment confirmation
- **Scope**: All subscription payments (monthly, yearly, initial)
- **Tracking**: Full transaction history and audit trail
- **Notifications**: Real-time user notifications

---

## 💰 **Reward Structure**

### **Payment Types That Award Points**
| Payment Type | Points Awarded | Description |
|--------------|----------------|-------------|
| **Monthly Subscription** | 500 | HKD$10/month agent subscription |
| **Yearly Subscription** | 500 | Annual subscription payments |
| **Initial Setup** | 500 | First payment for new subscriptions |
| **Reactivation** | 500 | Payment after account suspension |
| **Upgrade Payment** | 500 | Payment for plan upgrades |

### **Payment Types That Do NOT Award Points**
| Payment Type | Reason |
|--------------|--------|
| **Failed Payments** | No reward for failed transactions |
| **Refunds** | Points deducted if payment refunded |
| **Admin-granted Access** | No payment involved - direct grant |
| **Access Code Usage** | No payment involved - admin-granted code |
| **Free Plans** | No payment required |
| **Unlimited Access Grants** | No payment involved - admin discretion |

---

## 🔧 **Technical Implementation**

### **Database Schema Updates**

#### **1. Payment Transactions Table**
```sql
-- Add reward tracking fields
ALTER TABLE payment_transactions 
ADD COLUMN points_awarded INTEGER DEFAULT 0,
ADD COLUMN reward_processed BOOLEAN DEFAULT false;
```

#### **2. Point Transactions Table**
```sql
-- Add payment reward transaction type
ALTER TABLE point_transactions 
ADD COLUMN payment_transaction_id UUID REFERENCES payment_transactions(id);

-- Update transaction type enum
ALTER TYPE transaction_type_enum 
ADD VALUE 'payment_reward';
```

### **Backend Implementation**

#### **1. Payment Processing Service**
```javascript
// services/paymentService.js
class PaymentService {
  async processPayment(paymentData) {
    try {
      // Process payment with payment gateway
      const paymentResult = await this.paymentGateway.process(paymentData);
      
      if (paymentResult.status === 'completed') {
        // Check if points should be awarded (only for actual payments)
        const pointsAwarded = await this.awardPaymentPoints(paymentResult.userId, paymentResult.transactionId);
        
        // Update payment transaction
        await this.updatePaymentTransaction(paymentResult.transactionId, {
          points_awarded: pointsAwarded ? 500 : 0,
          reward_processed: true
        });
      }
      
      return paymentResult;
    } catch (error) {
      console.error('Payment processing error:', error);
      throw error;
    }
  }

  async awardPaymentPoints(userId, paymentTransactionId) {
    try {
      // Check if this is a paid subscription (not admin-granted)
      const paymentTransaction = await this.getPaymentTransaction(paymentTransactionId);
      const user = await this.getUserById(userId);
      
      // Only award points for actual payments, not admin grants
      if (user.agent_access_type === 'unlimited' && user.unlimited_access_granted_via_code) {
        console.log('No points awarded for admin-granted access');
        return false;
      }
      
      // Create point transaction
      await this.pointService.createTransaction({
        user_id: userId,
        transaction_type: 'payment_reward',
        points_amount: 500,
        payment_transaction_id: paymentTransactionId,
        description: 'Payment reward - 500 points'
      });

      // Update user point balance
      await this.pointService.updateUserBalance(userId, 500);

      // Send notification
      await this.notificationService.sendPaymentRewardNotification(userId, 500);

      return true;
    } catch (error) {
      console.error('Error awarding payment points:', error);
      throw error;
    }
  }
}
```

#### **2. Point Service Enhancement**
```javascript
// services/pointService.js
class PointService {
  async createTransaction(transactionData) {
    const query = `
      INSERT INTO point_transactions (
        user_id, transaction_type, points_amount, 
        payment_transaction_id, description
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    
    const values = [
      transactionData.user_id,
      transactionData.transaction_type,
      transactionData.points_amount,
      transactionData.payment_transaction_id,
      transactionData.description
    ];

    const result = await db.query(query, values);
    return result.rows[0];
  }

  async updateUserBalance(userId, pointsToAdd) {
    const query = `
      UPDATE user_points 
      SET points_earned = points_earned + $1,
          points_balance = points_balance + $1,
          updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $2
    `;
    
    await db.query(query, [pointsToAdd, userId]);
  }
}
```

#### **3. Notification Service**
```javascript
// services/notificationService.js
class NotificationService {
  async sendPaymentRewardNotification(userId, pointsAwarded) {
    const user = await this.getUserById(userId);
    const language = user.language_preference || 'zh-TW';
    
    const notification = {
      user_id: userId,
      type: 'payment_reward',
      title: this.getTranslation('payment.rewardNotification', language),
      message: this.getTranslation('payment.rewardDescription', language),
      data: {
        points_awarded: pointsAwarded,
        transaction_type: 'payment_reward'
      },
      created_at: new Date()
    };

    await this.createNotification(notification);
    
    // Send real-time notification if user is online
    this.sendRealtimeNotification(userId, notification);
  }
}
```

### **Frontend Implementation**

#### **1. Payment Success Component**
```javascript
// components/payment/PaymentSuccess.js
import React, { useEffect, useState } from 'react';
import { useTranslation } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

const PaymentSuccess = ({ paymentData }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [showReward, setShowReward] = useState(false);

  useEffect(() => {
    if (paymentData.points_awarded > 0) {
      setShowReward(true);
      
      // Auto-hide reward notification after 5 seconds
      setTimeout(() => setShowReward(false), 5000);
    }
  }, [paymentData]);

  return (
    <div className="payment-success">
      <div className="success-icon">
        <i className="fas fa-check-circle"></i>
      </div>
      
      <h2>{t('payment.successful')}</h2>
      <p>{t('subscription.payment')} {paymentData.amount} {paymentData.currency}</p>
      
      {showReward && (
        <div className="reward-notification">
          <div className="reward-icon">
            <i className="fas fa-gift"></i>
          </div>
          <h3>{t('payment.reward')}</h3>
          <p className="points-earned">
            +{paymentData.points_awarded} {t('points.balance')}
          </p>
          <p>{t('payment.rewardDescription')}</p>
        </div>
      )}
      
      <div className="action-buttons">
        <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
          {t('dashboard.title')}
        </button>
        <button className="btn btn-secondary" onClick={() => navigate('/points/history')}>
          {t('points.history')}
        </button>
      </div>
    </div>
  );
};
```

#### **2. Point Balance Component Update**
```javascript
// components/points/PointBalance.js
import React, { useEffect, useState } from 'react';
import { useTranslation } from '../contexts/LanguageContext';

const PointBalance = ({ userId }) => {
  const { t } = useTranslation();
  const [pointData, setPointData] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    fetchPointData();
    fetchRecentTransactions();
  }, [userId]);

  const fetchRecentTransactions = async () => {
    try {
      const response = await api.get(`/points/transactions/${userId}?limit=5`);
      setRecentTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  return (
    <div className="point-balance">
      <div className="balance-card">
        <h3>{t('points.balance')}</h3>
        <div className="balance-amount">
          {pointData?.points_balance || 0}
        </div>
      </div>
      
      <div className="recent-transactions">
        <h4>{t('points.history')}</h4>
        {recentTransactions.map(transaction => (
          <div key={transaction.id} className="transaction-item">
            <div className="transaction-type">
              {transaction.transaction_type === 'payment_reward' && (
                <i className="fas fa-gift text-success"></i>
              )}
              {transaction.description}
            </div>
            <div className="transaction-amount">
              {transaction.transaction_type === 'payment_reward' ? '+' : ''}
              {transaction.points_amount}
            </div>
            <div className="transaction-date">
              {new Date(transaction.created_at).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
```

---

## 📊 **Analytics & Reporting**

### **Payment Reward Analytics**
```sql
-- Payment reward statistics
SELECT 
    DATE_TRUNC('month', payment_date) as month,
    COUNT(*) as total_payments,
    SUM(points_awarded) as total_points_awarded,
    AVG(points_awarded) as avg_points_per_payment
FROM payment_transactions 
WHERE status = 'completed' AND points_awarded > 0
GROUP BY DATE_TRUNC('month', payment_date)
ORDER BY month DESC;
```

### **User Payment Reward History**
```sql
-- User payment reward summary
SELECT 
    u.name,
    u.email,
    COUNT(pt.id) as total_payments,
    SUM(pt.points_awarded) as total_points_earned,
    MAX(pt.payment_date) as last_payment_date
FROM users u
JOIN payment_transactions pt ON u.id = pt.user_id
WHERE pt.status = 'completed' AND pt.points_awarded > 0
GROUP BY u.id, u.name, u.email
ORDER BY total_points_earned DESC;
```

---

## 🔔 **Notification System**

### **Payment Reward Notifications**
1. **Real-time Notification**: Immediate notification upon successful payment
2. **Email Notification**: Confirmation email with reward details
3. **In-app Notification**: Persistent notification in user dashboard
4. **SMS Notification**: Optional SMS for high-value rewards

### **Notification Content**
```javascript
// Notification templates
const notificationTemplates = {
  'zh-TW': {
    payment_reward: {
      title: '付款成功獎勵',
      message: '感謝您的付款！您已獲得500點數作為獎勵。',
      action: '查看點數歷史'
    }
  },
  'en': {
    payment_reward: {
      title: 'Payment Success Reward',
      message: 'Thank you for your payment! You have earned 500 points as a reward.',
      action: 'View Point History'
    }
  }
};
```

---

## 🎯 **Business Benefits**

### **User Engagement**
- **Incentivized Payments**: Users motivated to maintain subscriptions
- **Increased Retention**: Point rewards encourage continued usage
- **Positive Feedback**: Immediate reward creates positive experience
- **Gamification**: Points system adds game-like elements

### **Revenue Impact**
- **Reduced Churn**: Rewards may reduce subscription cancellations
- **Higher Satisfaction**: Users feel valued for their payments
- **Word-of-Mouth**: Satisfied users more likely to refer others
- **Data Insights**: Payment patterns provide valuable analytics

### **Platform Benefits**
- **User Loyalty**: Points create stickiness to platform
- **Feature Adoption**: Points encourage use of premium features
- **Community Building**: Points foster engagement and participation
- **Competitive Advantage**: Unique reward system differentiates platform

---

## 🔧 **Implementation Checklist**

### **Phase 1: Database Setup**
- [ ] Update payment_transactions table with reward fields
- [ ] Update point_transactions table with payment reference
- [ ] Add payment_reward transaction type
- [ ] Create database indexes for performance

### **Phase 2: Backend Implementation**
- [ ] Implement payment reward service
- [ ] Add point award logic to payment processing
- [ ] Create notification system for rewards
- [ ] Add payment reward analytics

### **Phase 3: Frontend Implementation**
- [ ] Create payment success component with reward display
- [ ] Update point balance component
- [ ] Add payment reward notifications
- [ ] Implement reward history tracking

### **Phase 4: Testing & Deployment**
- [ ] Unit tests for payment reward logic
- [ ] Integration tests for payment flow
- [ ] User acceptance testing
- [ ] Production deployment

---

## 💡 **Future Enhancements**

### **Advanced Reward Features**
- **Tiered Rewards**: Higher points for larger payments
- **Streak Bonuses**: Extra points for consecutive payments
- **Seasonal Promotions**: Special rewards during holidays
- **Referral Rewards**: Points for referring new subscribers

### **Analytics Enhancements**
- **Reward Impact Analysis**: Measure effect on retention
- **User Behavior Tracking**: Understand reward preferences
- **A/B Testing**: Test different reward amounts
- **Predictive Analytics**: Forecast reward impact

**This payment reward system creates a win-win scenario where users are incentivized to maintain subscriptions while the platform benefits from increased engagement and retention!** 