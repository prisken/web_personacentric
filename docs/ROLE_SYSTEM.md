# Role-Based Access Control System

## 👥 **Overview**

This document outlines the comprehensive role-based access control system supporting three distinct user roles: **Admin**, **Agent**, and **Client**. Each role has specific permissions, features, and access levels designed to support the platform's business model.

---

## 🎯 **Role Definitions**

### **1. Admin Role**
**Purpose**: System administrators with full platform control  
**Access Level**: Complete system access  
**Subscription**: Free (system administrators)

#### **Core Responsibilities**
- **User Management**: Create, modify, and delete user accounts
- **Access Control**: Grant/revoke unlimited access to agents
- **Content Moderation**: Approve/reject content and contest submissions
- **System Configuration**: Manage settings, plans, and features
- **Analytics**: View comprehensive platform analytics and reports
- **Revenue Management**: Monitor subscriptions and commission tracking

#### **Admin Features**
| Feature Category | Access Level | Description |
|------------------|-------------|-------------|
| **User Management** | ✅ Full | Create, edit, delete, suspend users |
| **Access Control** | ✅ Full | Grant unlimited access, generate codes |
| **Content Moderation** | ✅ Full | Approve/reject all content |
| **System Settings** | ✅ Full | Configure platform settings |
| **Analytics Dashboard** | ✅ Full | Complete system analytics |
| **Revenue Tracking** | ✅ Full | Monitor all financial metrics |
| **Contest Management** | ✅ Full | Create, manage, judge contests |
| **Point System** | ✅ Full | Manage point rules and transactions |

### **2. Agent Role**
**Purpose**: Premium users with advanced features and revenue generation  
**Access Level**: Premium features with CRM and AI tools  
**Subscription**: HKD$10/month or free (admin-granted)

#### **Core Responsibilities**
- **Client Management**: Manage client relationships and interactions
- **Content Creation**: Generate AI-assisted content for marketing
- **Event Management**: Create and manage events
- **Commission Tracking**: Monitor earnings and performance
- **Self-Marketing**: Maintain public profile and showcase work

#### **Agent Features**
| Feature Category | Access Level | Description |
|------------------|-------------|-------------|
| **Client CRM** | ✅ Full | Manage client relationships |
| **AI Content Generation** | ✅ Full | Advanced AI tools for content |
| **Event Management** | ✅ Full | Create and manage events |
| **Commission Tracking** | ✅ Full | Track earnings and performance |
| **Self-Marketing Profile** | ✅ Full | Public profile showcase |
| **Advanced Analytics** | ✅ Full | Detailed performance data |
| **Priority Support** | ✅ Full | 24-hour response time |
| **Exclusive Features** | ✅ Full | Beta access and premium tools |

### **3. Client Role**
**Purpose**: Basic users with event access and community features  
**Access Level**: Basic features with upgrade path  
**Subscription**: Free (basic access)

#### **Core Responsibilities**
- **Event Participation**: Register for and attend events
- **Content Creation**: Basic content creation and sharing
- **Point Earning**: Participate in point system and contests
- **Community Engagement**: Interact with platform community
- **Agent Upgrade**: Apply to become an agent

#### **Client Features**
| Feature Category | Access Level | Description |
|------------------|-------------|-------------|
| **Event Registration** | ✅ Full | Register for events |
| **Rewards System** | ✅ Full | Earn and redeem points |
| **Basic Content Creation** | ✅ Limited | Simple posts and sharing |
| **Community Access** | ✅ Full | Participate in contests |
| **Point System** | ✅ Full | Earn points through content |
| **Agent Upgrade Path** | ✅ Full | Apply to become agent with upgrade dashboard |

---

## 🔐 **Access Control Matrix**

