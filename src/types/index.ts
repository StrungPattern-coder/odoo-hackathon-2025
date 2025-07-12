export interface User {
  id: string
  clerk_id: string
  email: string
  first_name: string
  last_name: string
  image_url?: string
  location?: string
  bio?: string
  is_public: boolean
  availability_status: 'available' | 'busy' | 'offline'
  xp_points: number
  level: number
  total_swaps_completed?: number
  average_rating?: number
  is_admin?: boolean
  is_banned?: boolean
  banned_until?: string
  ban_reason?: string
  last_active?: string
  created_at: string
  updated_at: string
}

export interface Skill {
  id: string
  name: string
  category: string
  description?: string
  is_approved: boolean
  created_at: string
  updated_at: string
}

export interface UserSkill {
  id: string
  user_id: string
  skill_id: string
  type: 'offered' | 'wanted'
  proficiency_level: 1 | 2 | 3 | 4 | 5
  years_experience?: number
  description?: string
  created_at: string
  skill?: Skill
  user?: User
}

export interface SwapRequest {
  id: string
  requester_id: string
  provider_id: string
  requester_skill_id: string
  provider_skill_id: string
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'completed'
  message?: string
  proposed_time?: string
  duration_hours?: number
  created_at: string
  updated_at: string
  requester?: User
  provider?: User
  requester_skill?: UserSkill
  provider_skill?: UserSkill
}

export interface Feedback {
  id: string
  swap_request_id: string
  reviewer_id: string
  reviewee_id: string
  rating: 1 | 2 | 3 | 4 | 5
  comment?: string
  is_public: boolean
  created_at: string
  reviewer?: User
  reviewee?: User
  swap_request?: SwapRequest
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  color: string
  criteria: string
  xp_requirement?: number
  created_at: string
}

export interface UserBadge {
  id: string
  user_id: string
  badge_id: string
  earned_at: string
  badge?: Badge
  user?: User
}

export interface Notification {
  id: string
  user_id: string
  type: 'swap_request' | 'swap_accepted' | 'swap_rejected' | 'feedback' | 'badge_earned' | 'system'
  title: string
  message: string
  data?: Record<string, any>
  is_read: boolean
  created_at: string
}

export interface AdminLog {
  id: string
  admin_id: string
  action: string
  target_type: 'user' | 'skill' | 'swap' | 'feedback' | 'system'
  target_id?: string
  details: Record<string, any>
  created_at: string
  admin?: User
}

export interface AnalyticsData {
  total_users: number
  active_users_today: number
  total_swaps: number
  completed_swaps: number
  pending_swaps: number
  popular_skills: Array<{
    skill_name: string
    demand_count: number
    supply_count: number
  }>
  conversion_rate: number
  daily_stats: Array<{
    date: string
    new_users: number
    new_swaps: number
    completed_swaps: number
  }>
}
