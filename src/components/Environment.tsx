import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useGameStore } from "../store/game";
import { useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";

export default function Environment() {
  const reset = useGameStore.getState().reset;

  const isThrown = useGameStore((s) => s.isThrown);

  const { scene } = useGLTF("/models/bakedChanges3.glb");

  // Load the texture
  const bakedTexture = useTexture("/textures/bakedChanges3.jpg");
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
  scene.position.set(1.5, -0.09, -19);
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
        </mesh>
        <CuboidCollider args={[20, 0.1, 20]} sensor />{" "}
        {/* Make the floor a sensor */}
      </RigidBody>

      {/* desk/wall colliders */}
      {/* left desk */}
      <RigidBody
        type="fixed"
        position={[-4, 0, -7]}
        rotation-y={Math.PI * -0.32}
      >
        <CuboidCollider args={[1, 3, 2.6]} />
      </RigidBody>

      {/* left chair */}
      <RigidBody
        type="fixed"
        position={[-3.5, 0, -5.5]}
        rotation-y={Math.PI * -0.32}
      >
        <CuboidCollider args={[1, 3, 0.8]} />
      </RigidBody>

      {/* left wall */}
      <RigidBody
        type="fixed"
        position={[-9, 0, -6]}
        rotation-y={Math.PI * -0.35}
      >
        <CuboidCollider args={[1, 3, 2]} />
      </RigidBody>

      {/* right desk */}
      <RigidBody
        type="fixed"
        position={[6.6, 1, -4.1]}
        rotation-y={Math.PI * -0.25}
      >
        <CuboidCollider args={[2, 3, 2]} />
      </RigidBody>

      {/* right chair */}
      <RigidBody
        type="fixed"
        position={[5.7, 1, -2]}
        rotation-y={Math.PI * -0.25}
      >
        <CuboidCollider args={[1, 3, 1]} />
      </RigidBody>

      {/* right wall */}
      <RigidBody
        type="fixed"
        position={[7.5, 1, -9]}
        rotation-y={Math.PI * -0.25}
      >
        <CuboidCollider args={[2, 3, 2]} />
      </RigidBody>
    </>
  );
}
