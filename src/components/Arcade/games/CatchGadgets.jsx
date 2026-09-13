import { useEffect, useRef, useState } from "react";
import Modal from "../../Modal/Modal.jsx";
import { useGameCanvas, loadBest, saveBest } from "../useGameCanvas.js";
import { burstConfetti } from "../../../lib/fx.js";
import "../Arcade.css";

const GADGETS = ["📱", "⌚", "💻", "🎧", "🎮", "🖥️", "🤖", "⌨️"];
const START_SPEED = 0.34; // screen heights per second
const LIVES = 3;

function newGame() {
  return {
    bx: 0.5,
    items: [],
    spawnT: 0.4,
    elapsed: 0,
    score: 0,
    lives: LIVES,
    pop: null, // { x, y, t } little catch effect
  };
}

export default function CatchGadgets({ onClose }) {
  const [status, setStatus] = useState("idle");
  const [hud, setHud] = useState({ score: 0, lives: LIVES });
  const [best, setBest] = useState(() => loadBest("catch"));
  const game = useRef(newGame());
  const keys = useRef({ left: false, right: false });
  const statusRef = useRef(status);
  statusRef.current = status;

  const { canvasRef } = useGameCanvas((ctx, w, h, dt) => {
    const g = game.current;
    ctx.clearRect(0, 0, w, h);

    // backdrop
    ctx.fillStyle = "#fff4ec";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "rgba(43, 37, 48, 0.05)";
    ctx.lineWidth = 1;
    for (let x = 24; x < w; x += 24) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }

    if (statusRef.current !== "playing") return;

    g.elapsed += dt;
    const ramp = Math.min(1, g.elapsed / 55);

    // keyboard steering
    if (keys.current.left) g.bx -= dt * 0.9;
    if (keys.current.right) g.bx += dt * 0.9;
    g.bx = Math.min(0.95, Math.max(0.05, g.bx));

    // spawning
    g.spawnT -= dt;
    if (g.spawnT <= 0) {
      g.spawnT = 0.95 - 0.5 * ramp;
      g.items.push({
        x: 0.08 + Math.random() * 0.84,
        y: -0.05,
        v: START_SPEED + 0.34 * ramp + Math.random() * 0.1,
        emoji: GADGETS[Math.floor(Math.random() * GADGETS.length)],
        star: Math.random() < 0.08,
      });
    }

    // items
    const catchY = h - 74;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (const item of g.items) {
      item.y += item.v * dt;
      if (item.y * h >= catchY && item.y * h <= catchY + 40 && Math.abs(item.x - g.bx) < 0.085) {
        item.dead = true;
        g.score += item.star ? 5 : 1;
        g.pop = { x: item.x * w, y: catchY, t: 0.4, star: item.star };
        setHud({ score: g.score, lives: g.lives });
      } else if (item.y * h > h + 34) {
        item.dead = true;
        if (!item.star) {
          g.lives -= 1;
          setHud({ score: g.score, lives: g.lives });
          if (g.lives <= 0) {
            saveBest("catch", g.score);
            setBest((b) => Math.max(b, g.score));
            setStatus("over");
            if (g.score >= 20) burstConfetti({ count: 80, y: 0.35 });
          }
        }
      }
      ctx.font = `${item.star ? 34 : 31}px "Segoe UI Emoji", "Apple Color Emoji", sans-serif`;
      ctx.fillText(item.star ? "⭐" : item.emoji, item.x * w, item.y * h);
    }
    g.items = g.items.filter((i) => !i.dead);

    // catch pop effect
    if (g.pop) {
      g.pop.t -= dt;
      if (g.pop.t <= 0) g.pop = null;
      else {
        ctx.fillStyle = g.pop.star ? "#ffc24b" : "rgba(255, 101, 132, 0.8)";
        ctx.font = "700 15px system-ui, sans-serif";
        ctx.fillText(g.pop.star ? "+5!" : "+1", g.pop.x, catchY - 26 - (0.4 - g.pop.t) * 40);
      }
    }

    // basket
    ctx.font = '42px "Segoe UI Emoji", "Apple Color Emoji", sans-serif';
    ctx.fillText("🧺", g.bx * w, catchY + 26);
  });

  useEffect(() => {
    const down = (e) => {
      if (e.key === "ArrowLeft") keys.current.left = true;
      if (e.key === "ArrowRight") keys.current.right = true;
    };
    const up = (e) => {
      if (e.key === "ArrowLeft") keys.current.left = false;
      if (e.key === "ArrowRight") keys.current.right = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  const start = () => {
    game.current = newGame();
    setHud({ score: 0, lives: LIVES });
    setStatus("playing");
  };

  const steer = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    game.current.bx = Math.min(0.95, Math.max(0.05, (e.clientX - rect.left) / rect.width));
  };

  return (
    <Modal title="🕹️ Catch the Gadgets" onClose={onClose}>
      <div className="game">
        <div className="game-hud">
          <span className="game-chip">Score: <b>{hud.score}</b></span>
          <span className="game-chip">{"❤️".repeat(Math.max(0, hud.lives)) || "💔"}</span>
          <span className="game-chip">Best: <b>{best}</b></span>
        </div>
        <div className="game-stage">
          <canvas
            ref={canvasRef}
            className="game-canvas"
            onPointerDown={steer}
            onPointerMove={(e) => statusRef.current === "playing" && steer(e)}
          />
          {status === "idle" && (
            <div className="game-overlay">
              <span className="game-overlay-emoji">📱⌚💻</span>
              <p>Catch the falling gadgets in the basket!</p>
              <p className="game-overlay-sub">drag / arrows to move · ⭐ = +5 · 3 drops = game over</p>
              <button className="game-btn" onClick={start}>Start ▶</button>
            </div>
          )}
          {status === "over" && (
            <div className="game-overlay">
              <span className="game-overlay-emoji">🔋</span>
              <p>Out of battery!</p>
              <p className="game-overlay-sub">
                Score: <b>{game.current.score}</b> · Best: <b>{best}</b>
              </p>
              <button className="game-btn" onClick={start}>Play again 🔁</button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
