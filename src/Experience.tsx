import { Physics } from "@react-three/rapier";
import Ball from "./components/Ball";
import TrashCan from "./components/TrashCan";
import WindZone from "./components/WindZone";
import { ContactShadows } from "@react-three/drei";
import ThrowPad from "./components/ThrowPad";
import Environment from "./components/Environment";
import { Fan } from "./components/Fan";
import CanvasUI from "./components/CanvasUI";
import useTieredCamera from "./hooks/useTieredCamera";
import { useGameStore } from "./store/game";
import { bgm, fan } from "./utils/audioManager";
import { useEffect } from "react";

export default function Experience() {
  useTieredCamera();
  const isMuted = useGameStore((s) => s.isMuted);

  useEffect(() => {
    if (isMuted) {
      bgm.pause();
      fan.pause();
    } else {
      bgm.play();
      fan.play();
    }
  }, [isMuted]);

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
