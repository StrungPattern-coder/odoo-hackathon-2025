-- SkillSync Complete Backend Setup for Supabase
-- Run this in Supabase SQL Editor in order

-- =============================================
-- 1. EXTENSIONS AND INITIAL SETUP
-- =============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_cron";

-- =============================================
-- 2. CUSTOM TYPES
-- =============================================
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'availability_status_enum') THEN
        CREATE TYPE availability_status_enum AS ENUM ('available', 'busy', 'offline');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'swap_status_enum') THEN
        CREATE TYPE swap_status_enum AS ENUM ('pending', 'accepted', 'rejected', 'cancelled', 'completed');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'skill_type_enum') THEN
        CREATE TYPE skill_type_enum AS ENUM ('offered', 'wanted');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notification_type_enum') THEN
        CREATE TYPE notification_type_enum AS ENUM ('swap_request', 'swap_accepted', 'swap_rejected', 'feedback', 'badge_earned', 'system', 'admin_message');
    END IF;
END$$;

-- =============================================
-- 3. MAIN TABLES (Enhanced Schema)
-- =============================================

-- Users Table (enhanced with availability and admin features)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  image_url TEXT,
  location TEXT,
  bio TEXT,
  is_public BOOLEAN DEFAULT true,
  availability_status availability_status_enum DEFAULT 'available',
  availability_schedule JSONB DEFAULT '{"weekdays": [], "weekends": [], "evenings": true}',
  xp_points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  total_swaps_completed INTEGER DEFAULT 0,
  average_rating DECIMAL(3,2) DEFAULT 0.0,
  is_admin BOOLEAN DEFAULT false,
  is_banned BOOLEAN DEFAULT false,
  banned_until TIMESTAMP WITH TIME ZONE NULL,
  ban_reason TEXT,
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skills Table (enhanced with categories and approval)
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  is_approved BOOLEAN DEFAULT false,
  approval_notes TEXT,
  submitted_by UUID REFERENCES users(id) ON DELETE SET NULL,
  approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
  approved_at TIMESTAMP WITH TIME ZONE,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Skills Table (what users offer/want)
CREATE TABLE IF NOT EXISTS user_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  type skill_type_enum NOT NULL,
  proficiency_level INTEGER NOT NULL CHECK (proficiency_level BETWEEN 1 AND 5),
  years_experience INTEGER DEFAULT 0,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, skill_id, type)
);

-- Swap Requests Table (enhanced with more details)
CREATE TABLE IF NOT EXISTS swap_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  requester_id UUID REFERENCES users(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES users(id) ON DELETE CASCADE,
  requester_skill_id UUID REFERENCES user_skills(id) ON DELETE CASCADE,
  provider_skill_id UUID REFERENCES user_skills(id) ON DELETE CASCADE,
  status swap_status_enum DEFAULT 'pending',
  message TEXT,
  response_message TEXT,
  proposed_time TIMESTAMP WITH TIME ZONE,
  duration_hours DECIMAL(3,1) DEFAULT 1.0,
  meeting_type TEXT DEFAULT 'online' CHECK (meeting_type IN ('online', 'in_person', 'hybrid')),
  meeting_details JSONB DEFAULT '{}',
  completed_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Feedback Table (enhanced with more details)
CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  swap_request_id UUID REFERENCES swap_requests(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  reviewee_id UUID REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  skills_learned TEXT[],
  would_swap_again BOOLEAN DEFAULT true,
  is_public BOOLEAN DEFAULT true,
  is_flagged BOOLEAN DEFAULT false,
  flag_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(swap_request_id, reviewer_id)
);

-- Badges Table
CREATE TABLE IF NOT EXISTS badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  criteria TEXT NOT NULL,
  xp_requirement INTEGER DEFAULT 0,
  swap_requirement INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Badges Table
CREATE TABLE IF NOT EXISTS user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- Notifications Table (enhanced)
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type notification_type_enum NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  action_url TEXT,
  is_read BOOLEAN DEFAULT false,
  is_email_sent BOOLEAN DEFAULT false,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin Logs Table (enhanced)
CREATE TABLE IF NOT EXISTS admin_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL CHECK (target_type IN ('user', 'skill', 'swap', 'feedback', 'system', 'report')),
  target_id UUID,
  details JSONB NOT NULL,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reports Table (for admin analytics)
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN ('user_activity', 'swap_stats', 'feedback_logs', 'skill_popularity')),
  data JSONB NOT NULL,
  generated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days')
);

