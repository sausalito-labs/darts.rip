import { ArrowLeft, Users } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGameStore } from '@/store/gameStore';

export function CountUpRulesForm() {
  const navigate = useNavigate();
  const config = useGameStore(
    (s) => s.config as { mode: 'count-up'; targetScore: number; maxRounds?: number } | null
  );
  const setConfig = useGameStore((s) => s.setConfig);
  const setStep = useGameStore((s) => s.setStep);

  const [targetScore, setTargetScore] = useState(config?.targetScore ?? 1000);
  const [maxRounds, setMaxRounds] = useState(config?.maxRounds ?? '');

  const handleContinue = () => {
    setConfig({
      mode: 'count-up',
      targetScore: Math.max(1, targetScore),
      maxRounds: maxRounds ? Math.max(1, Number(maxRounds)) : undefined,
    });
    setStep('players');
  };

  return (
    <div className="mx-auto max-w-xl">
      <Button variant="ghost" className="mb-4" onClick={() => navigate('/')}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Count Up Rules</CardTitle>
          <CardDescription>First player to reach the target score wins.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="target">Target Score</Label>
            <Input
              id="target"
              type="number"
              min={1}
              value={targetScore}
              onChange={(e) => setTargetScore(Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="max-rounds">Max Rounds (optional)</Label>
            <Input
              id="max-rounds"
              type="number"
              min={1}
              placeholder="Unlimited"
              value={maxRounds}
              onChange={(e) => setMaxRounds(e.target.value === '' ? '' : Number(e.target.value))}
            />
          </div>

          <Button className="w-full" onClick={handleContinue}>
            <Users className="mr-2 h-4 w-4" />
            Choose Players
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
