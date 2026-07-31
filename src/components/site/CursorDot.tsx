import { useEffect, useRef } from "react";

/** Discreet desktop-only cursor dot that scales over interactive elements. */
export function CursorDot() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const el = ref.current;
    if (!el) return;

    let x = -100;
    let y = -100;
    let cx = -100;
    let cy = -100;
    let raf = 0;

    const move = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      const target = e.target as HTMLElement | null;
      const interactive = target?.closest("a,button,[role='button']");
      el.style.width = interactive ? "42px" : "10px";
      el.style.height = interactive ? "42px" : "10px";
      el.style.opacity = "1";
    };
    const loop = () => {
      cx += (x - cx) * 0.18;
      cy += (y - cy) * 0.18;
      el.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", move);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[60] hidden rounded-full border border-foreground opacity-0 mix-blend-difference transition-[width,height] duration-300 md:block"
      style={{ width: 10, height: 10 }}
    />
  );
}