### **Feature Access by Role**
| Feature | Admin | Agent | Client |
|---------|-------|-------|--------|
| **User Management** | ✅ Full | ❌ None | ❌ None |
| **Access Control** | ✅ Full | ❌ None | ❌ None |
| **Content Moderation** | ✅ Full | ❌ None | ❌ None |
| **System Settings** | ✅ Full | ❌ None | ❌ None |
| **Analytics Dashboard** | ✅ Full | ✅ Limited | ❌ None |
| **Client CRM** | ✅ Full | ✅ Full | ❌ None |
| **AI Content Generation** | ✅ Full | ✅ Full | ❌ None |
| **Event Management** | ✅ Full | ✅ Full | ❌ None |
| **Commission Tracking** | ✅ Full | ✅ Full | ❌ None |
| **Event Registration** | ✅ Full | ✅ Full | ✅ Full |
| **Rewards System** | ✅ Full | ✅ Full | ✅ Full |
| **Basic Content Creation** | ✅ Full | ✅ Full | ✅ Limited |
| **Community Access** | ✅ Full | ✅ Full | ✅ Full |
| **Point System** | ✅ Full | ✅ Full | ✅ Full |

### **Subscription Status Impact**
| Subscription Status | Admin | Agent | Client |
|---------------------|-------|-------|--------|
| **Active** | ✅ Full | ✅ Full | ✅ Full |
| **Past Due (1-3 months)** | ✅ Full | ✅ Full | ✅ Full |
| **Suspended** | ✅ Full | ❌ Limited | ✅ Full |
| **Cancelled** | ✅ Full | ❌ Limited | ✅ Full |

---

## 🎯 **Role Progression Path**

### **Client → Agent Upgrade**
```
1. Client Registration
   ├── Free access to basic features
   ├── Earn points through content creation
   └── Build engagement and reputation

2. Agent Application
   ├── Complete application form
   ├── Provide business information
   └── Submit for admin review

3. Admin Review Process
   ├── Review application details
   ├── Check user activity and engagement
   └── Approve or reject application

4. Agent Onboarding
   ├── Choose subscription method:
   │   ├── Pay HKD$10/month
   │   ├── Request unlimited access
   │   └── Use access code
   └── Access premium features
```

### **Agent Access Methods**
| Method | Description | Points Awarded |
|--------|-------------|----------------|
| **Paid Subscription** | HKD$10/month | ✅ 500 points per payment |
| **Admin Grant** | Direct unlimited access | ❌ No points |
| **Access Code** | 6-digit admin code | ❌ No points |

---

## 🚀 **Client Upgrade System**

### **Upgrade Dashboard Features**
```
🎯 Upgrade Overview
├── Agent Benefits Showcase
├── Current Progress Tracking
├── Requirements Checklist
└── Success Stories

📋 Application Process
├── Personal Information
├── Business Background
├── Motivation Statement
└── Supporting Documents

📊 Progress Tracking
├── Application Status
├── Admin Feedback
├── Required Actions
└── Timeline Updates

🎓 Training Resources
├── Agent Training Videos
├── Best Practices Guide
├── Commission Structure
└── Success Tips
```

### **Upgrade Requirements**
| Requirement | Description | Verification |
|-------------|-------------|--------------|
| **Account Age** | Minimum 30 days active | Automatic check |
| **Event Participation** | Attended at least 3 events | Activity tracking |
| **Content Creation** | Created at least 5 posts | Content history |
| **Point Balance** | Minimum 100 points earned | Point system check |
| **Community Engagement** | Active in contests/forums | Engagement metrics |
| **Profile Completion** | 100% profile completion | Profile validation |

### **Application Process**
```
1. Eligibility Check
   ├── Verify account age (30+ days)
   ├── Check event participation (3+ events)
   ├── Validate content creation (5+ posts)
   └── Confirm point balance (100+ points)

2. Application Form
   ├── Personal information
   ├── Business background
   ├── Motivation statement
   └── Supporting documents

3. Admin Review
   ├── Review application details
   ├── Check user activity metrics
   ├── Verify eligibility requirements
   └── Make approval decision

4. Notification & Onboarding
   ├── Send approval/rejection notification
   ├── Provide onboarding resources
   ├── Guide through agent setup
   └── Activate agent features
```

