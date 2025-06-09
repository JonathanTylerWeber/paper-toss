import { Volume2, VolumeX } from "lucide-react";
import { useGameStore } from "../store/game";
import { useViewport } from "../hooks/useViewport";
import {
  awh,
  bgm,
  clap,
  fan,
  metalHit,
  paperRustle,
  prime,
} from "../utils/audioManager";

interface Props {
  onStart: () => void;
}

export default function StartScreen({ onStart }: Props) {
  const bestScore = useGameStore((state) => state.bestScore);
  const isMuted = useGameStore((s) => s.isMuted);
  const setIsMuted = useGameStore((s) => s.setIsMuted);

  const { width } = useViewport();

  const handleStart = () => {
    if (!isMuted) {
      [clap, metalHit, paperRustle, awh, fan, bgm].forEach(prime);
    }
    onStart(); // switch phase → mounts Experience
  };

  return (
    <>
      {width > 1024 && (
        <div
          className="
        w-screen-d
        h-screen-d
        bg-[url('/images/blurredBg.jpg')] 
        bg-cover 
        bg-center 
        flex 
        items-center 
        justify-center
      "
        >
          <div className="bg-black/50 rounded-2xl p-12 xl:p-10">
            <h1 className="text-white text-4xl md:text-6xl xl:text-8xl text-center font-mono font-semibold">
              Paper Toss
            </h1>
            <div className="flex md:flex-row flex-col gap-20 mt-14 justify-center">
              <button
                onPointerDown={handleStart}
                onTouchStart={handleStart}
                className="bg-white text-black font-mono text-4xl p-3 px-6 rounded-xl hover:bg-white/70"
              >
                Start
              </button>
              <button className="bg-white text-black font-mono text-4xl p-3 px-6 rounded-xl hover:bg-white/70">
                Exit
              </button>
            </div>
            <div className=" text-white font-mono text-4xl p-3 flex flex-col items-center mt-14 gap-14">
              <p>
                Best: <span>{bestScore}</span>
              </p>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="inline-flex items-center justify-center hover:text-gray-700 gap-3 bg-white text-black font-mono text-4xl p-3 px-6 rounded-xl hover:bg-white/70"
              >
                {isMuted ? <VolumeX size={32} /> : <Volume2 size={32} />}
                <span>{isMuted ? "Unmute" : "Mute"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {width <= 1024 && (
        <div
          className="
        w-screen-d
        h-screen-d
        bg-[url('/images/blurredBg.jpg')] 
        bg-cover 
        bg-center 
        flex 
        items-center 
        justify-center
      "
        >
          <div className="bg-black/50 rounded-2xl p-6 lg:p-12 xl:p-10">
            <h1 className="text-white text-3xl sm:text-4xl lg:text-6xl xl:text-8xl text-center font-mono font-semibold">
              Paper Toss
            </h1>
            <div className="flex flex-col sm:flex-row gap-10 sm:gap-20 mt-6 justify-center items-center">
              <button
                onPointerDown={handleStart}
                onTouchStart={handleStart}
                className="bg-white text-black font-mono text-3xl lg:text-6xl p-3 px-6 inline-block rounded-xl hover:bg-white/70"
              >
                Start
              </button>
              <button className="bg-white text-black font-mono text-3xl lg:text-6xl p-3 px-6 w-auto rounded-xl hover:bg-white/70">
                Exit
              </button>
            </div>
            <div className=" text-white font-mono text-3xl lg:text-6xl p-3 flex flex-col sm:flex-row items-center mt-6 gap-16">
              <p>
                Best: <span>{bestScore}</span>
              </p>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="inline-flex items-center justify-center hover:text-gray-700 gap-3 bg-white text-black font-mono text-3xl lg:text-6xl  p-3 px-6 rounded-xl hover:bg-white/70"
              >
                {isMuted ? <VolumeX size={32} /> : <Volume2 size={32} />}
                <span>{isMuted ? "Unmute" : "Mute"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
