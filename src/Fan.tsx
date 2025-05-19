import { forwardRef, useEffect, useRef } from "react";
import { useGLTF, useTexture, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import { useGameStore } from "./store/game";

export const Fan = forwardRef<THREE.Group>((_, fwdRef) => {
  const windDirection = useGameStore((s) => s.windDirection);

  // Load GLB & animation clips
  const { scene, animations } = useGLTF("./fan.glb") as {
    scene: THREE.Group;
    animations: THREE.AnimationClip[];
  };

  // Load baked texture
  const baked = useTexture("./fan.jpg");
  baked.flipY = false;
  baked.colorSpace = THREE.SRGBColorSpace;

  scene.scale.set(0.6, 0.6, 0.6);

  if (windDirection == "left") {
    scene.rotation.y = Math.PI / -2;
    scene.position.set(3, 0, -0.5);
  }

  if (windDirection == "right") {
    scene.rotation.y = Math.PI / 2;
    scene.position.set(-3, 0, -0.5);
  }

  // Local + forwarded refs
  const fanRef = useRef<THREE.Group>(null);
  const setRef = (node: THREE.Group | null) => {
    fanRef.current = node;
    if (typeof fwdRef === "function") fwdRef(node);
    else if (fwdRef)
      (fwdRef as React.MutableRefObject<THREE.Group | null>).current = node;
  };

  // Drei hook for clips bound to fanRef
  const { actions } = useAnimations(animations, fanRef);

  // Apply baked material once
  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).material = new THREE.MeshBasicMaterial({
          map: baked,
        });
      }
    });
  }, [scene, baked]);

  // Start animation & provide proper cleanup fn
  useEffect(() => {
    const firstKey = Object.keys(actions)[0];
    const action = actions[firstKey];
    if (!action) return; // nothing to play

    action
      .reset()
      .setLoop(THREE.LoopRepeat, Infinity)
      .setEffectiveTimeScale(5)
      .play();

    // Cleanup must return void ‑ wrap stop() in arrow
    return () => {
      action.stop();
    };
  }, [actions]);

  return <primitive object={scene} ref={setRef} />;
});

// Preload GLB for snappy load
useGLTF.preload("./fan.glb");
