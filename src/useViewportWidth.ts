// hooks/useViewportWidth.ts
import { useEffect, useState } from "react";

/** Returns the current `window.innerWidth` and updates on resize/orientation‑change */
export function useViewportWidth() {
  // SSR‑safe: if window is undefined (Next.js), default to 1024
  const [width, setWidth] = useState(() =>
    typeof window === "undefined" ? 1024 : window.innerWidth
  );

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    // many mobile browsers fire "orientationchange" but always fire resize as well, so one listener is enough
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return width;
}
