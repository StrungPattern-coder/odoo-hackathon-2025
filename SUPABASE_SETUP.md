# SkillSync Supabase Backend Setup Guide

This guide will help you set up the complete backend for SkillSync using Supabase.

## 📋 Prerequisites

- Supabase project created
- Clerk integration enabled in Supabase
- Environment variables properly configured

## 🚀 Setup Instructions

### Step 1: Database Schema Setup

1. Go to your Supabase Dashboard → SQL Editor
2. Run the scripts in this exact order:

#### 1.1 Complete Database Setup
```bash
# Copy and paste the entire content from:
supabase/complete-setup.sql
```

#### 1.2 Data Population
```bash
# Copy and paste the entire content from:
supabase/data-population.sql
```

#### 1.3 Storage Setup
```bash
# Copy and paste the entire content from:
supabase/storage-setup.sql
```

### Step 2: Verify Installation

After running all scripts, you should see:
- ✅ 11 database tables created
- ✅ 150+ default skills across 8 categories
- ✅ 20 achievement badges
- ✅ 3 storage buckets for files
- ✅ Row Level Security (RLS) policies applied
- ✅ Real-time subscriptions enabled

### Step 3: Authentication Configuration

#### 3.1 Clerk JWT Template (Supabase)
In your Clerk Dashboard, create a JWT template with:

```json
{
  "aud": "authenticated",
  "exp": "{{user.id}}",
  "iat": "{{date.now_timestamp}}",
  "iss": "https://your-clerk-frontend-api.clerk.accounts.dev",
  "nbf": "{{date.now_timestamp}}",
  "sub": "{{user.id}}",
  "user_metadata": {
    "email": "{{user.primary_email_address.email_address}}",
    "first_name": "{{user.first_name}}",
    "last_name": "{{user.last_name}}",
    "image_url": "{{user.image_url}}"
  }
}
```

#### 3.2 Supabase Auth Settings
In Supabase Dashboard → Authentication → Settings:
- Enable "Use Clerk as external auth provider"
- Add your Clerk JWT template URL

## 🗃️ Database Tables Overview

### Core Tables
- **users**: User profiles with availability, XP, level, admin flags
- **skills**: Skill catalog with categories and approval status
- **user_skills**: What users offer/want with proficiency levels
- **swap_requests**: Skill exchange requests with status tracking
- **feedback**: Reviews and ratings after swaps
- **notifications**: Real-time notifications for users

### Gamification
- **badges**: Achievement badges with criteria
- **user_badges**: User's earned badges

### Admin & Analytics
- **admin_logs**: Admin actions audit trail
- **reports**: Generated analytics reports
- **platform_messages**: System-wide announcements

## 🎯 Key Features

### User Features
- ✅ Profile management (bio, location, availability)
- ✅ Skill listing (offer/want with proficiency levels)
- ✅ Public/private profile toggle
- ✅ Browse/search users by skills
- ✅ Swap request system with accept/reject
- ✅ Real-time notifications
- ✅ Rating and feedback system
- ✅ XP points and leveling system
- ✅ Achievement badges
- ✅ File uploads (profile photos, skill media)

### Admin Features
- ✅ User management (ban/unban)
- ✅ Skill approval system
- ✅ Swap monitoring
- ✅ Platform-wide messaging
- ✅ Analytics and reporting
- ✅ Activity audit logs

### Automatic Features
- ✅ Auto-expire pending swaps (7 days)
- ✅ XP calculation on completed swaps
- ✅ Average rating updates
- ✅ Badge auto-awarding
- ✅ Real-time sync across devices
- ✅ File cleanup for orphaned uploads

## 🔐 Security Features

### Row Level Security (RLS)
- Users can only see public profiles
- Users can only edit their own data
- Banned users are filtered out
- Admins have elevated permissions

### File Storage Security
- Users can only upload to their own folders
- File type and size validation
- Profile photos are public, documents are private
- Automatic orphaned file cleanup

## 📊 Available Skill Categories

1. **Technology** (20 skills): JavaScript, Python, React, etc.
2. **Design** (20 skills): Photoshop, Figma, UI/UX, etc.
3. **Business** (20 skills): Project Management, Marketing, etc.
4. **Language** (20 skills): Spanish, French, Translation, etc.
5. **Music** (20 skills): Guitar, Piano, Production, etc.
6. **Fitness** (20 skills): Yoga, Personal Training, etc.
7. **Cooking** (20 skills): Cooking, Baking, Nutrition, etc.
8. **Art** (20 skills): Drawing, Painting, Photography, etc.
9. **Crafts** (20 skills): Knitting, Gardening, DIY, etc.

## 🏆 Achievement System

20 badges including:
- **First Steps**: Complete profile setup
- **First Swap**: Complete first skill exchange
- **Social Butterfly**: Swap with 10 different users
- **Skill Master**: Reach 1000 XP points
- **Five Star Guru**: Maintain 5.0 rating
- And 15 more achievement badges!

## 🔄 Real-time Features

Real-time subscriptions enabled for:
- Swap requests (instant notifications)
- Feedback (live rating updates)
- User skills (skill updates)
- Platform messages (announcements)
- Notifications (instant alerts)

## 📈 Analytics Functions

Built-in analytics functions:
- `generate_user_activity_report()`: User engagement metrics
- `get_popular_skills_by_category()`: Skill popularity tracking
- `get_skill_recommendations()`: AI-powered skill suggestions
- `get_storage_stats()`: File storage usage

## 🛠️ Maintenance Features

Automated maintenance:
- Auto-expire swap requests after 7 days
- Clean up old notifications (30 days)
- Remove expired reports
- Orphaned file cleanup

## ⚡ Performance Optimizations

- Comprehensive database indexing
- Efficient query patterns
- Pagination support
- Caching-friendly structure
- Optimized for real-time updates

## 🔧 Development Utilities

Helper functions included:
- `search_skills()`: Skill search with filtering
- `create_notification()`: Send notifications
- `validate_file_upload()`: File validation
- `generate_file_path()`: Secure file paths
- `create_admin_user()`: Admin user creation

## 📝 Next Steps

1. **Test the setup**: Create a test user and verify all features work
2. **Configure Clerk webhooks**: Set up user synchronization
3. **Test file uploads**: Verify storage buckets work correctly
4. **Review admin panel**: Test admin functions
5. **Performance testing**: Test with multiple concurrent users

## 🆘 Troubleshooting

### Common Issues

1. **Tables not created**: Check for SQL syntax errors in execution
2. **RLS blocking queries**: Verify user authentication is working
3. **File uploads failing**: Check storage bucket policies
4. **Real-time not working**: Verify realtime is enabled in Supabase

### Support

- Check Supabase logs for detailed error messages
- Verify environment variables are correctly set
- Test Clerk integration with JWT template
- Use Supabase Dashboard → API → Logs for debugging

## 🎉 You're Ready!

Your SkillSync backend is now fully configured with:
- Complete user management system
- Skill exchange functionality
- Real-time notifications
- Admin panel capabilities
- File storage and security
- Analytics and reporting
- Gamification features

The backend is production-ready and scalable! 🚀
