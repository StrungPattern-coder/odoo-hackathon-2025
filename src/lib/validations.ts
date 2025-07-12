import { z } from 'zod'

export const userProfileSchema = z.object({
  first_name: z.string().min(1, 'First name is required').max(50),
  last_name: z.string().min(1, 'Last name is required').max(50),
  bio: z.string().max(500).optional(),
  location: z.string().max(100).optional(),
  is_public: z.boolean().default(true),
  availability_status: z.enum(['available', 'busy', 'offline']).default('available'),
})

export const skillSchema = z.object({
  name: z.string().min(1, 'Skill name is required').max(100),
  category: z.string().min(1, 'Category is required'),
  description: z.string().max(300).optional(),
})

export const userSkillSchema = z.object({
  skill_id: z.string().uuid(),
  type: z.enum(['offered', 'wanted']),
  proficiency_level: z.number().min(1).max(5),
  years_experience: z.number().min(0).max(50).optional(),
  description: z.string().max(300).optional(),
})

export const swapRequestSchema = z.object({
  provider_id: z.string().uuid(),
  requester_skill_id: z.string().uuid(),
  provider_skill_id: z.string().uuid(),
  message: z.string().max(500).optional(),
  proposed_time: z.string().optional(),
  duration_hours: z.number().min(0.5).max(8).optional(),
})

export const feedbackSchema = z.object({
  swap_request_id: z.string().uuid(),
  reviewee_id: z.string().uuid(),
  rating: z.number().min(1).max(5),
  comment: z.string().max(500).optional(),
  is_public: z.boolean().default(true),
})

export const searchFiltersSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  location: z.string().optional(),
  availability: z.enum(['available', 'busy', 'offline']).optional(),
  skill_type: z.enum(['offered', 'wanted']).optional(),
  proficiency_level: z.number().min(1).max(5).optional(),
})

export type UserProfileFormData = z.infer<typeof userProfileSchema>
export type SkillFormData = z.infer<typeof skillSchema>
export type UserSkillFormData = z.infer<typeof userSkillSchema>
export type SwapRequestFormData = z.infer<typeof swapRequestSchema>
export type FeedbackFormData = z.infer<typeof feedbackSchema>
export type SearchFilters = z.infer<typeof searchFiltersSchema>