### **Upgrade Benefits Showcase**
| Benefit | Current (Client) | Upgrade (Agent) |
|---------|------------------|-----------------|
| **Event Management** | ❌ Can only register | ✅ Create and manage events |
| **Content Creation** | ✅ Basic posts only | ✅ Full AI-powered content |
| **Client Management** | ❌ No CRM access | ✅ Full CRM system |
| **Commission Tracking** | ❌ No earnings | ✅ Track commissions |
| **Analytics** | ✅ Basic activity | ✅ Advanced analytics |
| **Support** | ✅ Standard support | ✅ Priority support |
| **Features** | ✅ Limited features | ✅ All premium features |

### **Technical Implementation**

#### **Upgrade Dashboard Component**
```javascript
// components/client/UpgradeDashboard.js
const UpgradeDashboard = ({ user }) => {
  const [eligibility, setEligibility] = useState(null);
  const [application, setApplication] = useState(null);
  const [progress, setProgress] = useState({});

  useEffect(() => {
    checkEligibility();
    loadApplicationStatus();
  }, [user.id]);

  const checkEligibility = async () => {
    const response = await api.get(`/upgrade/eligibility/${user.id}`);
    setEligibility(response.data);
  };

  const submitApplication = async (applicationData) => {
    const response = await api.post('/upgrade/apply', applicationData);
    setApplication(response.data);
  };

  return (
    <div className="upgrade-dashboard">
      <div className="upgrade-overview">
        <h2>Upgrade to Agent</h2>
        <div className="benefits-showcase">
          {/* Agent benefits display */}
        </div>
        <div className="requirements-checklist">
          {/* Eligibility requirements */}
        </div>
      </div>
      
      <div className="application-section">
        {!application ? (
          <ApplicationForm onSubmit={submitApplication} />
        ) : (
          <ApplicationStatus application={application} />
        )}
      </div>
      
      <div className="training-resources">
        <h3>Agent Training Resources</h3>
        {/* Training materials */}
      </div>
    </div>
  );
};
```

#### **Eligibility Check Service**
```javascript
// services/upgradeService.js
class UpgradeService {
  async checkEligibility(userId) {
    const user = await this.getUserById(userId);
    const activities = await this.getUserActivities(userId);
    
    return {
      accountAge: this.calculateAccountAge(user.created_at),
      eventParticipation: activities.events_attended >= 3,
      contentCreation: activities.posts_created >= 5,
      pointBalance: user.points_balance >= 100,
      communityEngagement: activities.contest_participation > 0,
      profileCompletion: this.calculateProfileCompletion(user),
      isEligible: this.checkAllRequirements(user, activities)
    };
  }

  async submitApplication(applicationData) {
    // Validate application data
    // Create application record
    // Notify admins
    // Send confirmation to user
  }
}
```

---

## 💼 **Agent CRM System**

### **Client Management Features**
- **Client Database**: Store client information and interactions
- **Interaction Tracking**: Log calls, emails, meetings, messages
- **Follow-up System**: Automated reminders and scheduling
- **Performance Analytics**: Track conversion rates and success metrics
- **Commission Tracking**: Monitor earnings and commission rates

### **CRM Workflow**
```
1. Client Acquisition
   ├── Identify potential clients
   ├── Initial contact and qualification
   └── Add to CRM system

2. Relationship Management
   ├── Regular interactions and updates
   ├── Track progress and milestones
   └── Maintain communication history

3. Conversion Tracking
   ├── Monitor conversion rates
   ├── Track commission earnings
   └── Analyze performance metrics
```

---

## 🎨 **Content Creation System**

### **AI Content Generation (Agent Only)**
- **Content Types**: Posts, events, campaigns, social media
- **AI Assistance**: Automated content suggestions and optimization
- **Performance Tracking**: Monitor engagement and reach
- **Quality Bonuses**: Extra points for high-performing content
- **Multilingual Support**: Chinese and English content creation

