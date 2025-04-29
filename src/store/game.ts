import { create } from "zustand";

type GameState = {
  score: number;
  resetCount: number;
  arrowAngle: number;
  isOnPad: boolean;
  isWindOn: boolean;
  windStrength: number;
  windDirection: string;
  throwStrength: number;
  setArrowAngle: (angle: number) => void;
  setIsOnPad: (v: boolean) => void;
  setIsWindOn: (v: boolean) => void;
  setWindStrength: (n: number) => void;
  increment: () => void;
  reset: () => void;
};

function computeThrowStrength(ws: number): number {
  if (ws <= 2) return 5.5;
  if (ws <= 4) return 6;
  if (ws <= 5) return 6.25;
  if (ws <= 6) return 6.5;
  return 7;
}

export const useGameStore = create<GameState>((set) => ({
  score: 0,
  resetCount: 0,
  arrowAngle: 0,
  isOnPad: false,
  isWindOn: true,
  windStrength: 3.42,
  windDirection: "right",
  throwStrength: 6,
  setArrowAngle: (angle) => set({ arrowAngle: angle }),
  setIsOnPad: (v) => set({ isOnPad: v }),
  setIsWindOn: (v) => set({ isWindOn: v }),
  setWindStrength: (n) => set({ windStrength: n }),
  increment: () => {
    set((s) => ({
      score: s.score + 1,
      resetCount: s.resetCount + 1,
    }));

    setTimeout(() => {
      const ws = Math.round(Math.random() * 7 * 100) / 100;
      const dir = Math.random() > 0.5 ? "left" : "right";
      set({
        isWindOn: true,
        windStrength: ws,
        windDirection: dir,
        throwStrength: computeThrowStrength(ws),
      });
    }, 700);
  },

  reset: () => {
    set((s) => ({
      score: 0,
      resetCount: s.resetCount + 1,
    }));

    setTimeout(() => {
      const ws = Math.round(Math.random() * 7 * 100) / 100;
      const dir = Math.random() > 0.5 ? "left" : "right";
      set({
        isWindOn: true,
        windStrength: ws,
        windDirection: dir,
        throwStrength: computeThrowStrength(ws),
      });
    }, 700);
  },
}));
