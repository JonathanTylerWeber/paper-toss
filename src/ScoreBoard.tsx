import { useGameStore } from "./store/game";

export default function ScoreBoard() {
  const score = useGameStore((state) => state.score);
  return (
    <div
      style={{
        position: "absolute",
        top: 20,
        left: 20,
        color: "white",
        fontSize: "1.5rem",
        fontWeight: 600,
        pointerEvents: "none",
        zIndex: 1,
      }}
      className="absolute top-5 left-5 bg-black text-white pointer-events-none z-10 px-5"
    >
      Score: {score}
    </div>
  );
}
