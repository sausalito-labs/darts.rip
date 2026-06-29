import { ArrowLeft, ChevronDown, ChevronUp, Users } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { InRule, OutRule } from '@/game-engine/types';
import { useGameStore } from '@/store/gameStore';

const STARTING_SCORES = [301, 501, 701];
const IN_RULES: { value: InRule; label: string }[] = [
  { value: 'straight', label: 'Straight' },
  { value: 'double', label: 'Double' },
  { value: 'master', label: 'Master' },
];
const OUT_RULES: { value: OutRule; label: string }[] = [
  { value: 'straight', label: 'Straight' },
  { value: 'double', label: 'Double' },
  { value: 'master', label: 'Master' },
];
const ROUND_PRESETS = [10, 15, 20, 25];

export function CountDownRulesForm() {
  const navigate = useNavigate();
  const config = useGameStore(
    (s) =>
      s.config as {
        mode: 'count-down';
        startingScore: number;
        inRule: InRule;
        outRule: OutRule;
        maxRounds?: number;
      } | null
  );
  const setConfig = useGameStore((s) => s.setConfig);
  const setStep = useGameStore((s) => s.setStep);

  const [startingScore, setStartingScore] = useState(config?.startingScore ?? 501);
  const [customScore, setCustomScore] = useState(
    STARTING_SCORES.includes(config?.startingScore ?? 501)
      ? ''
      : String(config?.startingScore ?? '')
  );
  const [inRule, setInRule] = useState<InRule>(config?.inRule ?? 'straight');
  const [outRule, setOutRule] = useState<OutRule>(config?.outRule ?? 'straight');
  const [maxRounds, setMaxRounds] = useState<number | ''>(config?.maxRounds ?? '');
  const [customRounds, setCustomRounds] = useState(
    config?.maxRounds && !ROUND_PRESETS.includes(config.maxRounds) ? String(config.maxRounds) : ''
  );
  const [roundsOpen, setRoundsOpen] = useState(config?.maxRounds !== undefined);

  const effectiveScore = customScore ? Number(customScore) : startingScore;
  const effectiveRounds = customRounds ? Number(customRounds) : maxRounds;

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
      mode: 'count-down',
      startingScore: Math.max(1, effectiveScore),
      inRule,
      outRule,
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
          <CardTitle className="text-2xl">Count Down Rules</CardTitle>
          <CardDescription>Start from a score and race to exactly zero.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Starting Score</Label>
            <div className="grid grid-cols-4 gap-2">
              {STARTING_SCORES.map((score) => (
                <Button
                  key={score}
                  type="button"
                  variant={startingScore === score && !customScore ? 'default' : 'outline'}
                  onClick={() => {
                    setStartingScore(score);
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
                  setCustomScore(String(startingScore));
                }}
              >
                Custom
              </Button>
            </div>
            {customScore !== '' && (
              <Input
                type="number"
                min={1}
                placeholder="Custom score"
                value={customScore}
                onChange={(e) => {
                  setCustomScore(e.target.value);
                  if (e.target.value) setStartingScore(Number(e.target.value));
                }}
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>In Rule</Label>
              <div className="flex flex-wrap gap-2">
                {IN_RULES.map(({ value, label }) => (
                  <Button
                    key={value}
                    type="button"
                    size="sm"
                    variant={inRule === value ? 'default' : 'outline'}
                    onClick={() => setInRule(value)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Out Rule</Label>
              <div className="flex flex-wrap gap-2">
                {OUT_RULES.map(({ value, label }) => (
                  <Button
                    key={value}
                    type="button"
                    size="sm"
                    variant={outRule === value ? 'default' : 'outline'}
                    onClick={() => setOutRule(value)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>
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
