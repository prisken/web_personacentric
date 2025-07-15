# Access Code System for Unlimited Agent Access

## 🔐 **System Overview**

### **Access Code Feature**
- **Code Format**: 6-digit alphanumeric codes
- **Usage**: One-time use for unlimited agent access
- **Generation**: Admin-generated with expiration
- **Scope**: Bypass payment requirement for agent features
- **Security**: Unique, non-reusable codes with audit trail

---

## 🎯 **User Journey Flow**

### **Agent Signup Process**
```
1. Agent Registration
   ├── Normal signup process
   ├── Email verification
   └── Profile completion

2. Agent Features Selection
   ├── Choose agent role
   ├── View feature comparison
   └── Select access method

3. Payment Screen Options
   ├── Option A: Pay HKD$10/month
   ├── Option B: Request unlimited access
   └── Option C: Use access code

4. Access Code Request
   ├── Submit request to admin
   ├── Admin review process
   └── Code generation and delivery

5. Code Usage
   ├── Enter 6-digit code
   ├── Validation and activation
   └── Unlimited access granted
```

---

## 💻 **Technical Implementation**

### **Database Schema Updates**

#### **1. Access Codes Table**
```sql
CREATE TABLE access_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(6) UNIQUE NOT NULL,
    generated_by UUID REFERENCES users(id) NOT NULL,
    generated_for UUID REFERENCES users(id),
    status ENUM('active', 'used', 'expired', 'revoked') DEFAULT 'active',
    access_type ENUM('unlimited', 'temporary', 'trial') DEFAULT 'unlimited',
    expires_at TIMESTAMP,
    used_at TIMESTAMP,
    used_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### **2. Access Code Requests Table**
```sql
CREATE TABLE access_code_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requester_id UUID REFERENCES users(id) NOT NULL,
    contact_name VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    request_reason TEXT,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMP,
    admin_notes TEXT,
    access_code_id UUID REFERENCES access_codes(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### **3. Update Users Table**
```sql
-- Add access code tracking to users table
ALTER TABLE users 
ADD COLUMN access_code_used UUID REFERENCES access_codes(id),
ADD COLUMN unlimited_access_granted_via_code BOOLEAN DEFAULT false;
```

### **Backend Implementation**

#### **1. Access Code Generation Service**
```javascript
// services/accessCodeService.js
class AccessCodeService {
  generateAccessCode(adminId, userId = null, options = {}) {
    const code = this.generateUniqueCode();
    const expiresAt = options.expiresAt || this.getDefaultExpiration();
    
    const accessCode = {
      code: code,
      generated_by: adminId,
      generated_for: userId,
      access_type: options.accessType || 'unlimited',
      expires_at: expiresAt,
      status: 'active'
    };

    return this.createAccessCode(accessCode);
  }

  generateUniqueCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code;
    let isUnique = false;
    
    do {
      code = '';
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      isUnique = await this.isCodeUnique(code);
    } while (!isUnique);
    
    return code;
  }

  async validateAndUseCode(code, userId) {
    const accessCode = await this.getAccessCodeByCode(code);
    
    if (!accessCode) {
      throw new Error('Invalid access code');
    }
    
    if (accessCode.status !== 'active') {
      throw new Error('Access code is not active');
    }
    
    if (accessCode.expires_at && new Date() > accessCode.expires_at) {
      throw new Error('Access code has expired');
    }
    
    if (accessCode.used_by) {
      throw new Error('Access code has already been used');
    }
    
    // Use the code
    await this.useAccessCode(accessCode.id, userId);
    
    // Grant unlimited access to user
    await this.grantUnlimitedAccess(userId, accessCode.id);
    
    return accessCode;
  }

  async useAccessCode(codeId, userId) {
    const query = `
      UPDATE access_codes 
      SET status = 'used',
          used_at = CURRENT_TIMESTAMP,
          used_by = $1,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
    `;
    
    await db.query(query, [userId, codeId]);
  }

  async grantUnlimitedAccess(userId, accessCodeId) {
    const query = `
      UPDATE users 
      SET agent_access_type = 'unlimited',
          unlimited_access_granted_by = (SELECT generated_by FROM access_codes WHERE id = $1),
          unlimited_access_granted_at = CURRENT_TIMESTAMP,
          access_code_used = $1,
          unlimited_access_granted_via_code = true,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
    `;
    
    await db.query(query, [accessCodeId, userId]);
    
    // Note: No points awarded for admin-granted access
    console.log(`Unlimited access granted to user ${userId} via access code - no points awarded`);
  }
}
```

#### **2. Access Code Request Service**
```javascript
// services/accessCodeRequestService.js
class AccessCodeRequestService {
  async createRequest(requestData) {
    const query = `
      INSERT INTO access_code_requests (
        requester_id, contact_name, contact_phone, contact_email, request_reason, status
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    
    const values = [
      requestData.requester_id,
      requestData.contact_name,
      requestData.contact_phone,
      requestData.contact_email,
      requestData.request_reason,
      'pending'
    ];

    const result = await db.query(query, values);
    return result.rows[0];
  }

  async approveRequest(requestId, adminId, adminNotes = '') {
    // Generate access code
    const accessCode = await this.accessCodeService.generateAccessCode(adminId);
    
    // Update request status
    const query = `
      UPDATE access_code_requests 
      SET status = 'approved',
          reviewed_by = $1,
          reviewed_at = CURRENT_TIMESTAMP,
          admin_notes = $2,
          access_code_id = $3,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
    `;
    
    await db.query(query, [adminId, adminNotes, accessCode.id, requestId]);
    
    // Send notification to requester
    await this.notificationService.sendAccessCodeApprovedNotification(
      requestId, accessCode.code
    );
    
    return accessCode;
  }

  async rejectRequest(requestId, adminId, adminNotes = '') {
    const query = `
      UPDATE access_code_requests 
      SET status = 'rejected',
          reviewed_by = $1,
          reviewed_at = CURRENT_TIMESTAMP,
          admin_notes = $2,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
    `;
    
    await db.query(query, [adminId, adminNotes, requestId]);
    
    // Send notification to requester
    await this.notificationService.sendAccessCodeRejectedNotification(requestId);
  }
}
```

#### **3. Payment Screen Service**
```javascript
// services/paymentScreenService.js
class PaymentScreenService {
  async getPaymentOptions(userId) {
    const user = await this.getUserById(userId);
    
    return {
      paidSubscription: {
        title: 'HKD$10/month',
        description: 'Standard agent subscription',
        features: ['CRM', 'AI Content', 'Marketing', 'Analytics'],
        price: 10.00,
        currency: 'HKD',
        billingCycle: 'monthly'
      },
      unlimitedAccess: {
        title: 'Request Unlimited Access',
        description: 'Request free unlimited access from admin',
        features: ['All agent features', 'No payment required', 'Admin approval needed'],
        requestRequired: true
      },
      accessCode: {
        title: 'Use Access Code',
        description: 'Enter 6-digit code for unlimited access',
        features: ['Immediate activation', 'No payment required'],
        codeRequired: true
      }
    };
  }

