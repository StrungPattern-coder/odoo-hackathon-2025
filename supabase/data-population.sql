-- SkillSync Data Population Script
-- Run this AFTER the complete-setup.sql script

-- =============================================
-- 1. INSERT DEFAULT SKILLS BY CATEGORY
-- =============================================

-- Technology Skills
INSERT INTO skills (name, category, is_approved, description) VALUES
  ('JavaScript', 'Technology', true, 'Modern JavaScript programming language for web development'),
  ('Python', 'Technology', true, 'Versatile programming language for web, data science, and automation'),
  ('React', 'Technology', true, 'Popular JavaScript library for building user interfaces'),
  ('Node.js', 'Technology', true, 'JavaScript runtime for server-side development'),
  ('TypeScript', 'Technology', true, 'Typed superset of JavaScript for large applications'),
  ('HTML/CSS', 'Technology', true, 'Fundamental web technologies for structure and styling'),
  ('SQL', 'Technology', true, 'Database query language for data management'),
  ('Git/GitHub', 'Technology', true, 'Version control system for code collaboration'),
  ('Docker', 'Technology', true, 'Containerization platform for application deployment'),
  ('AWS', 'Technology', true, 'Amazon Web Services cloud computing platform'),
  ('MongoDB', 'Technology', true, 'NoSQL database for modern applications'),
  ('PostgreSQL', 'Technology', true, 'Advanced open-source relational database'),
  ('Machine Learning', 'Technology', true, 'AI techniques for data-driven predictions'),
  ('Data Science', 'Technology', true, 'Analysis and interpretation of complex data'),
  ('Cybersecurity', 'Technology', true, 'Protection of digital systems and data'),
  ('Mobile Development', 'Technology', true, 'Creating applications for mobile devices'),
  ('DevOps', 'Technology', true, 'Practices combining development and operations'),
  ('Blockchain', 'Technology', true, 'Distributed ledger technology'),
  ('Flutter', 'Technology', true, 'Cross-platform mobile app development framework'),
  ('Vue.js', 'Technology', true, 'Progressive JavaScript framework for UI development')
ON CONFLICT (name) DO NOTHING;

-- Design Skills
INSERT INTO skills (name, category, is_approved, description) VALUES
  ('Photoshop', 'Design', true, 'Adobe image editing and photo manipulation software'),
  ('Figma', 'Design', true, 'Collaborative design tool for UI/UX projects'),
  ('UI/UX Design', 'Design', true, 'User interface and experience design principles'),
  ('Graphic Design', 'Design', true, 'Visual communication through typography and imagery'),
  ('Illustration', 'Design', true, 'Creating original artwork and visual content'),
  ('Sketch', 'Design', true, 'Vector graphics editor for digital design'),
  ('Adobe Illustrator', 'Design', true, 'Vector graphics software for logos and illustrations'),
  ('InDesign', 'Design', true, 'Desktop publishing software for layouts'),
  ('After Effects', 'Design', true, 'Motion graphics and visual effects software'),
  ('Canva', 'Design', true, 'User-friendly graphic design platform'),
  ('Logo Design', 'Design', true, 'Creating brand identity through logo creation'),
  ('Web Design', 'Design', true, 'Designing websites and web applications'),
  ('Print Design', 'Design', true, 'Creating designs for physical media'),
  ('Brand Identity', 'Design', true, 'Developing consistent visual brand elements'),
  ('3D Modeling', 'Design', true, 'Creating three-dimensional digital objects'),
  ('Animation', 'Design', true, 'Creating moving images and characters'),
  ('Typography', 'Design', true, 'Art and technique of arranging type'),
  ('Color Theory', 'Design', true, 'Understanding color relationships in design'),
  ('Wireframing', 'Design', true, 'Creating blueprint layouts for digital products'),
  ('Prototyping', 'Design', true, 'Building interactive models of designs')
ON CONFLICT (name) DO NOTHING;

