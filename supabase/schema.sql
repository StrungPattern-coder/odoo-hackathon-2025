-- SkillSync Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table (extends Clerk user data)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  image_url TEXT,
  location TEXT,
  bio TEXT,
  is_public BOOLEAN DEFAULT true,
  availability_status TEXT DEFAULT 'available' CHECK (availability_status IN ('available', 'busy', 'offline')),
  xp_points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  is_banned BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skills Table
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Skills Table (what users offer/want)
CREATE TABLE user_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('offered', 'wanted')),
  proficiency_level INTEGER NOT NULL CHECK (proficiency_level BETWEEN 1 AND 5),
  years_experience INTEGER,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, skill_id, type)
);

-- Swap Requests Table
CREATE TABLE swap_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  requester_id UUID REFERENCES users(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES users(id) ON DELETE CASCADE,
  requester_skill_id UUID REFERENCES user_skills(id) ON DELETE CASCADE,
  provider_skill_id UUID REFERENCES user_skills(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'cancelled', 'completed')),
  message TEXT,
  proposed_time TIMESTAMP WITH TIME ZONE,
  duration_hours DECIMAL(3,1),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Feedback Table
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  swap_request_id UUID REFERENCES swap_requests(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  reviewee_id UUID REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(swap_request_id, reviewer_id)
);

-- Badges Table
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  criteria TEXT NOT NULL,
  xp_requirement INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Badges Table
CREATE TABLE user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- Notifications Table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('swap_request', 'swap_accepted', 'swap_rejected', 'feedback', 'badge_earned', 'system')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin Logs Table
CREATE TABLE admin_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL CHECK (target_type IN ('user', 'skill', 'swap', 'feedback', 'system')),
  target_id UUID,
  details JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_clerk_id ON users(clerk_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_user_skills_user_id ON user_skills(user_id);
CREATE INDEX idx_user_skills_skill_id ON user_skills(skill_id);
CREATE INDEX idx_user_skills_type ON user_skills(type);
CREATE INDEX idx_swap_requests_requester_id ON swap_requests(requester_id);
CREATE INDEX idx_swap_requests_provider_id ON swap_requests(provider_id);
CREATE INDEX idx_swap_requests_status ON swap_requests(status);
CREATE INDEX idx_feedback_reviewee_id ON feedback(reviewee_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON skills FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_swap_requests_updated_at BEFORE UPDATE ON swap_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE swap_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users can read public profiles and update their own
CREATE POLICY "Users can view public profiles" ON users FOR SELECT USING (is_public = true OR auth.uid()::text = clerk_id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid()::text = clerk_id);

-- User skills policies
CREATE POLICY "Users can view public user skills" ON user_skills FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = user_skills.user_id AND (users.is_public = true OR users.clerk_id = auth.uid()::text))
);
CREATE POLICY "Users can manage own skills" ON user_skills FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = user_skills.user_id AND users.clerk_id = auth.uid()::text)
);

-- Swap requests policies
CREATE POLICY "Users can view their swap requests" ON swap_requests FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE (users.id = swap_requests.requester_id OR users.id = swap_requests.provider_id) AND users.clerk_id = auth.uid()::text)
);
CREATE POLICY "Users can create swap requests" ON swap_requests FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM users WHERE users.id = swap_requests.requester_id AND users.clerk_id = auth.uid()::text)
);
CREATE POLICY "Users can update their swap requests" ON swap_requests FOR UPDATE USING (
  EXISTS (SELECT 1 FROM users WHERE (users.id = swap_requests.requester_id OR users.id = swap_requests.provider_id) AND users.clerk_id = auth.uid()::text)
);

-- Feedback policies
CREATE POLICY "Users can view public feedback" ON feedback FOR SELECT USING (is_public = true);
CREATE POLICY "Users can create feedback for their swaps" ON feedback FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM users 
    JOIN swap_requests ON swap_requests.requester_id = users.id OR swap_requests.provider_id = users.id
    WHERE users.clerk_id = auth.uid()::text AND swap_requests.id = feedback.swap_request_id
  )
);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = notifications.user_id AND users.clerk_id = auth.uid()::text)
);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = notifications.user_id AND users.clerk_id = auth.uid()::text)
);

-- Insert default skill categories
INSERT INTO skills (name, category, is_approved) VALUES
  ('JavaScript', 'Technology', true),
  ('Python', 'Technology', true),
  ('React', 'Technology', true),
  ('Node.js', 'Technology', true),
  ('TypeScript', 'Technology', true),
  ('Photoshop', 'Design', true),
  ('Figma', 'Design', true),
  ('UI/UX Design', 'Design', true),
  ('Graphic Design', 'Design', true),
  ('Illustration', 'Design', true),
  ('Project Management', 'Business', true),
  ('Digital Marketing', 'Business', true),
  ('Excel', 'Business', true),
  ('Data Analysis', 'Business', true),
  ('Sales', 'Business', true),
  ('Spanish', 'Language', true),
  ('French', 'Language', true),
  ('German', 'Language', true),
  ('Mandarin', 'Language', true),
  ('English', 'Language', true),
  ('Guitar', 'Music', true),
  ('Piano', 'Music', true),
  ('Singing', 'Music', true),
  ('Music Production', 'Music', true),
  ('Drums', 'Music', true),
  ('Yoga', 'Fitness', true),
  ('Personal Training', 'Fitness', true),
  ('Running', 'Fitness', true),
  ('Weight Training', 'Fitness', true),
  ('Dance', 'Fitness', true),
  ('Cooking', 'Cooking', true),
  ('Baking', 'Cooking', true),
  ('Nutrition', 'Cooking', true),
  ('Wine Tasting', 'Cooking', true),
  ('Meal Planning', 'Cooking', true),
  ('Drawing', 'Art', true),
  ('Painting', 'Art', true),
  ('Photography', 'Art', true),
  ('Sculpting', 'Art', true),
  ('Digital Art', 'Art', true);

-- Insert default badges
INSERT INTO badges (name, description, icon, color, criteria, xp_requirement) VALUES
  ('First Swap', 'Complete your first skill swap', '🤝', '#10B981', 'Complete 1 swap', 0),
  ('Social Butterfly', 'Connect with 10 different people', '🦋', '#3B82F6', 'Swap with 10 users', 100),
  ('Skill Master', 'Reach 1000 XP points', '⭐', '#F59E0B', 'Earn 1000 XP', 1000),
  ('Top Swapper', 'Complete 25 successful swaps', '🏆', '#EF4444', 'Complete 25 swaps', 500),
  ('Teacher', 'Help 15 people learn new skills', '👨‍🏫', '#8B5CF6', 'Complete 15 swaps as provider', 300),
  ('Student', 'Learn 15 new skills', '🎓', '#06B6D4', 'Complete 15 swaps as requester', 300),
  ('Guru', 'Maintain 5-star average rating', '🧘', '#F97316', 'Maintain 5.0 rating with 10+ reviews', 200),
  ('Explorer', 'Try skills from 5 different categories', '🧭', '#84CC16', 'Swap in 5 categories', 150);

-- Enable real-time subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE swap_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE feedback;
