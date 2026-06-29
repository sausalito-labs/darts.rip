import { cn } from '@/lib/utils';
import { useGameStore } from '@/store/game-store';

export function Scoreboard() {
  const gameState = useGameStore((s) => s.gameState);
  if (!gameState) return null;

  const { players, currentPlayerIndex, scores } = gameState;
  const turnOrder = [...players.slice(currentPlayerIndex), ...players.slice(0, currentPlayerIndex)];

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {turnOrder.map((player) => {
        const isCurrent = player.id === players[currentPlayerIndex]?.id;
        return (
          <div
            key={player.id}
            className={cn(
              'flex items-center justify-between rounded-lg border p-3 transition-colors',
              isCurrent ? 'border-primary bg-primary/10' : 'border-border bg-card'
            )}
          >
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: player.color }} />
              <span className="font-medium">{player.name}</span>
            </div>
            <span className="text-2xl font-bold tabular-nums">{scores[player.id]}</span>
          </div>
        );
      })}
    </div>
  );
}
