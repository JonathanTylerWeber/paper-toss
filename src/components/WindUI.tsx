import { ArrowBigUp, ArrowLeft, ArrowRight } from "lucide-react";
import { useGameStore } from "../store/game";
import { useViewport } from "../hooks/useViewport";

export default function WindUI() {
  const windStrength = useGameStore((s) => s.windStrength);
  const windDirection = useGameStore((s) => s.windDirection);
  const arrowAngle = useGameStore((s) => s.arrowAngle);

  const rotation = arrowAngle * 60;

  const { orientation } = useViewport();

  return (
    <div>
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
          <div className="text-center lg:mb-2 mt-16 lg:mt-24 xl:mt-32">
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
    </div>
  );
}
