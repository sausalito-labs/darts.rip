import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getMode } from '@/game-engine/registry';
import type { DartThrow, GameConfig, GameState, Player } from '@/game-engine/types';
import { createDartThrow, createPlayer } from '@/game-engine/utils';

export type SetupStep = 'rules' | 'players' | 'play';

const UNDO_STACK_LIMIT = 20;

interface AppState {
  currentModeId: string | null;
  currentStep: SetupStep;
  players: Player[];
  config: GameConfig | null;
  gameState: GameState | null;
  pastStates: GameState[];
  futureStates: GameState[];
}

interface AppActions {
  selectMode: (modeId: string) => void;
  setStep: (step: SetupStep) => void;
  setConfig: (config: GameConfig) => void;
  addPlayer: (name: string) => void;
  removePlayer: (id: string) => void;
  reorderPlayers: (players: Player[]) => void;
  updatePlayerName: (id: string, name: string) => void;
  randomizePlayers: () => void;
  startGame: () => void;
  throwDart: (segment: number, multiplier: 1 | 2 | 3) => void;
  undo: () => void;
  redo: () => void;
  resetGame: () => void;
  resetAll: () => void;
}

const initialState: AppState = {
  currentModeId: null,
  currentStep: 'rules',
  players: [],
  config: null,
  gameState: null,
  pastStates: [],
  futureStates: [],
};

function clearGameHistory(): Pick<AppState, 'pastStates' | 'futureStates'> {
  return { pastStates: [], futureStates: [] };
}

export const useGameStore = create<AppState & AppActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      selectMode: (modeId) => {
        const mode = getMode(modeId);
        if (!mode) return;

        set({
          currentModeId: modeId,
          currentStep: 'rules',
          config: mode.defaultConfig(),
          gameState: null,
          ...clearGameHistory(),
        });
      },

      setStep: (step) => set({ currentStep: step }),

      setConfig: (config) => set({ config }),

      addPlayer: (name) => {
        const state = get();
        const newPlayer = createPlayer(name, state.players.length);
        set({ players: [...state.players, newPlayer] });
      },

      removePlayer: (id) => {
        const state = get();
        set({ players: state.players.filter((p) => p.id !== id) });
      },

      reorderPlayers: (players) => set({ players }),

      updatePlayerName: (id, name) => {
        const state = get();
        set({
          players: state.players.map((p) =>
            p.id === id ? { ...p, name: name.trim() || p.name } : p
          ),
        });
      },

      randomizePlayers: () => {
        const state = get();
        const shuffled = [...state.players].sort(() => Math.random() - 0.5);
        set({ players: shuffled });
      },

      startGame: () => {
        const state = get();
        const mode = state.currentModeId ? getMode(state.currentModeId) : undefined;
        if (!mode || !state.config || state.players.length === 0) return;

        const gameState = mode.init(state.config, state.players);
        set({ gameState, currentStep: 'play', ...clearGameHistory() });
      },

      throwDart: (segment, multiplier) => {
        const state = get();
        const mode = state.currentModeId ? getMode(state.currentModeId) : undefined;
        if (!mode || !state.gameState) return;

        let dart: DartThrow;
        try {
          dart = createDartThrow(segment, multiplier);
        } catch {
          return;
        }

        const newGameState = mode.throwDart(state.gameState, dart);
        const pastStates = [state.gameState, ...state.pastStates].slice(0, UNDO_STACK_LIMIT);
        set({ gameState: newGameState, pastStates, futureStates: [] });
      },

      undo: () => {
        const state = get();
        const previous = state.pastStates[0];
        if (!previous || !state.gameState) return;

        set({
          gameState: previous,
          pastStates: state.pastStates.slice(1),
          futureStates: [state.gameState, ...state.futureStates].slice(0, UNDO_STACK_LIMIT),
        });
      },

      redo: () => {
        const state = get();
        const next = state.futureStates[0];
        if (!next || !state.gameState) return;

        set({
          gameState: next,
          futureStates: state.futureStates.slice(1),
          pastStates: [state.gameState, ...state.pastStates].slice(0, UNDO_STACK_LIMIT),
        });
      },

      resetGame: () => {
        const state = get();
        const mode = state.currentModeId ? getMode(state.currentModeId) : undefined;
        if (!mode || !state.config || state.players.length === 0) {
          set({ gameState: null, currentStep: 'rules', ...clearGameHistory() });
          return;
        }

        const gameState = mode.init(state.config, state.players);
        set({ gameState, currentStep: 'play', ...clearGameHistory() });
      },

      resetAll: () => set(initialState),
    }),
    {
      name: 'darts.fun.state',
      partialize: (state) => ({
        currentModeId: state.currentModeId,
        currentStep: state.currentStep,
        players: state.players,
        config: state.config,
        gameState: state.gameState,
        pastStates: state.pastStates,
        futureStates: state.futureStates,
      }),
    }
  )
);
