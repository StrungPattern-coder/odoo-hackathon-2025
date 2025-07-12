# 🔐 Admin Access Setup

## Quick Start (2 minutes)

1. **Start the server**: `npm run dev`
2. **Go to admin setup**: `http://localhost:3000/admin/setup`
3. **Create admin user**: Fill form and click "Create Admin User"
4. **Sign up with Clerk**: Use the provided credentials at `http://localhost:3000/sign-up`
5. **Access admin dashboard**: `http://localhost:3000/admin`

## Admin Features

✅ **User Management** - Ban/unban users, view all users  
✅ **Swap Monitoring** - Track all swap requests and statuses  
✅ **Platform Messages** - Send announcements to all users  
✅ **Analytics** - View platform statistics and growth metrics  
✅ **Real-time Updates** - Live data from Supabase  

## Demo Script

For your 20-minute hackathon demo:

1. **Show User Registration** (2 min)
   - Go to `/sign-up` and create a regular user account
   - Show the onboarding process

2. **Show Skill Management** (3 min)
   - Add skills you offer and want
   - Show the skills management interface

3. **Show User Browsing** (3 min)
   - Go to `/browse` and show how users can find each other
   - Demonstrate the search and filter functionality

4. **Show Swap Requests** (5 min)
   - Create a swap request between users
   - Show the real-time acceptance/rejection process
   - Demonstrate the swap management interface

5. **Show Admin Features** (5 min)
   - Go to `/admin` and show the admin dashboard
   - Ban a user to demonstrate admin power
   - Send a platform message
   - Show analytics and user management

6. **Show Real-time Features** (2 min)
   - Open multiple browser tabs to show real-time updates
   - Demonstrate live notifications and swap status changes

## Admin Credentials

Default admin credentials (created via setup page):
- **Email**: `admin@skillswap.com`
- **Password**: `admin123`

## Key URLs

- **Admin Dashboard**: `http://localhost:3000/admin`
- **Admin Setup**: `http://localhost:3000/admin/setup`
- **User Dashboard**: `http://localhost:3000/dashboard`
- **Browse Users**: `http://localhost:3000/browse`
- **Swap Requests**: `http://localhost:3000/dashboard/swaps`

## Troubleshooting

**Can't access admin dashboard?**
1. Make sure you signed up with the admin email
2. Check that the user has `is_admin = true` in the database
3. Try logging out and back in

**Admin user not created?**
1. Check browser console for errors
2. Verify Supabase connection
3. Try the manual SQL method in the full guide

## Full Setup Guide

See `ADMIN_SETUP.md` for detailed instructions and troubleshooting. 