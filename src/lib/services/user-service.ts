import { supabase, supabaseAdmin } from '@/lib/supabase'
import { User, UserSkill, SwapRequest, Feedback } from '@/types'
import { auth, currentUser } from '@clerk/nextjs'

// Get current user from Supabase using Clerk ID
export async function getCurrentUser(): Promise<User | null> {
  try {
    const { userId } = auth()
    if (!userId) return null

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_id', userId)
      .single()

    if (error) {
      console.error('Error fetching current user:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error in getCurrentUser:', error)
    return null
  }
}

// Get user by ID
export async function getUserById(id: string): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .eq('is_public', true)
      .single()

    if (error) {
      console.error('Error fetching user by ID:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error in getUserById:', error)
    return null
  }
}

// Update user profile
export async function updateUserProfile(updates: Partial<User>): Promise<User | null> {
  try {
    const { userId } = auth()
    if (!userId) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('clerk_id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error updating user profile:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Error in updateUserProfile:', error)
    throw error
  }
}

// Get user skills
export async function getUserSkills(userId?: string): Promise<UserSkill[]> {
  try {
    const targetUserId = userId || auth().userId
    if (!targetUserId) return []

    const { data, error } = await supabase
      .from('user_skills')
      .select(`
        *,
        skill:skills(*),
        user:users(*)
      `)
      .eq('user_id', targetUserId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching user skills:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in getUserSkills:', error)
    return []
  }
}

// Add user skill
export async function addUserSkill(skillData: {
  skill_id: string
  type: 'offered' | 'wanted'
  proficiency_level: 1 | 2 | 3 | 4 | 5
  years_experience?: number
  description?: string
}): Promise<UserSkill | null> {
  try {
    const { userId } = auth()
    if (!userId) throw new Error('User not authenticated')

    // Get user ID from Supabase
    const user = await getCurrentUser()
    if (!user) throw new Error('User not found in database')

    const { data, error } = await supabase
      .from('user_skills')
      .insert({
        user_id: user.id,
        ...skillData,
      })
      .select(`
        *,
        skill:skills(*),
        user:users(*)
      `)
      .single()

    if (error) {
      console.error('Error adding user skill:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Error in addUserSkill:', error)
    throw error
  }
}

// Get available skills for swapping
export async function getAvailableSkills(): Promise<UserSkill[]> {
  try {
    const { userId } = auth()
    if (!userId) return []

    const { data, error } = await supabase
      .from('user_skills')
      .select(`
        *,
        skill:skills(*),
        user:users(*)
      `)
      .eq('type', 'offered')
      .neq('user.clerk_id', userId)
      .eq('user.is_public', true)
      .eq('user.availability_status', 'available')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching available skills:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in getAvailableSkills:', error)
    return []
  }
}

// Create swap request
export async function createSwapRequest(requestData: {
  provider_id: string
  requester_skill_id: string
  provider_skill_id: string
  message?: string
  proposed_time?: string
  duration_hours?: number
}): Promise<SwapRequest | null> {
  try {
    const { userId } = auth()
    if (!userId) throw new Error('User not authenticated')

    const user = await getCurrentUser()
    if (!user) throw new Error('User not found in database')

    const { data, error } = await supabase
      .from('swap_requests')
      .insert({
        requester_id: user.id,
        ...requestData,
        status: 'pending',
      })
      .select(`
        *,
        requester:users!requester_id(*),
        provider:users!provider_id(*),
        requester_skill:user_skills!requester_skill_id(*),
        provider_skill:user_skills!provider_skill_id(*)
      `)
      .single()

    if (error) {
      console.error('Error creating swap request:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Error in createSwapRequest:', error)
    throw error
  }
}

// Get user swap requests
export async function getUserSwapRequests(): Promise<SwapRequest[]> {
  try {
    const { userId } = auth()
    if (!userId) return []

    const user = await getCurrentUser()
    if (!user) return []

    const { data, error } = await supabase
      .from('swap_requests')
      .select(`
        *,
        requester:users!requester_id(*),
        provider:users!provider_id(*),
        requester_skill:user_skills!requester_skill_id(*, skill:skills(*)),
        provider_skill:user_skills!provider_skill_id(*, skill:skills(*))
      `)
      .or(`requester_id.eq.${user.id},provider_id.eq.${user.id}`)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching swap requests:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in getUserSwapRequests:', error)
    return []
  }
}

// Update swap request status
export async function updateSwapRequestStatus(
  requestId: string,
  status: 'accepted' | 'rejected' | 'cancelled' | 'completed'
): Promise<SwapRequest | null> {
  try {
    const { userId } = auth()
    if (!userId) throw new Error('User not authenticated')

    const user = await getCurrentUser()
    if (!user) throw new Error('User not found in database')

    const { data, error } = await supabase
      .from('swap_requests')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', requestId)
      .or(`requester_id.eq.${user.id},provider_id.eq.${user.id}`)
      .select(`
        *,
        requester:users!requester_id(*),
        provider:users!provider_id(*),
        requester_skill:user_skills!requester_skill_id(*, skill:skills(*)),
        provider_skill:user_skills!provider_skill_id(*, skill:skills(*))
      `)
      .single()

    if (error) {
      console.error('Error updating swap request:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Error in updateSwapRequestStatus:', error)
    throw error
  }
}

// Search users by skills
export async function searchUsersBySkill(skillName: string): Promise<UserSkill[]> {
  try {
    const { data, error } = await supabase
      .from('user_skills')
      .select(`
        *,
        skill:skills(*),
        user:users(*)
      `)
      .eq('type', 'offered')
      .eq('user.is_public', true)
      .eq('user.availability_status', 'available')
      .ilike('skill.name', `%${skillName}%`)
      .order('proficiency_level', { ascending: false })

    if (error) {
      console.error('Error searching users by skill:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in searchUsersBySkill:', error)
    return []
  }
}
