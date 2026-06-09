import { create } from 'zustand'

export type Transaction = {
  id: string
  user_id: string
  category_id: string | null
  type: 'income' | 'expense'
  amount: number
  title: string
  note: string | null
  date: string
  payment_method: string | null
  reference: string | null
  tags: string[]
  split_id: string | null
  is_recurring: boolean
  created_at: string
  updated_at: string
}

interface AppState {
  transactions: Transaction[]
  isLoading: boolean
  setTransactions: (transactions: Transaction[]) => void
  addTransaction: (transaction: Transaction) => void
  updateTransaction: (id: string, updatedTransaction: Partial<Transaction>) => void
  deleteTransaction: (id: string) => void
}

export const useAppStore = create<AppState>((set) => ({
  transactions: [],
  isLoading: true,
  setTransactions: (transactions) => set({ transactions, isLoading: false }),
  addTransaction: (transaction) => 
    set((state) => ({ 
      transactions: [transaction, ...state.transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    })),
  updateTransaction: (id, updated) => 
    set((state) => ({
      transactions: state.transactions.map((t) => (t.id === id ? { ...t, ...updated } : t))
    })),
  deleteTransaction: (id) => 
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id)
    })),
}))
