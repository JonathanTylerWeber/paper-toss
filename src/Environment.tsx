import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useGameStore } from "./store/game";
import { useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";

export default function Environment() {
  const reset = useGameStore.getState().reset;

  const isThrown = useGameStore((s) => s.isThrown);

  const { scene } = useGLTF("/bakedChanges3.glb");

  // Load the texture
  const bakedTexture = useTexture("/bakedChanges3.jpg");
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

  // Scale the office model to match the floor size and rotate 45 degrees
  const scaleFactor = 3.25; // Same scale as the floor
  scene.scale.set(scaleFactor, scaleFactor, scaleFactor); // Scale the office model
  scene.rotation.y = Math.PI / -4; // Rotate 45 degrees (PI/4 radians)
  scene.position.set(1.5, 0, -19);
  return (
    <>
      {/* Office Model */}
      {/* Directly use the scene */}
      <primitive object={scene} dispose={null} />

      {/* Invisible floor with collision detection */}
      <RigidBody
        type="fixed"
        rotation-x={Math.PI * -0.5}
        rotation-z={Math.PI * -0.25}
        position={[0, -0.1, 0]} // Slightly above the origin for collision
        onCollisionEnter={() => {
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
    </>
  );
}
