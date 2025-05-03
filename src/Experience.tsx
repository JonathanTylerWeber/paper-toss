// import { OrbitControls } from "@react-three/drei";
import { CuboidCollider, Physics, RigidBody } from "@react-three/rapier";
import Ball from "./Ball";
import TrashCan from "./TrashCan";
import { useGameStore } from "./store/game";
import WindZone from "./WindZone";

export default function Experience() {
  const reset = useGameStore.getState().reset;
  const setIsOnPad = useGameStore((s) => s.setIsOnPad);
  const isThrown = useGameStore((s) => s.isThrown);

  return (
    <>
      {/* <OrbitControls makeDefault /> */}

      <Physics debug>
        <Ball />

        <WindZone />

        <RigidBody
          type="fixed"
          rotation-x={Math.PI * -0.5}
          onCollisionEnter={(e) => {
            console.log("💥 Ball hit the floor!", e);
            if (isThrown) reset();
          }}
        >
          <mesh scale={20}>
            <planeGeometry />
            <meshBasicMaterial color="greenyellow" />
          </mesh>
        </RigidBody>

        {/* red pad (visual only) */}
        <RigidBody
          type="fixed"
          rotation-x={-Math.PI / 2}
          position={[0, 1, 6.5]}
        >
          <mesh scale={5}>
            <planeGeometry />
            <meshBasicMaterial color="red" />
          </mesh>
        </RigidBody>

        {/* throw-pad sensor as its own static body */}
        <RigidBody type="fixed" position={[0, 1.05, 6]}>
          <CuboidCollider
            args={[2.5, 0.1, 2.5]} // x-half, y-half, z-half
            sensor // non-blocking overlap detector
            onIntersectionEnter={() => setIsOnPad(true)}
            onIntersectionExit={() => setIsOnPad(false)}
          />
        </RigidBody>

        <TrashCan />
      </Physics>
    </>
  );
}
