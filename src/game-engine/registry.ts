import type { GameMode } from './mode';
import { countDownMode } from './modes/count-down';
import { countUpMode } from './modes/count-up';
import { cutthroatMode } from './modes/cutthroat';
import { killerMode } from './modes/killer';

const modes: GameMode[] = [countUpMode, countDownMode, cutthroatMode, killerMode];

export const gameModeRegistry: Record<string, GameMode> = Object.fromEntries(
  modes.map((mode) => [mode.id, mode])
);

export function getMode(id: string): GameMode | undefined {
  return gameModeRegistry[id];
}

export function getAvailableModes(): GameMode[] {
  return modes.filter((mode) => mode.available);
}

export function getAllModes(): GameMode[] {
  return modes;
}
