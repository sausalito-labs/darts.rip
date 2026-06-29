export type Multiplier = 1 | 2 | 3;

export interface DartThrow {
  segment: number;
  multiplier: Multiplier;
  total: number;
}

export interface Player {
  id: string;
  name: string;
  color: string;
}

export type InRule = 'straight' | 'double' | 'master';
export type OutRule = 'straight' | 'double' | 'master';

export interface CountDownConfig {
  mode: 'count-down';
  startingScore: number;
  inRule: InRule;
  outRule: OutRule;
  maxRounds?: number;
}

export interface CountUpConfig {
  mode: 'count-up';
  targetScore: number;
  maxRounds?: number;
}

export type GameConfig = CountDownConfig | CountUpConfig;

export interface Turn {
  playerId: string;
  round: number;
  darts: DartThrow[];
  scoreBefore: number;
  scoreAfter: number;
  bust: boolean;
}

export interface GameState {
  modeId: string;
  config: GameConfig;
  players: Player[];
  currentPlayerIndex: number;
  currentDart: 0 | 1 | 2 | 3;
  scores: Record<string, number>;
  opened: Record<string, boolean>;
  currentTurn: Turn;
  history: Turn[];
  round: number;
  gameOver: boolean;
  winnerId?: string;
}
