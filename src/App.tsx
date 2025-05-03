import { Canvas } from "@react-three/fiber";
import Experience from "./Experience";
import Interface from "./Interface";

function App() {
  return (
    <>
      <Interface />

      <Canvas
        camera={{
          fov: 45,
          near: 0.1,
          far: 100,
          position: [0, 3, 7.2],
        }}
      >
        <Experience />
      </Canvas>
    </>
  );
}

export default App;
