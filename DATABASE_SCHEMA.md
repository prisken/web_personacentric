# Database Schema Documentation

## Core Tables

### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role ENUM('admin', 'agent', 'client') DEFAULT 'client',
    language_preference ENUM('en', 'zh-TW') DEFAULT 'zh-TW',
    points INTEGER DEFAULT 0,
    subscription_status ENUM('active', 'inactive', 'grace_period') DEFAULT 'inactive',
    subscription_end_date TIMESTAMP,
    grace_period_end_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    reset_password_token VARCHAR(255),
    reset_password_expires TIMESTAMP
);
```

### Agents Table
```sql
CREATE TABLE agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    bio TEXT,
    specialties TEXT[],
    experience_years INTEGER,
    certifications TEXT[],
    hourly_rate DECIMAL(10,2),
    availability_schedule JSONB,
    rating DECIMAL(3,2) DEFAULT 0.0,
    total_reviews INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_documents JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Events Table
```sql
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_type ENUM('workshop', 'seminar', 'consultation', 'webinar') NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    location VARCHAR(255),
    max_participants INTEGER,
    current_participants INTEGER DEFAULT 0,
    price DECIMAL(10,2),
    points_reward INTEGER DEFAULT 0,
    agent_id UUID REFERENCES agents(id),
    created_by UUID REFERENCES users(id),
    status ENUM('draft', 'published', 'cancelled', 'completed') DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Blog Posts Table
```sql
CREATE TABLE blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    author_id UUID REFERENCES users(id),
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    featured_image_url VARCHAR(500),
    meta_title VARCHAR(255),
    meta_description TEXT,
    meta_keywords TEXT[],
    reading_time INTEGER,
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0,
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Blog Images Table
```sql
CREATE TABLE blog_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    blog_post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    caption TEXT,
    display_order INTEGER DEFAULT 0,
    image_type ENUM('featured', 'content', 'gallery') DEFAULT 'content',
    file_size INTEGER,
    dimensions JSONB, -- {width: 1920, height: 1080}
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Blog Categories Table
```sql
CREATE TABLE blog_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    color VARCHAR(7), -- Hex color code
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Blog Post Categories Table
```sql
CREATE TABLE blog_post_categories (
    blog_post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
    category_id UUID REFERENCES blog_categories(id) ON DELETE CASCADE,
    PRIMARY KEY (blog_post_id, category_id)
);
```

### Quiz Questions Table
```sql
CREATE TABLE quiz_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_text TEXT NOT NULL,
    question_type ENUM('multiple_choice', 'scale', 'text') NOT NULL,
    options JSONB, -- For multiple choice questions
    category VARCHAR(50), -- personality, financial_habits, conversation_style
    weight INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Quiz Responses Table
```sql
CREATE TABLE quiz_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    question_id UUID REFERENCES quiz_questions(id),
    answer TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Quiz Sessions Table
```sql
CREATE TABLE quiz_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    completed BOOLEAN DEFAULT FALSE,
    personality_type VARCHAR(50),
    financial_profile JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);
```

