import type { DartThrow, GameConfig, GameState, Player } from './types';

export interface GameMode {
  id: string;
  name: string;
  available: boolean;
  description: string;
  defaultConfig(): GameConfig;
  validateConfig(config: GameConfig): boolean;
  init(config: GameConfig, players: Player[]): GameState;
  throwDart(state: GameState, dart: DartThrow): GameState;
  isGameOver(state: GameState): boolean;
  getCurrentPlayer(state: GameState): Player;
}
