import { useEffect, useRef, useState } from "react";
import { burstConfetti } from "../../lib/fx.js";
import "./ToyShelf.css";

/* ── RC Car ────────────────────────────────────────────────── */
function RCSpeedster() {
  const [pos, setPos] = useState({ x: 50, y: 62 });
  const [facing, setFacing] = useState(1); // 1 = right, -1 = left
  const [bubble, setBubble] = useState(null);
  const held = useRef(null);
  const facingRef = useRef(facing);
  facingRef.current = facing;
  const bubbleTimer = useRef(0);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const step = (t) => {
      const dt = Math.min((t - last) / 1000, 0.05);
      last = t;
      if (held.current) {
        const speed = 46; // % of area per second
        setPos((p) => {
          let { x, y } = p;
          if (held.current === "up") y -= speed * dt;
          if (held.current === "down") y += speed * dt;
          if (held.current === "left") {
            x -= speed * dt;
            setFacing(-1);
          }
          if (held.current === "right") {
            x += speed * dt;
            setFacing(1);
          }
          return {
            x: Math.min(92, Math.max(8, x)),
            y: Math.min(90, Math.max(14, y)),
          };
        });
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  const honk = () => {
    clearTimeout(bubbleTimer.current);
    setBubble("BEEP BEEP! 📣");
    burstConfetti({ count: 16, x: 0.5, y: 0.55 });
    bubbleTimer.current = setTimeout(() => setBubble(null), 1300);
  };

  const hold = (dir) => (e) => {
    e.preventDefault();
    held.current = dir;
  };
  const release = () => {
    held.current = null;
  };

  return (
    <div className="toy-card toy-card--wide">
      <div className="toy-head">
        <h3>🚗 Remote-Control Car</h3>
        <p>Mom says: no driving in the house 🙃</p>
      </div>
      <div className="rc-area" onPointerLeave={release}>
        <span className="rc-rug" aria-hidden="true" />
        <span className="rc-lamp" aria-hidden="true">🪴</span>
        <span className="rc-tv" aria-hidden="true">📺</span>
        <span
          className={`rc-car ${bubble ? "rc-car--honk" : ""}`}
          style={{
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            transform: `translate(-50%, -50%) scaleX(${facing})`,
          }}
          role="img"
          aria-label="Remote control car"
        >
          {bubble && <span className="rc-bubble">{bubble}</span>}
          🏎️
        </span>
      </div>
      <div className="rc-controls">
        <div className="rc-dpad" aria-label="Driving controls">
          <button className="rc-btn rc-btn--up" onPointerDown={hold("up")} onPointerUp={release} onPointerCancel={release} aria-label="Drive up">▲</button>
          <button className="rc-btn rc-btn--left" onPointerDown={hold("left")} onPointerUp={release} onPointerCancel={release} aria-label="Drive left">◀</button>
          <button className="rc-btn rc-btn--right" onPointerDown={hold("right")} onPointerUp={release} onPointerCancel={release} aria-label="Drive right">▶</button>
          <button className="rc-btn rc-btn--down" onPointerDown={hold("down")} onPointerUp={release} onPointerCancel={release} aria-label="Drive down">▼</button>
        </div>
        <button className="rc-horn" onClick={honk}>
          📣 Horn
        </button>
      </div>
    </div>
  );
}

/* ── Handheld console ──────────────────────────────────────── */
const CONSOLE_MSGS = [
  "BATTERY: 9999% (Nokia certified)",
  "HIGH SCORE: 9999 — unbreakable",
  "🐍 the snake ate the charger",
  "NEW GAME: try the Arcade below!",
];

function HandheldConsole() {
  const [score, setScore] = useState(0);
  const [jump, setJump] = useState(false);
  const [msg, setMsg] = useState(null);
  const jumpTimer = useRef(0);
  const msgTimer = useRef(0);

  useEffect(() => () => {
    clearTimeout(jumpTimer.current);
    clearTimeout(msgTimer.current);
  }, []);

  const pressA = () => {
    if (jump) return;
    setJump(true);
    setScore((s) => s + 1);
    jumpTimer.current = setTimeout(() => setJump(false), 480);
  };

  const pressB = () => {
    clearTimeout(msgTimer.current);
    setMsg(CONSOLE_MSGS[Math.floor(Math.random() * CONSOLE_MSGS.length)]);
    msgTimer.current = setTimeout(() => setMsg(null), 2000);
  };

  return (
    <div className="toy-card">
      <div className="toy-head">
        <h3>🎮 Handheld Console</h3>
        <p>A = jump · B = secrets</p>
      </div>
      <div className="console" aria-hidden="true">
        <div className="console-screen">
          <span className="console-score">{score}</span>
          {msg ? <span className="console-msg">{msg}</span> : null}
          <span className="console-runner">🧺</span>
          <span className={`console-player ${jump ? "is-jumping" : ""}`}>🏃</span>
        </div>
        <div className="console-pad">
          <div className="console-dpad">
            <span /><span className="console-key">▲</span><span />
            <span className="console-key">◀</span><span /><span className="console-key">▶</span>
            <span /><span className="console-key">▼</span><span />
          </div>
          <div className="console-btns">
            <button className="console-btn console-btn--b" onClick={pressB} aria-label="Console B button">B</button>
            <button className="console-btn console-btn--a" onClick={pressA} aria-label="Console A button">A</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Mini robot ────────────────────────────────────────────── */
const ROBOT_LINES = [
  "Beep boop: Bhaiya is the best.",
  "I compute… it's CAKE time. 🎂",
  "Error 404: chores not found.",
  "Scanning… gadget level: legendary.",
  "Mom detected. Initiating hiding mode. 🙈",
  "Prediction: he'll open a website for this.",
];

function MiniRobot() {
  const [line, setLine] = useState(null);
  const [wiggle, setWiggle] = useState(false);
  const [clicks, setClicks] = useState(0);
  const timer = useRef(0);

  useEffect(() => () => clearTimeout(timer.current), []);

  const poke = () => {
    clearTimeout(timer.current);
    setWiggle(true);
    setLine(ROBOT_LINES[Math.floor(Math.random() * ROBOT_LINES.length)]);
    timer.current = setTimeout(() => setWiggle(false), 650);
    const next = clicks + 1;
    setClicks(next);
    if (next % 4 === 0) {
      burstConfetti({ count: 45 });
    }
  };

  return (
    <div className="toy-card">
      <div className="toy-head">
        <h3>🤖 Mini Robot</h3>
        <p>Poke him. He has opinions.</p>
      </div>
      <button className="robot" onClick={poke} aria-label="Poke the robot">
        {line && <span className="robot-bubble">{line}</span>}
        <span className={`robot-body ${wiggle ? "is-wiggling" : ""}`} aria-hidden="true">
          🤖
        </span>
      </button>
    </div>
  );
}

/* ── AI speaker ────────────────────────────────────────────── */
function SpeakerToy({ music }) {
  const [bubble, setBubble] = useState(null);
  const timer = useRef(0);

  useEffect(() => () => clearTimeout(timer.current), []);

  const press = () => {
    clearTimeout(timer.current);
    music.onToggle();
    setBubble(
      music.playing
        ? "Paused. Bhaiya needs silence to think. 🤫"
        : "Playing: भाई का जन्मदिन 🎵"
    );
    timer.current = setTimeout(() => setBubble(null), 2400);
  };

  return (
    <div className="toy-card">
      <div className="toy-head">
        <h3>🔊 Smart Speaker</h3>
        <p>“Hey speaker, play the song”</p>
      </div>
      <button className="speaker" onClick={press} aria-label="Toggle birthday song">
        {bubble && <span className="robot-bubble robot-bubble--up">{bubble}</span>}
        <span className={`speaker-body ${music.playing ? "is-playing" : ""}`} aria-hidden="true">
          <i /><i /><i /><i />
        </span>
      </button>
    </div>
  );
}

/* ── Shelf ─────────────────────────────────────────────────── */
export default function ToyShelf({ music }) {
  return (
    <div className="toy-shelf">
      <p className="toy-shelf-title">🧸 The Toy Shelf — everything here is clickable too</p>
      <div className="toy-grid">
        <RCSpeedster />
        <HandheldConsole />
        <MiniRobot />
        <SpeakerToy music={music} />
      </div>
    </div>
  );
}