### Contests Table
```sql
CREATE TABLE contests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    prize_description TEXT,
    max_participants INTEGER,
    current_participants INTEGER DEFAULT 0,
    status ENUM('draft', 'active', 'voting', 'completed') DEFAULT 'draft',
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Contest Submissions Table
```sql
CREATE TABLE contest_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contest_id UUID REFERENCES contests(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    image_url VARCHAR(500),
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    vote_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Points Transactions Table
```sql
CREATE TABLE points_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    amount INTEGER NOT NULL,
    transaction_type ENUM('earned', 'spent', 'bonus', 'penalty') NOT NULL,
    description TEXT,
    reference_type VARCHAR(50), -- event_registration, content_creation, etc.
    reference_id UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Subscriptions Table
```sql
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    stripe_subscription_id VARCHAR(255),
    stripe_customer_id VARCHAR(255),
    plan_type ENUM('monthly', 'yearly') NOT NULL,
    status ENUM('active', 'canceled', 'past_due', 'unpaid') NOT NULL,
    current_period_start TIMESTAMP,
    current_period_end TIMESTAMP,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Access Codes Table
```sql
CREATE TABLE access_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(6) UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id),
    created_by UUID REFERENCES users(id),
    is_used BOOLEAN DEFAULT FALSE,
    used_at TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Notifications Table
```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('info', 'success', 'warning', 'error') DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    action_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Event Registrations Table
```sql
CREATE TABLE event_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    status ENUM('registered', 'attended', 'cancelled', 'no_show') DEFAULT 'registered',
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    attended_at TIMESTAMP,
    feedback_rating INTEGER,
    feedback_comment TEXT
);
```

### Agent Reviews Table
```sql
CREATE TABLE agent_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
    reviewer_id UUID REFERENCES users(id),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Agent Client Relationships Table
```sql
CREATE TABLE agent_client_relationships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
    client_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status ENUM('pending', 'active', 'completed', 'cancelled') DEFAULT 'pending',
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Indexes

```sql
-- Users table indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_subscription_status ON users(subscription_status);
CREATE INDEX idx_users_points ON users(points);
CREATE INDEX idx_users_is_verified ON users(is_verified);

-- Agents table indexes
CREATE INDEX idx_agents_user_id ON agents(user_id);
CREATE INDEX idx_agents_is_verified ON agents(is_verified);
CREATE INDEX idx_agents_rating ON agents(rating);
CREATE INDEX idx_agents_specialties ON agents USING GIN(specialties);
CREATE INDEX idx_agents_certifications ON agents USING GIN(certifications);

-- Events table indexes
CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_agent_id ON events(agent_id);
CREATE INDEX idx_events_event_type ON events(event_type);
CREATE INDEX idx_events_created_by ON events(created_by);

-- Blog posts table indexes
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_author_id ON blog_posts(author_id);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at);
CREATE INDEX idx_blog_posts_view_count ON blog_posts(view_count);
CREATE INDEX idx_blog_posts_meta_keywords ON blog_posts USING GIN(meta_keywords);

-- Blog images table indexes
CREATE INDEX idx_blog_images_blog_post_id ON blog_images(blog_post_id);
CREATE INDEX idx_blog_images_display_order ON blog_images(display_order);
CREATE INDEX idx_blog_images_image_type ON blog_images(image_type);

-- Blog categories table indexes
CREATE INDEX idx_blog_categories_slug ON blog_categories(slug);

-- Quiz questions table indexes
CREATE INDEX idx_quiz_questions_category ON quiz_questions(category);
CREATE INDEX idx_quiz_questions_is_active ON quiz_questions(is_active);

-- Quiz responses table indexes
CREATE INDEX idx_quiz_responses_user_id ON quiz_responses(user_id);
CREATE INDEX idx_quiz_responses_question_id ON quiz_responses(question_id);

-- Quiz sessions table indexes
CREATE INDEX idx_quiz_sessions_user_id ON quiz_sessions(user_id);
CREATE INDEX idx_quiz_sessions_completed ON quiz_sessions(completed);

-- Contests table indexes
CREATE INDEX idx_contests_status ON contests(status);
CREATE INDEX idx_contests_start_date ON contests(start_date);
CREATE INDEX idx_contests_end_date ON contests(end_date);
CREATE INDEX idx_contests_created_by ON contests(created_by);

-- Contest submissions table indexes
CREATE INDEX idx_contest_submissions_contest_id ON contest_submissions(contest_id);
CREATE INDEX idx_contest_submissions_user_id ON contest_submissions(user_id);
CREATE INDEX idx_contest_submissions_status ON contest_submissions(status);
CREATE INDEX idx_contest_submissions_vote_count ON contest_submissions(vote_count);

-- Points transactions table indexes
CREATE INDEX idx_points_transactions_user_id ON points_transactions(user_id);
CREATE INDEX idx_points_transactions_transaction_type ON points_transactions(transaction_type);
CREATE INDEX idx_points_transactions_created_at ON points_transactions(created_at);

-- Subscriptions table indexes
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);

-- Access codes table indexes
CREATE INDEX idx_access_codes_code ON access_codes(code);
CREATE INDEX idx_access_codes_user_id ON access_codes(user_id);
CREATE INDEX idx_access_codes_is_used ON access_codes(is_used);
CREATE INDEX idx_access_codes_expires_at ON access_codes(expires_at);

-- Notifications table indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- Event registrations table indexes
CREATE INDEX idx_event_registrations_event_id ON event_registrations(event_id);
CREATE INDEX idx_event_registrations_user_id ON event_registrations(user_id);
CREATE INDEX idx_event_registrations_status ON event_registrations(status);

-- Agent reviews table indexes
CREATE INDEX idx_agent_reviews_agent_id ON agent_reviews(agent_id);
CREATE INDEX idx_agent_reviews_reviewer_id ON agent_reviews(reviewer_id);
CREATE INDEX idx_agent_reviews_rating ON agent_reviews(rating);

-- Agent client relationships table indexes
CREATE INDEX idx_agent_client_relationships_agent_id ON agent_client_relationships(agent_id);
CREATE INDEX idx_agent_client_relationships_client_id ON agent_client_relationships(client_id);
CREATE INDEX idx_agent_client_relationships_status ON agent_client_relationships(status);
```

## Foreign Key Constraints

```sql
-- Add foreign key constraints
ALTER TABLE agents ADD CONSTRAINT fk_agents_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE events ADD CONSTRAINT fk_events_agent_id FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE SET NULL;
ALTER TABLE events ADD CONSTRAINT fk_events_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE blog_posts ADD CONSTRAINT fk_blog_posts_author_id FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE blog_images ADD CONSTRAINT fk_blog_images_blog_post_id FOREIGN KEY (blog_post_id) REFERENCES blog_posts(id) ON DELETE CASCADE;
ALTER TABLE blog_post_categories ADD CONSTRAINT fk_blog_post_categories_blog_post_id FOREIGN KEY (blog_post_id) REFERENCES blog_posts(id) ON DELETE CASCADE;
ALTER TABLE blog_post_categories ADD CONSTRAINT fk_blog_post_categories_category_id FOREIGN KEY (category_id) REFERENCES blog_categories(id) ON DELETE CASCADE;
ALTER TABLE quiz_responses ADD CONSTRAINT fk_quiz_responses_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE quiz_responses ADD CONSTRAINT fk_quiz_responses_question_id FOREIGN KEY (question_id) REFERENCES quiz_questions(id) ON DELETE CASCADE;
ALTER TABLE quiz_sessions ADD CONSTRAINT fk_quiz_sessions_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE contests ADD CONSTRAINT fk_contests_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE contest_submissions ADD CONSTRAINT fk_contest_submissions_contest_id FOREIGN KEY (contest_id) REFERENCES contests(id) ON DELETE CASCADE;
ALTER TABLE contest_submissions ADD CONSTRAINT fk_contest_submissions_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE points_transactions ADD CONSTRAINT fk_points_transactions_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE subscriptions ADD CONSTRAINT fk_subscriptions_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE access_codes ADD CONSTRAINT fk_access_codes_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE access_codes ADD CONSTRAINT fk_access_codes_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE notifications ADD CONSTRAINT fk_notifications_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE event_registrations ADD CONSTRAINT fk_event_registrations_event_id FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE;
ALTER TABLE event_registrations ADD CONSTRAINT fk_event_registrations_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE agent_reviews ADD CONSTRAINT fk_agent_reviews_agent_id FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE;
ALTER TABLE agent_reviews ADD CONSTRAINT fk_agent_reviews_reviewer_id FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE agent_client_relationships ADD CONSTRAINT fk_agent_client_relationships_agent_id FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE;
ALTER TABLE agent_client_relationships ADD CONSTRAINT fk_agent_client_relationships_client_id FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE;
```

## Triggers

```sql
-- Update updated_at timestamp on row update
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables with updated_at column
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON agents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blog_categories_updated_at BEFORE UPDATE ON blog_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_quiz_questions_updated_at BEFORE UPDATE ON quiz_questions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contests_updated_at BEFORE UPDATE ON contests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contest_submissions_updated_at BEFORE UPDATE ON contest_submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_access_codes_updated_at BEFORE UPDATE ON access_codes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_agent_reviews_updated_at BEFORE UPDATE ON agent_reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_agent_client_relationships_updated_at BEFORE UPDATE ON agent_client_relationships FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-increment view count on blog posts
CREATE OR REPLACE FUNCTION increment_blog_view_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE blog_posts SET view_count = view_count + 1 WHERE id = NEW.blog_post_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for blog view tracking (when a view is recorded)
-- CREATE TRIGGER increment_blog_view_count_trigger AFTER INSERT ON blog_views FOR EACH ROW EXECUTE FUNCTION increment_blog_view_count();
```

## Sample Data

```sql
-- Insert sample blog categories
INSERT INTO blog_categories (name, slug, description, color) VALUES
('Investment Strategies', 'investment-strategies', 'Articles about investment strategies and portfolio management', '#22c55e'),
('Financial Planning', 'financial-planning', 'Personal finance planning and budgeting tips', '#3b82f6'),
('Insurance Guide', 'insurance-guide', 'Insurance products and coverage information', '#14b8a6'),
('Market Analysis', 'market-analysis', 'Market trends and economic analysis', '#f59e0b'),
('Retirement Planning', 'retirement-planning', 'Retirement savings and planning strategies', '#8b5cf6');

-- Insert sample quiz questions
INSERT INTO quiz_questions (question_text, question_type, options, category) VALUES
('How do you typically make financial decisions?', 'multiple_choice', '["Based on thorough research", "Following expert advice", "Intuition and gut feeling", "Avoiding decisions"]', 'personality'),
('What is your primary financial goal?', 'multiple_choice', '["Building wealth", "Financial security", "Retirement planning", "Emergency fund"]', 'financial_habits'),
('How do you prefer to communicate with financial advisors?', 'multiple_choice', '["Face-to-face meetings", "Phone calls", "Email/Text", "Video calls"]', 'conversation_style');
```

This comprehensive database schema supports all the features of the Persona Centric platform, including the enhanced blog system with multiple images per post. 