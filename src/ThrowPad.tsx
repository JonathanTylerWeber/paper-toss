import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useGameStore } from "./store/game";

export default function ThrowPad() {
  const setIsOnPad = useGameStore((s) => s.setIsOnPad);

  return (
    <>
      {/* red pad (visual only) */}
      <RigidBody
        type="fixed"
        rotation-x={-Math.PI / 2}
        position={[0, 1.5, 5.5]}
      >
        <mesh scale={5}>
          <planeGeometry />
          <meshBasicMaterial color="red" />
        </mesh>
      </RigidBody>

      {/* throw-pad sensor as its own static body */}
      <RigidBody type="fixed" position={[0, 1.55, 5.5]}>
        <CuboidCollider
          args={[2.5, 0.1, 2.5]} // x-half, y-half, z-half
          sensor // non-blocking overlap detector
          onIntersectionEnter={() => setIsOnPad(true)}
          onIntersectionExit={() => setIsOnPad(false)}
        />
      </RigidBody>
    </>
  );
}
