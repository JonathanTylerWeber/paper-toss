import { useGameStore } from "./store/game";

export default function ScoreBoard() {
  const score = useGameStore((state) => state.score);
  return (
    <div className="absolute top-5 left-5 bg-black text-white pointer-events-none z-10 px-5">
      Score: {score}
    </div>
  );
}
