# Persona Centric System Architecture Diagram

## 🔄 User Flow & Relationships

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CLIENT USER   │    │   AGENT USER    │    │   ADMIN USER    │
│                 │    │                 │    │                 │
│ • Register      │    │ • Create Profile│    │ • Manage Users  │
│ • Earn Points   │    │ • Host Events   │    │ • Create Content│
│ • Connect Agents│    │ • Manage Clients│    │ • Oversee System│
│ • Redeem Gifts  │    │ • Earn Commissions│   │ • Analytics     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   AUTHENTICATION│
                    │   & AUTHORIZATION│
                    └─────────────────┘
                                 │
                    ┌─────────────────┐
                    │   CORE SYSTEM   │
                    └─────────────────┘
```

## 🗄️ Database Relationships

```
USERS TABLE
├── id (UUID, Primary Key)
├── email (Unique)
├── role (admin/agent/client)
├── points
├── subscription_status
└── other user data
    │
    ├── AGENT PROFILES (One-to-One)
    │   ├── specialization
    │   ├── experience_years
    │   ├── commission_rate
    │   └── availability
    │
    ├── CLIENT RELATIONSHIPS (Many-to-Many)
    │   ├── agent_id → USERS
    │   ├── client_id → USERS
    │   ├── status (pending/active/rejected)
    │   └── commission_tracking
    │
    ├── EVENTS (One-to-Many)
    │   ├── title, description
    │   ├── event_type (workshop/seminar/etc)
    │   ├── agent_id (optional)
    │   └── points_reward
    │
    ├── BLOG POSTS (One-to-Many)
    │   ├── title, content
    │   ├── categories
    │   └── view_count
    │
    ├── QUIZZES (One-to-Many)
    │   ├── title, questions
    │   ├── difficulty
    │   └── max_points
    │
    ├── CONTESTS (One-to-Many)
    │   ├── title, description
    │   ├── prize_description
    │   └── status
    │
    ├── POINT TRANSACTIONS (One-to-Many)
    │   ├── transaction_type
    │   ├── points_amount
    │   └── source tracking
    │
    ├── GIFT REDEMPTIONS (One-to-Many)
    │   ├── gift_id
    │   ├── redemption_status
    │   └── point_cost
    │
    └── EVENT REGISTRATIONS (Many-to-Many)
        ├── event_id
        ├── registration_status
        └── attendance_tracking
```

## 🎯 Feature Matrix by User Type

| Feature | Client | Agent | Admin |
|---------|--------|-------|-------|
| **User Management** | View own profile | View own profile | Manage all users |
| **Agent Connections** | Request/View agents | Manage client relationships | Oversee relationships |
| **Events** | Register/Attend | Create/Host | Create/Manage all |
| **Blogs** | Read/Share | Create/Manage own | Create/Manage all |
| **Quizzes** | Take/Earn points | Create/Manage own | Create/Manage all |
| **Contests** | Participate | View only | Create/Manage all |
| **Points** | Earn/Spend | Earn from events | Manage system |
| **Gifts** | Redeem | View only | Manage catalog |
| **Financial Planning** | Personal tools | Client tools | System analytics |
| **Analytics** | Personal stats | Client stats | System-wide stats |

## 🔄 Data Flow Architecture

```
FRONTEND (React)
├── Login/Register
├── Role-based Dashboards
├── Content Management
└── User Interfaces
    │
    ↓ (API Calls)
    │
BACKEND (Express.js)
├── Authentication Middleware
├── Role-based Authorization
├── Business Logic Controllers
└── Data Access Layer
    │
    ↓ (ORM Queries)
    │
DATABASE (SQLite/PostgreSQL)
├── User Tables
├── Relationship Tables
├── Content Tables
├── Transaction Tables
└── Analytics Tables
```

## 🎮 Gamification System

```
POINTS ECOSYSTEM
├── Earning Sources
│   ├── Event Attendance (+100 points)
│   ├── Quiz Completion (+50-200 points)
│   ├── Contest Participation (+25 points)
│   ├── Blog Reading (+10 points)
│   └── Payment Rewards (+500 points)
│
├── Spending Opportunities
│   ├── Gift Redemption (100-1000 points)
│   ├── Premium Features (500+ points)
│   └── Contest Entries (50 points)
│
└── Achievement System
    ├── Badges for milestones
    ├── Level progression
    └── Leaderboards
```

## 💰 Revenue Model

```
AGENT COMMISSION SYSTEM
├── Client Relationship Commission
│   ├── Base rate: 10-15%
│   ├── Performance bonuses
│   └── Long-term relationship rewards
│
├── Event Hosting Revenue
│   ├── Event fees
│   ├── Participant payments
│   └── Platform commission
│
└── Content Monetization
    ├── Premium content access
    ├── Consultation fees
    └── Course sales
```

## 🔐 Security Architecture

```
SECURITY LAYERS
├── Authentication
│   ├── JWT tokens
│   ├── Password hashing (bcrypt)
│   └── Session management
│
├── Authorization
│   ├── Role-based access (RBAC)
│   ├── Resource ownership
│   └── API endpoint protection
│
├── Data Protection
│   ├── Input validation
│   ├── SQL injection prevention
│   └── XSS protection
│
└── Infrastructure
    ├── HTTPS enforcement
    ├── Rate limiting
    └── CORS configuration
```

## 📱 User Journey Flows

### Client Journey
```
Register → Browse Agents → Connect → Attend Events → 
Earn Points → Take Quizzes → Redeem Gifts → 
Financial Planning → Repeat Engagement
```

### Agent Journey
```
Register → Create Profile → Get Approved → 
Host Events → Manage Clients → Earn Commissions → 
Create Content → Build Reputation
```

### Admin Journey
```
System Management → User Oversight → Content Creation → 
Analytics Review → Feature Development → 
Quality Assurance → Platform Growth
```

This diagram provides a visual representation of how all the system components interact and how data flows through the platform. It helps understand the complexity and interconnectedness of the Persona Centric ecosystem. 