import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";
import { onFx } from "../../lib/fx.js";
import "./Confetti.css";

const COLORS = ["#ff6584", "#ffc24b", "#8e7bff", "#5ad0a5", "#7cc5ff", "#ff9db0"];

/**
 * Lightweight canvas confetti. Call `burst({ count, x, y })` via a ref —
 * x/y are 0..1 fractions of the viewport.
 */
const Confetti = forwardRef(function Confetti(_, ref) {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const raf = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  const tick = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const w = window.innerWidth;
    const h = window.innerHeight;
    ctx.clearRect(0, 0, w, h);

    particles.current = particles.current.filter((p) => p.life > 0 && p.y < h + 40);
    for (const p of particles.current) {
      p.vy += 0.14;
      p.vx *= 0.992;
      p.vy *= 0.992;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.life -= 1;

      ctx.save();
      ctx.globalAlpha = Math.min(1, p.life / 40);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      if (p.shape === 0) {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      }
      ctx.restore();
    }

    if (particles.current.length > 0) {
      raf.current = requestAnimationFrame(tick);
    } else {
      raf.current = 0;
    }
  };

  const burst = useCallback(({ count = 100, x = 0.5, y = 0.6 } = {}) => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const scale = Math.min(w, h) / 800;
    for (let i = 0; i < count; i++) {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.7;
      const speed = (7 + Math.random() * 9) * Math.max(scale, 0.6);
      particles.current.push({
        x: x * w + (Math.random() - 0.5) * 60,
        y: y * h,
        vx: Math.cos(angle) * speed * (0.7 + Math.random() * 0.6),
        vy: Math.sin(angle) * speed,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.25,
        size: 7 + Math.random() * 7,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        shape: Math.random() < 0.4 ? 0 : 1,
        life: 110 + Math.random() * 50,
      });
    }
    if (!raf.current) raf.current = requestAnimationFrame(tick);
  }, []);

  useImperativeHandle(ref, () => ({ burst }));

  // Any component can fire confetti through the fx bus.
  useEffect(() => onFx((event) => {
    if (event.type === "confetti") burst(event.opts);
  }), [burst]);

  return <canvas ref={canvasRef} className="confetti" aria-hidden="true" />;
});

export default Confetti;
