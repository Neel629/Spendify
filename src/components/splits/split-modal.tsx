'use client'

import { useState } from 'react'
import { X, Users, UserCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useAppStore, Split } from '@/store/useAppStore'

interface SplitModalProps {
  split?: Split
  onClose: () => void
}

export function SplitModal({ split, onClose }: SplitModalProps) {
  const [loading, setLoading] = useState(false)
  // For Edit Mode
  const [editType, setEditType] = useState<'you_owe' | 'owed_to_you'>(split?.type || 'owed_to_you')
  
  // For Add Mode (Bill Splitter)
  const [paidBy, setPaidBy] = useState<'me' | 'friend'>('me')

  const addSplit = useAppStore(state => state.addSplit)
  const updateSplit = useAppStore(state => state.updateSplit)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    
    try {
      if (split) {
        // --- EDIT MODE ---
        const payload = {
          friend_name: formData.get('friend_name'),
          remark: formData.get('remark'),
          amount: parseFloat(formData.get('amount') as string),
          type: editType,
          date: formData.get('date'),
          status: split.status,
        }
        const res = await fetch(`/api/splits/${split.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        if (!res.ok) throw new Error('Failed to update split')
        const updated = await res.json()
        updateSplit(split.id, updated)
      } else {
        // --- ADD MODE (BILL SPLITTER) ---
        const totalAmount = parseFloat(formData.get('totalAmount') as string)
        const remark = formData.get('remark') as string
        const date = formData.get('date') as string
        const friendsInput = formData.get('friends') as string
        
        const friendsList = friendsInput.split(',').map(f => f.trim()).filter(f => f.length > 0)
        
        if (friendsList.length === 0) {
          throw new Error("You must add at least one friend to split with.")
        }

        // Total people sharing the bill = You (1) + number of friends listed
        const totalPeople = friendsList.length + 1
        const splitAmount = totalAmount / totalPeople

        const payloads: any[] = []

        if (paidBy === 'me') {
          // If I paid, everyone in the list owes me their share
          friendsList.forEach(friend => {
            payloads.push({
              friend_name: friend,
              remark,
              amount: splitAmount,
              type: 'owed_to_you',
              date,
              status: 'pending'
            })
          })
        } else {
          // If a friend paid, I owe that specific friend my share
          const payerName = formData.get('payerName') as string
          if (!payerName.trim()) throw new Error("Please enter the name of the friend who paid.")
          
          payloads.push({
            friend_name: payerName,
            remark,
            amount: splitAmount,
            type: 'you_owe',
            date,
            status: 'pending'
          })
        }

        const res = await fetch('/api/splits', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payloads)
        })
        
        if (!res.ok) {
          const errorData = await res.json().catch(() => null)
          throw new Error(errorData?.error || 'Failed to create split(s)')
        }
        
        const newSplits = await res.json()
        if (Array.isArray(newSplits)) {
          newSplits.forEach(s => addSplit(s))
        } else {
          addSplit(newSplits)
        }
      }
      onClose()
    } catch (err: any) {
      console.error(err)
      alert(`Error saving split: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const defaultDate = split?.date ? new Date(split.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-background/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-md rounded-3xl shadow-2xl border border-border overflow-hidden animate-in slide-in-from-bottom-8 sm:zoom-in-95 duration-300">
        <div className="p-6 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              {split ? 'Edit Split' : 'Split a Bill'}
            </h2>
            <button onClick={onClose} type="button" className="text-muted-foreground hover:text-foreground bg-secondary/50 p-2 rounded-full transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {split ? (
              // ================= EDIT MODE (SINGLE IOU) =================
              <>
                <div className="flex p-1 mb-6 bg-background border border-border rounded-xl">
                  <button 
                    type="button"
                    onClick={() => setEditType('owed_to_you')}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${editType === 'owed_to_you' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    They owe you
                  </button>
                  <button 
                    type="button"
                    onClick={() => setEditType('you_owe')}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${editType === 'you_owe' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    You owe them
                  </button>
                </div>
                
                <div>
                  <Label className="text-muted-foreground text-xs uppercase tracking-wider font-semibold mb-2 block">Amount</Label>
                  <div className="flex items-center text-4xl font-light text-foreground border-b border-border/60 pb-2 transition-colors focus-within:border-emerald-500">
                    <span className="text-muted-foreground mr-2">₹</span>
                    <input 
                      name="amount" 
                      type="number" 
                      step="0.01" 
                      required 
                      defaultValue={split.amount}
                      placeholder="0.00" 
                      className="bg-transparent w-full focus:outline-none placeholder:text-muted-foreground/30 font-mono" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Friend's Name</Label>
                  <input 
                    name="friend_name" 
                    type="text" 
                    required 
                    defaultValue={split.friend_name}
                    placeholder="e.g. Alex" 
                    className="w-full h-12 px-4 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-muted-foreground/50" 
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Remark / Title</Label>
                  <input 
                    name="remark" 
                    type="text" 
                    required 
                    defaultValue={split.remark}
                    placeholder="e.g. Dinner at Luigi's" 
                    className="w-full h-12 px-4 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-muted-foreground/50" 
                  />
                </div>
              </>
            ) : (
              // ================= ADD MODE (BILL SPLITTER) =================
              <>
                <div>
                  <Label className="text-muted-foreground text-xs uppercase tracking-wider font-semibold mb-2 block">Total Bill Amount</Label>
                  <div className="flex items-center text-4xl font-light text-foreground border-b border-border/60 pb-2 transition-colors focus-within:border-emerald-500">
                    <span className="text-muted-foreground mr-2">₹</span>
                    <input 
                      name="totalAmount" 
                      type="number" 
                      step="0.01" 
                      required 
                      placeholder="0.00" 
                      className="bg-transparent w-full focus:outline-none placeholder:text-muted-foreground/30 font-mono" 
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Amount will be split equally among all friends.</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Place / Remark</Label>
                  <input 
                    name="remark" 
                    type="text" 
                    required 
                    placeholder="e.g. Dinner at Luigi's" 
                    className="w-full h-12 px-4 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-muted-foreground/50" 
                  />
                </div>

                <div className="space-y-3 pt-2">
                  <Label className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Who Paid?</Label>
                  <div className="flex gap-2">
                    <button 
                      type="button"
                      onClick={() => setPaidBy('me')}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border ${paidBy === 'me' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500' : 'border-border bg-background text-muted-foreground hover:bg-secondary'}`}
                    >
                      <UserCircle className="h-5 w-5" /> You
                    </button>
                    <button 
                      type="button"
                      onClick={() => setPaidBy('friend')}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border ${paidBy === 'friend' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500' : 'border-border bg-background text-muted-foreground hover:bg-secondary'}`}
                    >
                      <Users className="h-5 w-5" /> Friend
                    </button>
                  </div>
                </div>

                {paidBy === 'friend' && (
                  <div className="space-y-2 animate-in slide-in-from-top-2 duration-300 fade-in">
                    <Label className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Payer's Name</Label>
                    <input 
                      name="payerName" 
                      type="text" 
                      required={paidBy === 'friend'}
                      placeholder="e.g. Alex" 
                      className="w-full h-12 px-4 rounded-xl bg-emerald-500/5 border border-emerald-500/30 text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-muted-foreground/50" 
                    />
                  </div>
                )}

                <div className="space-y-2 pt-2">
                  <Label className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Split With (Comma Separated)</Label>
                  <input 
                    name="friends" 
                    type="text" 
                    required 
                    placeholder="e.g. Alex, Sarah, John" 
                    className="w-full h-12 px-4 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-muted-foreground/50" 
                  />
                  <p className="text-xs text-muted-foreground">List everyone sharing this bill. You are automatically included.</p>
                </div>
              </>
            )}

            <div className="space-y-2 pt-2">
              <Label className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Date</Label>
              <input 
                name="date" 
                type="date" 
                required 
                defaultValue={defaultDate} 
                className="w-full h-12 px-4 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all cursor-pointer" 
                style={{ colorScheme: 'dark' }}
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full h-14 text-base font-semibold rounded-xl mt-8 bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 transition-all">
              {loading ? 'Saving...' : (split ? 'Save Changes' : 'Split Bill')}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
