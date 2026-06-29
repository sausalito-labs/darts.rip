import type { GameMode } from '../mode';
import type { GameConfig, GameState, Player } from '../types';

export const killerMode: GameMode = {
  id: 'killer',
  name: 'Killer',
  available: false,
  description: 'Claim a number and eliminate the competition.',

  defaultConfig(): GameConfig {
    return { mode: 'count-up', targetScore: 0 };
  },

  validateConfig(): boolean {
    return false;
  },

  init(): GameState {
    throw new Error('Killer mode is not available yet');
  },

  throwDart(): GameState {
    throw new Error('Killer mode is not available yet');
  },

  isGameOver(): boolean {
    return false;
  },

  getCurrentPlayer(): Player {
    throw new Error('Killer mode is not available yet');
  },
};
