# Database Structure Documentation

This document provides a comprehensive overview of the database structure for the PersonaCentric platform. The system uses PostgreSQL with Sequelize ORM and follows a relational database design.

> **Note**: This is the authoritative database documentation. The outdated `DATABASE_SCHEMA.md` has been removed to avoid confusion. All code, routes, and API endpoints follow this structure.

## Table Overview

The database consists of **25 main tables** organized into the following functional areas:

### Core User Management
- **users** - Main user accounts and profiles
- **agents** - Financial agent profiles and specializations
- **client_relationships** - Agent-client matching and relationships

### Content Management
- **blog_posts** - Blog articles and content
- **blog_images** - Images associated with blog posts
- **blog_categories** - Content categorization
- **blog_post_categories** - Many-to-many relationship between posts and categories

### Events & Activities
- **events** - Workshops, seminars, consultations, webinars
- **event_registrations** - User registrations for events

### Quizzes & Learning
- **quizzes** - Quiz definitions and questions
- **quiz_attempts** - User quiz attempts and scores

### Contests & Competitions
- **contests** - Contest definitions and rules
- **contest_submissions** - User submissions to contests

### Financial & Payment System
- **subscriptions** - User subscription plans and status
- **payment_transactions** - Payment records and processing
- **point_transactions** - Point earning and spending history

### Rewards & Gamification
- **badges** - Achievement badges and requirements
- **user_badges** - User badge assignments
- **gifts** - Redeemable rewards and prizes
- **gift_categories** - Gift categorization
- **gift_redemptions** - User gift redemption records

### Access Control & Security
- **access_codes** - Temporary access codes for registration
- **notifications** - System notifications and alerts
- **client_upgrades** - Client upgrade applications

---

## Detailed Table Structures

### 1. Users Table (`users`)
**Primary table for all user accounts**

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `email` | STRING(255) | Unique email address |
| `password_hash` | STRING(255) | Hashed password |
| `first_name` | STRING(100) | User's first name |
| `last_name` | STRING(100) | User's last name |
| `phone` | STRING(20) | Phone number (optional) |
| `client_id` | STRING(10) | Unique client identifier |
| `role` | ENUM | User role: admin, agent, client, super_admin |
| `language_preference` | ENUM | Language: en, zh-TW |
| `points` | INTEGER | Current point balance |
| `subscription_status` | ENUM | active, inactive, grace_period |
| `subscription_end_date` | DATE | When subscription expires |
| `grace_period_end_date` | DATE | Grace period end date |
| `last_login` | DATE | Last login timestamp |
| `is_verified` | BOOLEAN | Email verification status |
| `verification_token` | STRING(255) | Email verification token |
| `reset_password_token` | STRING(255) | Password reset token |
| `reset_password_expires` | DATE | Token expiration |
| `permissions` | JSONB | Custom permissions object |
| `created_by_super_admin` | UUID | Who created this user (if applicable) |
| `is_system_admin` | BOOLEAN | System admin flag |

**Key Relationships:**
- One-to-one with `agents` table
- One-to-many with events, blog posts, contests, payments, etc.

### 2. Agents Table (`agents`)
**Financial agent profiles and specializations**

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | Foreign key to users table |
| `specialization` | STRING(255) | Agent's area of expertise |
| `experience_years` | INTEGER | Years of experience |
| `certifications` | TEXT | Professional certifications |
| `bio` | TEXT | Agent biography |
| `commission_rate` | DECIMAL(5,4) | Commission percentage |
| `is_verified` | BOOLEAN | Verification status |
| `rating` | DECIMAL(3,2) | Average rating |
| `total_reviews` | INTEGER | Number of reviews |
| `profile_image` | STRING(500) | Profile image URL |
| `areas_of_expertise` | JSON | Array of expertise areas |
| `languages` | JSON | Languages spoken |
| `preferred_client_types` | JSON | Preferred client categories |
| `communication_modes` | JSON | Communication preferences |
| `availability` | TEXT | Availability schedule |
| `location` | STRING(255) | Geographic location |
| `status` | ENUM | pending, approved, active, inactive |
| `in_matching_pool` | BOOLEAN | Available for client matching |

### 3. Events Table (`events`)
**Workshops, seminars, consultations, and webinars**

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `title` | STRING(255) | Event title |
| `description` | TEXT | Event description |
| `event_type` | ENUM | workshop, seminar, consultation, webinar |
| `start_date` | DATE | Event start time |
| `end_date` | DATE | Event end time |
| `location` | STRING(255) | Event location |
| `max_participants` | INTEGER | Maximum attendees |
| `current_participants` | INTEGER | Current registrations |
| `price` | DECIMAL(10,2) | Event price |
| `points_reward` | INTEGER | Points awarded for attendance |
| `agent_id` | UUID | Associated agent |
| `created_by` | UUID | Event creator |
| `status` | ENUM | draft, published, cancelled, completed |
| `image` | STRING(500) | Event image URL |
| `video_url` | STRING(500) | Video content URL |

