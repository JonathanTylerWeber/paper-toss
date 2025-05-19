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

export default function Experience() {
  const bgmRef = useRef<HTMLAudioElement | null>(null);
  const bgmRef2 = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // 1) create and configure
    const bgm = new Audio("/officeNoise.mp3");
    bgm.loop = true;
    bgm.volume = 0.3;
    bgmRef.current = bgm;

    const bgm2 = new Audio("/fan.mp3");
    bgm2.loop = true;
    bgm2.volume = 0.6;
    bgmRef2.current = bgm2;

    // 2) wait for the very first user interaction to play
    const unlock = () => {
      bgm.play().catch(() => {});
      bgm2.play().catch(() => {});
      window.removeEventListener("pointerdown", unlock);
    };
    window.addEventListener("pointerdown", unlock);

    // 3) clean up on unmount
    return () => {
      bgm.pause();
      bgm.currentTime = 0;
      bgm2.pause();
      bgm2.currentTime = 0;
      window.removeEventListener("pointerdown", unlock);
    };
  }, []);

  return (
    <>
      {/* <OrbitControls makeDefault /> */}

      <pointLight intensity={100} />

      <Physics>
        <WindZone />
        <ContactShadows opacity={0.5} scale={25} />

        <Environment />
        <Fan />
        <Ball />
        <TrashCan />
        <ThrowPad />
      </Physics>
    </>
  );
}
