# darts.fun — Product & Architecture Plan

## Overview
A companion PWA for playing darts. Players pick a game mode, configure rules,
set up players, and then enter each throw via a dartboard-style keypad. The app
handles all math, turn logic, and bust detection.

## Tech Stack
- Vite + React + TypeScript
- Tailwind CSS
- shadcn/ui
- react-router-dom
- Zustand (with persist middleware)
- @dnd-kit/core + @dnd-kit/sortable
- vite-plugin-pwa

## Folder Structure
```
src/
├── game-engine/          # Pure TypeScript game logic; no React
│   ├── types.ts
│   ├── mode.ts           # GameMode interface
│   ├── utils.ts          # Scoring & bust helpers
│   ├── registry.ts       # Mode registry
│   └── modes/
│       ├── count-up.ts
│       ├── count-down.ts
│       ├── cutthroat.ts  # stub
│       └── killer.ts     # stub
├── store/
│   └── gameStore.ts      # Zustand store + localStorage persistence
├── pages/
│   ├── ModeSelectPage.tsx
│   ├── CountUpPage.tsx
│   ├── CountDownPage.tsx
│   └── ComingSoonPage.tsx
├── components/
│   ├── rules/
│   │   ├── CountUpRulesForm.tsx
│   │   └── CountDownRulesForm.tsx
│   ├── scoring/
│   │   ├── DartInput.tsx
│   │   ├── Scoreboard.tsx
│   │   └── TurnHistory.tsx
│   └── PlayerSetup.tsx
├── lib/
│   └── utils.ts
└── main.tsx
```

## Routing
| Route | Purpose |
|---|---|
| `/` | Game mode selection |
| `/count-up` | Count Up flow: rules → players → play |
| `/count-down` | Count Down flow: rules → players → play |
| `/cutthroat` | Coming soon placeholder |
| `/killer` | Coming soon placeholder |

Each mode page manages its own internal step state
(`'rules' | 'players' | 'play'`).

## Game Engine
Every mode implements the `GameMode` interface:

```ts
interface GameMode {
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
```

Adding a new mode only requires creating a new file in
`src/game-engine/modes/` and registering it in `src/game-engine/registry.ts`.

## State Management
A single Zustand store owns:
- current mode id
- current step
- rules config
- player list
- active game state

The `persist` middleware saves the store to `localStorage` so games survive
reloads. The store delegates scoring decisions to the active game engine.

## Scoring Counter — How Throws Are Entered

### Dart Input Keypad
The play screen shows a keypad with only valid dartboard segments:
- Numbers 1–20
- 25 (bull)
- 0 (miss)

A separate multiplier toggle controls how the next throw is recorded:
- Double (×2)
- Triple (×3)
- Single (×1) is implicit when no toggle is active.

Bull values are fixed: 25 single, 25 double = 50. Triple is not allowed on bull.

Example keypad interaction:
1. Tap “Double”.
2. Tap “20”.
3. App records a throw of 40.

### Turn Flow
- Each player throws up to 3 darts per turn.
- After each throw, the engine immediately validates the result.
- If the throw is valid, the score updates.
- If the throw causes a bust, the entire turn is discarded and the next player
  is activated immediately.

### Undo
The dart input keypad includes an **Undo** button:
- **Undo** reverts the most recent dart throw, restoring the game state from
  before that throw.
- The undo stack is cleared when a new game is started or reset.
- The stack is capped to avoid unbounded localStorage growth.

### Bust Detection — Count Down
A bust occurs when:
- The player goes below 0.
- The chosen out rule is Double Out and the player reaches exactly 1.
- The chosen out rule is Double Out and the player does not finish on a double.
- The chosen out rule is Master Out and the player does not finish on a double
  or triple.
- The chosen in rule is Double/Master In and the player has not yet “opened”
  scoring.

When a bust is detected:
- All darts thrown that turn are reverted.
- The player’s score returns to what it was at the start of the turn.
- The app advances to the next player.

### Bust Detection — Count Up
A bust does not apply in Count Up. Every valid throw adds to the player’s total.
The game ends as soon as a player reaches or exceeds the target score, or when
the optional max-rounds cap is reached, whichever comes first.

### Supported Rules
#### Count Down
- Starting scores: 301, 501, 701, custom
- In rules: Straight In, Double In, Master In
- Out rules: Straight Out, Double Out, Master Out
- Optional max rounds
- Bust detection: below 0, ending on 1 with Double Out, invalid finish, etc.

#### Count Up
- Target score
- Optional max rounds
- First to target wins; if max rounds are set, highest score wins at the cap.

## PWA
`vite-plugin-pwa` provides the web manifest, service worker, and offline asset
caching.

## MVP Scope
- Count Up and Count Down fully playable
- Player setup with add/remove/rename/reorder/randomize
- Dart input keypad with single/double/triple multipliers
- Turn history, bust detection, game-over screen
- Undo throws during active scoring
- localStorage persistence and offline PWA support

## Future
- Cutthroat mode
- Killer mode
- Game history / statistics
