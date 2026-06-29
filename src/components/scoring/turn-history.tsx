import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getMode } from '@/game-engine/registry';
import { formatDartThrow } from '@/game-engine/utils';
import { cn } from '@/lib/utils';
import { useGameStore } from '@/store/game-store';

export function TurnHistory() {
  const modeId = useGameStore((s) => s.currentModeId);
  const gameState = useGameStore((s) => s.gameState);

  const mode = modeId ? getMode(modeId) : undefined;
  if (!mode || !gameState) return null;

  const recentHistory = [...gameState.history].reverse().slice(0, 6);

  if (recentHistory.length === 0 && gameState.currentTurn.darts.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Turn History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {gameState.currentTurn.darts.length > 0 && (
          <div className="flex items-center justify-between rounded-md border border-dashed border-primary/50 bg-primary/5 p-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{mode.getCurrentPlayer(gameState).name}</span>
              <span className="text-xs text-muted-foreground">current</span>
            </div>
            <div className="flex gap-1">
              {gameState.currentTurn.darts.map((dart, i) => (
                <span
                  key={i}
                  className="inline-flex h-7 w-7 items-center justify-center rounded bg-primary/10 text-xs font-semibold"
                >
                  {formatDartThrow(dart)}
                </span>
              ))}
            </div>
          </div>
        )}

        {recentHistory.map((turn, idx) => {
          const player = gameState.players.find((p) => p.id === turn.playerId);
          return (
            <div
              key={idx}
              className={cn(
                'flex items-center justify-between rounded-md border p-2',
                turn.bust ? 'border-destructive/50 bg-destructive/10' : 'border-border'
              )}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{player?.name}</span>
                <span className="text-xs text-muted-foreground">R{turn.round}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {turn.darts.map((dart, i) => (
                    <span
                      key={i}
                      className="inline-flex h-7 w-7 items-center justify-center rounded bg-muted text-xs font-semibold"
                    >
                      {formatDartThrow(dart)}
                    </span>
                  ))}
                </div>
                <span
                  className={cn(
                    'w-16 text-right text-sm font-bold tabular-nums',
                    turn.bust ? 'text-destructive' : 'text-foreground'
                  )}
                >
                  {turn.bust ? 'BUST' : turn.scoreAfter}
                </span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
