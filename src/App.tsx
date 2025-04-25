import { Canvas } from "@react-three/fiber";
import Experience from "./Experience";
import ScoreBoard from "./ScoreBoard";

function App() {
  return (
    <>
      <ScoreBoard />

      <Canvas
        camera={{
          fov: 45,
          near: 0.1,
          far: 200,
          position: [0, 4, 10],
        }}
      >
        <Experience />
      </Canvas>
    </>
  );
}

export default App;
