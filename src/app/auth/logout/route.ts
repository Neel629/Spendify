import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = createClient()
  await supabase.auth.signOut()
  
  // Redirect to the landing page (root URL) with status 303 (See Other)
  return NextResponse.redirect(new URL('/', request.url), { status: 303 })
}
