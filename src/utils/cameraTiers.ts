// cameraTiers.ts
export type CameraPreset = {
  fov: number;
  pos: [number, number, number];
};

export type CameraTier = {
  /** max viewport width in px that this tier covers */
  maxWidth: number;
  /** "portrait" | "landscape" — omit to match either orientation */
  orientation?: "portrait" | "landscape";
  preset: CameraPreset;
};

export const CAMERA_TIERS: CameraTier[] = [
  {
    maxWidth: 640,
    orientation: "portrait",
    preset: { fov: 95, pos: [0, 4.0, 6] },
  },
  {
    maxWidth: 1024,
    orientation: "portrait",
    preset: { fov: 60, pos: [0, 5.0, 8.5] },
  },
  {
    maxWidth: 1024,
    orientation: "landscape",
    preset: { fov: 28, pos: [0, 4.0, 9] },
  },
  {
    maxWidth: Infinity,
    preset: { fov: 40, pos: [0, 3.75, 7.75] },
  },
];
