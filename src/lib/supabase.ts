import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
}

if (!supabaseAnonKey) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

// Base Supabase client (anonymous)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

// Server-side client with service role key
export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceRoleKey || supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

// Database types (add these based on your schema)
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          clerk_id: string
          email: string
          first_name: string
          last_name: string
          image_url: string | null
          location: string | null
          bio: string | null
          is_public: boolean
          availability_status: 'available' | 'busy' | 'offline'
          xp_points: number
          level: number
          is_banned: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          clerk_id: string
          email: string
          first_name: string
          last_name: string
          image_url?: string | null
          location?: string | null
          bio?: string | null
          is_public?: boolean
          availability_status?: 'available' | 'busy' | 'offline'
          xp_points?: number
          level?: number
          is_banned?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          clerk_id?: string
          email?: string
          first_name?: string
          last_name?: string
          image_url?: string | null
          location?: string | null
          bio?: string | null
          is_public?: boolean
          availability_status?: 'available' | 'busy' | 'offline'
          xp_points?: number
          level?: number
          is_banned?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      skills: {
        Row: {
          id: string
          name: string
          category: string
          description: string | null
          is_approved: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          category: string
          description?: string | null
          is_approved?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string
          description?: string | null
          is_approved?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      user_skills: {
        Row: {
          id: string
          user_id: string
          skill_id: string
          type: 'offered' | 'wanted'
          proficiency_level: number
          years_experience: number | null
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          skill_id: string
          type: 'offered' | 'wanted'
          proficiency_level: number
          years_experience?: number | null
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          skill_id?: string
          type?: 'offered' | 'wanted'
          proficiency_level?: number
          years_experience?: number | null
          description?: string | null
          created_at?: string
        }
      }
      swap_requests: {
        Row: {
          id: string
          requester_id: string
          provider_id: string
          requester_skill_id: string
          provider_skill_id: string
          status: 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'completed'
          message: string | null
          proposed_time: string | null
          duration_hours: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          requester_id: string
          provider_id: string
          requester_skill_id: string
          provider_skill_id: string
          status?: 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'completed'
          message?: string | null
          proposed_time?: string | null
          duration_hours?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          requester_id?: string
          provider_id?: string
          requester_skill_id?: string
          provider_skill_id?: string
          status?: 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'completed'
          message?: string | null
          proposed_time?: string | null
          duration_hours?: number | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
