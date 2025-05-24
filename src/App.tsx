import { Canvas } from "@react-three/fiber";
import StartScreen from "./StartScreen";
import LoadingScreen from "./LoadingScreen";
import { Suspense } from "react";
import { Html, useProgress } from "@react-three/drei";
import React from "react";
import { useGameStore } from "./store/game";
import { TieredCamera } from "./TieredCamera";
import { useViewportWidth } from "./useViewportWidth";

const Experience = React.lazy(() => import("./Experience"));
const Interface = React.lazy(() => import("./Interface"));

function computeYOffset(w: number) {
  if (w <= 640) return 2.5; // phones
  if (w <= 1024) return 2.8; // tablets
  return 1.78; // desktop (your old value)
}

function App() {
  const phase = useGameStore((s) => s.phase);
  const setPhase = useGameStore((s) => s.setPhase);

  // Drei hook that tells you how many suspense boundaries are still unresolved
  const { active } = useProgress();

  const isLoading = phase === "game" && active;

  // comput offset for loader
  const width = useViewportWidth();
  const y = computeYOffset(width);

  const mq = window.matchMedia("(orientation: portrait)");

  mq.addEventListener("change", (e) => {
    if (e.matches) {
      console.log("Now portrait");
    } else {
      console.log("Now landscape");
    }
  });

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
            <Html fullscreen position={[0, y, 0]} className="top-0 left-0">
              <LoadingScreen />
            </Html>
          }
        >
          <Experience />
        </Suspense>

        {/* 2) Overlay an HTML loading screen until all Suspense children resolve */}
        {/* {isLoading && (
          <Html fullscreen position={[0, y, 0]} className="top-0 left-0">
            <LoadingScreen />
          </Html>
        )} */}
      </Canvas>
    </>
  );
}

export default App;
