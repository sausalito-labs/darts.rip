import { ArrowLeft, Users } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { InRule, OutRule } from '@/game-engine/types';
import { useGameStore } from '@/store/gameStore';

const STARTING_SCORES = [301, 501, 701];

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
  const [outRule, setOutRule] = useState<OutRule>(config?.outRule ?? 'double');
  const [maxRounds, setMaxRounds] = useState(config?.maxRounds ?? '');

  const effectiveScore = customScore ? Number(customScore) : startingScore;

  const handleContinue = () => {
    setConfig({
      mode: 'count-down',
      startingScore: Math.max(1, effectiveScore),
      inRule,
      outRule,
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
          <CardTitle className="text-2xl">Count Down Rules</CardTitle>
          <CardDescription>Start from a score and race to exactly zero.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Starting Score</Label>
            <div className="grid grid-cols-3 gap-2">
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
            </div>
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>In Rule</Label>
              <Select value={inRule} onValueChange={(v) => setInRule(v as InRule)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="straight">Straight In</SelectItem>
                  <SelectItem value="double">Double In</SelectItem>
                  <SelectItem value="master">Master In</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Out Rule</Label>
              <Select value={outRule} onValueChange={(v) => setOutRule(v as OutRule)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="straight">Straight Out</SelectItem>
                  <SelectItem value="double">Double Out</SelectItem>
                  <SelectItem value="master">Master Out</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
