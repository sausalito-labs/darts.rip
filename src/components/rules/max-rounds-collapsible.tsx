import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';

const ROUND_PRESETS = [10, 15, 20];

interface MaxRoundsCollapsibleProps {
  value: number | undefined;
  onChange: (value: number | undefined) => void;
}

export function MaxRoundsCollapsible({ value, onChange }: MaxRoundsCollapsibleProps) {
  const [customRounds, setCustomRounds] = useState(
    value && !ROUND_PRESETS.includes(value) ? String(value) : ''
  );
  const [open, setOpen] = useState(value !== undefined);
  const isCustomActive = customRounds !== '';

  const handlePreset = (preset: number) => {
    if (value === preset) {
      onChange(undefined);
    } else {
      onChange(preset);
      setCustomRounds('');
    }
  };

  const handleCustomToggle = () => {
    if (isCustomActive) {
      setCustomRounds('');
      onChange(undefined);
    } else {
      const initial = value && !ROUND_PRESETS.includes(value) ? String(value) : '';
      setCustomRounds(initial);
      if (initial) {
        onChange(Number(initial));
      }
    }
  };

  const handleCustomChange = (input: string) => {
    setCustomRounds(input);
    const num = input ? Number(input) : NaN;
    if (!Number.isNaN(num) && num > 0) {
      onChange(num);
    } else {
      onChange(undefined);
    }
  };

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="flex w-full justify-between px-0">
          <span>Max Rounds (optional)</span>
          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2">
        <div className="grid grid-cols-4 gap-2">
          {ROUND_PRESETS.map((rounds) => (
            <Button
              key={rounds}
              type="button"
              variant={value === rounds && !isCustomActive ? 'default' : 'outline'}
              onClick={() => handlePreset(rounds)}
            >
              {rounds}
            </Button>
          ))}
          <Button
            type="button"
            variant={isCustomActive ? 'default' : 'outline'}
            onClick={handleCustomToggle}
          >
            Custom
          </Button>
        </div>
        {isCustomActive && (
          <Input
            type="number"
            min={1}
            placeholder="Custom rounds"
            value={customRounds}
            onChange={(e) => handleCustomChange(e.target.value)}
          />
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
