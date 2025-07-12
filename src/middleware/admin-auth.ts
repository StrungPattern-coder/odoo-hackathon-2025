import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { supabase } from '@/lib/supabase'

export async function adminAuthMiddleware(request: NextRequest) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.redirect(new URL('/sign-in', request.url))
    }

    // Check if user exists and is admin
    const { data: user, error } = await supabase
      .from('users')
      .select('is_admin')
      .eq('clerk_id', userId)
      .single()

    if (error || !user) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    if (!user.is_admin) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
  } catch (error) {
    console.error('Admin auth error:', error)
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }
} 