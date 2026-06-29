import type { GameMode } from '../mode';
import type { CountDownConfig, DartThrow, GameState, Player, Turn } from '../types';
import {
  getCurrentPlayer,
  getNextPlayerIndex,
  isBustCountDown,
  isValidOpener,
  shouldScore,
} from '../utils';

export const countDownMode: GameMode = {
  id: 'count-down',
  name: 'Count Down',
  available: true,
  description: 'Start from a set score and race to exactly zero.',

  defaultConfig(): CountDownConfig {
    return {
      mode: 'count-down',
      startingScore: 501,
      inRule: 'straight',
      outRule: 'straight',
    };
  },

  validateConfig(config: CountDownConfig): boolean {
    return (
      config.mode === 'count-down' &&
      config.startingScore > 0 &&
      ['straight', 'double', 'master'].includes(config.inRule) &&
      ['straight', 'double', 'master'].includes(config.outRule)
    );
  },

  init(config: CountDownConfig, players: Player[]): GameState {
    const scores: Record<string, number> = {};
    const opened: Record<string, boolean> = {};

    for (const player of players) {
      scores[player.id] = config.startingScore;
      opened[player.id] = config.inRule === 'straight';
    }

    const currentTurn: Turn = {
      playerId: players[0]?.id ?? '',
      round: 1,
      darts: [],
      scoreBefore: config.startingScore,
      scoreAfter: config.startingScore,
      bust: false,
    };

    return {
      modeId: this.id,
      config,
      players,
      currentPlayerIndex: 0,
      currentDart: 0,
      scores,
      opened,
      currentTurn,
      history: [],
      round: 1,
      gameOver: false,
    };
  },

  throwDart(state: GameState, dart: DartThrow): GameState {
    if (state.gameOver) return state;

    const config = state.config as CountDownConfig;
    const player = getCurrentPlayer(state);
    const playerId = player.id;
    const scoreBefore = state.scores[playerId];

    const newState: GameState = {
      ...state,
      currentTurn: {
        ...state.currentTurn,
        darts: [...state.currentTurn.darts, dart],
      },
    };

    // Handle opening / scoring
    let scoreChange = 0;
    if (shouldScore(dart, playerId, state)) {
      scoreChange = dart.total;
      if (!state.opened[playerId] && isValidOpener(dart, config.inRule)) {
        newState.opened = { ...state.opened, [playerId]: true };
      }
    }

    const candidateScore = scoreBefore - scoreChange;

    // Bust detection
    if (isBustCountDown(candidateScore, dart, config.outRule)) {
      const finalizedTurn: Turn = {
        ...newState.currentTurn,
        scoreBefore,
        scoreAfter: scoreBefore,
        bust: true,
      };

      return advancePlayer({
        ...newState,
        currentTurn: finalizedTurn,
        scores: { ...state.scores },
      });
    }

    // Valid throw
    newState.scores = { ...state.scores, [playerId]: candidateScore };
    newState.currentTurn = {
      ...newState.currentTurn,
      scoreAfter: candidateScore,
    };

    // Check win
    if (candidateScore === 0) {
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
  const config = state.config as CountDownConfig;
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

  const rankings = [...state.players].sort((a, b) => state.scores[a.id] - state.scores[b.id]);
  const winnerId = rankings[0]?.id;

  return {
    ...state,
    gameOver: true,
    winnerId,
  };
}
