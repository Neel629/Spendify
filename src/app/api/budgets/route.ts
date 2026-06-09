import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Get current month and year
  const now = new Date()
  const currentMonth = now.getMonth() + 1 // 1-12
  const currentYear = now.getFullYear()

  // 1. Fetch budgets for the current month
  const { data: budgets, error: budgetError } = await supabase
    .from('budgets')
    .select('*, categories(name, emoji, color)')
    .eq('user_id', user.id)
    .eq('month', currentMonth)
    .eq('year', currentYear)

  if (budgetError) return NextResponse.json({ error: budgetError.message }, { status: 500 })

  // 2. Fetch all expenses for the current month to calculate "spent"
  // Start of month:
  const startOfMonth = new Date(currentYear, currentMonth - 1, 1).toISOString()
  // End of month:
  const endOfMonth = new Date(currentYear, currentMonth, 0, 23, 59, 59).toISOString()

  const { data: expenses, error: expenseError } = await supabase
    .from('transactions')
    .select('amount, category_id')
    .eq('user_id', user.id)
    .eq('type', 'expense')
    .gte('date', startOfMonth)
    .lte('date', endOfMonth)

  if (expenseError) return NextResponse.json({ error: expenseError.message }, { status: 500 })

  // 3. Calculate spent per budget
  const budgetsWithSpent = budgets.map((budget: any) => {
    const spent = expenses
      .filter((tx: any) => tx.category_id === budget.category_id)
      .reduce((sum: number, tx: any) => sum + Number(tx.amount), 0)
      
    return {
      ...budget,
      spent
    }
  })

  return NextResponse.json(budgetsWithSpent)
}
