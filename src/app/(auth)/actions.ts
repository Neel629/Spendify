'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = createClient()
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = createClient()
  const fullName = formData.get('full_name') as string

  // 1. Create the auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data: {
        full_name: fullName,
      }
    }
  })

  if (authError) {
    return { error: authError.message }
  }

  if (!authData.user) {
    return { error: 'Signup failed. Please try again.' }
  }

  // 2. Create the user profile in the database
  const { error: profileError } = await supabase.from('profiles').insert({
    id: authData.user.id,
    full_name: fullName,
  })

  if (profileError) {
    console.error('Profile creation error:', profileError)
    // Don't block the user — they can still use the app
  }

  // 3. Seed default categories
  const defaultCategories = [
    { user_id: authData.user.id, name: 'Food & Drinks',  emoji: '🍔', type: 'expense', is_default: true },
    { user_id: authData.user.id, name: 'Transport',      emoji: '🚌', type: 'expense', is_default: true },
    { user_id: authData.user.id, name: 'Shopping',       emoji: '🛍', type: 'expense', is_default: true },
    { user_id: authData.user.id, name: 'Entertainment',  emoji: '🎮', type: 'expense', is_default: true },
    { user_id: authData.user.id, name: 'Rent & Bills',   emoji: '🏠', type: 'expense', is_default: true },
    { user_id: authData.user.id, name: 'Other',          emoji: '💸', type: 'expense', is_default: true },
    { user_id: authData.user.id, name: 'Salary',         emoji: '💰', type: 'income',  is_default: true },
    { user_id: authData.user.id, name: 'Freelance',      emoji: '💻', type: 'income',  is_default: true },
    { user_id: authData.user.id, name: 'Gift',           emoji: '🎁', type: 'income',  is_default: true },
  ]

  const { error: catError } = await supabase.from('categories').insert(defaultCategories)

  if (catError) {
    console.error('Category seeding error:', catError)
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}
