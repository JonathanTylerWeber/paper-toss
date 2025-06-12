import { Volume2, VolumeX } from "lucide-react";
import { useGameStore } from "../store/game";
import { purgeAssets } from "../utils/purgeAssets";
import { useViewport } from "../hooks/useViewport";

export default function Interface() {
  const isMuted = useGameStore((s) => s.isMuted);
  const score = useGameStore((s) => s.score);
  const best = useGameStore((s) => s.bestScore);
  const setIsMuted = useGameStore((s) => s.setIsMuted);
  const setPhase = useGameStore((s) => s.setPhase);

  const { width, orientation } = useViewport();

  return (
    <div>
      {width <= 1024 && orientation != "landscape" && (
        <div className="absolute top-0 w-full h-[32%] md:h-1/4 text-white font-mono pt-10">
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
                <span>{score}</span>
              </p>
              <p className="flex gap-1">
                Best:
                <span>{best}</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {width <= 1024 && orientation == "landscape" && (
        <div className="absolute z-10 p-4 text-white w-40 ml-10 mt-20">
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
          <div className="flex flex-col items-center lg:text-3xl justify-center gap-6 py-4 rounded-xl bg-slate-700/70">
            <p className="flex gap-1 mb-4 sm:mb-0 xl:mb-4">
              Score:
              <span>{score}</span>
            </p>
            <p className="flex gap-1">
              Best:
              <span>{best}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
