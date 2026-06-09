'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function completeOnboarding(formData: FormData) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const fullName = formData.get('full_name') as string
  const currency = formData.get('currency') as string
  const monthlyBudget = parseFloat(formData.get('monthly_budget') as string) || 0

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: fullName,
      currency,
      monthly_budget: monthlyBudget,
      onboarding_completed: true,
      updated_at: new Date().toISOString()
    })
    .eq('id', user.id)

  if (error) {
    return { error: error.message }
  }

  redirect('/dashboard')
}
