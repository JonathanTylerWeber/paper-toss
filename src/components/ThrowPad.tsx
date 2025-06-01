import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useGameStore } from "../store/game";
import { useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
import paperURL from "/sounds/paperRustle.wav";
import { useMemo } from "react";

export default function ThrowPad() {
  const setIsOnPad = useGameStore((s) => s.setIsOnPad);
  const isMuted = useGameStore((s) => s.isMuted);

  const paper = useMemo(() => {
    const a = new Audio(paperURL);
    a.preload = "auto";
    a.volume = 0.2;
    return a;
  }, []);

  const { scene } = useGLTF("/models/desktop.glb");

  // Load the texture
  const bakedTexture = useTexture("/textures/desktop.jpg");
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

  const scaleFactor = 3.25; // Same scale as the floor
  scene.scale.set(scaleFactor, scaleFactor, scaleFactor); // Scale the office model
  scene.rotation.y = Math.PI / 1.33;
  scene.position.set(-1.25, -0.5, 28.2);

  return (
    <>
      {/* throw pad */}
      <RigidBody
        type="fixed"
        rotation-x={-Math.PI / 2}
        position={[0, 1.5, 5.8]}
      >
        <mesh scale={5}>
          <planeGeometry />
          {/* <meshBasicMaterial color="red" /> */}
        </mesh>
      </RigidBody>

      <primitive object={scene} dispose={null} />

      {/* throw-pad sensor as its own static body */}
      <RigidBody type="fixed" position={[0, 1.55, 5.5]}>
        <CuboidCollider
          args={[2.5, 0.1, 2.5]} // x-half, y-half, z-half
          sensor // non-blocking overlap detector
          onIntersectionEnter={() => setIsOnPad(true)}
          onIntersectionExit={() => {
            setIsOnPad(false);
            if (isMuted) return;
            paper.currentTime = 0; // start 1s in if you like
            paper.play().catch(() => {});
            setTimeout(() => {
              paper.pause();
              paper.currentTime = 0;
            }, 2000);
          }}
        />
      </RigidBody>
    </>
  );
}
