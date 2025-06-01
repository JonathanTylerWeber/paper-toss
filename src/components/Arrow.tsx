import { ArrowBigUp } from "lucide-react";
import { useGameStore } from "../store/game";

export default function Arrow() {
  const arrowAngle = useGameStore((s) => s.arrowAngle);
  const rotation = arrowAngle * 60;
  console.log(arrowAngle);

  return (
    <div
      className="absolute left-1/2 top-1/2 origin-center pointer-events-none z-10 translate-y-40"
      style={{
        transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
      }}
    >
      <ArrowBigUp size={60} />
    </div>
  );
}
