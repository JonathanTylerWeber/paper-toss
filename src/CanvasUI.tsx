import { Html } from "@react-three/drei";
import { useGameStore } from "./store/game";
import { Volume2, VolumeX } from "lucide-react";

export default function CanvasUI() {
  const score = useGameStore((state) => state.score);
  const bestScore = useGameStore((state) => state.bestScore);
  const isMuted = useGameStore((s) => s.isMuted);
  const setIsMuted = useGameStore((s) => s.setIsMuted);

  return (
    <>
      {/* score */}
      <Html position={[-4.55, 4.45, -4]}>
        <div
          className="origin-left [perspective:800px] [transform:rotateY(-18deg)_rotateX(-10deg)]
                  text-[42px] font-semibold font-mono flex flex-col "
          onPointerDown={(e) => e.stopPropagation()}
          onPointerUp={(e) => e.stopPropagation()}
        >
          <p className="flex gap-1">
            Score:<span>{score}</span>
          </p>
          <p className="flex gap-1">
            Best:<span>{bestScore}</span>
          </p>
        </div>
      </Html>

      <Html position={[1.32, 4.1, -4]}>
        <div
          className="origin-left [perspective:800px] [transform:rotateY(25deg)_rotateX(-6deg)]
                      text-[24px] font-semibold font-mono flex flex-col gap-1"
          onPointerDown={(e) => e.stopPropagation()}
          onPointerUp={(e) => e.stopPropagation()}
        >
          <button className="inline-flex items-center hover:text-gray-700">
            Main&nbsp;Menu
          </button>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className="inline-flex items-center justify-center hover:text-gray-700 gap-2"
          >
            {isMuted ? <VolumeX /> : <Volume2 />}
            <span>{isMuted ? "off" : "on"}</span>
          </button>
        </div>
      </Html>
    </>
  );
}
