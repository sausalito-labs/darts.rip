import { Undo2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useGameStore } from '@/store/game-store';

interface DartInputProps {
  onThrow: (segment: number, multiplier: 1 | 2 | 3) => void;
  disabled?: boolean;
}

const NUMBERS = [20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

export function DartInput({ onThrow, disabled }: DartInputProps) {
  const [multiplier, setMultiplier] = useState<1 | 2 | 3>(1);
  const undo = useGameStore((s) => s.undo);
  const canUndo = useGameStore((s) => s.pastStates.length > 0);

  const handleThrow = (segment: number) => {
    if (disabled) return;
    onThrow(segment, multiplier);
    setMultiplier(1);
  };

  return (
    <Card>
      <CardContent className="space-y-2 p-4 pt-4 flex flex-col">
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
        <div className="grid grid-cols-5 gap-2">
          <Button
            variant="outline"
            size="lg"
            disabled={disabled}
            onClick={() => handleThrow(0)}
            className="h-14 text-lg font-semibold"
          >
            0
          </Button>
          <Button
            variant="outline"
            size="lg"
            disabled={disabled || multiplier === 3}
            onClick={() => handleThrow(25)}
            className="h-14 text-lg font-semibold"
          >
            25
          </Button>

          <ToggleGroup
            type="single"
            value={multiplier === 1 ? '' : String(multiplier)}
            onValueChange={(v) => setMultiplier(v ? (Number(v) as 2 | 3) : 1)}
            className="col-span-2 flex justify-center"
            disabled={disabled}
          >
            <ToggleGroupItem value="2" className="flex-1 h-14" aria-label="Double">
              2x
            </ToggleGroupItem>
            <ToggleGroupItem value="3" className="flex-1 h-14" aria-label="Triple">
              3x
            </ToggleGroupItem>
          </ToggleGroup>

          <Button
            size="sm"
            variant="secondary"
            className="w-full h-14"
            disabled={disabled || !canUndo}
            onClick={undo}
          >
            <Undo2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