### **Content Workflow**
```
1. Content Creation
   ├── Choose content type and format
   ├── Use AI tools for optimization
   └── Submit for approval (if required)

2. Content Management
   ├── Track performance metrics
   ├── Optimize based on engagement
   └── Earn points for quality content

3. Content Distribution
   ├── Share across platforms
   ├── Monitor reach and engagement
   └── Analyze effectiveness
```

---

## 📊 **Analytics & Reporting**

### **Admin Analytics**
- **User Analytics**: Registration, activity, engagement metrics
- **Revenue Analytics**: Subscription revenue, commission tracking
- **Content Analytics**: Creation rates, performance metrics
- **System Analytics**: Platform health, performance monitoring

### **Agent Analytics**
- **Client Analytics**: CRM performance, conversion rates
- **Content Analytics**: Creation and engagement metrics
- **Commission Analytics**: Earnings and performance tracking
- **Personal Analytics**: Individual performance and growth

### **Client Analytics**
- **Activity Analytics**: Event participation, content creation
- **Point Analytics**: Earning and spending patterns
- **Engagement Analytics**: Community participation metrics

---

## 🔧 **Technical Implementation**

### **Role-Based UI Components**
```javascript
// Example role-based component rendering
const Dashboard = ({ user }) => {
  switch (user.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'agent':
      return <AgentDashboard />;
    case 'client':
      return <ClientDashboard />;
    default:
      return <ClientDashboard />;
  }
};
```

### **Permission Checking**
```javascript
// Example permission checking
const hasPermission = (user, resource, action) => {
  const permissions = {
    admin: { [resource]: { [action]: true } },
    agent: { 
      'content': { 'create': true, 'moderate': false },
      'clients': { 'manage': true }
    },
    client: { 
      'content': { 'create': true, 'moderate': false },
      'clients': { 'manage': false }
    }
  };
  
  return permissions[user.role]?.[resource]?.[action] || false;
};
```

### **Access Control Middleware**
```javascript
// Example access control middleware
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};

// Usage in routes
app.get('/admin/users', requireRole(['admin']), adminController.getUsers);
app.get('/agent/crm', requireRole(['admin', 'agent']), agentController.getCRM);
```

---

## 🎯 **Business Benefits**

### **Scalable Access Control**
- **Flexible Permissions**: Granular control over feature access
- **Role Progression**: Clear upgrade path for user growth
- **Admin Oversight**: Quality control through admin management
- **Revenue Optimization**: Strategic access grants and subscriptions

### **User Experience**
- **Tailored Interfaces**: Role-specific dashboards and features
- **Clear Progression**: Understandable upgrade path
- **Flexible Access**: Multiple ways to obtain premium features
- **Quality Assurance**: Admin oversight ensures platform quality

### **Platform Growth**
- **User Retention**: Role progression encourages long-term engagement
- **Revenue Generation**: Multiple subscription and commission models
- **Quality Control**: Admin oversight maintains platform standards
- **Scalable Architecture**: Supports growth across all user types

---

## 📋 **Implementation Checklist**

### **✅ Completed**
- [x] **Role Definitions**: Admin, agent, client roles defined
- [x] **Permission Matrix**: Complete access control mapping
- [x] **Feature Mapping**: All features assigned to roles
- [x] **Subscription Integration**: Role-based subscription handling
- [x] **Access Control**: Multiple access methods implemented
- [x] **CRM System**: Agent client management features
- [x] **Content System**: Role-based content creation
- [x] **Analytics**: Role-specific reporting and metrics

### **🔄 Next Steps**
- [ ] **Frontend Implementation**: Role-based UI components
- [ ] **Backend API**: Role-based route protection
- [ ] **Testing**: Role-based functionality testing
- [ ] **Documentation**: User guides for each role
- [ ] **Training**: Admin training for role management

**This role-based system provides a comprehensive, scalable foundation for user management, access control, and platform growth while maintaining quality through admin oversight.** 