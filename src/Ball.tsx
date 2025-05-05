import { RigidBody, RapierRigidBody } from "@react-three/rapier";
import { useRef, useEffect, useMemo } from "react";
import { useGameStore } from "./store/game";
import { useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";

export default function Ball() {
  const ballRef = useRef<RapierRigidBody>(null);
  const resetCount = useGameStore((s) => s.resetCount);
  const isOnPad = useGameStore((s) => s.isOnPad);
  const throwStrength = useGameStore((s) => s.throwStrength);
  const setIsThrown = useGameStore((s) => s.setIsThrown);
  const setAngle = useGameStore((s) => s.setArrowAngle);

  const { nodes } = useGLTF("./crumpledPaper.glb");
  const ico = nodes.Icosphere as THREE.Mesh;
  const bakedTexture = useTexture("./paperBaked.jpg");
  bakedTexture.flipY = false;

  const initialEuler = useMemo(
    () => new THREE.Euler(Math.PI / 4, Math.PI / 2, 0),
    []
  );
  const initialQuatObj = useMemo(() => {
    const q = new THREE.Quaternion().setFromEuler(initialEuler);
    // `setRotation` wants a plain object – pull the components out:
    return { x: q.x, y: q.y, z: q.z, w: q.w };
  }, [initialEuler]);

  // teleport and un-rotate on any resetCount change:
  useEffect(() => {
    const timer = setTimeout(() => {
      const body = ballRef.current;
      if (!body) return;
      // 1) position & linear velocity
      body.setTranslation({ x: 0, y: 2, z: 4 }, true);
      body.setLinvel({ x: 0, y: 0, z: 0 }, true);

      // 2) rotation & angular velocity
      //   identity quaternion = no rotation
      body.setRotation(initialQuatObj, true);
      //   stop any spinning
      body.setAngvel({ x: 0, y: 0, z: 0 }, true);

      setAngle(0);
    }, 700);

    return () => clearTimeout(timer);
  }, [initialQuatObj, resetCount, setAngle]);

  // store the drag origin in a ref (so it survives across renders without stale-closure issues)
  const dragStart = useRef<[number, number] | null>(null);

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      // record where the user first touched/clicked
      dragStart.current = [e.clientX, e.clientY];
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!dragStart.current || !isOnPad) return;

      const [startX, startY] = dragStart.current;
      const dx = e.clientX - startX;
      const dy = startY - e.clientY; // invert so "drag up" is positive

      // compute angle relative to straight-forward (–Z)
      let angle = Math.atan2(dx, dy);
      const max = Math.PI / 4; // ±45°
      angle = Math.max(-max, Math.min(max, angle));

      setAngle(angle);

      const ix = Math.sin(angle) * throwStrength;
      const iz = Math.cos(angle) * throwStrength;

      ballRef.current?.applyImpulse({ x: ix, y: 0.35, z: -iz }, true);

      ballRef.current?.setAngvel({ x: -10, y: 0, z: 0 }, true);

      dragStart.current = null;
      setIsThrown(true);
    };

    // attach to window (or document)
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [isOnPad, setAngle, setIsThrown, throwStrength]);

  return (
    <RigidBody
      ref={ballRef}
      colliders="ball"
      position={[0, 2, 4]}
      rotation={[initialEuler.x, initialEuler.y, initialEuler.z]}
    >
      {/* <mesh>
        <boxGeometry />
        <meshBasicMaterial color="mediumpurple" />
      </mesh> */}
      <mesh scale={5} geometry={ico.geometry}>
        <meshBasicMaterial map={bakedTexture} />
      </mesh>
    </RigidBody>
  );
}
