# 🚀 Complete Clerk + Supabase Integration Setup

This guide will help you set up a robust, production-ready authentication and database system for SkillSync using Clerk and Supabase.

## 📋 Prerequisites

1. A Clerk account ([clerk.com](https://clerk.com))
2. A Supabase account ([supabase.com](https://supabase.com))
3. Node.js and npm installed

## 🎯 Step-by-Step Setup

### 1. Supabase Configuration

#### Database Schema
1. Go to your Supabase dashboard → SQL Editor
2. Copy and run the entire `supabase/schema.sql` file
3. This creates all tables, policies, and triggers

#### Authentication Settings
1. Go to Authentication → Settings → Auth Providers
2. Disable all providers except Email (we'll use Clerk)
3. Go to Authentication → Settings
4. **IMPORTANT**: Turn OFF "Enable email confirmations" for faster development

#### Row Level Security (RLS)
- RLS is automatically enabled in the schema
- Policies are configured to work with Clerk's user IDs

#### Realtime Setup
1. Go to Database → Replication
2. Enable realtime for these tables:
   - `swap_requests`
   - `notifications`
   - `feedback`

### 2. Clerk Configuration

#### Create Application
1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create a new application
3. Choose "Email" as authentication method

#### Configure User Profile
1. Go to User & Authentication → Personal Information
2. Enable and make required:
   - First name ✅
   - Last name ✅
   - Profile image ✅

#### JWT Template (CRITICAL)
1. Go to Sessions → Customize Session Token
2. Create a new template called "supabase"
3. Use this configuration:

```json
{
  "sub": "{{user.id}}",
  "email": "{{user.primary_email_address.email_address}}",
  "app_metadata": {
    "provider": "clerk"
  },
  "user_metadata": {
    "first_name": "{{user.first_name}}",
    "last_name": "{{user.last_name}}",
    "image_url": "{{user.image_url}}"
  }
}
```

#### Webhooks Setup
1. Go to Webhooks → Create Endpoint
2. For development, use ngrok:
   ```bash
   npm install -g ngrok
   ngrok http 3000
   ```
3. Endpoint URL: `https://your-ngrok-url.ngrok.io/api/webhooks/clerk`
4. Subscribe to events:
   - `user.created` ✅
   - `user.updated` ✅
   - `user.deleted` ✅
5. Copy webhook secret to your `.env.local`

### 3. Environment Variables

Update your `.env.local` file:

```bash
# Clerk Keys (from Clerk Dashboard → API Keys)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Webhook Secret (from Clerk Dashboard → Webhooks)
CLERK_WEBHOOK_SECRET=whsec_...

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# Supabase (from Supabase Dashboard → Settings → API)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Test the Integration

#### Start Development Server
```bash
npm run dev
```

#### Test Authentication Flow
1. Go to `/sign-up` and create an account
2. Check Supabase → Table Editor → users (should see new user)
3. Go to `/sign-in` and sign in
4. Check webhook logs in Clerk dashboard

#### Test API Endpoints
```bash
# Get user profile (requires authentication)
curl -H "Authorization: Bearer YOUR_CLERK_TOKEN" http://localhost:3000/api/user/profile

# Get skills
curl http://localhost:3000/api/skills

# Add user skill (requires authentication)
curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_CLERK_TOKEN" \
  -d '{"skill_id":"uuid","type":"offered","proficiency_level":4}' \
  http://localhost:3000/api/user/skills
```

## 🔧 Available Components and Hooks

### Client-Side Hooks
```typescript
import { useCurrentUser, useUserSkills, useSkills, useSwapRequests } from '@/hooks/use-auth'

// Get current user data from both Clerk and Supabase
const { clerkUser, supabaseUser, loading, error, isAuthenticated } = useCurrentUser()

// Get user's skills
const { skills, loading, error, refetch } = useUserSkills()

// Get all available skills
const { skills, loading, error } = useSkills()

// Get swap requests with real-time updates
const { swapRequests, loading, error } = useSwapRequests()
```

### Server-Side Utilities
```typescript
import { getCurrentUser, updateUserProfile, getUserSkills } from '@/lib/auth'

// Get current user server-side
const user = await getCurrentUser()

// Update user profile
await updateUserProfile(userId, { bio: "New bio", location: "New location" })

// Get user skills
const skills = await getUserSkills(userId, 'offered')
```

### API Routes Available
- `GET /api/user/profile` - Get current user profile
- `PATCH /api/user/profile` - Update user profile
- `GET /api/user/skills` - Get user skills
- `POST /api/user/skills` - Add user skill
- `DELETE /api/user/skills` - Remove user skill
- `GET /api/skills` - Get all skills
- `POST /api/skills` - Create new skill
- `POST /api/webhooks/clerk` - Clerk webhook handler

## 🔐 Security Features

- **Row Level Security (RLS)**: All database access is restricted by user
- **Clerk Authentication**: Industry-standard authentication
- **JWT Tokens**: Secure token-based authentication
- **Webhook Verification**: All webhooks are verified with signatures
- **Input Validation**: All API endpoints validate input data

## 🚀 Production Deployment

### Environment Variables for Production
1. Update webhook URL to your production domain
2. Set proper CORS origins in Supabase
3. Enable email confirmations in Clerk for production
4. Set up proper error monitoring

### Performance Optimizations
- Real-time subscriptions for live updates
- Optimized queries with proper indexes
- Connection pooling with Supabase
- Client-side caching with React Query (optional)

## 🐛 Troubleshooting

### Common Issues

1. **Webhook not receiving events**
   - Check webhook URL is accessible
   - Verify webhook secret matches
   - Check ngrok is running for development

2. **RLS policy blocking access**
   - Ensure JWT template is configured correctly
   - Check user exists in users table
   - Verify auth.uid() returns correct value

3. **CORS errors**
   - Add your domain to Supabase CORS settings
   - Check environment variables are correct

4. **Database connection issues**
   - Verify Supabase keys are correct
   - Check network connectivity
   - Ensure RLS policies allow access

### Debug Commands
```bash
# Check environment variables
echo $NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

# Test webhook endpoint
curl -X POST http://localhost:3000/api/webhooks/clerk

# Check database connectivity
npm run db:test
```

## ✅ Verification Checklist

- [ ] Supabase database schema applied
- [ ] Clerk JWT template configured
- [ ] Webhook endpoint created and tested
- [ ] Environment variables set
- [ ] User registration working
- [ ] User data syncing between Clerk and Supabase
- [ ] API endpoints responding correctly
- [ ] Real-time subscriptions working
- [ ] RLS policies protecting data

## 🎉 You're Ready!

Your Clerk + Supabase integration is now complete and production-ready! You have:

- ✅ Secure authentication with Clerk
- ✅ Scalable database with Supabase
- ✅ Real-time capabilities
- ✅ Type-safe API routes
- ✅ Comprehensive user management
- ✅ Production-ready security

Start building your SkillSync features! 🚀
