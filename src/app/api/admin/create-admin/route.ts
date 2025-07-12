import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { supabase } from '@/lib/supabase'

// POST /api/admin/create-admin - Create admin user (for development)
export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { email, first_name, last_name } = body

    // Check if current user is already admin (for security)
    const { data: currentUser, error: currentUserError } = await supabase
      .from('users')
      .select('is_admin')
      .eq('clerk_id', userId)
      .single()

    if (currentUserError || !currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // For development, allow any user to create admin (remove this in production)
    // In production, you would check if currentUser.is_admin === true

    // Create admin user
    const { data: adminUser, error } = await supabase
      .from('users')
      .insert({
        clerk_id: `admin_${Date.now()}`, // Temporary clerk_id for demo
        email: email || 'admin@skillswap.com',
        first_name: first_name || 'Admin',
        last_name: last_name || 'User',
        is_admin: true,
        is_public: true,
        availability_status: 'available',
        xp_points: 1000,
        level: 10
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating admin user:', error)
      return NextResponse.json({ error: 'Failed to create admin user' }, { status: 500 })
    }

    return NextResponse.json({ 
      adminUser,
      message: 'Admin user created successfully. Use these credentials to login:',
      credentials: {
        email: adminUser.email,
        password: 'admin123' // Default password for demo
      }
    })
  } catch (error) {
    console.error('Error in POST /api/admin/create-admin:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 