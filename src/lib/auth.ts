import { auth, currentUser } from '@clerk/nextjs'
import { supabase } from '@/lib/supabase'

// Get authenticated user with Supabase data
export async function getAuthenticatedUser() {
  try {
    const { userId } = auth()
    if (!userId) return null

    const clerkUser = await currentUser()
    if (!clerkUser) return null

    // Get user from Supabase
    const { data: supabaseUser, error } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_id', userId)
      .single()

    if (error) {
      console.error('Error fetching user from Supabase:', error)
      return null
    }

    return {
      clerk: clerkUser,
      supabase: supabaseUser,
    }
  } catch (error) {
    console.error('Error in getAuthenticatedUser:', error)
    return null
  }
}

// Check if user exists in Supabase
export async function ensureUserExists() {
  try {
    const { userId } = auth()
    if (!userId) return null

    const clerkUser = await currentUser()
    if (!clerkUser) return null

    // Check if user exists in Supabase
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_id', userId)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116 is "not found" error, which is expected for new users
      console.error('Error checking user existence:', fetchError)
      return null
    }

    if (existingUser) {
      return existingUser
    }

    // Create user in Supabase if they don't exist
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert({
        clerk_id: userId,
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        first_name: clerkUser.firstName || '',
        last_name: clerkUser.lastName || '',
        image_url: clerkUser.imageUrl || null,
        is_public: true,
        availability_status: 'available',
        xp_points: 0,
        level: 1,
      })
      .select()
      .single()

    if (createError) {
      console.error('Error creating user in Supabase:', createError)
      return null
    }

    return newUser
  } catch (error) {
    console.error('Error in ensureUserExists:', error)
    return null
  }
}

// Get user permissions
export async function getUserPermissions(userId?: string) {
  try {
    const targetUserId = userId || auth().userId
    if (!targetUserId) return { canEdit: false, canView: false }

    const currentUserId = auth().userId
    const canEdit = currentUserId === targetUserId
    const canView = true // Public profiles are viewable by all

    return { canEdit, canView }
  } catch (error) {
    console.error('Error in getUserPermissions:', error)
    return { canEdit: false, canView: false }
  }
}
