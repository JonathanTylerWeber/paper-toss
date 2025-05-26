// hooks/useViewport.ts
import { useEffect, useState } from "react";

export function useViewport() {
  const [state, set] = useState(() => ({
    width: typeof window === "undefined" ? 1024 : window.innerWidth,
    orient:
      typeof window === "undefined"
        ? "landscape"
        : window.matchMedia("(orientation: portrait)").matches
        ? "portrait"
        : "landscape",
  }));

  useEffect(() => {
    const onResize = () =>
      set({
        width: window.innerWidth,
        orient: window.matchMedia("(orientation: portrait)").matches
          ? "portrait"
          : "landscape",
      });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return state; // { width, orient }
}