-- Business Skills
INSERT INTO skills (name, category, is_approved, description) VALUES
  ('Project Management', 'Business', true, 'Planning and executing projects effectively'),
  ('Digital Marketing', 'Business', true, 'Online marketing strategies and campaigns'),
  ('Excel', 'Business', true, 'Spreadsheet software for data analysis'),
  ('Data Analysis', 'Business', true, 'Interpreting data to make business decisions'),
  ('Sales', 'Business', true, 'Selling products and services to customers'),
  ('Content Writing', 'Business', true, 'Creating engaging written content'),
  ('SEO', 'Business', true, 'Search engine optimization for web visibility'),
  ('Social Media Marketing', 'Business', true, 'Marketing through social media platforms'),
  ('Email Marketing', 'Business', true, 'Direct marketing via email campaigns'),
  ('Business Strategy', 'Business', true, 'Long-term planning for business success'),
  ('Financial Analysis', 'Business', true, 'Evaluating financial data and performance'),
  ('Market Research', 'Business', true, 'Gathering and analyzing market information'),
  ('Customer Service', 'Business', true, 'Supporting and assisting customers'),
  ('Leadership', 'Business', true, 'Guiding and motivating teams'),
  ('Public Speaking', 'Business', true, 'Presenting ideas to audiences effectively'),
  ('Negotiation', 'Business', true, 'Reaching agreements through discussion'),
  ('Time Management', 'Business', true, 'Efficiently organizing and planning time'),
  ('Team Building', 'Business', true, 'Creating effective collaborative teams'),
  ('Consulting', 'Business', true, 'Providing expert advice to organizations'),
  ('Event Planning', 'Business', true, 'Organizing and coordinating events')
ON CONFLICT (name) DO NOTHING;

-- Language Skills
INSERT INTO skills (name, category, is_approved, description) VALUES
  ('Spanish', 'Language', true, 'Speaking and understanding Spanish language'),
  ('French', 'Language', true, 'Speaking and understanding French language'),
  ('German', 'Language', true, 'Speaking and understanding German language'),
  ('Mandarin', 'Language', true, 'Speaking and understanding Mandarin Chinese'),
  ('English', 'Language', true, 'Speaking and understanding English language'),
  ('Japanese', 'Language', true, 'Speaking and understanding Japanese language'),
  ('Portuguese', 'Language', true, 'Speaking and understanding Portuguese language'),
  ('Italian', 'Language', true, 'Speaking and understanding Italian language'),
  ('Russian', 'Language', true, 'Speaking and understanding Russian language'),
  ('Arabic', 'Language', true, 'Speaking and understanding Arabic language'),
  ('Korean', 'Language', true, 'Speaking and understanding Korean language'),
  ('Hindi', 'Language', true, 'Speaking and understanding Hindi language'),
  ('Dutch', 'Language', true, 'Speaking and understanding Dutch language'),
  ('Swedish', 'Language', true, 'Speaking and understanding Swedish language'),
  ('Translation', 'Language', true, 'Converting text from one language to another'),
  ('Interpretation', 'Language', true, 'Oral translation between languages'),
  ('Creative Writing', 'Language', true, 'Writing fiction, poetry, and creative content'),
  ('Technical Writing', 'Language', true, 'Writing technical documentation and manuals'),
  ('Copywriting', 'Language', true, 'Writing persuasive marketing content'),
  ('Proofreading', 'Language', true, 'Reviewing and correcting written text')
ON CONFLICT (name) DO NOTHING;

