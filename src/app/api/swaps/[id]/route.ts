import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { supabase } from '@/lib/supabase'

// PATCH /api/swaps/[id] - Update swap request status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { status } = body

    if (!['accepted', 'rejected', 'cancelled', 'completed'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
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

    // Update swap request status
    const { data: swapRequest, error } = await supabase
      .from('swap_requests')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
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
      return NextResponse.json({ error: 'Failed to update swap request' }, { status: 500 })
    }

    if (!swapRequest) {
      return NextResponse.json({ error: 'Swap request not found or access denied' }, { status: 404 })
    }

    return NextResponse.json({ swapRequest })
  } catch (error) {
    console.error('Error in PATCH /api/swaps/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/swaps/[id] - Delete swap request
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Delete swap request (only if user is the requester)
    const { error } = await supabase
      .from('swap_requests')
      .delete()
      .eq('id', params.id)
      .eq('requester_id', user.id)

    if (error) {
      console.error('Error deleting swap request:', error)
      return NextResponse.json({ error: 'Failed to delete swap request' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/swaps/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 