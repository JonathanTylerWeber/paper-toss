import {
  ArrowBigUp,
  ArrowLeft,
  ArrowRight,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useGameStore } from "../store/game";
import { useEffect, useRef } from "react";
import { purgeAssets } from "../utils/purgeAssets";
import { useViewport } from "../hooks/useViewport";

export default function Interface() {
  const windStrength = useGameStore((s) => s.windStrength);
  const windDirection = useGameStore((s) => s.windDirection);
  const arrowAngle = useGameStore((s) => s.arrowAngle);
  const rotation = arrowAngle * 60;

  const isMuted = useGameStore((s) => s.isMuted);
  const setIsMuted = useGameStore((s) => s.setIsMuted);
  const setPhase = useGameStore((s) => s.setPhase);

  const { width, orientation } = useViewport();

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
      {width <= 1024 && orientation != "landscape" && (
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
            <div className="flex flex-row xl:flex-col items-center lg:text-3xl justify-center gap-10 sm:gap-12 xl:gap-0">
              <p className="flex gap-1 mb-0 xl:mb-4">
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

      {width <= 1024 && orientation == "landscape" && (
        <div className="absolute z-10 p-4 text-white w-40 ml-10">
          <div
            className="font-semibold font-mono flex flex-col gap-4 mb-10 w-full lg:text-3xl"
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
              className="inline-flex items-center justify-center z-20 bg-slate-600 p-2 px-3 rounded-lg lg:p-4 lg:px-5"
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
          <div className="flex flex-col items-center lg:text-3xl justify-center gap-6 bg-slate-700 py-4 rounded-xl">
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
      )}

      {orientation != "landscape" && (
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
            <div className="text-base lg:text-xl z-10">
              {(windStrength * 10).toFixed(1)}
            </div>
            <div className="flex justify-center">
              {windDirection === "right" ? (
                <ArrowRight className="size-6 z-10" />
              ) : (
                <ArrowLeft className="size-6 z-10" />
              )}
            </div>
          </div>

          {/* 3. Arrow  */}
          <div
            className="origin-center"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            <ArrowBigUp className="size-12 z-10" />
          </div>
        </div>
      )}

      {orientation == "landscape" && (
        <div
          className="
          absolute 
          left-1/2 top-2/3 lg:top-3/4 
          transform -translate-x-1/2
          -translate-y-[12px]
          lg:-translate-y-24
          flex flex-col items-center 
          pointer-events-none z-10
        "
        >
          {/* 2. Wind info  */}
          <div className="text-center lg:mb-2">
            <div className="text-sm lg:text-xl">
              {(windStrength * 10).toFixed(1)}
            </div>
            <div className="flex justify-center">
              {windDirection === "right" ? (
                <ArrowRight className="size-4 lg:size-6 z-10" />
              ) : (
                <ArrowLeft className="size-4 lg:size-6 z-10" />
              )}
            </div>
          </div>

          {/* 3. Arrow  */}
          <div
            className="origin-center hidden lg:block"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            <ArrowBigUp className=" size-6 lg:size-12 z-10" />
          </div>
        </div>
      )}
    </>
  );
}
