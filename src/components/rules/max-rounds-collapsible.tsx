import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { PresetNumberPicker } from './preset-number-picker';

const ROUND_PRESETS = [10, 15, 20];

interface MaxRoundsCollapsibleProps {
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  onValidationChange?: (isValid: boolean) => void;
}

export function MaxRoundsCollapsible({
  value,
  onChange,
  onValidationChange,
}: MaxRoundsCollapsibleProps) {
  const [open, setOpen] = useState(value !== undefined);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="flex w-full justify-between px-0">
          <span>Max Rounds (optional)</span>
          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2">
        <PresetNumberPicker
          presets={ROUND_PRESETS}
          value={value}
          onChange={onChange}
          placeholder="Custom rounds"
          onValidationChange={onValidationChange}
        />
      </CollapsibleContent>
    </Collapsible>
  );
}