-- Platform Messages Table (for admin announcements)
CREATE TABLE IF NOT EXISTS platform_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'warning', 'error', 'success')),
  is_active BOOLEAN DEFAULT true,
  show_until TIMESTAMP WITH TIME ZONE,
  target_users TEXT DEFAULT 'all' CHECK (target_users IN ('all', 'admins', 'users', 'specific')),
  specific_user_ids UUID[],
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 4. INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_availability ON users(availability_status);
CREATE INDEX IF NOT EXISTS idx_users_public ON users(is_public);
CREATE INDEX IF NOT EXISTS idx_users_location ON users(location);
CREATE INDEX IF NOT EXISTS idx_users_last_active ON users(last_active);

CREATE INDEX IF NOT EXISTS idx_skills_name ON skills(name);
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);
CREATE INDEX IF NOT EXISTS idx_skills_approved ON skills(is_approved);

CREATE INDEX IF NOT EXISTS idx_user_skills_user_id ON user_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_skill_id ON user_skills(skill_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_type ON user_skills(type);
CREATE INDEX IF NOT EXISTS idx_user_skills_active ON user_skills(is_active);

CREATE INDEX IF NOT EXISTS idx_swap_requests_requester ON swap_requests(requester_id);
CREATE INDEX IF NOT EXISTS idx_swap_requests_provider ON swap_requests(provider_id);
CREATE INDEX IF NOT EXISTS idx_swap_requests_status ON swap_requests(status);
CREATE INDEX IF NOT EXISTS idx_swap_requests_created ON swap_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_swap_requests_expires ON swap_requests(expires_at);

CREATE INDEX IF NOT EXISTS idx_feedback_reviewee ON feedback(reviewee_id);
CREATE INDEX IF NOT EXISTS idx_feedback_public ON feedback(is_public);
CREATE INDEX IF NOT EXISTS idx_feedback_rating ON feedback(rating);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);

-- =============================================
-- 5. TRIGGER FUNCTIONS
-- =============================================

-- Updated at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- XP and level calculation function
CREATE OR REPLACE FUNCTION calculate_user_xp_and_level()
RETURNS TRIGGER AS $$
DECLARE
  user_id_var UUID;
  total_xp INTEGER;
  new_level INTEGER;
BEGIN
  -- Get user IDs from the swap request
  SELECT requester_id, provider_id INTO user_id_var FROM swap_requests WHERE id = NEW.swap_request_id;
  
  -- Award XP to both users (10 XP per completed swap)
  IF NEW.rating IS NOT NULL THEN
    -- Award XP to reviewee
    UPDATE users 
    SET xp_points = xp_points + 10,
        total_swaps_completed = total_swaps_completed + 1
    WHERE id = NEW.reviewee_id;
    
    -- Calculate new level (every 100 XP = 1 level)
    SELECT xp_points INTO total_xp FROM users WHERE id = NEW.reviewee_id;
    new_level := FLOOR(total_xp / 100) + 1;
    
    UPDATE users SET level = new_level WHERE id = NEW.reviewee_id;
  END IF;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Average rating calculation function
CREATE OR REPLACE FUNCTION update_user_average_rating()
RETURNS TRIGGER AS $$
DECLARE
  avg_rating DECIMAL(3,2);
BEGIN
  SELECT AVG(rating::DECIMAL) INTO avg_rating 
  FROM feedback 
  WHERE reviewee_id = NEW.reviewee_id AND is_public = true;
  
  UPDATE users 
  SET average_rating = COALESCE(avg_rating, 0.0)
  WHERE id = NEW.reviewee_id;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Auto-expire swap requests function
CREATE OR REPLACE FUNCTION auto_expire_swap_requests()
RETURNS void AS $$
BEGIN
  UPDATE swap_requests 
  SET status = 'cancelled', 
      updated_at = NOW()
  WHERE status = 'pending' 
    AND expires_at < NOW();
END;
$$ language 'plpgsql';

-- =============================================
-- 6. TRIGGERS
-- =============================================
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_skills_updated_at ON skills;
CREATE TRIGGER update_skills_updated_at 
  BEFORE UPDATE ON skills 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_swap_requests_updated_at ON swap_requests;
CREATE TRIGGER update_swap_requests_updated_at 
  BEFORE UPDATE ON swap_requests 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS feedback_xp_trigger ON feedback;
CREATE TRIGGER feedback_xp_trigger 
  AFTER INSERT ON feedback 
  FOR EACH ROW EXECUTE FUNCTION calculate_user_xp_and_level();