-- Music Skills
INSERT INTO skills (name, category, is_approved, description) VALUES
  ('Guitar', 'Music', true, 'Playing acoustic or electric guitar'),
  ('Piano', 'Music', true, 'Playing piano or keyboard instruments'),
  ('Singing', 'Music', true, 'Vocal performance and technique'),
  ('Music Production', 'Music', true, 'Recording and producing music tracks'),
  ('Drums', 'Music', true, 'Playing drum kits and percussion'),
  ('Violin', 'Music', true, 'Playing violin and string techniques'),
  ('Bass Guitar', 'Music', true, 'Playing bass guitar in bands'),
  ('Saxophone', 'Music', true, 'Playing saxophone and wind instruments'),
  ('DJ Skills', 'Music', true, 'Mixing and performing as a DJ'),
  ('Music Theory', 'Music', true, 'Understanding musical structure and composition'),
  ('Songwriting', 'Music', true, 'Creating lyrics and melodies'),
  ('Audio Engineering', 'Music', true, 'Recording and mixing audio professionally'),
  ('Trumpet', 'Music', true, 'Playing trumpet and brass instruments'),
  ('Ukulele', 'Music', true, 'Playing ukulele and basic chords'),
  ('Flute', 'Music', true, 'Playing flute and woodwind instruments'),
  ('Cello', 'Music', true, 'Playing cello and string instruments'),
  ('Music Composition', 'Music', true, 'Creating original musical pieces'),
  ('Live Performance', 'Music', true, 'Performing music in front of audiences'),
  ('Music Teaching', 'Music', true, 'Teaching musical instruments and theory'),
  ('Beatboxing', 'Music', true, 'Creating beats and sounds vocally')
ON CONFLICT (name) DO NOTHING;

-- Fitness Skills
INSERT INTO skills (name, category, is_approved, description) VALUES
  ('Yoga', 'Fitness', true, 'Physical and mental practices for flexibility'),
  ('Personal Training', 'Fitness', true, 'Helping others achieve fitness goals'),
  ('Running', 'Fitness', true, 'Distance running and marathon training'),
  ('Weight Training', 'Fitness', true, 'Strength training with weights'),
  ('Dance', 'Fitness', true, 'Various dance styles and choreography'),
  ('Pilates', 'Fitness', true, 'Low-impact exercise for core strength'),
  ('CrossFit', 'Fitness', true, 'High-intensity functional fitness training'),
  ('Swimming', 'Fitness', true, 'Swimming techniques and water fitness'),
  ('Martial Arts', 'Fitness', true, 'Self-defense and combat sports'),
  ('Rock Climbing', 'Fitness', true, 'Indoor and outdoor climbing techniques'),
  ('Cycling', 'Fitness', true, 'Road cycling and mountain biking'),
  ('Hiking', 'Fitness', true, 'Outdoor walking and trail navigation'),
  ('Meditation', 'Fitness', true, 'Mindfulness and mental wellness practices'),
  ('Nutrition Coaching', 'Fitness', true, 'Guidance on healthy eating habits'),
  ('Stretching', 'Fitness', true, 'Flexibility and mobility techniques'),
  ('Cardio Training', 'Fitness', true, 'Cardiovascular fitness and endurance'),
  ('Bodybuilding', 'Fitness', true, 'Muscle building and physique development'),
  ('Zumba', 'Fitness', true, 'High-energy dance fitness program'),
  ('Tai Chi', 'Fitness', true, 'Slow-motion martial arts for wellness'),
  ('Sports Coaching', 'Fitness', true, 'Training athletes in specific sports')
ON CONFLICT (name) DO NOTHING;

-- Cooking Skills
INSERT INTO skills (name, category, is_approved, description) VALUES
  ('Cooking', 'Cooking', true, 'General cooking techniques and recipes'),
  ('Baking', 'Cooking', true, 'Bread, cakes, and pastry preparation'),
  ('Nutrition', 'Cooking', true, 'Understanding healthy eating and meal planning'),
  ('Wine Tasting', 'Cooking', true, 'Wine knowledge and tasting techniques'),
  ('Meal Planning', 'Cooking', true, 'Planning balanced and efficient meals'),
  ('Italian Cuisine', 'Cooking', true, 'Traditional Italian cooking methods'),
  ('Asian Cuisine', 'Cooking', true, 'Various Asian cooking styles and techniques'),
  ('Vegetarian Cooking', 'Cooking', true, 'Plant-based meal preparation'),
  ('Pastry Making', 'Cooking', true, 'Advanced pastry and dessert creation'),
  ('Grilling', 'Cooking', true, 'Outdoor grilling and barbecue techniques'),
  ('Fermentation', 'Cooking', true, 'Fermenting foods for flavor and health'),
  ('Knife Skills', 'Cooking', true, 'Proper knife handling and cutting techniques'),
  ('Food Photography', 'Cooking', true, 'Styling and photographing food'),
  ('Mexican Cuisine', 'Cooking', true, 'Traditional Mexican cooking methods'),
  ('French Cuisine', 'Cooking', true, 'Classic French cooking techniques'),
  ('Cocktail Making', 'Cooking', true, 'Mixology and drink preparation'),
  ('Food Safety', 'Cooking', true, 'Safe food handling and preparation'),
  ('Cake Decorating', 'Cooking', true, 'Artistic cake design and decoration'),
  ('Bread Making', 'Cooking', true, 'Artisan bread baking techniques'),
  ('Spice Blending', 'Cooking', true, 'Creating custom spice mixtures')
