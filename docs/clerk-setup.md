# Clerk Setup Instructions

## 1. Clerk Dashboard Configuration

### Authentication Settings
1. Go to User & Authentication → Email, Phone, Username
2. Enable Email addresses (required)
3. Disable phone numbers (optional)
4. Enable usernames (optional)

### User Profile Settings
1. Go to User & Authentication → Personal Information
2. Enable: First name, Last name, Profile image
3. Make First name and Last name required

### Webhooks Setup (CRITICAL)
1. Go to Webhooks → Create Endpoint
2. Endpoint URL: `https://yourdomain.com/api/webhooks/clerk` (use ngrok for local development)
3. Subscribe to events:
   - user.created
   - user.updated 
   - user.deleted
4. Copy the webhook secret to your .env.local as CLERK_WEBHOOK_SECRET

### For Local Development (Using ngrok)
```bash
# Install ngrok
npm install -g ngrok

# In one terminal, start your Next.js app
npm run dev

# In another terminal, expose port 3000
ngrok http 3000

# Copy the ngrok URL (e.g., https://abc123.ngrok.io)
# Add to Clerk webhook: https://abc123.ngrok.io/api/webhooks/clerk
```

## 2. Environment Variables Required

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
```

## 3. JWT Template Setup
1. Go to Sessions → Customize session token
2. Add custom claims for Supabase integration:

```json
{
  "sub": "{{user.id}}",
  "email": "{{user.primary_email_address.email_address}}",
  "app_metadata": {
    "provider": "clerk",
    "user_id": "{{user.id}}"
  },
  "user_metadata": {
    "first_name": "{{user.first_name}}",
    "last_name": "{{user.last_name}}",
    "image_url": "{{user.image_url}}"
  }
}
```
