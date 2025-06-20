// useTieredCamera.ts
import { useThree } from "@react-three/fiber";
import { useLayoutEffect } from "react";
import * as THREE from "three";
import { useViewport } from "./useViewport";
import { CAMERA_TIERS } from "../utils/cameraTiers";

export default function useTieredCamera() {
  const { camera } = useThree();
  const cam = camera as THREE.PerspectiveCamera;

  const { width, orientation } = useViewport();

  useLayoutEffect(() => {
    const tier =
      CAMERA_TIERS.find(
        (t) =>
          width <= t.maxWidth &&
          (!t.orientation || t.orientation === orientation)
      ) ?? CAMERA_TIERS[CAMERA_TIERS.length - 1];

    cam.fov = tier.preset.fov;
    cam.position.set(...tier.preset.pos);
    cam.updateProjectionMatrix();
  }, [width, orientation, cam]);
}
