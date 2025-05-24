import {
  ArrowBigUp,
  ArrowLeft,
  ArrowRight,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useGameStore } from "./store/game";
import { useEffect, useRef } from "react";
import { purgeAssets } from "./purgeAssets";
import { useIsMobile } from "./useIsMobile";

export default function Interface() {
  const windStrength = useGameStore((s) => s.windStrength);
  const windDirection = useGameStore((s) => s.windDirection);
  const arrowAngle = useGameStore((s) => s.arrowAngle);
  const rotation = arrowAngle * 60;

  const isMuted = useGameStore((s) => s.isMuted);
  const setIsMuted = useGameStore((s) => s.setIsMuted);
  const setPhase = useGameStore((s) => s.setPhase);

  const isMobile = useIsMobile();

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

  return (
    <>
      {isMobile && (
        <div className="absolute top-0 w-full h-[32%] md:h-1/4 bg-slate-700 text-white font-mono pt-10">
          <div className="flex flex-col gap-12 items-center text-2xl sm:gap-6">
            <div
              className="font-semibold font-mono flex justify-between w-full px-6 md:px-40 lg:text-3xl"
              onPointerDown={(e) => e.stopPropagation()}
              onPointerUp={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  purgeAssets(); // throw away meshes, mats, textures from cache
                  setPhase("start"); // back to the start screen
                }}
                onPointerDown={(e) => e.stopPropagation()}
                onPointerUp={(e) => e.stopPropagation()}
                className="inline-flex items-center z-20 bg-slate-600 p-2 px-3 rounded-lg lg:p-4 lg:px-5"
              >
                Main&nbsp;Menu
              </button>

              <button
                onClick={() => setIsMuted(!isMuted)}
                className="inline-flex items-center justify-center z-20 gap-2 bg-slate-600 p-2 px-3 rounded-lg lg:p-4 lg:px-5"
              >
                {isMuted ? <VolumeX /> : <Volume2 />}
                <span>{isMuted ? "Unmute" : "Mute"}</span>
              </button>
            </div>
            <div className="flex flex-col sm:flex-row xl:flex-col items-center lg:text-3xl justify-center gap-0 sm:gap-12 xl:gap-0">
              <p className="flex gap-1 mb-4 sm:mb-0 xl:mb-4">
                Score:
                <span ref={scoreRef} />
              </p>
              <p className="flex gap-1">
                Best:
                <span ref={bestRef} />
              </p>
            </div>
          </div>
        </div>
      )}

      <div
        className="
          absolute 
          left-1/2 top-3/4 
          transform -translate-x-1/2
          -translate-y-28
          flex flex-col items-center 
          pointer-events-none z-10
        "
      >
        {/* 2. Wind info  */}
        <div className="text-center mb-2">
          <div className="text-base lg:text-xl">
            {(windStrength * 10).toFixed(1)}
          </div>
          <div className="flex justify-center">
            {windDirection === "right" ? (
              <ArrowRight className="size-6" />
            ) : (
              <ArrowLeft className="size-6" />
            )}
          </div>
        </div>

        {/* 3. Arrow  */}
        <div
          className="origin-center"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <ArrowBigUp className="size-12" />
        </div>
      </div>
    </>
  );
}
