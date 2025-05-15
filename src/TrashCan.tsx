import { CuboidCollider, RigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { useGameStore } from "./store/game";

export default function TrashCan() {
  const increment = useGameStore.getState().increment;
  const setIsWindOn = useGameStore((s) => s.setIsWindOn);
  const isThrown = useGameStore((s) => s.isThrown);

  return (
    <>
      <group position={[0, 0.5, -4]}>
        {/* trash can */}
        <RigidBody colliders="trimesh" type="fixed">
          <mesh scale={2}>
            <cylinderGeometry args={[0.3, 0.25, 0.7, 32, 1, true]} />
            <meshBasicMaterial color="orange" side={THREE.DoubleSide} />
          </mesh>
        </RigidBody>

        {/* turn wind off sensor */}
        <CuboidCollider
          args={[0.7, 0.7, 0.7]}
          position={[0, 0, 0]}
          sensor
          onIntersectionEnter={() => setIsWindOn(false)}
        />

        {/* score sensor */}
        <CuboidCollider
          args={[0.5, 0.1, 0.5]} // width, height, depth
          position={[0, 0, 0]} // line it up inside the can
          sensor // makes it non-solid
          onIntersectionEnter={() => {
            if (isThrown) increment();
          }}
        />
      </group>
    </>
  );
}
