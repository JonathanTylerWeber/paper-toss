// hooks/useIsMobile.ts
import { useEffect, useState } from "react";

/** true if viewport width is below `breakpoint` px (default 640) */
export function useIsMobile(breakpoint = 1025) {
  const [isMobile, set] = useState(() => window.innerWidth < breakpoint);

  useEffect(() => {
    const m = window.matchMedia(`(max-width:${breakpoint - 0.02}px)`);
    const onChange = () => set(m.matches);
    m.addEventListener("change", onChange);
    return () => m.removeEventListener("change", onChange);
  }, [breakpoint]);

  return isMobile;
}