ON CONFLICT (name) DO NOTHING;

-- Art Skills
INSERT INTO skills (name, category, is_approved, description) VALUES
  ('Drawing', 'Art', true, 'Sketching and drawing with various mediums'),
  ('Painting', 'Art', true, 'Creating art with paints and brushes'),
  ('Photography', 'Art', true, 'Capturing and editing photographs'),
  ('Sculpting', 'Art', true, 'Creating three-dimensional art pieces'),
  ('Digital Art', 'Art', true, 'Creating art using digital tools'),
  ('Watercolor', 'Art', true, 'Painting with watercolor techniques'),
  ('Oil Painting', 'Art', true, 'Traditional oil painting methods'),
  ('Ceramics', 'Art', true, 'Creating pottery and ceramic art'),
  ('Jewelry Making', 'Art', true, 'Designing and crafting jewelry'),
  ('Calligraphy', 'Art', true, 'Decorative handwriting and lettering'),
  ('Portrait Drawing', 'Art', true, 'Drawing realistic human portraits'),
  ('Landscape Painting', 'Art', true, 'Painting natural outdoor scenes'),
  ('Abstract Art', 'Art', true, 'Non-representational artistic expression'),
  ('Street Art', 'Art', true, 'Urban art and graffiti techniques'),
  ('Printmaking', 'Art', true, 'Creating art through printing processes'),
  ('Mixed Media', 'Art', true, 'Combining different artistic materials'),
  ('Comic Art', 'Art', true, 'Creating comics and graphic novels'),
  ('Fashion Design', 'Art', true, 'Designing clothing and accessories'),
  ('Interior Design', 'Art', true, 'Designing interior spaces'),
  ('Woodworking', 'Art', true, 'Creating objects from wood')
ON CONFLICT (name) DO NOTHING;

-- Crafts & Hobbies
INSERT INTO skills (name, category, is_approved, description) VALUES
  ('Knitting', 'Crafts', true, 'Creating fabric through interlocking loops'),
  ('Sewing', 'Crafts', true, 'Joining fabrics and materials with stitches'),
  ('Gardening', 'Crafts', true, 'Growing plants and maintaining gardens'),
  ('DIY Projects', 'Crafts', true, 'Do-it-yourself home improvement projects'),
  ('Origami', 'Crafts', true, 'Japanese art of paper folding'),
  ('Embroidery', 'Crafts', true, 'Decorative stitching on fabric'),
  ('Crocheting', 'Crafts', true, 'Creating fabric with hooked needles'),
  ('Scrapbooking', 'Crafts', true, 'Creating decorative photo albums'),
  ('Candle Making', 'Crafts', true, 'Creating custom candles'),
  ('Soap Making', 'Crafts', true, 'Creating handmade soaps'),
  ('Quilting', 'Crafts', true, 'Creating quilts through stitching layers'),
  ('Macramé', 'Crafts', true, 'Creating textiles through knotting'),
  ('Leather Working', 'Crafts', true, 'Crafting items from leather'),
  ('Glass Blowing', 'Crafts', true, 'Shaping glass through blowing techniques'),
  ('Blacksmithing', 'Crafts', true, 'Metalworking and forging'),
  ('Bookbinding', 'Crafts', true, 'Creating and repairing books'),
  ('Miniature Making', 'Crafts', true, 'Creating small-scale models'),
  ('Bead Making', 'Crafts', true, 'Creating jewelry and art with beads'),
  ('Paper Crafts', 'Crafts', true, 'Creating art and objects from paper'),
  ('Upcycling', 'Crafts', true, 'Repurposing items into new creations')
