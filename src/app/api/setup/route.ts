import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return NextResponse.json({ error: 'Not logged in', details: authError }, { status: 401 })
  }

  const results: any = { user_id: user.id, steps: [] }

  // 1. Check if profile exists
  const { data: profile } = await supabase.from('profiles').select('id').eq('id', user.id).single()
  
  if (!profile) {
    results.steps.push('Profile missing. Attempting to insert...')
    const { error: profileError } = await supabase.from('profiles').insert({
      id: user.id,
      full_name: user.user_metadata?.full_name || 'User'
    })
    
    if (profileError) {
      results.steps.push({ step: 'Profile Insert Failed', error: profileError })
      return NextResponse.json(results, { status: 500 })
    }
    results.steps.push('Profile Inserted Successfully!')
  } else {
    results.steps.push('Profile already exists.')
  }

  // 2. Check if categories exist
  const { data: categories } = await supabase.from('categories').select('id').eq('user_id', user.id)
  
  if (!categories || categories.length === 0) {
    results.steps.push('Categories missing. Attempting to seed...')
    const { error: catError } = await supabase.from('categories').insert([
      { user_id: user.id, name: 'Food & Drinks', emoji: '🍔', type: 'expense', is_default: true },
      { user_id: user.id, name: 'Salary', emoji: '💰', type: 'income', is_default: true }
    ])
    
    if (catError) {
      results.steps.push({ step: 'Categories Insert Failed', error: catError })
      return NextResponse.json(results, { status: 500 })
    }
    results.steps.push('Categories Seeded Successfully!')
  } else {
    results.steps.push(`Found ${categories.length} categories.`)
  }

  // 3. Check streaks
  const { data: streak } = await supabase.from('user_streaks').select('id').eq('user_id', user.id).single()
  if (!streak) {
    const { error: streakError } = await supabase.from('user_streaks').insert({ user_id: user.id })
    if (streakError) {
      results.steps.push({ step: 'Streak Insert Failed', error: streakError })
    } else {
      results.steps.push('Streak Inserted Successfully!')
    }
  }

  results.success = true
  results.message = "Your account is now perfectly set up! You can go back to the dashboard and add transactions."
  
  return NextResponse.json(results)
}
