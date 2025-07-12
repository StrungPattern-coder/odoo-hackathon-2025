import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's Supabase ID
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('clerk_id', userId)
      .single()

    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 500 })
    }

    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type') as 'offered' | 'wanted' | null

    let query = supabaseAdmin
      .from('user_skills')
      .select(`
        *,
        skill:skills(*)
      `)
      .eq('user_id', user.id)

    if (type) {
      query = query.eq('type', type)
    }

    const { data: skills, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(skills)
  } catch (error) {
    console.error('Error fetching user skills:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's Supabase ID
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('clerk_id', userId)
      .single()

    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 500 })
    }

    const { skill_id, type, proficiency_level, years_experience, description } = await req.json()

    // Validate required fields
    if (!skill_id || !type || !proficiency_level) {
      return NextResponse.json({ 
        error: 'Missing required fields: skill_id, type, proficiency_level' 
      }, { status: 400 })
    }

    // Validate type
    if (!['offered', 'wanted'].includes(type)) {
      return NextResponse.json({ 
        error: 'Type must be either "offered" or "wanted"' 
      }, { status: 400 })
    }

    // Validate proficiency level
    if (proficiency_level < 1 || proficiency_level > 5) {
      return NextResponse.json({ 
        error: 'Proficiency level must be between 1 and 5' 
      }, { status: 400 })
    }

    const { data: userSkill, error } = await supabaseAdmin
      .from('user_skills')
      .insert({
        user_id: user.id,
        skill_id,
        type,
        proficiency_level,
        years_experience,
        description
      })
      .select(`
        *,
        skill:skills(*)
      `)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(userSkill)
  } catch (error) {
    console.error('Error adding user skill:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's Supabase ID
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('clerk_id', userId)
      .single()

    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 500 })
    }

    const { searchParams } = new URL(req.url)
    const skillId = searchParams.get('skillId')

    if (!skillId) {
      return NextResponse.json({ 
        error: 'Missing required parameter: skillId' 
      }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('user_skills')
      .delete()
      .eq('id', skillId)
      .eq('user_id', user.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing user skill:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
