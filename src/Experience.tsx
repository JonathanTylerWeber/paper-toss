// import { OrbitControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import Ball from "./Ball";
import TrashCan from "./TrashCan";
import WindZone from "./WindZone";
import { ContactShadows } from "@react-three/drei";
import ThrowPad from "./ThrowPad";
import Environment from "./Environment";
import { useEffect, useRef } from "react";
import { Fan } from "./Fan";
import CanvasUI from "./CanvasUI";
import { useGameStore } from "./store/game";

export default function Experience() {
  const bgmRef = useRef<HTMLAudioElement | null>(null);
  const bgm2Ref = useRef<HTMLAudioElement | null>(null);
  const isMuted = useGameStore((s) => s.isMuted);

  // 1) Create & configure the audio elements on mount
  useEffect(() => {
    const bgm = new Audio("/officeNoise.mp3");
    const bgm2 = new Audio("/fan.mp3");
    bgm.loop = bgm2.loop = true;
    bgm.volume = 0.3;
    bgm2.volume = 0.6;
    bgm.preload = bgm2.preload = "auto";

    bgmRef.current = bgm;
    bgm2Ref.current = bgm2;

    // 2) Unlock on first user interaction
    const unlock = () => {
      const { isMuted } = useGameStore.getState(); // read fresh value
      if (!isMuted) {
        bgm.play().catch(() => {});
        bgm2.play().catch(() => {});
      }
      window.removeEventListener("pointerdown", unlock);
    };
    window.addEventListener("pointerdown", unlock);

    // 3) Clean up on unmount
    return () => {
      window.removeEventListener("pointerdown", unlock);
      bgm.pause();
      bgm2.pause();
      bgm.currentTime = 0;
      bgm2.currentTime = 0;
    };
  }, []);

  // 4) Watch for mute toggles and pause/resume accordingly
  useEffect(() => {
    const bgm = bgmRef.current;
    const bgm2 = bgm2Ref.current;
    if (!bgm || !bgm2) return;

    if (isMuted) {
      bgm.pause();
      bgm2.pause();
    } else {
      // if they've already unlocked, this will resume
      bgm.play().catch(() => {});
      bgm2.play().catch(() => {});
    }
  }, [isMuted]);

  return (
    <>
      {/* <OrbitControls makeDefault /> */}

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