  async requestUnlimitedAccess(userId, requestReason) {
    const request = await this.accessCodeRequestService.createRequest({
      requester_id: userId,
      request_reason: requestReason
    });
    
    // Notify admins of new request
    await this.notificationService.notifyAdminsOfAccessRequest(request);
    
    return request;
  }

  async validateAccessCode(code, userId) {
    try {
      const accessCode = await this.accessCodeService.validateAndUseCode(code, userId);
      
      // Send success notification
      await this.notificationService.sendAccessCodeUsedNotification(userId, accessCode);
      
      return {
        success: true,
        message: 'Access code applied successfully',
        accessCode: accessCode
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }
}
```

### **Frontend Implementation**

#### **1. Payment Options Component**
```javascript
// components/payment/PaymentOptions.js
import React, { useState } from 'react';
import { useTranslation } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

const PaymentOptions = ({ onOptionSelect }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [selectedOption, setSelectedOption] = useState(null);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [showCodeForm, setShowCodeForm] = useState(false);
  const [requestReason, setRequestReason] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    
    if (option === 'unlimited') {
      setShowRequestForm(true);
    } else if (option === 'code') {
      setShowCodeForm(true);
    } else {
      onOptionSelect(option);
    }
  };

  const isFormValid = () => {
    return contactName.trim() && 
           contactPhone.trim() && 
           contactEmail.trim() && 
           requestReason.trim() &&
           /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail);
  };

