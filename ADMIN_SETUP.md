# 🔐 Admin Setup Guide for SkillSync

This guide will help you set up admin access for the SkillSync platform on localhost.

## 🚀 Quick Start

### Step 1: Access Admin Setup Page
1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the admin setup page:
   ```
   http://localhost:3000/admin/setup
   ```

3. Fill in the admin details and click "Create Admin User"

### Step 2: Sign Up with Clerk
1. Go to `http://localhost:3000/sign-up`
2. Use the credentials provided by the setup page:
   - Email: `admin@skillswap.com` (or your custom email)
   - Password: `admin123`
3. Complete the sign-up process

### Step 3: Access Admin Dashboard
1. After signing up, you'll be redirected to the dashboard
2. Navigate to `http://localhost:3000/admin`
3. You should now have full admin access!

## 🔧 Manual Setup (Alternative)

If the automatic setup doesn't work, you can manually create an admin user:

### Option 1: Using Supabase Dashboard
1. Go to your Supabase Dashboard → SQL Editor
2. Run this SQL command:
   ```sql
   INSERT INTO users (clerk_id, email, first_name, last_name, is_admin, xp_points, level)
   VALUES ('admin_user_123', 'admin@skillswap.com', 'Admin', 'User', true, 1000, 10);
   ```

### Option 2: Using the API
1. Make sure you're signed in to the platform
2. Send a POST request to `/api/admin/create-admin`:
   ```bash
   curl -X POST http://localhost:3000/api/admin/create-admin \
     -H "Content-Type: application/json" \
     -d '{
       "email": "admin@skillswap.com",
       "first_name": "Admin",
       "last_name": "User"
     }'
   ```

## 🛡️ Admin Features

Once you have admin access, you can:

### User Management
- View all users in the system
- Ban/unban users
- Monitor user activity

### Swap Monitoring
- View all swap requests
- Monitor swap statuses
- Track completed swaps

### Platform Messages
- Send platform-wide announcements
- Create system notifications
- Manage user communications

### Analytics
- View platform statistics
- Monitor user growth
- Track swap completion rates

## 🔒 Security Notes

### Development vs Production
- **Development**: Admin setup is open for easy testing
- **Production**: Remove the `/admin/setup` route and use proper admin creation methods

### Admin Privileges
- Admins can ban/unban users
- Admins can send platform messages
- Admins can view all user data
- Admins can monitor all swap requests

### Best Practices
1. Use strong passwords for admin accounts
2. Limit admin access to trusted users only
3. Regularly audit admin actions
4. Use environment variables for sensitive admin settings

## 🐛 Troubleshooting

### "Access Denied" Error
- Make sure you've signed up with the admin email
- Check that the user exists in the database with `is_admin = true`
- Verify your Clerk authentication is working

### Admin User Not Created
- Check the browser console for errors
- Verify your Supabase connection
- Ensure the database schema is properly set up

### Can't Access Admin Dashboard
- Make sure you're signed in
- Check that your user has `is_admin = true` in the database
- Try logging out and back in

## 📊 Database Schema

The admin functionality relies on these database fields:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY,
  clerk_id TEXT UNIQUE,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  is_admin BOOLEAN DEFAULT false,  -- This field controls admin access
  is_banned BOOLEAN DEFAULT false,
  -- ... other fields
);
```

## 🎯 Demo Features

For your hackathon demo, you can showcase:

1. **User Management**: Show how to ban a problematic user
2. **Swap Monitoring**: Display real-time swap statistics
3. **Platform Messages**: Send a test announcement
4. **Analytics**: Show platform growth metrics

## 🔗 Quick Links

- **Admin Dashboard**: `http://localhost:3000/admin`
- **Admin Setup**: `http://localhost:3000/admin/setup`
- **User Dashboard**: `http://localhost:3000/dashboard`
- **Browse Users**: `http://localhost:3000/browse`

## 📝 Environment Variables

Make sure these are set in your `.env.local`:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

---

**Happy Admin-ing! 🎉** 