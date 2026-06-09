import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = createClient()
  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get('limit') || '50')
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('transactions')
    .select('*, categories(name, emoji, color)')
    .eq('user_id', user.id)
    .order('date', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const { type, amount, title, date, category_id } = body

    let finalCategoryId = category_id
    if (!finalCategoryId) {
      // Find a default category
      const { data: cat } = await supabase
        .from('categories')
        .select('id')
        .eq('user_id', user.id)
        .eq('type', type)
        .limit(1)
        .single()
      
      finalCategoryId = cat?.id || null
    }

    const { data, error } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        type,
        amount,
        title,
        category_id: finalCategoryId,
        date: date || new Date().toISOString().split('T')[0]
      })
      .select('*')
      .single()

    if (error) {
      // If the profile is missing (user created before schema.sql was run), create it automatically
      if (error.message?.includes('transactions_user_id_fkey')) {
        console.log("Auto-creating missing legacy profile for user:", user.id)
        await supabase.from('profiles').insert({
          id: user.id,
          full_name: user.user_metadata?.full_name || 'User'
        })
        
        // Also auto-create a default category so it doesn't fail
        const { data: fallbackCat } = await supabase.from('categories').insert({
          user_id: user.id,
          name: 'General',
          type: 'expense'
        }).select('id').single()

        // Retry the transaction insert
        const { data: retryData, error: retryError } = await supabase.from('transactions').insert({
          user_id: user.id,
          type,
          amount,
          title,
          category_id: fallbackCat?.id,
          date: date || new Date().toISOString().split('T')[0]
        }).select('*').single()
        
        if (retryError) throw retryError
        return NextResponse.json(retryData)
      }
      console.error("SUPABASE INSERT ERROR:", error)
      return NextResponse.json({ error: error.message, details: error.details, hint: error.hint }, { status: 400 })
    }
    
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("SERVER ERROR:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
