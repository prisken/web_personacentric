-- Create badges table
CREATE TABLE IF NOT EXISTS badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    category VARCHAR(50),
    requirement_type VARCHAR(50),
    requirement_value INTEGER,
    points_reward INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create recommendations table
CREATE TABLE IF NOT EXISTS recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL CHECK (category IN ('movie', 'restaurant', 'gift', 'book', 'event', 'app')),
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    why_recommend TEXT NOT NULL,
    link VARCHAR(500),
    location VARCHAR(255),
    photo_url VARCHAR(500),
    share_code VARCHAR(20) NOT NULL UNIQUE,
    total_views INTEGER DEFAULT 0,
    total_engagements INTEGER DEFAULT 0,
    total_signups INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'moderated')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create recommendation_engagements table
CREATE TABLE IF NOT EXISTS recommendation_engagements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recommendation_id UUID NOT NULL REFERENCES recommendations(id) ON DELETE CASCADE,
    visitor_email VARCHAR(255),
    engagement_type VARCHAR(50) NOT NULL CHECK (engagement_type IN ('view', 'like', 'share', 'signup')),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create user_badges table
CREATE TABLE IF NOT EXISTS user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, badge_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_recommendations_user_id ON recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_category ON recommendations(category);
CREATE INDEX IF NOT EXISTS idx_recommendations_share_code ON recommendations(share_code);
CREATE INDEX IF NOT EXISTS idx_recommendations_status ON recommendations(status);
CREATE INDEX IF NOT EXISTS idx_recommendations_created_at ON recommendations(created_at);

CREATE INDEX IF NOT EXISTS idx_recommendation_engagements_recommendation_id ON recommendation_engagements(recommendation_id);
CREATE INDEX IF NOT EXISTS idx_recommendation_engagements_engagement_type ON recommendation_engagements(engagement_type);
CREATE INDEX IF NOT EXISTS idx_recommendation_engagements_created_at ON recommendation_engagements(created_at);

CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_badge_id ON user_badges(badge_id);

-- Insert some sample badges
INSERT INTO badges (name, description, icon, category, requirement_type, requirement_value, points_reward) VALUES
('First Recommendation', 'Created your first recommendation', '🌟', 'general', 'count', 1, 50),
('Movie Master', 'Created 10 movie recommendations', '🎬', 'movie', 'count', 10, 200),
('Foodie', 'Created 5 restaurant recommendations', '🍽️', 'restaurant', 'count', 5, 150),
('Gift Guru', 'Created 8 gift recommendations', '🎁', 'gift', 'count', 8, 180),
('Bookworm', 'Created 6 book recommendations', '📚', 'book', 'count', 6, 160),
('Event Enthusiast', 'Created 4 event recommendations', '🎪', 'event', 'count', 4, 120),
('Tech Savvy', 'Created 7 app recommendations', '📱', 'app', 'count', 7, 170),
('Engagement King', 'Received 50 total engagements', '👑', 'general', 'engagement', 50, 300),
('Viral Sensation', 'Received 100 total views', '🔥', 'general', 'engagement', 100, 250),
('Community Builder', 'Helped 10 people sign up', '🌱', 'general', 'engagement', 10, 500)
ON CONFLICT DO NOTHING; 