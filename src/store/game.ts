import { create } from "zustand";

type GameState = {
  score: number;
  resetCount: number;
  arrowAngle: number;
  setArrowAngle: (angle: number) => void;
  onPad: boolean;
  setOnPad: (v: boolean) => void;
  increment: () => void;
  reset: () => void;
};

export const useGameStore = create<GameState>((set) => ({
  score: 0,
  resetCount: 0,
  arrowAngle: 0,
  onPad: false,
  setArrowAngle: (angle) => set({ arrowAngle: angle }),
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
