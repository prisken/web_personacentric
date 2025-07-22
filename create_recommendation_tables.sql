-- Create badges table
CREATE TABLE IF NOT EXISTS badges (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon_url VARCHAR(500),
    points_required INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create recommendations table
CREATE TABLE IF NOT EXISTS recommendations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    image_url VARCHAR(500),
    external_link VARCHAR(500),
    likes_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create recommendation_engagements table
CREATE TABLE IF NOT EXISTS recommendation_engagements (
    id SERIAL PRIMARY KEY,
    recommendation_id INTEGER NOT NULL,
    visitor_email VARCHAR(255) NOT NULL,
    engagement_type VARCHAR(50) NOT NULL, -- 'like', 'view', 'click'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(recommendation_id, visitor_email, engagement_type)
);

-- Create user_badges table
CREATE TABLE IF NOT EXISTS user_badges (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    badge_id INTEGER NOT NULL,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, badge_id)
);

-- Insert sample badge data
INSERT INTO badges (name, description, icon_url, points_required) VALUES
('First Recommendation', 'Created your first recommendation', '🎯', 1),
('Popular Creator', 'Received 10 likes on your recommendations', '⭐', 10),
('Trending', 'Had a recommendation viewed 50+ times', '🔥', 50),
('Community Leader', 'Created 20+ recommendations', '👑', 20),
('Engagement Master', 'Received 100+ total engagements', '🏆', 100);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_recommendations_user_id ON recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_recommendation_engagements_recommendation_id ON recommendation_engagements(recommendation_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_badge_id ON user_badges(badge_id); 