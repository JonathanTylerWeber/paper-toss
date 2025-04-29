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
          far: 200,
          position: [0, 4, 9],
        }}
      >
        <Experience />
      </Canvas>
    </>
  );
}

export default App;
