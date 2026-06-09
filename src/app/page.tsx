import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/30">
      {/* Navigation */}
      <nav className="w-full border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-bold text-xl tracking-tighter text-primary">Spendify.</div>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">Log in</Button>
            </Link>
            <Link href="/signup">
              <Button className="font-semibold">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 relative overflow-hidden">
        <div className="max-w-3xl mx-auto text-center z-10 space-y-8 mt-16">
          <div className="inline-flex items-center rounded-full border border-border bg-secondary/50 px-3 py-1 text-sm font-medium text-muted-foreground mb-4 backdrop-blur-sm">
            Finance without the noise.
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-foreground leading-[1.1]">
            Your money.<br />
            <span className="text-muted-foreground font-normal">No cap.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
            The ultra-minimal expense tracker. Track spending, split bills with the squad, and hit your savings goals.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/signup" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg font-semibold rounded-2xl">
                Start Tracking Free
              </Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg border-border hover:bg-secondary rounded-2xl">
                I already have an account
              </Button>
            </Link>
          </div>
        </div>

        {/* Minimal Mockup / Visual Indicator */}
        <div className="mt-32 w-full max-w-4xl mx-auto relative z-10">
          <div className="aspect-[21/9] rounded-t-3xl border-t border-l border-r border-border/50 bg-card shadow-2xl overflow-hidden flex items-end justify-center pb-0">
            {/* Abstract UI representation */}
            <div className="w-3/4 h-5/6 bg-background rounded-t-xl border-t border-l border-r border-border/50 p-8 flex flex-col gap-6">
              <div className="flex justify-between items-center border-b border-border/50 pb-4">
                <div className="h-6 w-24 bg-secondary rounded-md" />
                <div className="h-8 w-8 bg-secondary rounded-full" />
              </div>
              <div className="h-24 w-full bg-secondary/30 rounded-xl" />
              <div className="flex gap-4">
                <div className="h-16 flex-1 bg-secondary/20 rounded-xl" />
                <div className="h-16 flex-1 bg-secondary/20 rounded-xl" />
                <div className="h-16 flex-1 bg-secondary/20 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
