import { Canvas } from "@react-three/fiber";
import LoadingScreen from "./components/LoadingScreen";
import { Suspense, useEffect } from "react";
import { Html, useProgress } from "@react-three/drei";
import React from "react";
import { useGameStore } from "./store/game";
import { useViewport } from "./hooks/useViewport";
import StartScreen from "./components/StartScreen";
import "./utils/audioManager";
import { bgm, fan } from "./utils/audioManager";

const Experience = React.lazy(() => import("./Experience"));
const Interface = React.lazy(() => import("./components/Interface"));

function computeYOffset(w: number, orient: string) {
  if (w <= 640) return 1.8;
  if (w <= 1024 && orient === "landscape") return 1.8;
  if (w <= 1024) return 2.8;
  return 1.78;
}

function App() {
  const phase = useGameStore((s) => s.phase);
  const setPhase = useGameStore((s) => s.setPhase);

  // Drei hook that tells you how many suspense boundaries are still unresolved
  const { active } = useProgress();

  const isLoading = phase === "game" && active;

  // compute offset for loader
  const { width, orient } = useViewport();
  const y = computeYOffset(width, orient);

  // Pause bgm + fan whenever we return to "start"
  useEffect(() => {
    if (phase === "start") {
      bgm.pause();
      fan.pause();
    }
  }, [phase]);

  if (phase === "start")
    return <StartScreen onStart={() => setPhase("game")} />;

  return (
    <>
      {!isLoading && (
        <Suspense fallback={<LoadingScreen />}>
          <Interface />
        </Suspense>
      )}

      <Canvas
        camera={{
          fov: 40,
          near: 0.1,
          far: 100,
          position: [0, 3.75, 7.75],
          rotation: [-0.25, 0, 0],
        }}
        style={{ touchAction: "none" }}
        dpr={[1, 1.5]} // cap pixel‑ratio
      >
        <Suspense
          fallback={
            <Html fullscreen position={[0, y, 0]} className="top-0 left-0">
              <LoadingScreen />
            </Html>
          }
        >
          <Experience />
        </Suspense>
      </Canvas>
    </>
  );
}

export default App;
