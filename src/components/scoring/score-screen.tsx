import { Home, RotateCcw, Trophy } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getMode } from '@/game-engine/registry';
import { useGameStore } from '@/store/game-store';
import { DartInput } from './dart-input';
import { Scoreboard } from './scoreboard';
import { TurnHistory } from './turn-history';

export function ScoreScreen() {
  const navigate = useNavigate();
  const modeId = useGameStore((s) => s.currentModeId);
  const gameState = useGameStore((s) => s.gameState);
  const resetGame = useGameStore((s) => s.resetGame);
  const resetAll = useGameStore((s) => s.resetAll);
  const [bustFlash, setBustFlash] = useState(false);

  const mode = modeId ? getMode(modeId) : undefined;
  if (!mode || !gameState) return null;

  const currentPlayer = mode.getCurrentPlayer(gameState);
  const isGameOver = mode.isGameOver(gameState);
  const winner = gameState.winnerId
    ? gameState.players.find((p) => p.id === gameState.winnerId)
    : undefined;

  const handleThrow = (segment: number, multiplier: 1 | 2 | 3) => {
    const throwingPlayerId = currentPlayer.id;
    useGameStore.getState().throwDart(segment, multiplier);

    // Detect bust after the fact by inspecting the latest history entry
    const latest = useGameStore.getState().gameState?.history.at(-1);
    if (latest?.playerId === throwingPlayerId && latest.bust) {
      setBustFlash(true);
      setTimeout(() => setBustFlash(false), 600);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">Round {gameState.round}</div>
        <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
          <Home className="h-4 w-4" />
        </Button>
      </div>

      <Card className={`mb-4 transition-colors ${bustFlash ? 'bg-destructive/20' : ''}`}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="h-10 w-10 rounded-full"
                style={{ backgroundColor: currentPlayer.color }}
              />
              <div>
                <CardTitle>{currentPlayer.name}</CardTitle>
                <p className="text-xs text-muted-foreground">
                  Throw dart {gameState.currentDart + 1} of 3
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-base">
              {mode.name}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Scoreboard />
        </CardContent>
      </Card>

      <DartInput onThrow={handleThrow} disabled={isGameOver} />

      <div className="mt-4">
        <TurnHistory />
      </div>

      {isGameOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 p-4">
          <Card className="w-full max-w-md text-center">
            <CardHeader>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Trophy className="h-8 w-8" />
              </div>
              <CardTitle className="text-3xl">
                {winner ? `${winner.name} wins!` : 'Game Over'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" onClick={resetGame}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Play Again
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  resetAll();
                  navigate('/');
                }}
              >
                Main Menu
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
