// cameraTiers.ts
export type CameraPreset = {
  fov: number;
  pos: [number, number, number];
};

export const CAMERA_TIERS: { maxWidth: number; preset: CameraPreset }[] = [
  { maxWidth: 640, preset: { fov: 95, pos: [0, 4, 6] } }, // phones
  { maxWidth: 1024, preset: { fov: 60, pos: [0, 5, 8.5] } }, // small tablets
  { maxWidth: Infinity, preset: { fov: 40, pos: [0, 3.75, 7.75] } }, // everything else
];
