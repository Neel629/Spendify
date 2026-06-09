import { Card } from '@/components/ui/card'

export default function DashboardLoading() {
  return (
    <div className="space-y-8 p-6 md:p-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <div className="h-10 w-64 bg-card border border-border rounded-lg animate-pulse mb-2"></div>
          <div className="h-5 w-48 bg-card border border-border rounded-lg animate-pulse"></div>
        </div>
        <div className="h-10 w-48 bg-card border border-border rounded-lg animate-pulse"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="h-32 bg-card border-border animate-pulse" />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="p-6 bg-card border-border col-span-1 lg:col-span-3 min-h-[400px] animate-pulse" />
        <Card className="p-6 bg-card border-border col-span-1 lg:col-span-2 min-h-[400px] animate-pulse" />
      </div>
    </div>
  )
}
