import { create } from 'zustand'

export type Split = {
  id: string
  user_id: string
  friend_name: string
  remark: string
  amount: number
  type: 'you_owe' | 'owed_to_you'
  status: 'pending' | 'settled'
  date: string
  created_at: string
}
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
  splits: Split[]
  isSplitsLoading: boolean
  setSplitsLoading: (loading: boolean) => void
  setSplits: (splits: Split[]) => void
  addSplit: (split: Split) => void
  updateSplit: (id: string, updatedSplit: Partial<Split>) => void
  deleteSplit: (id: string) => void
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
  splits: [],
  isSplitsLoading: true,
  setSplitsLoading: (loading) => set({ isSplitsLoading: loading }),
  setSplits: (splits) => set({ splits, isSplitsLoading: false }),
  addSplit: (split) => 
    set((state) => ({ 
      splits: [split, ...state.splits].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    })),
  updateSplit: (id, updated) => 
    set((state) => ({
      splits: state.splits.map((s) => (s.id === id ? { ...s, ...updated } : s))
    })),
  deleteSplit: (id) => 
    set((state) => ({
      splits: state.splits.filter((s) => s.id !== id)
    })),
}))
