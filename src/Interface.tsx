import { ArrowBigUp, ArrowLeft, ArrowRight } from "lucide-react";
import { useGameStore } from "./store/game";
import { Html } from "@react-three/drei";

export default function Interface() {
  // const score = useGameStore((state) => state.score);
  const windStrength = useGameStore((s) => s.windStrength);
  const windDirection = useGameStore((s) => s.windDirection);
  const arrowAngle = useGameStore((s) => s.arrowAngle);
  const rotation = arrowAngle * 60;

  return (
    <>
      {/* <div className="absolute top-5 left-5 bg-black text-white pointer-events-none z-10 px-5">
        Score: {score}
      </div> */}

      <Html>
        <div
          className="
          absolute 
          left-1/2 top-1/2 
          transform -translate-x-1/2 
          -translate-y-32
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
      </Html>
    </>
  );
}
