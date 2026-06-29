import type { GameMode } from '../mode';
import type { GameConfig, GameState, Player } from '../types';

export const cutthroatMode: GameMode = {
  id: 'cutthroat',
  name: 'Cutthroat',
  available: false,
  description: 'Knock out your opponents while staying alive.',

  defaultConfig(): GameConfig {
    return { mode: 'count-up', targetScore: 0 };
  },

  validateConfig(): boolean {
    return false;
  },

  init(): GameState {
    throw new Error('Cutthroat mode is not available yet');
  },

  throwDart(): GameState {
    throw new Error('Cutthroat mode is not available yet');
  },

  isGameOver(): boolean {
    return false;
  },

  getCurrentPlayer(): Player {
    throw new Error('Cutthroat mode is not available yet');
  },
};
