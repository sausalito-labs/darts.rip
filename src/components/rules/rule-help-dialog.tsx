import { HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export function RuleHelpDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <HelpCircle className="h-4 w-4" />
          <span className="sr-only">In and Out rule help</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>In &amp; Out Rules</DialogTitle>
          <DialogDescription>How you start and finish a Count Down game.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* The In Rule */}
          <section className="space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              1. How to Start (The "In" Rule)
            </h3>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="p-3 border rounded-lg bg-card">
                <h4 className="font-semibold text-foreground">Straight In</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Start scoring immediately. Any segment you hit counts right away.
                </p>
              </div>
              <div className="p-3 border rounded-lg bg-card">
                <h4 className="font-semibold text-foreground">Double In</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  You must hit any <strong className="text-foreground">Double</strong> ring to open
                  your score.
                </p>
              </div>
              <div className="p-3 border rounded-lg bg-card">
                <h4 className="font-semibold text-foreground">Master In</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  You must hit a <strong className="text-foreground">Double or Triple</strong> to
                  start scoring.
                </p>
              </div>
            </div>
          </section>

          {/* The Out Rule */}
          <section className="space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              2. How to Win (The "Out" Rule)
            </h3>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="p-3 border rounded-lg bg-card">
                <h4 className="font-semibold text-foreground">Straight Out</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Hit any segment that reduces your score to exactly zero.
                </p>
              </div>
              <div className="p-3 border rounded-lg bg-card">
                <h4 className="font-semibold text-foreground">Double Out</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Your final dart must be a <strong className="text-foreground">Double</strong> that
                  lands exactly on zero.
                </p>
              </div>
              <div className="p-3 border rounded-lg bg-card">
                <h4 className="font-semibold text-foreground">Master Out</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Your final dart must be a{' '}
                  <strong className="text-foreground">Double or Triple</strong> that lands exactly
                  on zero.
                </p>
              </div>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
