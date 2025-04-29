import { CuboidCollider, RigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { useGameStore } from "./store/game";

export default function TrashCan() {
  const increment = useGameStore.getState().increment;
  const setIsWindOn = useGameStore((s) => s.setIsWindOn);

  return (
    <group position={[0, 0.5, -3]}>
      <RigidBody colliders="trimesh" type="fixed">
        <mesh scale={2}>
          <cylinderGeometry args={[0.5, 0.5, 0.5, 32, 1, true]} />
          <meshBasicMaterial color="orange" side={THREE.DoubleSide} />
        </mesh>

        {/* bottom disc */}
        <mesh
          rotation-x={-Math.PI / 2}
          position={[0, -0.25, 0]} // half the height down
          scale={2}
        >
          <circleGeometry args={[0.5, 32]} />
          <meshBasicMaterial color="red" side={THREE.DoubleSide} />
        </mesh>
      </RigidBody>

      {/* turn wind off sensor */}
      <CuboidCollider
        args={[1, 1, 1]}
        position={[0, 0, 0]}
        sensor
        onIntersectionEnter={() => setIsWindOn(false)}
      />

      {/* score sensor */}
      <CuboidCollider
        args={[0.5, 0.1, 0.5]} // width, height, depth
        position={[0, 0, 0]} // line it up inside the can
        sensor // makes it non-solid
        onIntersectionEnter={(payload) => {
          console.log("🔥 sensor hit!", payload);
          increment();
        }}
      />
    </group>
  );
}
