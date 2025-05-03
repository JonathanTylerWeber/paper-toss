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
  isThrown: boolean;
  setArrowAngle: (angle: number) => void;
  setIsOnPad: (v: boolean) => void;
  setIsWindOn: (v: boolean) => void;
  setWindStrength: (n: number) => void;
  setIsThrown: (v: boolean) => void;
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
  windStrength: Math.round(Math.random() * 7 * 100) / 100,
  windDirection: "right",
  throwStrength: 6,
  isThrown: false,
  setArrowAngle: (angle) => set({ arrowAngle: angle }),
  setIsOnPad: (v) => set({ isOnPad: v }),
  setIsWindOn: (v) => set({ isWindOn: v }),
  setWindStrength: (n) => set({ windStrength: n }),
  setIsThrown: (n) => set({ isThrown: n }),
  increment: () => {
    set((s) => ({
      score: s.score + 1,
      resetCount: s.resetCount + 1,
      isThrown: false,
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
      isThrown: false,
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
