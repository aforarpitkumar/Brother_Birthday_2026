import { useEffect, useRef, useState } from "react";
import Modal from "../../Modal/Modal.jsx";
import { useGameCanvas, loadBest, saveBest } from "../useGameCanvas.js";
import { burstConfetti } from "../../../lib/fx.js";
import "../Arcade.css";

const CHORES = ["🍽️", "🧺", "🥦", "🧹", "🪣"];
const LIVES = 3;

function newGame() {
  return {
    px: 0.5,
    items: [],
    spawnT: 0.5,
    elapsed: 0,
    lives: LIVES,
    invincible: 0,
    hitFlash: 0,
  };
}

export default function DodgeChores({ onClose }) {
  const [status, setStatus] = useState("idle");
  const [hud, setHud] = useState({ score: 0, lives: LIVES });
  const [best, setBest] = useState(() => loadBest("dodge"));
  const game = useRef(newGame());
  const keys = useRef({ left: false, right: false });
  const statusRef = useRef(status);
  statusRef.current = status;

  const { canvasRef } = useGameCanvas((ctx, w, h, dt) => {
    const g = game.current;
    ctx.clearRect(0, 0, w, h);

    ctx.fillStyle = "#fef6f9";
    ctx.fillRect(0, 0, w, h);
    // floor line
    ctx.fillStyle = "rgba(255, 101, 132, 0.12)";
    ctx.fillRect(0, h - 58, w, 2);

    if (statusRef.current !== "playing") return;

    g.elapsed += dt;
    g.invincible = Math.max(0, g.invincible - dt);
    g.hitFlash = Math.max(0, g.hitFlash - dt);
    const ramp = Math.min(1, g.elapsed / 50);
    const score = Math.floor(g.elapsed * 10);
    setHud((prev) =>
      prev.score === score && prev.lives === g.lives ? prev : { score, lives: g.lives }
    );

    if (keys.current.left) g.px -= dt * 1.0;
    if (keys.current.right) g.px += dt * 1.0;
    g.px = Math.min(0.94, Math.max(0.06, g.px));

    g.spawnT -= dt;
    if (g.spawnT <= 0) {
      g.spawnT = 0.8 - 0.45 * ramp;
      const isShout = Math.random() < 0.14;
      g.items.push({
        x: 0.08 + Math.random() * 0.84,
        y: -0.06,
        v: 0.38 + 0.36 * ramp + Math.random() * 0.12,
        emoji: CHORES[Math.floor(Math.random() * CHORES.length)],
        shout: isShout,
      });
    }

    const playerY = h - 64;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (const item of g.items) {
      item.y += item.v * dt;
      const sx = item.x * w;
      const sy = item.y * h;
      const hit = g.invincible <= 0 && Math.abs(item.x - g.px) < (item.shout ? 0.11 : 0.075) && Math.abs(sy - playerY) < 34;

      if (hit) {
        item.dead = true;
        g.lives -= 1;
        g.invincible = 1.3;
        g.hitFlash = 0.4;
        setHud({ score, lives: g.lives });
        if (g.lives <= 0) {
          saveBest("dodge", score);
          setBest((b) => Math.max(b, score));
          setStatus("over");
        }
      } else if (sy > h + 36) {
        item.dead = true;
      }

      if (item.shout) {
        ctx.fillStyle = "#ff6584";
        ctx.font = "800 17px system-ui, sans-serif";
        ctx.fillText("GET UP!", sx, sy);
      } else {
        ctx.font = '33px "Segoe UI Emoji", "Apple Color Emoji", sans-serif';
        ctx.fillText(item.emoji, sx, sy);
      }
    }
    g.items = g.items.filter((i) => !i.dead);

    // player (blinks while invincible)
    if (g.invincible <= 0 || Math.floor(g.invincible * 10) % 2 === 0) {
      ctx.font = '38px "Segoe UI Emoji", "Apple Color Emoji", sans-serif';
      ctx.fillText("😴", g.px * w, playerY);
    }
    if (g.hitFlash > 0) {
      ctx.fillStyle = `rgba(255, 101, 132, ${g.hitFlash})`;
      ctx.fillRect(0, 0, w, h);
    }
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
    game.current.px = Math.min(0.94, Math.max(0.06, (e.clientX - rect.left) / rect.width));
  };

  return (
    <Modal title="😤 Dodge Mom's Chores" onClose={onClose}>
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
              <span className="game-overlay-emoji">🍽️🧺🥦</span>
              <p>Dodge the chores. Stay in bed mode. 😴</p>
              <p className="game-overlay-sub">
                drag / arrows to move · watch out for “GET UP!” · 3 hits and Mom wins
              </p>
              <button className="game-btn" onClick={start}>Start ▶</button>
            </div>
          )}
          {status === "over" && (
            <div className="game-overlay">
              <span className="game-overlay-emoji">😤</span>
              <p>Mom caught you!</p>
              <p className="game-overlay-sub">
                Survived: <b>{game.current.elapsed.toFixed(1)}s</b> · Score: <b>{game.current.elapsed ? Math.floor(game.current.elapsed * 10) : 0}</b> · Best: <b>{best}</b>
              </p>
              <button className="game-btn" onClick={start}>Run again 🔁</button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
