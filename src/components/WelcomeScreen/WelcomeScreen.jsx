import { useRef, useState } from "react";
import { burstConfetti, toast } from "../../lib/fx.js";
import "./WelcomeScreen.css";

const FLOATIES = ["💻", "⌚", "🧸", "🎮", "⚡", "🎈", "🤖", "🍰"];

export default function WelcomeScreen({ config, leaving, onStart }) {
  const [taps, setTaps] = useState(0);
  const tapTimer = useRef(0);

  const cakeTapped = () => {
    clearTimeout(tapTimer.current);
    const next = taps + 1;
    setTaps(next);
    if (next >= 3) {
      setTaps(0);
      burstConfetti({ count: 90, y: 0.35 });
      toast("Eager much? The party starts below 😄", "🥳");
    }
    tapTimer.current = setTimeout(() => setTaps(0), 1800);
  };

  return (
    <div
      className={`welcome ${leaving ? "welcome--leaving" : ""}`}
      role="dialog"
      aria-label="Birthday welcome"
    >
      <div className="welcome-floaties" aria-hidden="true">
        {FLOATIES.map((emoji, i) => (
          <span key={emoji} style={{ "--i": i }}>
            {emoji}
          </span>
        ))}
      </div>

      <div className="welcome-inner">
        <button className="welcome-cake" onClick={cakeTapped} aria-label="Tap the cake">
          🎂
        </button>
        <h1 className="welcome-title">
          Happy Birthday,
          <br />
          <span className="grad">{config.name}</span>
        </h1>
        <p className="welcome-sub">“{config.subtitle}”</p>
        <button className="btn btn-primary welcome-start" onClick={onStart}>
          {config.startButton}
        </button>
        <p className="welcome-hint">🔊 Turn your sound on for the full experience</p>
      </div>
    </div>
  );
}
