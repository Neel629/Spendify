import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function SettingsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 bg-card border-border">
          <h2 className="text-xl font-semibold text-foreground mb-4">Profile Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground block mb-1">Full Name</label>
              <input 
                type="text" 
                defaultValue="Neel Prajapati" 
                className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground block mb-1">Email Address</label>
              <input 
                type="email" 
                defaultValue="user@email.com" 
                disabled
                className="w-full bg-background/50 border border-border rounded-lg px-4 py-2 text-muted-foreground cursor-not-allowed"
              />
            </div>
            <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white mt-2">
              Save Changes
            </Button>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <h2 className="text-xl font-semibold text-foreground mb-4">Preferences</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground block mb-1">Currency</label>
              <select className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground block mb-1">Theme</label>
              <select className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option value="system">System Default</option>
                <option value="light">Light</option>
                <option value="dark">Dark (Premium Slate)</option>
              </select>
            </div>
            <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white mt-2">
              Update Preferences
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
