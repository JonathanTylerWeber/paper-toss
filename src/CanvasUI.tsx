import { Html } from "@react-three/drei";
import { useGameStore } from "./store/game";
import { Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef } from "react";
import { purgeAssets } from "./purgeAssets";
import { useIsMobile } from "./useIsMobile";

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

  const isMobile = useIsMobile();

  if (isMobile) {
    return null;
  }

  // only render for non mobile
  return (
    <>
      {/* score */}
      <Html position={[-4.4, 4.45, -4]}>
        <div className="[perspective:300px] origin-left">
          <div
            className="[transform:rotateY(16deg)_rotateX(4deg)_rotateZ(0deg)]
                  text-[4.4vh] font-semibold font-mono flex flex-col "
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

      <Html position={[1.3, 4.15, -4]}>
        <div
          className="[transform:rotateY(25deg)_rotateX(-6deg)_rotateZ(-0.5deg)]
                      text-[2.2vh] font-semibold font-mono flex flex-col gap-1"
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
