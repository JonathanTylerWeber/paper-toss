import { Html } from "@react-three/drei";
import { useGameStore } from "../store/game";
import { Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef } from "react";
import { purgeAssets } from "../utils/purgeAssets";
import { useViewport } from "../hooks/useViewport";
import * as THREE from "three";

export default function CanvasUI() {
  const isMuted = useGameStore((s) => s.isMuted);
  const setIsMuted = useGameStore((s) => s.setIsMuted);
  const setPhase = useGameStore((s) => s.setPhase);

  // 1. refs to the DOM elements we want to mutate
  const scoreRef = useRef<HTMLSpanElement>(null);
  const bestRef = useRef<HTMLSpanElement>(null);

  // 2. subscribe outside React render cycle
  useEffect(() => {
    const unsub = useGameStore.subscribe((state) => {
      if (scoreRef.current) scoreRef.current.textContent = String(state.score);
      if (bestRef.current)
        bestRef.current.textContent = String(state.bestScore);
    });
    return unsub; // clean up
  }, []);

  const { width } = useViewport();

  if (width <= 1024) {
    return null;
  }

  // only render for non mobile
  return (
    <>
      {/* score */}
      <mesh
        position={[-3.68, 3.9, -4]}
        rotation={[
          THREE.MathUtils.degToRad(0),
          THREE.MathUtils.degToRad(30),
          THREE.MathUtils.degToRad(0),
        ]}
      >
        <planeGeometry args={[2.05, 1.45]} />
        <meshBasicMaterial color="white" />
      </mesh>

      <Html position={[-4.5, 4.5, -4]}>
        <div className="[perspective:600px] origin-left">
          <div
            className="[transform:rotateY(25deg)_rotateX(6deg)_rotateZ(0deg)]
                  text-[4.4vh] font-semibold font-mono flex flex-col"
            onPointerDown={(e) => e.stopPropagation()}
            onPointerUp={(e) => e.stopPropagation()}
          >
            <p className="flex gap-1">
              Score:
              <span ref={scoreRef} />
            </p>
            <p className="flex gap-1">
              Best:
              <span ref={bestRef} />
            </p>
          </div>
        </div>
      </Html>

      {/* Menu */}
      <mesh
        position={[1.8, 3.82, -4]}
        rotation={[
          THREE.MathUtils.degToRad(0),
          THREE.MathUtils.degToRad(-30),
          THREE.MathUtils.degToRad(0),
        ]}
      >
        <planeGeometry args={[1.13, 0.83]} />
        <meshBasicMaterial color="white" />
      </mesh>

      <Html position={[1.28, 4.15, -4]}>
        <div
          className="[transform:rotateY(25deg)_rotateX(-6deg)_rotateZ(-0.5deg)]
                      text-[2vh] xl:text-[2.2vh] font-semibold font-mono flex flex-col gap-1"
          onPointerDown={(e) => e.stopPropagation()}
          onPointerUp={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => {
              purgeAssets(); // throw away meshes, mats, textures from cache
              setPhase("start"); // back to the start screen
            }}
            className="inline-flex items-center hover:text-gray-700"
          >
            Main&nbsp;Menu
          </button>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className="inline-flex items-center justify-center hover:text-gray-700 gap-2"
          >
            {isMuted ? <VolumeX /> : <Volume2 />}
            <span>{isMuted ? "Unmute" : "Mute"}</span>
          </button>
        </div>
      </Html>
    </>
  );
}
