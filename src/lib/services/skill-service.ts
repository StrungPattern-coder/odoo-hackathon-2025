import { supabase } from '@/lib/supabase'
import { Skill } from '@/types'

// Get all approved skills
export async function getAllSkills(): Promise<Skill[]> {
  try {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .eq('is_approved', true)
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching skills:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in getAllSkills:', error)
    return []
  }
}

// Get skills by category
export async function getSkillsByCategory(category: string): Promise<Skill[]> {
  try {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .eq('category', category)
      .eq('is_approved', true)
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching skills by category:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in getSkillsByCategory:', error)
    return []
  }
}

// Search skills
export async function searchSkills(query: string): Promise<Skill[]> {
  try {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .eq('is_approved', true)
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .order('name', { ascending: true })
      .limit(20)

    if (error) {
      console.error('Error searching skills:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in searchSkills:', error)
    return []
  }
}

// Get skill by ID
export async function getSkillById(id: string): Promise<Skill | null> {
  try {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .eq('id', id)
      .eq('is_approved', true)
      .single()

    if (error) {
      console.error('Error fetching skill by ID:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error in getSkillById:', error)
    return null
  }
}

// Get skill categories
export async function getSkillCategories(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('skills')
      .select('category')
      .eq('is_approved', true)

    if (error) {
      console.error('Error fetching skill categories:', error)
      return []
    }

    const uniqueCategories = new Set(data?.map(item => item.category) || [])
    const categories = Array.from(uniqueCategories)
    return categories.sort()
  } catch (error) {
    console.error('Error in getSkillCategories:', error)
    return []
  }
}

// Get popular skills (most offered/wanted)
export async function getPopularSkills(limit: number = 10): Promise<Skill[]> {
  try {
    const { data, error } = await supabase
      .from('skills')
      .select(`
        *,
        user_skills(count)
      `)
      .eq('is_approved', true)
      .order('user_skills(count)', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching popular skills:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in getPopularSkills:', error)
    return []
  }
}
