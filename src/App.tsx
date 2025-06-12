import { Canvas } from "@react-three/fiber";
import LoadingScreen from "./components/LoadingScreen";
import { Suspense, useEffect } from "react";
import { Html } from "@react-three/drei";
import React from "react";
import { useGameStore } from "./store/game";
import { useViewport } from "./hooks/useViewport";
import StartScreen from "./components/StartScreen";
import "./utils/audioManager";
import { audioReady, bgm, fan, unlockAudioContext } from "./utils/audioManager";
import computeYOffset from "./utils/computeYOffset";

const Experience = React.lazy(() => import("./Experience"));

function App() {
  const phase = useGameStore((s) => s.phase);
  const setPhase = useGameStore((s) => s.setPhase);
  const isMuted = useGameStore((s) => s.isMuted);

  // compute offset for loader
  const { width, orientation } = useViewport();
  const y = computeYOffset(width, orientation);

  // ***************
  // ensure context + buffers are ready
  const [audioReadyFlag, setAudioReadyFlag] = React.useState(false);

  useEffect(() => {
    unlockAudioContext(); // resumes on first user gesture
    audioReady.then(() => setAudioReadyFlag(true));
  }, []);

  // ***************
  // no bgm/fan calls until ready
  useEffect(() => {
    if (!audioReadyFlag) return;
    if (phase === "start") {
      bgm.pause();
      fan.pause();
    }
  }, [phase, audioReadyFlag]);

  // ***************
  // turn off audio when navigating away or muted
  useEffect(() => {
    if (!audioReadyFlag) return;

    const handleVisibility = () => {
      if (document.hidden) {
        bgm.pause();
        fan.pause();
      } else if (phase === "game" && !isMuted) {
        bgm.play();
        fan.play();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("blur", handleVisibility);
    window.addEventListener("focus", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("blur", handleVisibility);
      window.removeEventListener("focus", handleVisibility);
    };
  }, [phase, isMuted, audioReadyFlag]);
  // ***************

  if (phase === "start")
    return <StartScreen onStart={() => setPhase("game")} />;

  return (
    <div className="fixed inset-0 w-screen-d h-screen-d overflow-hidden">
      <Canvas
        camera={{
          fov: 40,
          near: 0.1,
          far: 100,
          position: [0, 3.75, 7.75],
          rotation: [-0.25, 0, 0],
        }}
        style={{
          position: "absolute",
          inset: 0,
          width: "100dvw", // dynamic units directly
          height: "100dvh",
          touchAction: "none",
          display: "block",
        }}
        className="bg-slate-700"
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
    </div>
  );
}

export default App;
