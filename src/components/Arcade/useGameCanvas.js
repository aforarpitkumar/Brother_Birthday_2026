import { useEffect, useRef } from "react";

/**
 * Canvas game loop: handles DPR-aware sizing and requestAnimationFrame.
 * `frame(ctx, w, h, dt)` is called every frame while mounted.
 */
export function useGameCanvas(frame) {
  const canvasRef = useRef(null);
  const sizeRef = useRef({ w: 0, h: 0 });
  const frameRef = useRef(frame);
  frameRef.current = frame;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf = 0;
    let last = performance.now();

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sizeRef.current = { w: rect.width, h: rect.height };
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const loop = (t) => {
      const dt = Math.min((t - last) / 1000, 0.05);
      last = t;
      if (sizeRef.current.w > 0) frameRef.current(ctx, sizeRef.current.w, sizeRef.current.h, dt);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return { canvasRef, sizeRef };
}

/** Read + write the session's best score for a game. */
export function loadBest(key) {
  try {
    return Number(localStorage.getItem(`arcade-best-${key}`)) || 0;
  } catch {
    return 0;
  }
}

export function saveBest(key, score) {
  try {
    if (score > loadBest(key)) localStorage.setItem(`arcade-best-${key}`, String(score));
  } catch {
    /* private mode — no problem */
  }
}
