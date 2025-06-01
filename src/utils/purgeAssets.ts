// utils/purgeAssets.ts
import { Cache } from "three";
import { useGLTF } from "@react-three/drei";

export function purgeAssets() {
  Cache.clear(); // textures & other loaders

  [
    "/models/desktop.glb",
    "/models/trashCan3.glb",
    "/models/fan.glb",
    "/models/crumpledPaper.glb",
    "/models/bakedChanges3.glb",
  ].forEach(useGLTF.clear); // clear one by one (type‑safe)
}
