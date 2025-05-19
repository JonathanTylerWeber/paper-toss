import { CuboidCollider, RigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { useGameStore } from "./store/game";
import { useGLTF, useTexture } from "@react-three/drei";
import clapUrl from "/clapping.mp3";
import metalHitUrl from "/metalHit.mp3";
import { useMemo, useRef } from "react";

export default function TrashCan() {
  const increment = useGameStore.getState().increment;
  const setIsWindOn = useGameStore((s) => s.setIsWindOn);
  const isThrown = useGameStore((s) => s.isThrown);
  const isMuted = useGameStore((s) => s.isMuted);

  // preload both sounds once
  const clap = useMemo(() => {
    const a = new Audio(clapUrl);
    a.preload = "auto";
    a.volume = 0.4;
    return a;
  }, []);
  const hit = useMemo(() => {
    const a = new Audio(metalHitUrl);
    a.preload = "auto";
    a.volume = 0.3;
    return a;
  }, []);

  // guard so hit only retriggers once per play
  const hitPlaying = useRef(false);

  const { scene } = useGLTF("/trashCan3.glb");

  // Load the texture
  const bakedTexture = useTexture("/trashCan3.jpg");
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

  const scaleFactor = 3.45; // Same scale as the floor
  scene.scale.set(scaleFactor, scaleFactor, scaleFactor); // Scale the office model
  scene.rotation.y = Math.PI / 1.33;
  scene.position.set(-0.87, -0.9, 17.3);

  return (
    <>
      <group position={[0, 0.6, -4]}>
        {/* trash can collider */}
        <RigidBody
          colliders="trimesh"
          type="fixed"
          onCollisionEnter={() => {
            if (hitPlaying.current || isMuted) return; // skip if already playing
            hitPlaying.current = true;
            hit.currentTime = 1; // start 1s in if desired
            hit.play().catch(() => {});

            // after 1s stop & clear flag
            setTimeout(() => {
              hit.pause();
              hit.currentTime = 0;
              hitPlaying.current = false;
            }, 1000);
          }}
        >
          <mesh scale={2}>
            <cylinderGeometry args={[0.3, 0.22, 0.53, 32, 1, true]} />
            <meshBasicMaterial
              transparent
              opacity={0}
              side={THREE.DoubleSide}
            />
          </mesh>
        </RigidBody>

        {/* trash can */}
        <primitive object={scene} dispose={null} />

        {/* turn wind off sensor */}
        <CuboidCollider
          args={[0.7, 0.7, 0.7]}
          position={[0, 0, 0]}
          sensor
          onIntersectionEnter={() => setIsWindOn(false)}
        />

        {/* score sensor */}
        <CuboidCollider
          args={[0.15, 0.1, 0.4]} // width, height, depth
          position={[0, -0.3, 0]} // line it up inside the can
          sensor
          onIntersectionEnter={() => {
            if (isThrown) increment();
            if (isMuted) return;
            clap.currentTime = 1; // start 1s in if you like
            clap.play().catch(() => {});
            setTimeout(() => {
              clap.pause();
              clap.currentTime = 1;
            }, 1900);
          }}
        />
      </group>
    </>
  );
}