DROP TRIGGER IF EXISTS feedback_rating_trigger ON feedback;
CREATE TRIGGER feedback_rating_trigger 
  AFTER INSERT OR UPDATE ON feedback 
  FOR EACH ROW EXECUTE FUNCTION update_user_average_rating();

-- =============================================
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE swap_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

-- Users policies
DROP POLICY IF EXISTS "Users can view public profiles" ON users;
CREATE POLICY "Users can view public profiles" ON users 
  FOR SELECT USING (
    is_public = true 
    OR auth.uid()::text = clerk_id 
    OR is_banned = false
  );

DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile" ON users 
  FOR UPDATE USING (auth.uid()::text = clerk_id);

-- User skills policies
DROP POLICY IF EXISTS "Users can view public user skills" ON user_skills;
CREATE POLICY "Users can view public user skills" ON user_skills 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = user_skills.user_id 
        AND (users.is_public = true OR users.clerk_id = auth.uid()::text)
        AND users.is_banned = false
    )
  );

DROP POLICY IF EXISTS "Users can manage own skills" ON user_skills;
CREATE POLICY "Users can manage own skills" ON user_skills 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = user_skills.user_id 
        AND users.clerk_id = auth.uid()::text
        AND users.is_banned = false
    )
  );

-- Swap requests policies
DROP POLICY IF EXISTS "Users can view their swap requests" ON swap_requests;
CREATE POLICY "Users can view their swap requests" ON swap_requests 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE (users.id = swap_requests.requester_id OR users.id = swap_requests.provider_id) 
        AND users.clerk_id = auth.uid()::text
        AND users.is_banned = false
    )
  );

DROP POLICY IF EXISTS "Users can create swap requests" ON swap_requests;
CREATE POLICY "Users can create swap requests" ON swap_requests 
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = swap_requests.requester_id 
        AND users.clerk_id = auth.uid()::text
        AND users.is_banned = false
    )
  );

DROP POLICY IF EXISTS "Users can update their swap requests" ON swap_requests;
CREATE POLICY "Users can update their swap requests" ON swap_requests 
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE (users.id = swap_requests.requester_id OR users.id = swap_requests.provider_id) 
        AND users.clerk_id = auth.uid()::text
        AND users.is_banned = false
    )
  );

-- Feedback policies
DROP POLICY IF EXISTS "Users can view public feedback" ON feedback;
CREATE POLICY "Users can view public feedback" ON feedback 
  FOR SELECT USING (is_public = true AND is_flagged = false);

DROP POLICY IF EXISTS "Users can create feedback" ON feedback;
CREATE POLICY "Users can create feedback for their swaps" ON feedback 
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      JOIN swap_requests ON (swap_requests.requester_id = users.id OR swap_requests.provider_id = users.id)
      WHERE users.clerk_id = auth.uid()::text 
        AND swap_requests.id = feedback.swap_request_id
        AND swap_requests.status = 'completed'
        AND users.is_banned = false
    )
  );

-- Notifications policies
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
CREATE POLICY "Users can view own notifications" ON notifications 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = notifications.user_id 
        AND users.clerk_id = auth.uid()::text
    )
  );

DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
CREATE POLICY "Users can update own notifications" ON notifications 
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = notifications.user_id 
        AND users.clerk_id = auth.uid()::text
    )
  );

-- Admin policies
DROP POLICY IF EXISTS "Admins can view logs" ON admin_logs;
CREATE POLICY "Admins can view logs" ON admin_logs 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.clerk_id = auth.uid()::text 
        AND users.is_admin = true
    )
  );

-- =============================================
-- 8. CRON JOBS (Auto-cleanup)
-- =============================================
-- Auto-expire swap requests every hour
SELECT cron.schedule('auto-expire-swaps', '0 * * * *', 'SELECT auto_expire_swap_requests();');

-- Clean up old notifications every day at midnight
SELECT cron.schedule('cleanup-notifications', '0 0 * * *', '
  DELETE FROM notifications 
  WHERE created_at < NOW() - INTERVAL ''30 days'' 
    AND is_read = true;
');

-- Clean up expired reports every day
SELECT cron.schedule('cleanup-reports', '0 1 * * *', '
  DELETE FROM reports 
  WHERE expires_at < NOW();
');

-- =============================================
-- 9. REALTIME SUBSCRIPTIONS
-- =============================================
ALTER PUBLICATION supabase_realtime ADD TABLE swap_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE feedback;
ALTER PUBLICATION supabase_realtime ADD TABLE user_skills;
ALTER PUBLICATION supabase_realtime ADD TABLE platform_messages;
