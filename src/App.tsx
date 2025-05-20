import { Canvas } from "@react-three/fiber";
import Experience from "./Experience";
import Interface from "./Interface";
import StartScreen from "./StartScreen";
import LoadingScreen from "./LoadingScreen";
import { Suspense, useState } from "react";
import { Html, useProgress } from "@react-three/drei";

function App() {
  const [started, setStarted] = useState(false);

  // Drei hook that tells you how many suspense boundaries are still unresolved
  const { active } = useProgress();

  // We’re “loading” as soon as we’ve pressed Start, and while `active > 0`
  const isLoading = started && active;

  if (!started) {
    return <StartScreen onStart={() => setStarted(true)} />;
  }

  return (
    <>
      <Canvas
        camera={{
          fov: 40,
          near: 0.1,
          far: 100,
          position: [0, 3.75, 7.75],
          rotation: [-0.25, 0, 0],
        }}
      >
        {/* 1) We still lazy-load Experience via Suspense */}
        <Suspense
          fallback={
            <Html fullscreen position={[0, 1.7, 0]}>
              <LoadingScreen />
            </Html>
          }
        >
          <Interface />
          <Experience />
        </Suspense>

        {/* 2) Overlay an HTML loading screen until all Suspense children resolve */}
        {isLoading && (
          <Html fullscreen position={[0, 1.7, 0]}>
            <LoadingScreen />
          </Html>
        )}
      </Canvas>
    </>
  );
}

export default App;
