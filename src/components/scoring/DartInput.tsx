import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface DartInputProps {
  onThrow: (segment: number, multiplier: 1 | 2 | 3) => void;
  disabled?: boolean;
}

const NUMBERS = [20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

export function DartInput({ onThrow, disabled }: DartInputProps) {
  const [multiplier, setMultiplier] = useState<1 | 2 | 3>(1);

  const handleThrow = (segment: number) => {
    if (disabled) return;
    onThrow(segment, multiplier);
  };

  return (
    <Card>
      <CardContent className="space-y-4 p-4">
        <ToggleGroup
          type="single"
          value={String(multiplier)}
          onValueChange={(v) => v && setMultiplier(Number(v) as 1 | 2 | 3)}
          className="flex justify-center"
          disabled={disabled}
        >
          <ToggleGroupItem value="1" className="flex-1" aria-label="Single">
            Single
          </ToggleGroupItem>
          <ToggleGroupItem value="2" className="flex-1" aria-label="Double">
            Double
          </ToggleGroupItem>
          <ToggleGroupItem value="3" className="flex-1" aria-label="Triple">
            Triple
          </ToggleGroupItem>
        </ToggleGroup>

        <div className="grid grid-cols-5 gap-2">
          {NUMBERS.map((n) => (
            <Button
              key={n}
              variant="outline"
              size="lg"
              disabled={disabled}
              onClick={() => handleThrow(n)}
              className="h-14 text-lg font-semibold"
            >
              {n}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="secondary"
            size="lg"
            disabled={disabled}
            onClick={() => handleThrow(25)}
            className="h-14 text-lg font-semibold"
          >
            Bull
          </Button>
          <Button
            variant="secondary"
            size="lg"
            disabled={disabled}
            onClick={() => handleThrow(50)}
            className="h-14 text-lg font-semibold"
          >
            2x Bull
          </Button>
          <Button
            variant="outline"
            size="lg"
            disabled={disabled}
            onClick={() => handleThrow(0)}
            className="h-14 text-lg font-semibold"
          >
            Miss
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
