// import { OrbitControls } from "@react-three/drei";
import { CuboidCollider, Physics, RigidBody } from "@react-three/rapier";
import Ball from "./Ball";
import TrashCan from "./TrashCan";
import { useGameStore } from "./store/game";
import WindZone from "./WindZone";
import { useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";

export default function Experience() {
  const reset = useGameStore.getState().reset;
  const setIsOnPad = useGameStore((s) => s.setIsOnPad);
  const isThrown = useGameStore((s) => s.isThrown);

  const { scene } = useGLTF("/officeBakedOneObject.glb");

  // Load the texture
  const bakedTexture = useTexture("/finalBaked.jpg");
  bakedTexture.flipY = false;
  bakedTexture.colorSpace = THREE.SRGBColorSpace;

  scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      // Apply the texture to each mesh's material
      child.material = new THREE.MeshBasicMaterial({
        map: bakedTexture, // Apply the texture to the material's map
      });
    }
  });

  // const { scene } = useGLTF("/officeBakedOneObject.glb");

  // scene.traverse((child) => {
  //   if (child instanceof THREE.Mesh) {
  //     child.material = new THREE.MeshStandardMaterial({ color: "white" });
  //   }
  // });

  // Scale the office model to match the floor size and rotate 45 degrees
  const scaleFactor = 3.25; // Same scale as the floor
  scene.scale.set(scaleFactor, scaleFactor, scaleFactor); // Scale the office model
  scene.rotation.y = Math.PI / -4; // Rotate 45 degrees (PI/4 radians)
  scene.position.set(1.5, 0, -19);

  return (
    <>
      {/* <OrbitControls makeDefault /> */}

      {/* <pointLight position={[0, 5, -5]} intensity={10} /> */}

      <Physics
      // debug
      >
        <Ball />

        <WindZone />

        {/* Office Model */}
        {/* Directly use the scene */}
        <primitive object={scene} dispose={null} />

        {/* Invisible floor with collision detection */}
        <RigidBody
          type="fixed"
          rotation-x={Math.PI * -0.5}
          rotation-z={Math.PI * -0.25}
          position={[0, -0.1, 0]} // Slightly above the origin for collision
          onCollisionEnter={(e) => {
            console.log("💥 Ball hit the floor!", e);
            if (isThrown) reset();
          }}
        >
          <mesh
            scale={30}
            // visible={false}
          >
            {/* Set visible to false to hide */}
            <planeGeometry />
            <meshBasicMaterial color="greenyellow" opacity={0} />
          </mesh>
          <CuboidCollider args={[20, 0.1, 20]} sensor />{" "}
          {/* Make the floor a sensor */}
        </RigidBody>

        {/* floor */}
        {/* <RigidBody
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
        </RigidBody> */}

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

        <TrashCan />
      </Physics>
    </>
  );
}