ON CONFLICT (name) DO NOTHING;

-- =============================================
-- 2. INSERT DEFAULT BADGES
-- =============================================
INSERT INTO badges (name, description, icon, color, criteria, xp_requirement, swap_requirement) VALUES
  ('First Steps', 'Welcome to SkillSync! Complete your profile setup.', '👋', '#10B981', 'Complete profile with bio, skills, and availability', 0, 0),
  ('First Swap', 'Complete your first skill swap exchange.', '🤝', '#3B82F6', 'Complete 1 successful swap', 10, 1),
  ('Social Butterfly', 'Connect with people from different backgrounds.', '🦋', '#8B5CF6', 'Swap with 10 different users', 100, 10),
  ('Skill Collector', 'Learn a variety of new skills.', '📚', '#F59E0B', 'Learn skills from 5 different categories', 150, 5),
  ('Teacher''s Pet', 'Help others learn and grow.', '👨‍🏫', '#EF4444', 'Complete 15 swaps as a skill provider', 200, 15),
  ('Eager Student', 'Always ready to learn something new.', '🎓', '#06B6D4', 'Complete 15 swaps as a skill requester', 200, 15),
  ('Top Swapper', 'A seasoned skill swapper.', '🏆', '#DC2626', 'Complete 25 successful swaps', 500, 25),
  ('Five Star Guru', 'Maintain excellence in teaching.', '⭐', '#F97316', 'Maintain 5.0 average rating with 10+ reviews', 300, 10),
  ('Skill Master', 'Reach mastery level in the platform.', '🎯', '#7C3AED', 'Earn 1000 XP points', 1000, 0),
  ('Explorer', 'Try skills from many different areas.', '🧭', '#84CC16', 'Swap skills in 8 different categories', 400, 20),
  ('Community Helper', 'Active contributor to the community.', '🤲', '#EC4899', 'Receive 50 positive feedbacks', 750, 30),
  ('Speed Learner', 'Quick to pick up new skills.', '⚡', '#14B8A6', 'Complete 10 swaps in one month', 200, 10),
  ('Mentor', 'Guide and inspire others.', '🧙‍♂️', '#6366F1', 'Help 20 people achieve their goals', 600, 20),
  ('Global Connector', 'Connect across cultures and languages.', '🌍', '#059669', 'Swap with users from 5 different countries', 300, 15),
  ('Night Owl', 'Active during evening hours.', '🦉', '#7C2D12', 'Complete 10 swaps scheduled for evenings', 150, 10),
  ('Weekend Warrior', 'Makes the most of weekends.', '🛡️', '#BE123C', 'Complete 10 swaps during weekends', 150, 10),
  ('Quality Assurance', 'Consistently provides excellent experiences.', '✅', '#166534', 'Maintain 4.5+ rating with 20+ reviews', 400, 20),
  ('Innovation Pioneer', 'Among the first to try new platform features.', '🚀', '#1E40AF', 'Use 5 different platform features', 100, 5),
  ('Feedback Champion', 'Helps others improve through thoughtful feedback.', '💬', '#DC2626', 'Leave 25 detailed feedback reviews', 250, 25),
  ('Consistency King', 'Regular and reliable platform user.', '👑', '#FBBF24', 'Active for 6 consecutive months', 500, 0)
ON CONFLICT (name) DO NOTHING;

