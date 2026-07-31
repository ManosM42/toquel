import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Full-bleed parallax media block. The image translates slower than the page.
 * On small screens the strength is reduced for scroll performance.
 */
export function ParallaxImage({
  src,
  alt,
  className,
  imgClassName,
  strength = 0.25,
  priority = false,
  overlay = true,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  strength?: number;
  priority?: boolean;
  overlay?: boolean;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const img = imgRef.current;
    if (!wrap || !img) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = wrap.getBoundingClientRect();
      if (rect.bottom < -200 || rect.top > window.innerHeight + 200) return;
      const mobile = window.innerWidth < 768;
      const s = mobile ? strength * 0.45 : strength;
      const progress = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight;
      img.style.transform = `translate3d(0, ${(progress * s * 100).toFixed(2)}px, 0) scale(1.18)`;
    };
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [strength]);

  return (
    <div ref={wrapRef} className={cn("relative overflow-hidden bg-background", className)}>
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className={cn("h-full w-full object-cover will-change-transform", imgClassName)}
      />
      {overlay ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(10,10,10,0.55), rgba(10,10,10,0.25) 45%, rgba(10,10,10,0.9))",
          }}
        />
      ) : null}
    </div>
  );
}
