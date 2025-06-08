// hooks/useViewport.ts
import { useEffect, useState } from "react";

export function useViewport() {
  const getDims = () => ({
    width:
      typeof window === "undefined"
        ? 1024
        : window.visualViewport?.width ?? window.innerWidth,
    orientation:
      typeof window === "undefined"
        ? "landscape"
        : window.matchMedia("(orientation: portrait)").matches
        ? "portrait"
        : "landscape",
  });

  const [state, setState] = useState(getDims);

  useEffect(() => {
    const handle = () => setState(getDims());

    // classic resize (desktop & Android)
    window.addEventListener("resize", handle);
    // iOS fires this, not always a classic resize
    window.addEventListener("orientationchange", handle);
    // visual viewport is what actually changes on iOS/Android Chrome
    window.visualViewport?.addEventListener("resize", handle);

    return () => {
      window.removeEventListener("resize", handle);
      window.removeEventListener("orientationchange", handle);
      window.visualViewport?.removeEventListener("resize", handle);
    };
  }, []);

  return state; // { width, orientation }
}
