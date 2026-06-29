import { Skull, Swords, Target, TrendingDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getAllModes } from '@/game-engine/registry';
import { useGameStore } from '@/store/gameStore';

const icons: Record<string, React.ReactNode> = {
  'count-up': <Target className="h-8 w-8" />,
  'count-down': <TrendingDown className="h-8 w-8" />,
  cutthroat: <Swords className="h-8 w-8" />,
  killer: <Skull className="h-8 w-8" />,
};

export function ModeSelectPage() {
  const navigate = useNavigate();
  const selectMode = useGameStore((s) => s.selectMode);
  const modes = getAllModes();

  const handleSelect = (modeId: string, available: boolean) => {
    if (!available) return;
    selectMode(modeId);
    navigate(`/${modeId}`);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            darts.rip
          </h1>
          <p className="mt-2 text-muted-foreground">
            Pick a game mode and let the app handle the math.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {modes.map((mode) => (
            <Card
              key={mode.id}
              onClick={() => handleSelect(mode.id, mode.available)}
              className={`
                cursor-pointer transition-all duration-200
                ${
                  mode.available
                    ? 'hover:border-primary hover:bg-primary/5'
                    : 'cursor-not-allowed opacity-60'
                }
              `}
            >
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  {icons[mode.id]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle>{mode.name}</CardTitle>
                    {!mode.available && <Badge variant="secondary">Coming Soon</Badge>}
                  </div>
                  <CardDescription>{mode.description}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
