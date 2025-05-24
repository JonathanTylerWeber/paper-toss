import { Volume2, VolumeX } from "lucide-react";
import { useGameStore } from "./store/game";

interface Props {
  onStart: () => void;
}

export default function StartScreen({ onStart }: Props) {
  const bestScore = useGameStore((state) => state.bestScore);
  const isMuted = useGameStore((s) => s.isMuted);
  const setIsMuted = useGameStore((s) => s.setIsMuted);

  return (
    <div
      className="
        w-screen 
        h-screen 
        bg-[url('/blurredBg.jpg')] 
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
            onClick={onStart}
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
  );
}