  const handleRequestSubmit = async () => {
    if (!isFormValid()) {
      showNotification('error', t('accessCode.requestForm.validationError'));
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/access-codes/request', {
        contact_name: contactName.trim(),
        contact_phone: contactPhone.trim(),
        contact_email: contactEmail.trim(),
        request_reason: requestReason.trim()
      });
      
      // Show success message
      showNotification('success', t('accessCode.requestSubmitted'));
      setShowRequestForm(false);
      
      // Reset form
      setContactName('');
      setContactPhone('');
      setContactEmail('');
      setRequestReason('');
    } catch (error) {
      showNotification('error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCodeSubmit = async () => {
    setLoading(true);
    try {
      const response = await api.post('/access-codes/validate', {
        code: accessCode
      });
      
      if (response.data.success) {
        showNotification('success', t('accessCode.codeApplied'));
        onOptionSelect('code_success');
      } else {
        showNotification('error', response.data.message);
      }
    } catch (error) {
      showNotification('error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-options">
      <h2>{t('payment.selectOption')}</h2>
      
      <div className="options-grid">
        {/* Paid Subscription Option */}
        <div className="option-card">
          <h3>{t('subscription.paid')}</h3>
          <div className="price">HKD$10/month</div>
          <ul className="features">
            <li>{t('subscription.feature.crm')}</li>
            <li>{t('subscription.feature.aiContent')}</li>
            <li>{t('subscription.feature.marketing')}</li>
            <li>{t('subscription.feature.analytics')}</li>
          </ul>
          <button 
            className="btn btn-primary"
            onClick={() => handleOptionSelect('paid')}
          >
            {t('payment.selectPaid')}
          </button>
        </div>

        {/* Unlimited Access Request Option */}
        <div className="option-card">
          <h3>{t('accessCode.requestUnlimited')}</h3>
          <div className="price">{t('subscription.free')}</div>
          <ul className="features">
            <li>{t('accessCode.feature.allAgent')}</li>
            <li>{t('accessCode.feature.noPayment')}</li>
            <li>{t('accessCode.feature.adminApproval')}</li>
          </ul>
          <button 
            className="btn btn-secondary"
            onClick={() => handleOptionSelect('unlimited')}
          >
            {t('accessCode.requestAccess')}
          </button>
        </div>

        {/* Access Code Option */}
        <div className="option-card">
          <h3>{t('accessCode.useCode')}</h3>
          <div className="price">{t('subscription.free')}</div>
          <ul className="features">
            <li>{t('accessCode.feature.immediate')}</li>
            <li>{t('accessCode.feature.noPayment')}</li>
            <li>{t('accessCode.feature.codeRequired')}</li>
          </ul>
          <button 
            className="btn btn-secondary"
            onClick={() => handleOptionSelect('code')}
          >
            {t('accessCode.enterCode')}
          </button>
        </div>
      </div>

      {/* Request Form Modal */}
      {showRequestForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{t('accessCode.requestForm.title')}</h3>
            
            {/* Contact Information Fields */}
            <div className="form-group">
              <label>{t('accessCode.requestForm.contactName')}</label>
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder={t('accessCode.requestForm.contactNamePlaceholder')}
                required
              />
            </div>
            
            <div className="form-group">
              <label>{t('accessCode.requestForm.contactPhone')}</label>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder={t('accessCode.requestForm.contactPhonePlaceholder')}
                required
              />
            </div>
            
            <div className="form-group">
              <label>{t('accessCode.requestForm.contactEmail')}</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder={t('accessCode.requestForm.contactEmailPlaceholder')}
                required
              />
            </div>
            
            <div className="form-group">
              <label>{t('accessCode.requestForm.reason')}</label>
              <textarea
                value={requestReason}
                onChange={(e) => setRequestReason(e.target.value)}
                placeholder={t('accessCode.requestForm.placeholder')}
                rows={4}
                required
              />
            </div>
            
            <div className="modal-actions">
              <button 
                className="btn btn-primary"
                onClick={handleRequestSubmit}
                disabled={loading || !isFormValid()}
              >
                {loading ? t('common.loading') : t('accessCode.submitRequest')}
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => setShowRequestForm(false)}
              >
                {t('common.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Access Code Form Modal */}
      {showCodeForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{t('accessCode.enterCodeTitle')}</h3>
            <input
              type="text"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
              placeholder={t('accessCode.codePlaceholder')}
              maxLength={6}
              className="code-input"
            />
            <div className="modal-actions">
              <button 
                className="btn btn-primary"
                onClick={handleCodeSubmit}
                disabled={loading || accessCode.length !== 6}
              >
                {loading ? t('common.loading') : t('accessCode.applyCode')}
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => setShowCodeForm(false)}
              >
                {t('common.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
```

#### **2. Admin Access Code Management**
```javascript
// components/admin/AccessCodeManagement.js
import React, { useState, useEffect } from 'react';
import { useTranslation } from '../contexts/LanguageContext';

const AccessCodeManagement = () => {
  const { t } = useTranslation();
  const [accessCodes, setAccessCodes] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [generatedCode, setGeneratedCode] = useState('');

  useEffect(() => {
    fetchAccessCodes();
    fetchPendingRequests();
  }, []);

  const generateAccessCode = async (requestId) => {
    try {
      const response = await api.post(`/admin/access-codes/generate`, {
        request_id: requestId
      });
      
      setGeneratedCode(response.data.code);
      fetchPendingRequests(); // Refresh list
    } catch (error) {
      showNotification('error', error.message);
    }
  };

  const rejectRequest = async (requestId, reason) => {
    try {
      await api.post(`/admin/access-codes/reject`, {
        request_id: requestId,
        reason: reason
      });
      
      fetchPendingRequests(); // Refresh list
      showNotification('success', t('accessCode.requestRejected'));
    } catch (error) {
      showNotification('error', error.message);
    }
  };

  return (
    <div className="access-code-management">
      <h2>{t('admin.accessCodeManagement')}</h2>
      
      {/* Pending Requests */}
      <div className="pending-requests">
        <h3>{t('accessCode.pendingRequests')}</h3>
        {pendingRequests.map(request => (
          <div key={request.id} className="request-card">
            <div className="request-info">
              <h4>{request.contact_name}</h4>
              <div className="contact-details">
                <p><strong>{t('accessCode.requestForm.contactPhone')}:</strong> {request.contact_phone}</p>
                <p><strong>{t('accessCode.requestForm.contactEmail')}:</strong> {request.contact_email}</p>
              </div>
              <p><strong>{t('accessCode.requestReason')}:</strong> {request.request_reason}</p>
              <small>{new Date(request.created_at).toLocaleDateString()}</small>
            </div>
            <div className="request-actions">
              <button 
                className="btn btn-success"
                onClick={() => generateAccessCode(request.id)}
              >
                {t('accessCode.approve')}
              </button>
              <button 
                className="btn btn-danger"
                onClick={() => rejectRequest(request.id)}
              >
                {t('accessCode.reject')}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Generated Code Display */}
      {generatedCode && (
        <div className="generated-code">
          <h3>{t('accessCode.generatedCode')}</h3>
          <div className="code-display">
            <span className="code">{generatedCode}</span>
            <button 
              className="btn btn-secondary"
              onClick={() => navigator.clipboard.writeText(generatedCode)}
            >
              {t('common.copy')}
            </button>
          </div>
          <p>{t('accessCode.codeInstructions')}</p>
        </div>
      )}

      {/* Access Code History */}
      <div className="code-history">
        <h3>{t('accessCode.history')}</h3>
        <table className="code-table">
          <thead>
            <tr>
              <th>{t('accessCode.code')}</th>
              <th>{t('accessCode.generatedBy')}</th>
              <th>{t('accessCode.status')}</th>
              <th>{t('accessCode.usedBy')}</th>
              <th>{t('accessCode.createdAt')}</th>
            </tr>
          </thead>
          <tbody>
            {accessCodes.map(code => (
              <tr key={code.id}>
                <td>{code.code}</td>
                <td>{code.generated_by_name}</td>
                <td>
                  <span className={`status ${code.status}`}>
                    {t(`accessCode.status.${code.status}`)}
                  </span>
                </td>
                <td>{code.used_by_name || '-'}</td>
                <td>{new Date(code.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
```

---

## 🔔 **Notification System**

### **Access Code Notifications**
```javascript
// Notification templates for access codes
const accessCodeNotifications = {
  'zh-TW': {
    requestSubmitted: {
      title: '無限存取申請已提交',
      message: '您的申請已提交給管理員審核，我們會盡快回覆您。'
    },
    requestApproved: {
      title: '無限存取申請已獲批准',
      message: '您的申請已獲批准！請使用以下6位數代碼啟用無限存取：{code}'
    },
    requestRejected: {
      title: '無限存取申請被拒絕',
      message: '很抱歉，您的申請未被批准。如有疑問，請聯絡客服。'
    },
    codeApplied: {
      title: '存取代碼已成功應用',
      message: '恭喜！您現在擁有無限存取權限。'
    }
  },
  'en': {
    requestSubmitted: {
      title: 'Unlimited Access Request Submitted',
      message: 'Your request has been submitted for admin review. We will respond soon.'
    },
    requestApproved: {
      title: 'Unlimited Access Request Approved',
      message: 'Your request has been approved! Please use this 6-digit code to activate unlimited access: {code}'
    },
    requestRejected: {
      title: 'Unlimited Access Request Rejected',
      message: 'Sorry, your request was not approved. Please contact support if you have questions.'
    },
    codeApplied: {
      title: 'Access Code Successfully Applied',
      message: 'Congratulations! You now have unlimited access.'
    }
  }
};
```

---

## 📊 **Analytics & Reporting**

### **Access Code Analytics**
```sql
-- Access code usage statistics
SELECT 
    DATE_TRUNC('month', created_at) as month,
    COUNT(*) as total_codes_generated,
    COUNT(CASE WHEN status = 'used' THEN 1 END) as codes_used,
    COUNT(CASE WHEN status = 'expired' THEN 1 END) as codes_expired,
    AVG(EXTRACT(EPOCH FROM (used_at - created_at))/3600) as avg_hours_to_use
FROM access_codes 
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;

-- Request approval rates
SELECT 
    COUNT(*) as total_requests,
    COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved,
    COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected,
    ROUND(
        COUNT(CASE WHEN status = 'approved' THEN 1 END) * 100.0 / COUNT(*), 2
    ) as approval_rate
FROM access_code_requests;
```

---

## 🎯 **Business Benefits**

### **User Experience**
- **Flexible Options**: Users can choose payment or request access
- **Immediate Activation**: Access codes provide instant access
- **Clear Process**: Transparent request and approval workflow
- **No Payment Barrier**: Reduces friction for qualified users

### **Point Reward Policy**
- **No Points for Admin Grants**: Access codes and direct admin grants do not award points
- **Payment Required for Points**: Only actual payments (HKD$10/month) award 500 points
- **Clear Distinction**: Users understand the difference between paid and granted access
- **Revenue Protection**: Prevents point inflation from free access grants

### **Admin Control**
- **Selective Approval**: Admins control who gets free access
- **Audit Trail**: Complete tracking of all access grants
- **Revenue Management**: Balance between paid and free access
- **Code Security**: One-time use prevents abuse

### **Platform Benefits**
- **User Acquisition**: Easier onboarding for qualified agents
- **Revenue Optimization**: Strategic use of free access
- **Quality Control**: Admin oversight ensures quality users
- **Flexibility**: Adapts to different user needs and situations

---

## 🔧 **Implementation Checklist**

### **Phase 1: Database Setup**
- [ ] Create access_codes table
- [ ] Create access_code_requests table
- [ ] Update users table with access code fields
- [ ] Add database indexes for performance

### **Phase 2: Backend Implementation**
- [ ] Implement access code generation service
- [ ] Create access code request service
- [ ] Add payment screen options service
- [ ] Implement notification system for access codes

### **Phase 3: Frontend Implementation**
- [ ] Create payment options component
- [ ] Build access code request form
- [ ] Implement access code validation form
- [ ] Create admin access code management interface

### **Phase 4: Testing & Deployment**
- [ ] Unit tests for access code logic
- [ ] Integration tests for request flow
- [ ] User acceptance testing
- [ ] Production deployment

---

## 💡 **Security Considerations**

### **Code Security**
- **Unique Generation**: Each code is unique and non-guessable
- **One-time Use**: Codes cannot be reused
- **Expiration**: Codes expire after set time period
- **Audit Trail**: Complete logging of all code usage

### **Access Control**
- **Admin Only**: Only admins can generate codes
- **Request Validation**: All requests reviewed by admin
- **Usage Tracking**: Monitor for suspicious activity
- **Revocation**: Ability to revoke codes if needed

**This access code system provides a flexible and secure way to grant unlimited access while maintaining admin control and preventing abuse!** 