### 4. Blog Posts Table (`blog_posts`)
**Content management for articles and blog posts**

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `title` | STRING(255) | Post title |
| `slug` | STRING(255) | URL-friendly slug |
| `excerpt` | TEXT | Post summary |
| `content` | TEXT | Full post content |
| `author_id` | UUID | Post author |
| `status` | ENUM | draft, published, archived |
| `featured_image_url` | STRING(500) | Featured image |
| `meta_title` | STRING(255) | SEO title |
| `meta_description` | TEXT | SEO description |
| `meta_keywords` | JSON | SEO keywords |
| `reading_time` | INTEGER | Estimated reading time |
| `view_count` | INTEGER | Page views |
| `like_count` | INTEGER | Likes received |
| `share_count` | INTEGER | Shares |
| `published_at` | DATE | Publication date |
| `featured` | BOOLEAN | Featured post flag |

### 5. Quizzes Table (`quizzes`)
**Quiz system for learning and engagement**

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `title` | STRING(255) | Quiz title |
| `description` | TEXT | Quiz description |
| `category` | STRING(100) | Quiz category |
| `max_points` | INTEGER | Maximum points available |
| `time_limit` | INTEGER | Time limit in minutes |
| `difficulty` | ENUM | easy, medium, hard |
| `is_active` | BOOLEAN | Active status |
| `image_url` | STRING(500) | Quiz image |
| `instructions` | TEXT | Quiz instructions |
| `passing_score` | INTEGER | Minimum score to pass (%) |
| `questions` | JSON | Array of question objects |
| `scoring_rules` | JSON | Custom scoring rules |
| `created_by` | UUID | Quiz creator |
| `external_quiz_url` | STRING(500) | External quiz platform URL |
| `quiz_type` | STRING(20) | internal or external |
| `external_quiz_id` | STRING(100) | External platform ID |
| `point_calculation_method` | STRING(20) | How points are calculated |
| `min_score_for_points` | INTEGER | Minimum score to earn points |

### 6. Contests Table (`contests`)
**Competition and contest management**

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `title` | STRING(255) | Contest title |
| `description` | TEXT | Contest description |
| `start_date` | DATE | Contest start |
| `end_date` | DATE | Contest end |
| `prize_description` | TEXT | Prize details |
| `max_participants` | INTEGER | Maximum participants |
| `current_participants` | INTEGER | Current participants |
| `status` | ENUM | draft, active, voting, completed |
| `created_by` | UUID | Contest creator |

### 7. Financial System Tables

#### Subscriptions Table (`subscriptions`)
| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | Subscriber |
| `stripe_subscription_id` | STRING(255) | Stripe subscription ID |
| `stripe_customer_id` | STRING(255) | Stripe customer ID |
| `plan_type` | ENUM | monthly, yearly |
| `status` | ENUM | active, canceled, past_due, unpaid |
| `current_period_start` | DATE | Billing period start |
| `current_period_end` | DATE | Billing period end |
| `cancel_at_period_end` | BOOLEAN | Auto-cancel flag |

#### Payment Transactions Table (`payment_transactions`)
| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | Payer |
| `subscription_id` | UUID | Associated subscription |
| `payment_method` | ENUM | stripe, paypal, bank_transfer |
| `amount` | DECIMAL(10,2) | Payment amount |
| `currency` | STRING(3) | Currency code (default: HKD) |
| `status` | ENUM | pending, completed, failed, refunded |
| `external_payment_id` | STRING(255) | External payment system ID |
| `points_awarded` | INTEGER | Points earned from payment |
| `reward_processed` | BOOLEAN | Reward processing status |
| `consecutive_failed_payments` | INTEGER | Failed payment counter |
| `last_payment_attempt` | DATE | Last attempt timestamp |
| `payment_date` | DATE | Successful payment date |
| `metadata` | JSONB | Additional payment data |

#### Point Transactions Table (`point_transactions`)
| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | User earning/spending points |
| `transaction_type` | ENUM | earned, spent, bonus, penalty, payment_reward |
| `points_amount` | INTEGER | Points amount (positive/negative) |
| `content_id` | UUID | Related blog post |
| `event_id` | UUID | Related event |
| `contest_id` | UUID | Related contest |
| `payment_transaction_id` | UUID | Related payment |
| `quiz_id` | UUID | Related quiz |
| `description` | TEXT | Transaction description |
| `metadata` | JSONB | Additional transaction data |

### 8. Client Relationship System

