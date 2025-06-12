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
import { useEffect, useState } from "react";
import { useViewport } from "./hooks/useViewport";
import { useThree } from "@react-three/fiber";

export default function Experience() {
  useTieredCamera();
  const { camera } = useThree();
  const { width } = useViewport();

  const isMuted = useGameStore((s) => s.isMuted);
  const windDirection = useGameStore((s) => s.windDirection);

  useEffect(() => {
    if (isMuted) {
      bgm.pause();
      fan.pause();
    } else {
      bgm.play();
      fan.play();
    }
  }, [isMuted]);

  // ***************
  // turn off dynamic shadow for mobile
  const [shadowKey, setShadowKey] = useState(0);
  useEffect(() => {
    // refresh shadows only on small screens
    if (width <= 1024) setShadowKey((k) => k + 1);
  }, [windDirection, width]);

  useEffect(() => {
    if (width <= 1024) {
      camera.layers.enable(1); // see the ball on small screens
    } else {
      camera.layers.disable(1); // tidy up on desktop
    }
  }, [camera, width]);

  const freeze = width <= 1024;
  // ***************

  return (
    <>
      <Physics>
        <WindZone />
        <CanvasUI />
        <ContactShadows
          key={freeze ? shadowKey : "desktop"}
          frames={freeze ? 1 : Infinity}
          opacity={0.5}
          scale={25}
        />

        <Environment />
        <Fan />
        <Ball />
        <TrashCan />
        <ThrowPad />
      </Physics>
    </>
  );
}
