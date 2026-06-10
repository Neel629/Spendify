import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const id = params.id
    const body = await request.json()
    const { friend_name, remark, amount, type, date, status } = body

    const { data, error } = await supabase
      .from('splits')
      .update({ friend_name, remark, amount, type, date, status })
      .eq('id', id)
      .eq('user_id', user.id) // security check
      .select('*')
      .single()

    if (error) {
      console.error("Split update error:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Server error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const id = params.id

    const { error } = await supabase
      .from('splits')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      console.error("Split delete error:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Server error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
