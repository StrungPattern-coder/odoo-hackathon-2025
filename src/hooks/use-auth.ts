'use client'

import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/supabase'

type User = Database['public']['Tables']['users']['Row']

/**
 * Hook to get current user data from both Clerk and Supabase
 */
export function useCurrentUser() {
  const { user: clerkUser, isLoaded } = useUser()
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchUser() {
      if (!isLoaded) return
      
      if (!clerkUser) {
        setSupabaseUser(null)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const { data: user, error: supabaseError } = await supabase
          .from('users')
          .select('*')
          .eq('clerk_id', clerkUser.id)
          .single()

        if (supabaseError) {
          setError(supabaseError.message)
          setSupabaseUser(null)
        } else {
          setSupabaseUser(user)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
        setSupabaseUser(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [clerkUser, isLoaded])

  return {
    clerkUser,
    supabaseUser,
    loading: loading || !isLoaded,
    error,
    isAuthenticated: !!clerkUser && !!supabaseUser
  }
}

/**
 * Hook to get user's skills
 */
export function useUserSkills(userId?: string, type?: 'offered' | 'wanted') {
  const { supabaseUser } = useCurrentUser()
  const [skills, setSkills] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const targetUserId = userId || supabaseUser?.id

  const fetchSkills = async () => {
    if (!targetUserId) {
      setSkills([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      let query = supabase
        .from('user_skills')
        .select(`
          *,
          skill:skills(*)
        `)
        .eq('user_id', targetUserId)

      if (type) {
        query = query.eq('type', type)
      }

      const { data, error: supabaseError } = await query

      if (supabaseError) {
        setError(supabaseError.message)
        setSkills([])
      } else {
        setSkills(data || [])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setSkills([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSkills()
  }, [targetUserId, type])

  return { skills, loading, error, refetch: fetchSkills }
}

/**
 * Hook to get all available skills
 */
export function useSkills() {
  const [skills, setSkills] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSkills() {
      try {
        setLoading(true)
        setError(null)

        const { data, error: supabaseError } = await supabase
          .from('skills')
          .select('*')
          .eq('is_approved', true)
          .order('name')

        if (supabaseError) {
          setError(supabaseError.message)
          setSkills([])
        } else {
          setSkills(data || [])
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
        setSkills([])
      } finally {
        setLoading(false)
      }
    }

    fetchSkills()
  }, [])

  return { skills, loading, error }
}

/**
 * Hook to get swap requests for current user
 */
export function useSwapRequests() {
  const { supabaseUser } = useCurrentUser()
  const [swapRequests, setSwapRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSwapRequests() {
      if (!supabaseUser) {
        setSwapRequests([])
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const { data, error: supabaseError } = await supabase
          .from('swap_requests')
          .select(`
            *,
            requester:users!requester_id(*),
            provider:users!provider_id(*),
            requester_skill:user_skills!requester_skill_id(*, skill:skills(*)),
            provider_skill:user_skills!provider_skill_id(*, skill:skills(*))
          `)
          .or(`requester_id.eq.${supabaseUser.id},provider_id.eq.${supabaseUser.id}`)
          .order('created_at', { ascending: false })

        if (supabaseError) {
          setError(supabaseError.message)
          setSwapRequests([])
        } else {
          setSwapRequests(data || [])
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
        setSwapRequests([])
      } finally {
        setLoading(false)
      }
    }

    fetchSwapRequests()

    // Set up real-time subscription
    const subscription = supabase
      .channel('swap_requests')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'swap_requests',
          filter: `requester_id=eq.${supabaseUser?.id},provider_id=eq.${supabaseUser?.id}`,
        },
        () => {
          fetchSwapRequests()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [supabaseUser])

  return { swapRequests, loading, error }
}

/**
 * Hook to manage user profile updates
 */
export function useProfileUpdate() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateProfile = async (updates: Partial<User>) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      const data = await response.json()
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return { updateProfile, loading, error }
}
