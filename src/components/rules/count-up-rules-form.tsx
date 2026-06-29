import { ArrowLeft, Users } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useGameStore } from '@/store/game-store';
import { MaxRoundsCollapsible } from './max-rounds-collapsible';
import { PresetNumberPicker } from './preset-number-picker';

const TARGET_SCORES = [1000, 2000, 3000];

export function CountUpRulesForm() {
  const navigate = useNavigate();
  const config = useGameStore(
    (s) => s.config as { mode: 'count-up'; targetScore: number; maxRounds?: number } | null
  );
  const setConfig = useGameStore((s) => s.setConfig);
  const setStep = useGameStore((s) => s.setStep);

  const [targetScore, setTargetScore] = useState(config?.targetScore ?? 1000);
  const [maxRounds, setMaxRounds] = useState<number | undefined>(config?.maxRounds);
  const [isTargetScoreValid, setIsTargetScoreValid] = useState(true);
  const [isMaxRoundsValid, setIsMaxRoundsValid] = useState(true);

  const handleContinue = () => {
    setConfig({
      mode: 'count-up',
      targetScore,
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
            <PresetNumberPicker
              presets={TARGET_SCORES}
              value={targetScore}
              onChange={(value) => setTargetScore(value ?? 1000)}
              placeholder="Custom target"
              required
              onValidationChange={setIsTargetScoreValid}
            />
          </div>

          <MaxRoundsCollapsible
            value={maxRounds}
            onChange={setMaxRounds}
            onValidationChange={setIsMaxRoundsValid}
          />

          <Button
            className="w-full"
            disabled={!isTargetScoreValid || !isMaxRoundsValid}
            onClick={handleContinue}
          >
            <Users className="mr-2 h-4 w-4" />
            Choose Players
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
