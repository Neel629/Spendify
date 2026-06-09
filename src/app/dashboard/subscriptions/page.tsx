'use client'

import { Card } from '@/components/ui/card'
import { ReceiptText } from 'lucide-react'

export default function SubscriptionsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Subscriptions</h1>
        <p className="text-muted-foreground mt-2">Manage your recurring bills and subscriptions.</p>
      </div>

      <Card className="p-12 bg-card border-border border-dashed text-center flex flex-col items-center justify-center">
        <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center mb-6">
          <ReceiptText className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">Coming Soon</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          We are currently building the Subscriptions manager. Soon you'll be able to track all your active subscriptions and get notified before they renew.
        </p>
      </Card>
    </div>
  )
}
