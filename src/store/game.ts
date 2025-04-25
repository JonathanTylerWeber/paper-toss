import { create } from "zustand";

type GameState = {
  score: number;
  resetCount: number;
  onPad: boolean;
  setOnPad: (v: boolean) => void;
  increment: () => void;
  reset: () => void;
};

export const useGameStore = create<GameState>((set) => ({
  score: 0,
  resetCount: 0,
  onPad: false,
  setOnPad: (v) => set({ onPad: v }),
  increment: () =>
    set((s) => ({
      score: s.score + 1,
      resetCount: s.resetCount + 1,
    })),
  reset: () =>
    set((s) => ({
      score: 0,
      resetCount: s.resetCount + 1,
    })),
}));
