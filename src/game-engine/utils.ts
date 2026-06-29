import type { DartThrow, GameState, Multiplier, OutRule, Player } from './types';

export const PLAYER_COLORS = [
  '#f97316', // orange
  '#22c55e', // green
  '#3b82f6', // blue
  '#ef4444', // red
  '#a855f7', // purple
  '#06b6d4', // cyan
  '#eab308', // yellow
  '#ec4899', // pink
];

export function generateId(): string {
  return Math.random().toString(36).slice(2, 9);
}

export function getPlayerColor(index: number): string {
  return PLAYER_COLORS[index % PLAYER_COLORS.length];
}

export function createPlayer(name: string, index: number): Player {
  return {
    id: generateId(),
    name: name.trim() || `Player ${index + 1}`,
    color: getPlayerColor(index),
  };
}

export function createDartThrow(segment: number, multiplier: Multiplier): DartThrow {
  if (segment === 0) {
    return { segment: 0, multiplier: 1, total: 0 };
  }

  if (segment === 50) {
    // Double bull is always 50.
    return { segment: 25, multiplier: 2, total: 50 };
  }

  if (segment === 25) {
    // Triple bull is invalid; downgrade to single bull for a smoother UX.
    const effectiveMultiplier = multiplier === 3 ? 1 : multiplier;
    return { segment: 25, multiplier: effectiveMultiplier, total: 25 * effectiveMultiplier };
  }

  if (segment >= 1 && segment <= 20) {
    return { segment, multiplier, total: segment * multiplier };
  }

  throw new Error(`Invalid segment: ${segment}`);
}

export function getCurrentPlayer(state: GameState): Player {
  return state.players[state.currentPlayerIndex];
}

export function getNextPlayerIndex(state: GameState): number {
  return (state.currentPlayerIndex + 1) % state.players.length;
}

export function isDouble(dart: DartThrow): boolean {
  return dart.multiplier === 2;
}

export function isMaster(dart: DartThrow): boolean {
  return dart.multiplier === 2 || dart.multiplier === 3;
}

export function isValidOpener(dart: DartThrow, inRule: 'straight' | 'double' | 'master'): boolean {
  if (inRule === 'straight') return true;
  if (inRule === 'double') return isDouble(dart);
  return isMaster(dart);
}

export function formatDartThrow(dart: DartThrow): string {
  if (dart.segment === 0) return '0';
  if (dart.multiplier === 1) return String(dart.segment);
  const prefix = dart.multiplier === 2 ? 'D' : 'T';
  return `${prefix}${dart.segment}`;
}

export function shouldScore(dart: DartThrow, playerId: string, state: GameState): boolean {
  if (state.config.mode !== 'count-down') return true;
  if (state.opened[playerId]) return true;
  return isValidOpener(dart, state.config.inRule);
}

export function isBustCountDown(score: number, dart: DartThrow, outRule: OutRule): boolean {
  if (score < 0) return true;
  if (score === 1 && outRule === 'double') return true;
  if (score === 0 && outRule === 'double' && !isDouble(dart)) return true;
  if (score === 0 && outRule === 'master' && !isMaster(dart)) return true;
  return false;
}
