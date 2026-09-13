import { useEffect, useMemo, useRef, useState } from "react";
import Modal from "../../Modal/Modal.jsx";
import { burstConfetti } from "../../../lib/fx.js";
import "../Arcade.css";

const ROUNDS = [
  {
    client: "Mom 🌷",
    want: "a recipe website",
    steps: ["📝 Plan", "🎨 Design", "💻 Code", "🚀 Deploy"],
  },
  {
    client: "Bhaiya 😎",
    want: "a gadget showcase",
    steps: ["📝 Plan", "🎨 Design", "💻 Code", "🐛 Debug", "🚀 Deploy"],
  },
  {
    client: "The Family ❤️",
    want: "a birthday surprise",
    steps: ["📝 Plan", "🎨 Design", "💻 Code", "🧪 Test", "🚀 Deploy", "🍰 Celebrate"],
  },
];

const ERRORS = [
  "404: Order not found 🤪",
  "Merge conflict in the kitchen 🍽️",
  "It works on my machine 🤷",
  "npm ERR! wrong tap detected",
  "Git says no. Git is right.",
];

function shuffle(arr) {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function buildRound(roundIndex) {
  const steps = ROUNDS[roundIndex].steps;
  let chips = shuffle(steps);
  let guard = 0;
  while (chips.join() === steps.join() && guard++ < 8) chips = shuffle(steps);
  return chips;
}

export default function BuildWebsite({ onClose }) {
  const [round, setRound] = useState(0);
  const [chips, setChips] = useState(() => buildRound(0));
  const [progress, setProgress] = useState([]); // correctly tapped steps
  const [used, setUsed] = useState([]); // chip labels consumed (correct or not)
  const [score, setScore] = useState(0);
  const [msg, setMsg] = useState(null);
  const [shaking, setShaking] = useState(false);
  const [finished, setFinished] = useState(false);
  const timers = useRef([]);

  const current = ROUNDS[round];
  const roundDone = progress.length === current.steps.length;

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));

  const tap = (chip) => {
    if (roundDone || finished || used.includes(chip)) return;
    if (chip === current.steps[progress.length]) {
      // correct step
      const firstTry = !msg; // no error shown yet for this step-ish, keep simple bonus logic
      setProgress((p) => [...p, chip]);
      setUsed((u) => [...u, chip]);
      setScore((s) => s + (firstTry ? 100 : 40));
      setMsg(null);
      if (progress.length + 1 === current.steps.length) {
        burstConfetti({ count: 90, y: 0.4 });
        if (round === ROUNDS.length - 1) {
          later(() => setFinished(true), 1300);
        } else {
          later(() => {
            const next = round + 1;
            setRound(next);
            setChips(buildRound(next));
            setProgress([]);
            setUsed([]);
            setMsg(null);
          }, 1600);
        }
      }
    } else {
      // wrong step
      setScore((s) => Math.max(0, s - 10));
      setMsg(ERRORS[Math.floor(Math.random() * ERRORS.length)]);
      setShaking(true);
      later(() => setShaking(false), 450);
    }
  };

  const restart = () => {
    setRound(0);
    setChips(buildRound(0));
    setProgress([]);
    setUsed([]);
    setScore(0);
    setMsg(null);
    setFinished(false);
  };

  const progressPct = Math.round((progress.length / current.steps.length) * 100);

  return (
    <Modal title="🧱 Build a Website" onClose={onClose}>
      <div className="game">
        <div className="game-hud">
          <span className="game-chip">Score: <b>{score}</b></span>
          <span className="game-chip">Round: <b>{round + 1}/{ROUNDS.length}</b></span>
        </div>

        {finished ? (
          <div className="game-overlay game-overlay--static">
            <span className="game-overlay-emoji">🏆</span>
            <p className="build-success">BUILD SUCCESSFUL! 🎉</p>
            <p className="game-overlay-sub">
              All {ROUNDS.length} websites shipped · Score: <b>{score}</b>
            </p>
            <p className="game-overlay-sub">Obviously… he can build it. 😎</p>
            <button className="game-btn" onClick={restart}>Play again 🔁</button>
          </div>
        ) : (
          <div className={`build ${shaking ? "is-shaking" : ""}`}>
            <div className="build-client">
              <p className="build-client-line">
                <b>Client:</b> {current.client}
              </p>
              <p className="build-client-line">
                <b>Wants:</b> {current.want}
              </p>
            </div>

            <div className="build-bar">
              <span style={{ width: `${progressPct}%` }} />
            </div>

            {roundDone ? (
              <div className="build-success-banner">BUILD SUCCESSFUL! 🎉</div>
            ) : (
              <div className="build-chips">
                {chips.map((chip) => (
                  <button
                    key={chip}
                    className={`build-chip ${used.includes(chip) ? "is-used" : ""}`}
                    onClick={() => tap(chip)}
                    disabled={used.includes(chip)}
                  >
                    {chip}
                    
                  </button>
                ))}
              </div>
            )}

            <p className={`build-msg ${msg ? "is-error" : ""}`} aria-live="polite">
              {roundDone
                ? "Shipped! Next client incoming…"
                : msg || "Tap the build steps in the correct order 👆"}
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
}
