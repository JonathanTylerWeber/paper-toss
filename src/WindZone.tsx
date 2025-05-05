import {
  CuboidCollider,
  IntersectionEnterHandler,
  IntersectionExitHandler,
  IntersectionEnterPayload,
  IntersectionExitPayload,
  RigidBody,
  RapierRigidBody,
} from "@react-three/rapier";
import { useState, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import { useGameStore } from "./store/game";

interface WindZoneProps {
  position?: [number, number, number];
  size?: [number, number, number];
  strength?: number;
}

export default function WindZone({
  position = [0, 1, -2], // ← start _behind_ the ball so it has to enter
  size = [5, 3, 5],
}: WindZoneProps) {
  const [bodies] = useState<Set<RapierRigidBody>>(() => new Set());
  const isWindOn = useGameStore((state) => state.isWindOn);
  const windStrength = useGameStore((s) => s.windStrength);
  const windDirection = useGameStore((s) => s.windDirection);

  console.log("isWindOn", isWindOn);

  const onEnter: IntersectionEnterHandler = useCallback(
    (p: IntersectionEnterPayload) => {
      const b = p.other.rigidBody;
      if (b) bodies.add(b);
    },
    [bodies]
  );
  const onExit: IntersectionExitHandler = useCallback(
    (p: IntersectionExitPayload) => {
      const b = p.other.rigidBody;
      if (b) bodies.delete(b);
    },
    [bodies]
  );

  useFrame((_, delta) => {
    if (!isWindOn) return;
    let impulse = windStrength * delta;
    if (windDirection === "left") {
      impulse *= -1;
    }
    bodies.forEach((b) => b.applyImpulse({ x: impulse, y: 0, z: 0 }, true));
  });

  return (
    <RigidBody type="fixed" position={position} colliders={false}>
      <CuboidCollider
        args={size}
        sensor
        onIntersectionEnter={onEnter}
        onIntersectionExit={onExit}
      />
    </RigidBody>
  );
}
