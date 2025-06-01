// utils/purgeAssets.ts
import { Cache } from "three";
import { useGLTF } from "@react-three/drei";

export function purgeAssets() {
  Cache.clear(); // textures & other loaders

  [
    "/desktop.glb",
    "/trashCan3.glb",
    "/fan.glb",
    "/crumpledPaper.glb",
    "/bakedChanges3.glb",
  ].forEach(useGLTF.clear); // clear one by one (type‑safe)
}
