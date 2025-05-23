// useTieredCamera.ts
import { useThree } from "@react-three/fiber";
import { useLayoutEffect } from "react";
import { CAMERA_TIERS } from "./cameraTiers";
import * as THREE from "three";

export default function useTieredCamera() {
  const { camera, size } = useThree();

  const cam = camera as THREE.PerspectiveCamera;

  useLayoutEffect(() => {
    // 1) find the first tier whose maxWidth >= viewport width
    const { preset } =
      CAMERA_TIERS.find((tier) => size.width <= tier.maxWidth) ??
      CAMERA_TIERS[CAMERA_TIERS.length - 1];

    // 2) apply params
    cam.fov = preset.fov;
    cam.position.set(...preset.pos);
    cam.updateProjectionMatrix();
  }, [size.width, cam]);
  return null;
}
