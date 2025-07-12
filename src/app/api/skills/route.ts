import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')

    let query = supabaseAdmin
      .from('skills')
      .select('*')
      .eq('is_approved', true)
      .order('name')

    if (category) {
      query = query.eq('category', category)
    }

    const { data: skills, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(skills)
  } catch (error) {
    console.error('Error fetching skills:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, category, description } = await req.json()

    // Validate required fields
    if (!name || !category) {
      return NextResponse.json({ 
        error: 'Missing required fields: name, category' 
      }, { status: 400 })
    }

    // Check if skill already exists
    const { data: existingSkill, error: checkError } = await supabaseAdmin
      .from('skills')
      .select('id')
      .eq('name', name)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      return NextResponse.json({ error: checkError.message }, { status: 500 })
    }

    if (existingSkill) {
      return NextResponse.json({ 
        error: 'Skill already exists' 
      }, { status: 400 })
    }

    const { data: skill, error } = await supabaseAdmin
      .from('skills')
      .insert({
        name,
        category,
        description,
        is_approved: false // New skills need approval
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(skill)
  } catch (error) {
    console.error('Error creating skill:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
