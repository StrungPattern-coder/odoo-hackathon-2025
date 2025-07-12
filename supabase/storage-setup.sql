-- SkillSync Storage Setup for Supabase
-- Run this in Supabase SQL Editor to set up file storage

-- =============================================
-- 1. CREATE STORAGE BUCKETS
-- =============================================

-- Create bucket for profile photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profile-photos',
  'profile-photos',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Create bucket for skill demonstration media
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'skill-media',
  'skill-media',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm']
) ON CONFLICT (id) DO NOTHING;

-- Create bucket for user documents/certificates
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'user-documents',
  'user-documents',
  false, -- Private bucket
  10485760, -- 10MB limit
  ARRAY['application/pdf', 'image/jpeg', 'image/png']
) ON CONFLICT (id) DO NOTHING;

-- =============================================
-- 2. STORAGE POLICIES FOR PROFILE PHOTOS
-- =============================================

-- Allow users to upload their own profile photos
CREATE POLICY "Users can upload their own profile photos"
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'profile-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to view all public profile photos
CREATE POLICY "Public profile photos are viewable by everyone"
ON storage.objects FOR SELECT 
USING (bucket_id = 'profile-photos');

-- Allow users to update their own profile photos
CREATE POLICY "Users can update their own profile photos"
ON storage.objects FOR UPDATE 
USING (
  bucket_id = 'profile-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own profile photos
CREATE POLICY "Users can delete their own profile photos"
ON storage.objects FOR DELETE 
USING (
  bucket_id = 'profile-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- =============================================
-- 3. STORAGE POLICIES FOR SKILL MEDIA
-- =============================================

-- Allow users to upload skill demonstration media
CREATE POLICY "Users can upload skill media"
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'skill-media' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow public viewing of skill media
CREATE POLICY "Skill media is viewable by everyone"
ON storage.objects FOR SELECT 
USING (bucket_id = 'skill-media');

-- Allow users to update their own skill media
CREATE POLICY "Users can update their own skill media"
ON storage.objects FOR UPDATE 
USING (
  bucket_id = 'skill-media' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own skill media
CREATE POLICY "Users can delete their own skill media"
ON storage.objects FOR DELETE 
USING (
  bucket_id = 'skill-media' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- =============================================
-- 4. STORAGE POLICIES FOR USER DOCUMENTS
-- =============================================

-- Allow users to upload their own documents
CREATE POLICY "Users can upload their own documents"
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'user-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to view only their own documents
CREATE POLICY "Users can view only their own documents"
ON storage.objects FOR SELECT 
USING (
  bucket_id = 'user-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to update their own documents
CREATE POLICY "Users can update their own documents"
ON storage.objects FOR UPDATE 
USING (
  bucket_id = 'user-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own documents
CREATE POLICY "Users can delete their own documents"
ON storage.objects FOR DELETE 
USING (
  bucket_id = 'user-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- =============================================
-- 5. HELPER FUNCTIONS FOR FILE MANAGEMENT
-- =============================================

-- Function to generate a secure file path for user uploads
CREATE OR REPLACE FUNCTION generate_file_path(
  user_id TEXT,
  bucket_name TEXT,
  file_extension TEXT,
  prefix TEXT DEFAULT ''
)
RETURNS TEXT AS $$
DECLARE
  timestamp_str TEXT;
  random_str TEXT;
  file_path TEXT;
BEGIN
  -- Generate timestamp string
  timestamp_str := EXTRACT(EPOCH FROM NOW())::TEXT;
  
  -- Generate random string
  random_str := substr(md5(random()::text), 1, 8);
  
  -- Construct file path
  file_path := user_id || '/' || prefix || 
              CASE WHEN prefix != '' THEN '_' ELSE '' END ||
              timestamp_str || '_' || random_str || '.' || file_extension;
  
  RETURN file_path;
END;
$$ LANGUAGE plpgsql;

-- Function to clean up orphaned files (files not referenced in database)
CREATE OR REPLACE FUNCTION cleanup_orphaned_files()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER := 0;
  file_record RECORD;
BEGIN
  -- This function should be run periodically to clean up unused files
  -- For now, it just returns 0, but can be extended to actual cleanup logic
  
  -- Example: Delete profile photos not referenced in users table
  FOR file_record IN 
    SELECT name FROM storage.objects 
    WHERE bucket_id = 'profile-photos'
    AND name NOT IN (
      SELECT REPLACE(image_url, 'https://hdfmecdzljzyfxqdcxhx.supabase.co/storage/v1/object/public/profile-photos/', '')
      FROM users 
      WHERE image_url LIKE '%/storage/v1/object/public/profile-photos/%'
    )
  LOOP
    -- Delete the orphaned file
    DELETE FROM storage.objects 
    WHERE bucket_id = 'profile-photos' AND name = file_record.name;
    deleted_count := deleted_count + 1;
  END LOOP;
  
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- 6. FILE UPLOAD VALIDATION FUNCTIONS
-- =============================================

-- Function to validate file uploads
CREATE OR REPLACE FUNCTION validate_file_upload(
  bucket_name TEXT,
  file_name TEXT,
  file_size BIGINT,
  mime_type TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  bucket_info RECORD;
  is_valid BOOLEAN := false;
BEGIN
  -- Get bucket configuration
  SELECT file_size_limit, allowed_mime_types 
  INTO bucket_info
  FROM storage.buckets 
  WHERE id = bucket_name;
  
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  -- Check file size
  IF file_size > bucket_info.file_size_limit THEN
    RETURN false;
  END IF;
  
  -- Check mime type
  IF mime_type = ANY(bucket_info.allowed_mime_types) THEN
    is_valid := true;
  END IF;
  
  RETURN is_valid;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- 7. PROFILE PHOTO UPDATE TRIGGER
-- =============================================

-- Function to update user profile photo URL when file is uploaded
CREATE OR REPLACE FUNCTION update_user_profile_photo()
RETURNS TRIGGER AS $$
DECLARE
  user_clerk_id TEXT;
  photo_url TEXT;
BEGIN
  -- Extract user clerk ID from file path
  user_clerk_id := (string_to_array(NEW.name, '/'))[1];
  
  -- Construct the public URL
  photo_url := 'https://hdfmecdzljzyfxqdcxhx.supabase.co/storage/v1/object/public/profile-photos/' || NEW.name;
  
  -- Update user record
  UPDATE users 
  SET image_url = photo_url, updated_at = NOW()
  WHERE clerk_id = user_clerk_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for profile photo updates
DROP TRIGGER IF EXISTS profile_photo_update_trigger ON storage.objects;
CREATE TRIGGER profile_photo_update_trigger
  AFTER INSERT ON storage.objects
  FOR EACH ROW
  WHEN (NEW.bucket_id = 'profile-photos')
  EXECUTE FUNCTION update_user_profile_photo();

-- =============================================
-- 8. STORAGE STATISTICS FUNCTION
-- =============================================

-- Function to get storage usage statistics
CREATE OR REPLACE FUNCTION get_storage_stats()
RETURNS JSONB AS $$
DECLARE
  stats JSONB;
BEGIN
  SELECT jsonb_build_object(
    'profile_photos', (
      SELECT jsonb_build_object(
        'total_files', COUNT(*),
        'total_size_mb', ROUND(SUM(metadata->>'size')::NUMERIC / 1048576, 2)
      )
      FROM storage.objects 
      WHERE bucket_id = 'profile-photos'
    ),
    'skill_media', (
      SELECT jsonb_build_object(
        'total_files', COUNT(*),
        'total_size_mb', ROUND(SUM(metadata->>'size')::NUMERIC / 1048576, 2)
      )
      FROM storage.objects 
      WHERE bucket_id = 'skill-media'
    ),
    'user_documents', (
      SELECT jsonb_build_object(
        'total_files', COUNT(*),
        'total_size_mb', ROUND(SUM(metadata->>'size')::NUMERIC / 1048576, 2)
      )
      FROM storage.objects 
      WHERE bucket_id = 'user-documents'
    ),
    'generated_at', NOW()
  ) INTO stats;
  
  RETURN stats;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- 9. SETUP VERIFICATION
-- =============================================

-- Verify storage buckets are created
DO $$
DECLARE
  bucket_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO bucket_count
  FROM storage.buckets
  WHERE id IN ('profile-photos', 'skill-media', 'user-documents');
  
  IF bucket_count = 3 THEN
    RAISE NOTICE 'SUCCESS: All 3 storage buckets created successfully!';
    RAISE NOTICE 'Buckets created: profile-photos, skill-media, user-documents';
  ELSE
    RAISE NOTICE 'WARNING: Only % out of 3 buckets were created.', bucket_count;
  END IF;
END$$;

-- Show bucket configuration
SELECT 
  id as bucket_name,
  public,
  file_size_limit / 1048576 as max_size_mb,
  allowed_mime_types
FROM storage.buckets
WHERE id IN ('profile-photos', 'skill-media', 'user-documents')
ORDER BY id;