#### Client Relationships Table (`client_relationships`)
| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `agent_id` | UUID | Financial agent |
| `client_id` | UUID | Client user |
| `status` | ENUM | pending, active, rejected, inactive |
| `requested_at` | DATE | Relationship request date |
| `confirmed_at` | DATE | Confirmation date |
| `commission_rate` | DECIMAL(5,4) | Commission rate |
| `total_commission` | DECIMAL(10,2) | Total commission earned |
| `notes` | TEXT | Relationship notes |
| `relationship_start_date` | DATE | Official start date |
| `last_contact_date` | DATE | Last interaction |
| `client_goals` | JSON | Client investment goals |
| `risk_tolerance` | ENUM | conservative, moderate, aggressive |
| `investment_horizon` | ENUM | short_term, medium_term, long_term |

### 9. Rewards & Gamification System

#### Badges Table (`badges`)
| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `name` | STRING(100) | Badge name |
| `description` | TEXT | Badge description |
| `icon` | STRING(100) | Badge icon identifier |
| `category` | ENUM | movie, restaurant, gift, book, event, app, general |
| `requirement_type` | ENUM | count, streak, points, engagement |
| `requirement_value` | INTEGER | Requirement threshold |
| `points_reward` | INTEGER | Points awarded for badge |
| `is_active` | BOOLEAN | Active status |

#### Gifts Table (`gifts`)
| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `name` | STRING(255) | Gift name |
| `description` | TEXT | Gift description |
| `category_id` | UUID | Gift category |
| `points_required` | INTEGER | Points needed to redeem |
| `stock_quantity` | INTEGER | Available quantity |
| `status` | ENUM | draft, active, inactive, out_of_stock, discontinued |
| `availability_start` | DATE | Availability start date |
| `availability_end` | DATE | Availability end date |
| `display_order` | INTEGER | Display priority |
| `created_by` | UUID | Gift creator |

### 10. Access Control & Security

#### Access Codes Table (`access_codes`)
| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `code` | STRING(6) | 6-character access code |
| `user_id` | UUID | Assigned user (if used) |
| `created_by` | UUID | Code creator |
| `is_used` | BOOLEAN | Usage status |
| `used_at` | DATE | When code was used |
| `expires_at` | DATE | Expiration date |

#### Notifications Table (`notifications`)
| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | Notification recipient |
| `type` | ENUM | payment_reward, contest_winner, event_reminder, system_alert, upgrade_approved, payment_failed |
| `title` | STRING(255) | Notification title |
| `message` | TEXT | Notification message |
| `is_read` | BOOLEAN | Read status |
| `data` | JSONB | Additional notification data |
| `priority` | ENUM | low, medium, high, urgent |

---

## Key Relationships

### Primary Relationships
1. **Users** are the central entity connecting to all other tables
2. **Agents** extend user profiles with financial expertise
3. **Client Relationships** connect agents with clients
4. **Events** can be created by users and assigned to agents
5. **Blog Posts** are authored by users
6. **Quizzes** are created by users and attempted by users
7. **Contests** are created by users with submissions from users

### Financial Flow
1. **Subscriptions** → **Payment Transactions** → **Point Transactions**
2. **Point Transactions** can be earned from various activities
3. **Gift Redemptions** spend points for rewards

### Content Relationships
1. **Blog Posts** can have multiple **Blog Images** and **Blog Categories**
2. **Events** can have multiple **Event Registrations**
3. **Contests** can have multiple **Contest Submissions**

---

## Database Features

### Indexing Strategy
- Primary keys on all tables (UUID)
- Foreign key indexes for performance
- Composite indexes for common queries
- JSONB indexes for metadata fields

### Data Types
- **UUID** for all primary keys (better for distributed systems)
- **JSONB** for flexible metadata and configuration
- **ENUM** for controlled vocabulary fields
- **DECIMAL** for precise financial calculations
- **TEXT** for long-form content

### Security Features
- Password hashing for user authentication
- Token-based verification and password reset
- Role-based access control with permissions
- Access code system for controlled registration

### Scalability Considerations
- UUID primary keys for horizontal scaling
- JSONB fields for flexible schema evolution
- Proper indexing for query performance
- Separation of concerns across functional areas

---

## Recent Updates

### Database Cleanup (Latest)
- ✅ Removed outdated `DATABASE_SCHEMA.md` to eliminate confusion
- ✅ Verified all models use correct table names (`client_relationships` not `agent_client_relationships`)
- ✅ Confirmed all field names are consistent (`specialization` not `specialties`, `commission_rate` not `hourly_rate`)
- ✅ Validated all user roles include `super_admin` role
- ✅ Ensured all 27 tables are properly documented and match actual implementation

### Consistency Verification
- ✅ All database models match this documentation
- ✅ All API routes use correct table and field names
- ✅ All migrations are up to date
- ✅ No references to old field names found in codebase

---

This database structure supports a comprehensive financial advisory platform with user management, content delivery, event management, gamification, and financial transaction processing.
