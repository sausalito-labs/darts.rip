import { ArrowLeft, ChevronDown, ChevronUp, Users } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGameStore } from '@/store/gameStore';

const TARGET_SCORES = [1000, 2000, 3000];
const ROUND_PRESETS = [10, 15, 20, 25];

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
  const [maxRounds, setMaxRounds] = useState<number | ''>(config?.maxRounds ?? '');
  const [customRounds, setCustomRounds] = useState(
    config?.maxRounds && !ROUND_PRESETS.includes(config.maxRounds) ? String(config.maxRounds) : ''
  );
  const [roundsOpen, setRoundsOpen] = useState(config?.maxRounds !== undefined);

  const effectiveScore = customScore ? Number(customScore) : targetScore;
  const effectiveRounds = customRounds ? Number(customRounds) : maxRounds;

  const handleScorePreset = (score: number) => {
    setTargetScore(score);
    setCustomScore('');
  };

  const handleCustomScore = (value: string) => {
    setCustomScore(value);
    if (value) {
      const num = Number(value);
      if (TARGET_SCORES.includes(num)) {
        setTargetScore(num);
        setCustomScore('');
      }
    }
  };

  const handleRoundsPreset = (value: number | '') => {
    setMaxRounds(value);
    setCustomRounds('');
  };

  const handleCustomRounds = (value: string) => {
    setCustomRounds(value);
    if (value) {
      const num = Number(value);
      if (ROUND_PRESETS.includes(num)) {
        setMaxRounds(num);
        setCustomRounds('');
      } else {
        setMaxRounds('');
      }
    }
  };

  const handleContinue = () => {
    setConfig({
      mode: 'count-up',
      targetScore: Math.max(1, effectiveScore),
      maxRounds: effectiveRounds ? Math.max(1, Number(effectiveRounds)) : undefined,
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
                  onClick={() => handleScorePreset(score)}
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
                onChange={(e) => handleCustomScore(e.target.value)}
              />
            )}
          </div>

          <Collapsible open={roundsOpen} onOpenChange={setRoundsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="flex w-full justify-between px-0">
                <span>Max Rounds {effectiveRounds ? `(${effectiveRounds})` : '(Off)'}</span>
                {roundsOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2">
              <div className="grid grid-cols-4 gap-2">
                <Button
                  type="button"
                  variant={maxRounds === '' && customRounds === '' ? 'default' : 'outline'}
                  onClick={() => handleRoundsPreset('')}
                >
                  Off
                </Button>
                {ROUND_PRESETS.map((rounds) => (
                  <Button
                    key={rounds}
                    type="button"
                    variant={maxRounds === rounds && !customRounds ? 'default' : 'outline'}
                    onClick={() => handleRoundsPreset(rounds)}
                  >
                    {rounds}
                  </Button>
                ))}
              </div>
              <Input
                type="number"
                min={1}
                placeholder="Custom rounds"
                value={customRounds}
                onChange={(e) => handleCustomRounds(e.target.value)}
              />
            </CollapsibleContent>
          </Collapsible>

          <Button className="w-full" onClick={handleContinue}>
            <Users className="mr-2 h-4 w-4" />
            Choose Players
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
