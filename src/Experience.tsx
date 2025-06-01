import { Physics } from "@react-three/rapier";
import Ball from "./components/Ball";
import TrashCan from "./components/TrashCan";
import WindZone from "./components/WindZone";
import { ContactShadows } from "@react-three/drei";
import ThrowPad from "./components/ThrowPad";
import Environment from "./components/Environment";
import { useEffect, useMemo } from "react";
import { Fan } from "./components/Fan";
import CanvasUI from "./components/CanvasUI";
import { useGameStore } from "./store/game";
import useTieredCamera from "./hooks/useTieredCamera";

export default function Experience() {
  const isMuted = useGameStore((s) => s.isMuted);

  useTieredCamera();

  // 1) Memoize your audio instances so they’re created exactly once
  const bgm = useMemo(() => {
    const a = new Audio("/sounds/officeNoise.mp3");
    a.loop = true;
    a.volume = 0.3;
    a.preload = "auto";
    return a;
  }, []);
  const bgm2 = useMemo(() => {
    const a = new Audio("/sounds/fan.mp3");
    a.loop = true;
    a.volume = 0.6;
    a.preload = "auto";
    return a;
  }, []);

  // 2) Unlock (play) on first interaction
  useEffect(() => {
    const unlock = () => {
      if (!useGameStore.getState().isMuted) {
        bgm.play().catch(() => {});
        bgm2.play().catch(() => {});
      }
      window.removeEventListener("pointerdown", unlock);
    };
    window.addEventListener("pointerdown", unlock);

    return () => {
      window.removeEventListener("pointerdown", unlock);
      bgm.pause();
      bgm2.pause();
    };
  }, [bgm, bgm2]);

  // 3) Pause/resume when the muted flag changes
  useEffect(() => {
    if (isMuted) {
      bgm.pause();
      bgm2.pause();
    } else {
      bgm.play().catch(() => {});
      bgm2.play().catch(() => {});
    }
  }, [isMuted, bgm, bgm2]);

  return (
    <>
      <Physics>
        <WindZone />
        <ContactShadows opacity={0.5} scale={25} />
        <CanvasUI />

        <Environment />
        <Fan />
        <Ball />
        <TrashCan />
        <ThrowPad />
      </Physics>
    </>
  );
}
