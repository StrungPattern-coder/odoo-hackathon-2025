import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { supabase } from '@/lib/supabase'

// GET /api/swaps - Get user's swap requests
export async function GET() {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get current user from database
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_id', userId)
      .single()

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get swap requests where user is requester or provider
    const { data: swapRequests, error } = await supabase
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
      return NextResponse.json({ error: 'Failed to fetch swap requests' }, { status: 500 })
    }

    return NextResponse.json({ swapRequests })
  } catch (error) {
    console.error('Error in GET /api/swaps:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/swaps - Create a new swap request
export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { provider_id, requester_skill_id, provider_skill_id, message, proposed_time, duration_hours } = body

    // Get current user from database
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_id', userId)
      .single()

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Create swap request
    const { data: swapRequest, error } = await supabase
      .from('swap_requests')
      .insert({
        requester_id: user.id,
        provider_id,
        requester_skill_id,
        provider_skill_id,
        message,
        proposed_time,
        duration_hours: duration_hours || 1.0,
        status: 'pending'
      })
      .select(`
        *,
        requester:users!requester_id(*),
        provider:users!provider_id(*),
        requester_skill:user_skills!requester_skill_id(*, skill:skills(*)),
        provider_skill:user_skills!provider_skill_id(*, skill:skills(*))
      `)
      .single()

    if (error) {
      console.error('Error creating swap request:', error)
      return NextResponse.json({ error: 'Failed to create swap request' }, { status: 500 })
    }

    return NextResponse.json({ swapRequest })
  } catch (error) {
    console.error('Error in POST /api/swaps:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 