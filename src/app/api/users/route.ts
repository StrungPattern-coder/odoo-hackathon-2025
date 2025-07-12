import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/users - Get public users for browsing
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const skill = searchParams.get('skill')
    const availability = searchParams.get('availability')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    let query = supabase
      .from('users')
      .select(`
        id,
        first_name,
        last_name,
        image_url,
        location,
        bio,
        availability_status,
        average_rating,
        total_swaps_completed,
        user_skills!inner(
          id,
          type,
          proficiency_level,
          years_experience,
          description,
          skill:skills(
            id,
            name,
            category,
            description
          )
        )
      `)
      .eq('is_public', true)
      .eq('is_banned', false)

    // Filter by skill if provided
    if (skill) {
      query = query.eq('user_skills.skill.name', skill)
    }

    // Filter by availability if provided
    if (availability && availability !== 'all') {
      query = query.eq('availability_status', availability)
    }

    // Add pagination
    query = query.range(offset, offset + limit - 1)

    const { data: users, error, count } = await query

    if (error) {
      console.error('Error fetching users:', error)
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
    }

    // Transform data to match frontend expectations
    const transformedUsers = users?.map(user => ({
      id: user.id,
      name: `${user.first_name} ${user.last_name}`,
      profilePhoto: user.image_url || '/api/placeholder/120/120',
      location: user.location,
      bio: user.bio,
      rating: user.average_rating || 0,
      maxRating: 5,
      availability: user.availability_status,
      totalSwaps: user.total_swaps_completed || 0,
      skillsOffered: user.user_skills
        .filter((us: any) => us.type === 'offered')
        .map((us: any) => us.skill.name),
      skillsWanted: user.user_skills
        .filter((us: any) => us.type === 'wanted')
        .map((us: any) => us.skill.name),
      userSkills: user.user_skills
    })) || []

    return NextResponse.json({
      users: transformedUsers,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    console.error('Error in GET /api/users:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 