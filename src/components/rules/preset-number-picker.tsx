import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface PresetNumberPickerProps {
  presets: number[];
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  placeholder?: string;
  required?: boolean;
  onValidationChange?: (isValid: boolean) => void;
}

export function PresetNumberPicker({
  presets,
  value,
  onChange,
  placeholder,
  required,
  onValidationChange,
}: PresetNumberPickerProps) {
  const [isCustomActive, setIsCustomActive] = useState(
    value !== undefined && !presets.includes(value)
  );
  const [customInput, setCustomInput] = useState(
    value !== undefined && !presets.includes(value) ? String(value) : ''
  );

  useEffect(() => {
    const isValid = !(isCustomActive && customInput === '') && !(required && value === undefined);
    onValidationChange?.(isValid);
  }, [isCustomActive, customInput, required, value, onValidationChange]);

  const handleValueChange = (selected: string) => {
    if (selected === '') {
      setIsCustomActive(false);
      setCustomInput('');
      onChange(required ? (value ?? presets[0]) : undefined);
      return;
    }

    if (selected === 'custom') {
      setIsCustomActive(true);
      const initial = value !== undefined && !presets.includes(value) ? String(value) : '';
      setCustomInput(initial);
      if (initial) {
        onChange(Number(initial));
      }
      return;
    }

    const num = Number(selected);
    if (!Number.isNaN(num)) {
      setIsCustomActive(false);
      setCustomInput('');
      onChange(num);
    }
  };

  const handleInputChange = (input: string) => {
    const sanitized = input.replace(/\D/g, '').replace(/^0+/, '');
    setCustomInput(sanitized);
    const num = sanitized ? Number(sanitized) : NaN;
    if (!Number.isNaN(num) && num > 0) {
      onChange(num);
    } else if (!required) {
      onChange(undefined);
    }
  };

  const toggleValue = isCustomActive ? 'custom' : value !== undefined ? String(value) : '';

  return (
    <div className="space-y-2">
      <ToggleGroup
        type="single"
        variant="outline"
        value={toggleValue}
        onValueChange={handleValueChange}
        className="w-full"
      >
        {presets.map((preset) => (
          <ToggleGroupItem
            key={preset}
            value={String(preset)}
            className="flex-1 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
          >
            {preset}
          </ToggleGroupItem>
        ))}
        <ToggleGroupItem
          value="custom"
          className="flex-1 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
        >
          Custom
        </ToggleGroupItem>
      </ToggleGroup>

      {isCustomActive && (
        <Input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder={placeholder}
          value={customInput}
          onChange={(e) => handleInputChange(e.target.value)}
        />
      )}
    </div>
  );
}
