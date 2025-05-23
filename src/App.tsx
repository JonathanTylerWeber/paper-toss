import { Canvas } from "@react-three/fiber";
import StartScreen from "./StartScreen";
import LoadingScreen from "./LoadingScreen";
import { Suspense } from "react";
import { Html, useProgress } from "@react-three/drei";
import React from "react";
import { useGameStore } from "./store/game";
import { TieredCamera } from "./TieredCamera";

const Experience = React.lazy(() => import("./Experience"));
const Interface = React.lazy(() => import("./Interface"));

function App() {
  const phase = useGameStore((s) => s.phase);
  const setPhase = useGameStore((s) => s.setPhase);

  // Drei hook that tells you how many suspense boundaries are still unresolved
  const { active } = useProgress();

  const isLoading = phase === "game" && active;

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
        <TieredCamera />

        {/* 1) lazy-load Experience via Suspense */}
        <Suspense
          fallback={
            <Html fullscreen position={[0, 1.78, 0]}>
              <LoadingScreen />
            </Html>
          }
        >
          <Experience />
        </Suspense>

        {/* 2) Overlay an HTML loading screen until all Suspense children resolve */}
        {isLoading && (
          <Html fullscreen position={[0, 1.78, 0]}>
            <LoadingScreen />
          </Html>
        )}
      </Canvas>
    </>
  );
}

export default App;
