import { RigidBody, RapierRigidBody } from "@react-three/rapier";
import { useRef, useEffect } from "react";
import { useGameStore } from "./store/game";

export default function Ball() {
  const ballRef = useRef<RapierRigidBody>(null);
  const resetCount = useGameStore((s) => s.resetCount);
  const onPad = useGameStore((s) => s.onPad);
  const setAngle = useGameStore((s) => s.setArrowAngle);

  // teleport and un-rotate on any resetCount change:
  useEffect(() => {
    const timer = setTimeout(() => {
      const body = ballRef.current;
      if (!body) return;
      // 1) position & linear velocity
      body.setTranslation({ x: 0, y: 1.5, z: 5 }, true);
      body.setLinvel({ x: 0, y: 0, z: 0 }, true);

      // 2) rotation & angular velocity
      //   identity quaternion = no rotation
      body.setRotation({ x: 0, y: 0, z: 0, w: 1 }, true);
      //   stop any spinning
      body.setAngvel({ x: 0, y: 0, z: 0 }, true);

      setAngle(0);
    }, 700);

    return () => clearTimeout(timer);
  }, [resetCount, setAngle]);

  // store the drag origin in a ref (so it survives across renders without stale-closure issues)
  const dragStart = useRef<[number, number] | null>(null);

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      // record where the user first touched/clicked
      dragStart.current = [e.clientX, e.clientY];
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!dragStart.current || !onPad) return;
      const [startX, startY] = dragStart.current;
      const dx = e.clientX - startX;
      const dy = startY - e.clientY; // invert so "drag up" is positive

      // compute angle relative to straight-forward (–Z)
      let angle = Math.atan2(dx, dy);
      const max = Math.PI / 4; // ±45°
      angle = Math.max(-max, Math.min(max, angle));

      setAngle(angle);

      // constant strength – you can scale by drag length if you like
      const strength = 7;
      const ix = Math.sin(angle) * strength;
      const iz = Math.cos(angle) * strength;

      ballRef.current?.applyImpulse({ x: ix, y: 6, z: -iz }, true);

      dragStart.current = null;
    };

    // attach to window (or document)
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [onPad, setAngle]);

  return (
    <RigidBody ref={ballRef} colliders="cuboid" position={[0, 1.5, 5]}>
      <mesh>
        <boxGeometry />
        <meshBasicMaterial color="mediumpurple" />
      </mesh>
    </RigidBody>
  );
}
