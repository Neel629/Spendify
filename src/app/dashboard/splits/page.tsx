'use client'

import { Card } from '@/components/ui/card'
import { Users, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function SplitsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Squad Splits</h1>
          <p className="text-muted-foreground mt-2">Track who owes you and settle up.</p>
        </div>
        <Button className="font-semibold gap-2 rounded-xl h-12 px-6">
          <Plus className="h-4 w-4" /> New Split
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-8 bg-card border-border hover:border-muted-foreground/30 transition-colors">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-foreground">You are owed</h2>
            <span className="text-2xl font-mono text-foreground font-medium">₹0.00</span>
          </div>
          <div className="h-px w-full bg-border mb-6" />
          <div className="text-center py-6">
            <p className="text-muted-foreground font-medium">No one owes you right now.</p>
            <p className="text-sm text-muted-foreground mt-1">Create a split when you pay for the squad.</p>
          </div>
        </Card>

        <Card className="p-8 bg-card border-border hover:border-muted-foreground/30 transition-colors">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-foreground">You owe</h2>
            <span className="text-2xl font-mono text-foreground font-medium">₹0.00</span>
          </div>
          <div className="h-px w-full bg-border mb-6" />
          <div className="text-center py-6">
            <p className="text-muted-foreground font-medium">You're all settled up!</p>
            <p className="text-sm text-muted-foreground mt-1">No pending IOUs to pay back.</p>
          </div>
        </Card>
      </div>

      <h2 className="text-2xl font-bold text-foreground pt-4">Recent Splits</h2>
      
      <Card className="p-12 bg-secondary/20 border-border border-dashed text-center flex flex-col items-center justify-center rounded-3xl">
        <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center mb-6">
          <Users className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">No splits yet</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Split dinners, trips, or rent with friends. Everyone's share is tracked right here.
        </p>
      </Card>
    </div>
  )
}
