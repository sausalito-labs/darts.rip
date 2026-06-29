import { ArrowLeft, Users } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGameStore } from '@/store/game-store';
import { MaxRoundsCollapsible } from './max-rounds-collapsible';

const TARGET_SCORES = [1000, 2000, 3000];

export function CountUpRulesForm() {
  const navigate = useNavigate();
  const config = useGameStore(
    (s) => s.config as { mode: 'count-up'; targetScore: number; maxRounds?: number } | null
  );
  const setConfig = useGameStore((s) => s.setConfig);
  const setStep = useGameStore((s) => s.setStep);

  const [targetScore, setTargetScore] = useState(config?.targetScore ?? 1000);
  const [customScore, setCustomScore] = useState(
    TARGET_SCORES.includes(config?.targetScore ?? 1000) ? '' : String(config?.targetScore ?? '')
  );
  const [maxRounds, setMaxRounds] = useState<number | undefined>(config?.maxRounds);

  const effectiveScore = customScore ? Number(customScore) : targetScore;

  const handleContinue = () => {
    setConfig({
      mode: 'count-up',
      targetScore: Math.max(1, effectiveScore),
      maxRounds,
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
            <Label>Target Score</Label>
            <div className="grid grid-cols-4 gap-2">
              {TARGET_SCORES.map((score) => (
                <Button
                  key={score}
                  type="button"
                  variant={targetScore === score && !customScore ? 'default' : 'outline'}
                  onClick={() => {
                    setTargetScore(score);
                    setCustomScore('');
                  }}
                >
                  {score}
                </Button>
              ))}
              <Button
                type="button"
                variant={customScore ? 'default' : 'outline'}
                onClick={() => {
                  setCustomScore(String(targetScore));
                }}
              >
                Custom
              </Button>
            </div>
            {customScore !== '' && (
              <Input
                type="number"
                min={1}
                placeholder="Custom target"
                value={customScore}
                onChange={(e) => {
                  setCustomScore(e.target.value);
                  if (e.target.value) setTargetScore(Number(e.target.value));
                }}
              />
            )}
          </div>

          <MaxRoundsCollapsible value={maxRounds} onChange={setMaxRounds} />

          <Button className="w-full" onClick={handleContinue}>
            <Users className="mr-2 h-4 w-4" />
            Choose Players
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
