import { Canvas } from "@react-three/fiber";
import Experience from "./Experience";
import Interface from "./Interface";

function App() {
  return (
    <>
      <Interface />

      <Canvas
        camera={{
          fov: 40,
          near: 0.1,
          far: 100,
          position: [0, 3.75, 7.75],
          rotation: [-0.25, 0, 0],
        }}
      >
        <Experience />
      </Canvas>
    </>
  );
}

export default App;
