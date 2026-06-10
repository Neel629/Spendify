import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = createClient()
  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get('limit') || '50')
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('splits')
    .select('*')
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
    const { friend_name, remark, amount, type, date, status } = body

    const { data, error } = await supabase
      .from('splits')
      .insert({
        user_id: user.id,
        friend_name,
        remark,
        amount,
        type,
        status: status || 'pending',
        date: date || new Date().toISOString().split('T')[0]
      })
      .select('*')
      .single()

    if (error) {
      console.error("Split insert error:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Server error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