-- =============================================
-- 3. CREATE FIRST ADMIN USER FUNCTION
-- =============================================
CREATE OR REPLACE FUNCTION create_admin_user(clerk_user_id TEXT, user_email TEXT, first_name TEXT, last_name TEXT)
RETURNS UUID AS $$
DECLARE
    user_id UUID;
BEGIN
    INSERT INTO users (clerk_id, email, first_name, last_name, is_admin, xp_points, level)
    VALUES (clerk_user_id, user_email, first_name, last_name, true, 1000, 10)
    RETURNING id INTO user_id;
    
    -- Give admin all badges
    INSERT INTO user_badges (user_id, badge_id)
    SELECT user_id, id FROM badges;
    
    RETURN user_id;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- 4. UTILITY FUNCTIONS FOR SKILL MANAGEMENT
-- =============================================

-- Function to suggest skills based on user input
CREATE OR REPLACE FUNCTION search_skills(search_term TEXT, category_filter TEXT DEFAULT NULL)
RETURNS TABLE(
    id UUID,
    name TEXT,
    category TEXT,
    description TEXT,
    usage_count INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT s.id, s.name, s.category, s.description, s.usage_count
    FROM skills s
    WHERE s.is_approved = true
        AND (search_term IS NULL OR s.name ILIKE '%' || search_term || '%' OR s.description ILIKE '%' || search_term || '%')
        AND (category_filter IS NULL OR s.category = category_filter)
    ORDER BY s.usage_count DESC, s.name ASC;
END;
$$ LANGUAGE plpgsql;

-- Function to get popular skills by category
CREATE OR REPLACE FUNCTION get_popular_skills_by_category()
RETURNS TABLE(
    category TEXT,
    skill_name TEXT,
    skill_id UUID,
    user_count INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT s.category, s.name, s.id, COUNT(us.id)::INTEGER as user_count
    FROM skills s
    LEFT JOIN user_skills us ON s.id = us.skill_id
    WHERE s.is_approved = true
    GROUP BY s.category, s.name, s.id
    ORDER BY s.category, user_count DESC, s.name;
END;
$$ LANGUAGE plpgsql;

-- Function to get skill recommendations for a user
CREATE OR REPLACE FUNCTION get_skill_recommendations(user_id_param UUID, limit_count INTEGER DEFAULT 10)
RETURNS TABLE(
    skill_id UUID,
    skill_name TEXT,
    category TEXT,
    match_score INTEGER
) AS $$
BEGIN
    RETURN QUERY
    WITH user_categories AS (
        SELECT DISTINCT s.category
        FROM user_skills us
        JOIN skills s ON us.skill_id = s.id
        WHERE us.user_id = user_id_param
    ),
    recommended_skills AS (
        SELECT s.id, s.name, s.category,
               CASE 
                   WHEN s.category IN (SELECT category FROM user_categories) THEN 3
                   ELSE 1
               END + s.usage_count / 10 as score
        FROM skills s
        WHERE s.is_approved = true
          AND s.id NOT IN (
              SELECT skill_id FROM user_skills WHERE user_id = user_id_param
          )
    )
    SELECT rs.id, rs.name, rs.category, rs.score
    FROM recommended_skills rs
    ORDER BY rs.score DESC, rs.name
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- 5. NOTIFICATION HELPER FUNCTIONS
-- =============================================

-- Function to create notifications
CREATE OR REPLACE FUNCTION create_notification(
    user_id_param UUID,
    type_param notification_type_enum,
    title_param TEXT,
    message_param TEXT,
    data_param JSONB DEFAULT '{}',
    action_url_param TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    notification_id UUID;
BEGIN
    INSERT INTO notifications (user_id, type, title, message, data, action_url)
    VALUES (user_id_param, type_param, title_param, message_param, data_param, action_url_param)
    RETURNING id INTO notification_id;
    
    RETURN notification_id;
END;
$$ LANGUAGE plpgsql;

-- Function to send swap request notification
CREATE OR REPLACE FUNCTION notify_swap_request()
RETURNS TRIGGER AS $$
DECLARE
    provider_name TEXT;
    requester_name TEXT;
    skill_name TEXT;
BEGIN
    -- Get provider and requester names
    SELECT first_name || ' ' || last_name INTO provider_name
    FROM users WHERE id = NEW.provider_id;
    
    SELECT first_name || ' ' || last_name INTO requester_name
    FROM users WHERE id = NEW.requester_id;
    
    -- Get skill name
    SELECT s.name INTO skill_name
    FROM user_skills us
    JOIN skills s ON us.skill_id = s.id
    WHERE us.id = NEW.provider_skill_id;
    
    -- Create notification for provider
    PERFORM create_notification(
        NEW.provider_id,
        'swap_request',
        'New Swap Request',
        requester_name || ' wants to learn ' || skill_name || ' from you!',
        jsonb_build_object('swap_request_id', NEW.id, 'requester_id', NEW.requester_id),
        '/dashboard/swaps/' || NEW.id
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for swap request notifications
DROP TRIGGER IF EXISTS swap_request_notification_trigger ON swap_requests;
CREATE TRIGGER swap_request_notification_trigger
    AFTER INSERT ON swap_requests
    FOR EACH ROW
    EXECUTE FUNCTION notify_swap_request();

-- =============================================
-- 6. ANALYTICS FUNCTIONS
-- =============================================

-- Function to generate user activity report
CREATE OR REPLACE FUNCTION generate_user_activity_report(date_from DATE DEFAULT CURRENT_DATE - INTERVAL '30 days')
RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'total_users', (SELECT COUNT(*) FROM users WHERE created_at >= date_from),
        'active_users', (SELECT COUNT(*) FROM users WHERE last_active >= date_from),
        'total_swaps', (SELECT COUNT(*) FROM swap_requests WHERE created_at >= date_from),
        'completed_swaps', (SELECT COUNT(*) FROM swap_requests WHERE status = 'completed' AND created_at >= date_from),
        'pending_swaps', (SELECT COUNT(*) FROM swap_requests WHERE status = 'pending'),
        'top_skills', (
            SELECT jsonb_agg(jsonb_build_object('skill', skill_name, 'count', skill_count))
            FROM (
                SELECT s.name as skill_name, COUNT(us.id) as skill_count
                FROM skills s
                JOIN user_skills us ON s.id = us.skill_id
                GROUP BY s.name
                ORDER BY skill_count DESC
                LIMIT 10
            ) top_skills_data
        ),
        'generated_at', NOW()
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- 7. SAMPLE DATA (Optional - for testing)
-- =============================================

-- You can uncomment these lines if you want some sample data for testing
/*
-- Create a sample admin user (replace with your actual Clerk ID)
-- SELECT create_admin_user('user_abc123', 'admin@skillsync.com', 'Admin', 'User');

-- Create some sample skills requests (for testing)
INSERT INTO skills (name, category, is_approved, description, submitted_by) VALUES
  ('Advanced React Patterns', 'Technology', false, 'Complex React patterns like render props and compound components', NULL),
  ('Sourdough Bread Making', 'Cooking', false, 'Traditional sourdough fermentation and baking techniques', NULL),
  ('Urban Sketching', 'Art', false, 'Drawing cityscapes and urban environments on location', NULL);
*/

-- =============================================
-- 8. FINAL SETUP VERIFICATION
-- =============================================

-- Verify all tables exist
DO $$
DECLARE
    table_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO table_count
    FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name IN ('users', 'skills', 'user_skills', 'swap_requests', 'feedback', 'badges', 'user_badges', 'notifications', 'admin_logs', 'reports', 'platform_messages');
    
    IF table_count = 11 THEN
        RAISE NOTICE 'SUCCESS: All 11 required tables have been created successfully!';
    ELSE
        RAISE NOTICE 'WARNING: Only % out of 11 tables were created. Please check for errors.', table_count;
    END IF;
END$$;

-- Show skill counts by category
SELECT 
    category,
    COUNT(*) as skill_count
FROM skills
WHERE is_approved = true
GROUP BY category
ORDER BY skill_count DESC;
