import { Html } from "@react-three/drei";
import { useGameStore } from "../store/game";
import { Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef } from "react";
import { purgeAssets } from "../utils/purgeAssets";
import { useViewport } from "../hooks/useViewport";
import * as THREE from "three";

/* ------------------------------------------------------------------ */
/*  Re‑usable “white card” component                                  */
/* ------------------------------------------------------------------ */
function Card({
  size = [1, 0.5], // [width, height] in meters
  offset = [0, 0, -0.01], // local position *relative to Html*
  rotation = [0, 0, 0], // local Euler (rad) relative to Html
}: {
  size?: [number, number];
  offset?: [number, number, number];
  rotation?: [number, number, number];
}) {
  return (
    <mesh position={offset} rotation={rotation}>
      <planeGeometry args={size} />
      {/* fully opaque white */}
      <meshBasicMaterial color="white" />
    </mesh>
  );
}

export default function CanvasUI() {
  /* ------------------- state + subscriptions --------------------- */
  const isMuted = useGameStore((s) => s.isMuted);
  const setIsMuted = useGameStore((s) => s.setIsMuted);
  const setPhase = useGameStore((s) => s.setPhase);

  const scoreRef = useRef<HTMLSpanElement>(null);
  const bestRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const unsub = useGameStore.subscribe((state) => {
      scoreRef.current!.textContent = String(state.score);
      bestRef.current!.textContent = String(state.bestScore);
    });
    return unsub;
  }, []);

  /* ------------------------- responsive guard -------------------- */
  const { width } = useViewport();
  if (width <= 1024) return null; // hide on tablet/phone

  /* --------------------------- UI blocks ------------------------- */
  return (
    <>
      {/* ❶ Score ---------------------------------------------------- */}
      <group
        position={[-4.4, 4.45, -4]}
        rotation={[
          THREE.MathUtils.degToRad(0), // x
          THREE.MathUtils.degToRad(25), // y
          THREE.MathUtils.degToRad(0), // z
        ]}
      >
        {/* 👉 plane directly behind Html; tweak size / offset / rotation here */}
        <Card size={[2.1, 1.48]} offset={[0.69, -0.54, -0.015]} />

        <Html>
          <div className="[perspective:300px] origin-left">
            <div className="text-[4.4vh] [transform:rotateY(12deg)_rotateX(4deg)_rotateZ(0deg)] font-semibold font-mono flex flex-col">
              <p className="flex gap-1">
                Score: <span ref={scoreRef} />
              </p>
              <p className="flex gap-1">
                Best: <span ref={bestRef} />
              </p>
            </div>
          </div>
        </Html>
      </group>

      {/* ❷ Menu + mute -------------------------------------------- */}
      <group
        position={[1.3, 4.15, -4]}
        rotation={[
          THREE.MathUtils.degToRad(-6),
          THREE.MathUtils.degToRad(25),
          THREE.MathUtils.degToRad(-0.5),
        ]}
      >
        {/* give this card a custom tilt so it matches the Html element */}
        <Card
          size={[1.14, 0.85]}
          offset={[0.6, -0.3, -0.015]}
          rotation={[
            THREE.MathUtils.degToRad(3), // x
            THREE.MathUtils.degToRad(-53), // y
            THREE.MathUtils.degToRad(0.2), // z
          ]}
        />

        <Html>
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
      </group>
    </>
  );
}
