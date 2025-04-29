import { ArrowBigUp, ArrowLeft, ArrowRight } from "lucide-react";
import { useGameStore } from "./store/game";

export default function Interface() {
  const score = useGameStore((state) => state.score);
  const windStrength = useGameStore((s) => s.windStrength);
  const windDirection = useGameStore((s) => s.windDirection);
  const arrowAngle = useGameStore((s) => s.arrowAngle);
  const rotation = arrowAngle * 60;

  return (
    <>
      <div className="absolute top-5 left-5 bg-black text-white pointer-events-none z-10 px-5">
        Score: {score}
      </div>

      {/* 1. Make this a flex-col container, center it at half/half */}
      <div
        className="
          absolute 
          left-1/2 top-1/2 
          transform -translate-x-1/2 translate-y-40 
          flex flex-col items-center 
          pointer-events-none z-10
        "
      >
        {/* 2. Wind info (one flex item) */}
        <div className="text-center mb-2">
          <div className="text-sm">{windStrength}</div>
          <div className="flex justify-center">
            {windDirection === "right" ? <ArrowRight /> : <ArrowLeft />}
          </div>
        </div>

        {/* 3. Arrow (second flex item) */}
        <div
          className="origin-center"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <ArrowBigUp size={60} />
        </div>
      </div>
    </>
  );
}
