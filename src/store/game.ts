// store/game.ts
import { create } from "zustand";
import awhUrl from "/awh.mp3";

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
  if (ws <= 0.2) return 0.425;
  if (ws <= 0.4) return 0.45;
  if (ws <= 0.5) return 0.475;
  if (ws <= 0.6) return 0.5;
  return 0.525;
}

export const useGameStore = create<GameState>((set, get) => {
  // preload your “awh” sound
  const awh = new Audio(awhUrl);
  awh.preload = "auto";
  awh.volume = 0.4;

  return {
    score: 0,
    resetCount: 0,
    arrowAngle: 0,
    isOnPad: false,
    isWindOn: true,
    windDirection: "right",
    windStrength: 0.26,
    throwStrength: 0.425,
    isThrown: false,

    setArrowAngle: (angle) => set({ arrowAngle: angle }),
    setIsOnPad: (v) => set({ isOnPad: v }),
    setIsWindOn: (v) => set({ isWindOn: v }),
    setWindStrength: (n) => set({ windStrength: n }),
    setIsThrown: (v) => set({ isThrown: v }),

    increment: () => {
      set((s) => ({
        score: s.score + 1,
        resetCount: s.resetCount + 1,
        isThrown: false,
      }));

      setTimeout(() => {
        const ws = Math.round(Math.random() * 0.7 * 100) / 100;
        const dir = Math.random() > 0.5 ? "left" : "right";
        set({
          windStrength: ws,
          isWindOn: true,
          windDirection: dir,
          throwStrength: computeThrowStrength(ws),
        });
      }, 700);
    },

    reset: () => {
      const prevScore = get().score;
      // play "awh" if they had any points
      if (prevScore > 0) {
        awh.currentTime = 0;
        awh.play().catch(() => {});
      }

      set((s) => ({
        score: 0,
        resetCount: s.resetCount + 1,
        isThrown: false,
      }));

      setTimeout(() => {
        const ws = Math.round(Math.random() * 0.7 * 100) / 100;
        const dir = Math.random() > 0.5 ? "left" : "right";
        set({
          windStrength: ws,
          isWindOn: true,
          windDirection: dir,
          throwStrength: computeThrowStrength(ws),
        });
      }, 700);
    },
  };
});
