import { useCallback, useRef } from "react";

/**
 * Pointer-tracked light for a surface.
 *
 * Spread the returned props on the element and add the `crux-spotlight` class:
 * the handler writes the pointer position into two CSS variables, and the class
 * paints a soft emerald glow there. One style write per animation frame, no
 * React state, nothing on touch devices (there is no hover to answer).
 */
export function useSpotlight<T extends HTMLElement>() {
  const frame = useRef(0);

  const onPointerMove = useCallback((e: React.PointerEvent<T>) => {
    if (e.pointerType !== "mouse") return;
    const el = e.currentTarget;
    const { clientX, clientY } = e;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${clientX - r.left}px`);
      el.style.setProperty("--my", `${clientY - r.top}px`);
    });
  }, []);

  return { onPointerMove };
}
