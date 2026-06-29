import type { GameMode } from '../mode';
import type { CountUpConfig, DartThrow, GameState, Player, Turn } from '../types';
import { getCurrentPlayer, getNextPlayerIndex } from '../utils';

export const countUpMode: GameMode = {
  id: 'count-up',
  name: 'Count Up',
  available: true,
  description: 'Race to reach a target score first.',

  defaultConfig(): CountUpConfig {
    return {
      mode: 'count-up',
      targetScore: 1000,
    };
  },

  validateConfig(config: CountUpConfig): boolean {
    return config.mode === 'count-up' && config.targetScore > 0;
  },

  init(config: CountUpConfig, players: Player[]): GameState {
    const scores: Record<string, number> = {};
    for (const player of players) {
      scores[player.id] = 0;
    }

    const currentTurn: Turn = {
      playerId: players[0]?.id ?? '',
      round: 1,
      darts: [],
      scoreBefore: 0,
      scoreAfter: 0,
      bust: false,
    };

    return {
      modeId: this.id,
      config,
      players,
      currentPlayerIndex: 0,
      currentDart: 0,
      scores,
      opened: {},
      currentTurn,
      history: [],
      round: 1,
      gameOver: false,
    };
  },

  throwDart(state: GameState, dart: DartThrow): GameState {
    if (state.gameOver) return state;

    const config = state.config as CountUpConfig;
    const player = getCurrentPlayer(state);
    const playerId = player.id;
    const scoreBefore = state.scores[playerId];
    const candidateScore = scoreBefore + dart.total;

    const newState: GameState = {
      ...state,
      scores: { ...state.scores, [playerId]: candidateScore },
      currentTurn: {
        ...state.currentTurn,
        darts: [...state.currentTurn.darts, dart],
        scoreAfter: candidateScore,
      },
    };

    // Check win
    if (candidateScore >= config.targetScore) {
      const finalizedTurn: Turn = {
        ...newState.currentTurn,
        scoreBefore,
        scoreAfter: candidateScore,
        bust: false,
      };

      return {
        ...advancePlayer({
          ...newState,
          currentTurn: finalizedTurn,
        }),
        gameOver: true,
        winnerId: playerId,
      };
    }

    // Continue turn or advance
    const nextDart = (newState.currentDart + 1) as 1 | 2 | 3;
    if (nextDart === 3) {
      const finalizedTurn: Turn = {
        ...newState.currentTurn,
        scoreBefore,
        scoreAfter: candidateScore,
        bust: false,
      };
      return advancePlayer({
        ...newState,
        currentDart: 0,
        currentTurn: finalizedTurn,
      });
    }

    return {
      ...newState,
      currentDart: nextDart,
    };
  },

  isGameOver(state: GameState): boolean {
    return state.gameOver;
  },

  getCurrentPlayer(state: GameState): Player {
    return getCurrentPlayer(state);
  },
};

function advancePlayer(state: GameState): GameState {
  const config = state.config as CountUpConfig;
  const finalizedTurn = state.currentTurn;
  const nextIndex = getNextPlayerIndex(state);
  const nextRound = nextIndex === 0 ? state.round + 1 : state.round;
  const nextPlayerId = state.players[nextIndex]?.id ?? '';
  const nextScore = state.scores[nextPlayerId] ?? 0;

  const advancedState: GameState = {
    ...state,
    currentPlayerIndex: nextIndex,
    currentDart: 0,
    history: [...state.history, finalizedTurn],
    round: nextRound,
    currentTurn: {
      playerId: nextPlayerId,
      round: nextRound,
      darts: [],
      scoreBefore: nextScore,
      scoreAfter: nextScore,
      bust: false,
    },
  };

  if (config.maxRounds && nextRound > config.maxRounds && nextIndex === 0) {
    return endGameByMaxRounds(advancedState);
  }

  return advancedState;
}

function endGameByMaxRounds(state: GameState): GameState {
  if (state.gameOver) return state;

  const rankings = [...state.players].sort((a, b) => state.scores[b.id] - state.scores[a.id]);
  const winnerId = rankings[0]?.id;

  return {
    ...state,
    gameOver: true,
    winnerId,
  };
}
