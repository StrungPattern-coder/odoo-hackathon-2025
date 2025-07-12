# Supabase Setup Instructions

## 1. Database Schema Setup
1. Go to your Supabase dashboard → SQL Editor
2. Run the schema.sql file to create all tables and policies
3. Enable Row Level Security (RLS) on all tables

## 2. Authentication Configuration
1. Go to Authentication → Settings
2. Disable email confirmations (for faster development): 
   - Turn OFF "Enable email confirmations"
3. Enable custom JWT claims in Authentication → Settings → JWT Template
4. Add this custom JWT template:

```json
{
  "aud": "authenticated",
  "exp": {{ .Exp }},
  "iat": {{ .Iat }},
  "iss": "{{ .Issuer }}",
  "sub": "{{ .Subject }}",
  "email": "{{ .Email }}",
  "phone": "{{ .Phone }}",
  "app_metadata": {{ .AppMetaData }},
  "user_metadata": {{ .UserMetaData }},
  "role": "authenticated"
}
```

## 3. Enable Realtime
1. Go to Database → Replication
2. Enable realtime for these tables:
   - swap_requests
   - notifications 
   - feedback

## 4. API Keys
- Copy your Project URL and anon key to .env.local
- Copy service_role key for server-side operations
