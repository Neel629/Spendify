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

    // If no category_id was provided, find a default one
    let finalCategoryId = category_id
    if (!finalCategoryId) {
      const { data: defaultCat } = await supabase
        .from('categories')
        .select('id')
        .eq('user_id', user.id)
        .eq('type', type)
        .eq('is_default', true)
        .limit(1)
        .single()
      finalCategoryId = defaultCat?.id || null
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
      .select('*, categories(name, emoji, color)')
      .single()

    if (error) {
      console.error("Transaction insert error:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Server error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
