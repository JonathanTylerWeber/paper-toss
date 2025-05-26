// useTieredCamera.ts
import { useThree } from "@react-three/fiber";
import { useLayoutEffect } from "react";
import * as THREE from "three";
import { CAMERA_TIERS } from "./cameraTiers";
import { useViewport } from "./useViewportWidth";

export default function useTieredCamera() {
  const { camera } = useThree();
  const cam = camera as THREE.PerspectiveCamera;

  const { width, orient } = useViewport();

  useLayoutEffect(() => {
    const tier =
      CAMERA_TIERS.find(
        (t) =>
          width <= t.maxWidth && (!t.orientation || t.orientation === orient)
      ) ?? CAMERA_TIERS[CAMERA_TIERS.length - 1];

    cam.fov = tier.preset.fov;
    cam.position.set(...tier.preset.pos);
    cam.updateProjectionMatrix();
  }, [width, orient, cam]);
}
