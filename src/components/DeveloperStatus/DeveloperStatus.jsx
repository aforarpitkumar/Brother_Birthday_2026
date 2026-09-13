import { useEffect, useRef, useState } from "react";
import { toast } from "../../lib/fx.js";
import "./DeveloperStatus.css";

const STATS = [
  { label: "Coding", value: 100 },
  { label: "Gadgets", value: 100 },
  { label: "Lazy Mode", value: 100 },
  { label: "Mom's Patience", value: 30, warn: true },
];

export default function DeveloperStatus() {
  const ref = useRef(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setOn(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`status ${on ? "is-on" : ""}`}>
      <p className="status-head">
        SYSTEM STATUS <span className="status-live" aria-hidden="true" /> LIVE
      </p>
      {STATS.map((stat, i) => (
        <div
          className={`status-row ${stat.warn ? "status-row--clickable" : ""}`}
          key={stat.label}
          onClick={
            stat.warn
              ? () => toast("Patience +1%… system says: just kidding, −5% 😅", "⚡")
              : undefined
          }
        >
          <span className="status-label">{stat.label}</span>
          <span className="status-bar">
            <span
              className={`status-fill ${stat.warn ? "status-fill--warn" : ""}`}
              style={{ "--w": `${stat.value}%`, "--d": `${i * 0.15}s` }}
            />
          </span>
          <span className={`status-val ${stat.warn ? "status-val--warn" : ""}`}>
            {stat.value}%
          </span>
        </div>
      ))}
      <p className="status-note">
        {"// all systems running perfectly. Mom's patience may need a restart."}
      </p>
    </div>
  );
}
