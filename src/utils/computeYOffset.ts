export default function computeYOffset(w: number, orientation: string) {
  if (w <= 640) return 1.75;
  if (w <= 1024 && orientation === "landscape") return 1.8;
  if (w <= 1024) return 1.75;
  return 1.78;
}
