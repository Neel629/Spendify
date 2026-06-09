'use client'

import { Card } from '@/components/ui/card'
import { Gift } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function WrappedPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Spendify Wrapped</h1>
        <p className="text-muted-foreground mt-2">Your money habits, unwrapped. Discover how you spent this month.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-10 bg-card border-border hover:border-muted-foreground/30 transition-colors flex flex-col justify-center min-h-[300px]">
          <h2 className="text-lg font-bold text-muted-foreground uppercase tracking-widest mb-4">Top Spending Category</h2>
          <div className="text-8xl mb-6">🍔</div>
          <h3 className="text-4xl font-black text-foreground">Food & Dining</h3>
          <p className="text-muted-foreground mt-4 font-medium text-lg">You spent ₹14,500 eating out this month. That's a lot of takeout.</p>
        </Card>

        <Card className="p-10 bg-foreground text-background border-border hover:scale-[1.02] transition-transform flex flex-col justify-center min-h-[300px]">
          <h2 className="text-lg font-bold text-background/70 uppercase tracking-widest mb-4">Biggest Win</h2>
          <div className="text-8xl mb-6">🔥</div>
          <h3 className="text-4xl font-black">7 Day Streak</h3>
          <p className="text-background/80 mt-4 font-medium text-lg">Your longest no-spend streak this month. You're building solid habits.</p>
        </Card>

        <Card className="p-10 bg-card border-border hover:border-muted-foreground/30 transition-colors md:col-span-2 flex flex-col justify-center items-center text-center min-h-[350px]">
          <Gift className="h-16 w-16 text-foreground mb-6" />
          <h2 className="text-xl font-bold text-muted-foreground uppercase tracking-widest mb-2">Coming Next Month</h2>
          <h3 className="text-5xl font-black text-foreground mb-6">Your Full Wrapped Report</h3>
          <p className="text-muted-foreground max-w-xl font-medium text-lg mb-8">
            Keep tracking your expenses. At the end of every month, we'll generate a personalized, shareable story of your financial month.
          </p>
          <Button className="h-14 px-8 text-lg font-semibold rounded-2xl bg-foreground text-background hover:bg-foreground/90">
            Share Preview to Insta
          </Button>
        </Card>
      </div>
    </div>
  )
}
