import { useEffect, useMemo, useRef, useState } from "react";
import Modal from "../../Modal/Modal.jsx";
import { useTypedLines } from "../../../lib/useTypedLines.js";
import "./Desktop.css";

const ICONS = [
  { id: "code", icon: "🧩", label: "VS Code" },
  { id: "terminal", icon: "⌨️", label: "Terminal" },
  { id: "antigravity", icon: "🪐", label: "Antigravity" },
  { id: "cloud", icon: "☁️", label: "Cloud Code" },
  { id: "deploy", icon: "🚀", label: "Deploy" },
];

export default function Desktop({ onClose, onBuilt }) {
  const [win, setWin] = useState(null);

  return (
    <Modal title="Bhaiya's Dev Machine 💻" onClose={onClose} wide dark>
      <div className="desktop">
        <div className="desktop-icons">
          {ICONS.map((ic) => (
            <button
              key={ic.id}
              className={`desktop-icon ${win === ic.id ? "is-active" : ""}`}
              onClick={() => setWin(ic.id)}
            >
              <span className="desktop-icon-img">{ic.icon}</span>
              <span className="desktop-icon-label">{ic.label}</span>
            </button>
          ))}
        </div>

        <div className="desktop-stage">
          {win === "code" && <VSCodeWindow key="code" onBuilt={onBuilt} />}
          {win === "terminal" && <TerminalWindow key="terminal" />}
          {win === "antigravity" && <AntigravityWindow key="antigravity" />}
          {win === "cloud" && <CloudCodeWindow key="cloud" />}
          {win === "deploy" && <DeployWindow key="deploy" onBuilt={onBuilt} />}
          {!win && (
            <div className="desktop-empty">
              <span className="desktop-empty-icon">🖥️</span>
              <p>Click any icon. He&apos;d want you to.</p>
              <p className="desktop-empty-sub">every app is 100% handcrafted nonsense</p>
            </div>
          )}
        </div>

        <footer className="desktop-taskbar">
          <span>🪟 bhaiyaOS</span>
          <span className="desktop-taskbar-note">🎵 भाई का जन्मदिन — now playing</span>
          <span>🔋 1%</span>
        </footer>
      </div>
    </Modal>
  );
}

/* ── Shared window frame ───────────────────────────────────── */
function WinFrame({ title, className = "", children }) {
  return (
    <div className={`win ${className}`}>
      <div className="win-head">
        <span className="win-dots">
          <i />
          <i />
          <i />
        </span>
        <span className="win-title">{title}</span>
      </div>
      <div className="win-body">{children}</div>
    </div>
  );
}

/* ── VS Code ───────────────────────────────────────────────── */
const CODE = [
  [{ t: "// birthday.js — the most important build of the year", c: "cm" }],
  [
    { t: "import ", c: "kw" },
    { t: "happiness", c: "fn" },
    { t: " from ", c: "kw" },
    { t: '"family"', c: "str" },
    { t: ";", c: "pl" },
  ],
  [
    { t: "import ", c: "kw" },
    { t: "cake", c: "fn" },
    { t: " from ", c: "kw" },
    { t: '"kitchen"', c: "str" },
    { t: ";", c: "pl" },
  ],
  [{ t: "", c: "pl" }],
  [
    { t: "function ", c: "kw" },
    { t: "celebrateBhaiya", c: "fn" },
    { t: "() {", c: "pl" },
  ],
  [
    { t: "  const ", c: "kw" },
    { t: "wishes", c: "pl" },
    { t: " = [", c: "pl" },
    { t: '"health"', c: "str" },
    { t: ", ", c: "pl" },
    { t: '"gadgets"', c: "str" },
    { t: ", ", c: "pl" },
    { t: '"sleep"', c: "str" },
    { t: "];", c: "pl" },
  ],
  [
    { t: "  return ", c: "kw" },
    { t: "`Happy Birthday Bhaiya! ${cake} 🎂`", c: "str" },
    { t: ";", c: "pl" },
  ],
  [{ t: "}", c: "pl" }],
  [{ t: "", c: "pl" }],
  [
    { t: "celebrateBhaiya", c: "fn" },
    { t: "();", c: "pl" },
  ],
];

function VSCodeWindow({ onBuilt }) {
  const flat = useMemo(
    () =>
      CODE.flatMap((line, li) => {
        const items = [];
        for (const token of line) {
          for (const ch of token.t) items.push({ ch, cls: token.c });
        }
        if (li < CODE.length - 1) items.push({ ch: "\n", cls: "pl" });
        return items;
      }),
    []
  );
  const [chars, setChars] = useState(0);
  const builtRef = useRef(onBuilt);
  builtRef.current = onBuilt;

  useEffect(() => {
    const id = setInterval(() => {
      setChars((c) => {
        if (c >= flat.length) {
          clearInterval(id);
          return c;
        }
        return c + 1;
      });
    }, 24);
    return () => clearInterval(id);
  }, [flat]);

  const built = chars >= flat.length;
  useEffect(() => {
    if (!built) return;
    const t = setTimeout(() => builtRef.current?.(), 500);
    return () => clearTimeout(t);
  }, [built]);

  const typed = useMemo(() => {
    const out = [];
    let run = null;
    for (const { ch, cls } of flat.slice(0, chars)) {
      if (run && run.cls === cls) run.text += ch;
      else {
        run = { cls, text: ch };
        out.push(run);
      }
    }
    return out;
  }, [flat, chars]);

  return (
    <WinFrame title="birthday.js — Visual Studio Code" className="win--vscode">
      <div className="vscode">
        <aside className="vscode-side">
          <p className="vscode-side-head">EXPLORER</p>
          <p className="is-open-file">birthday.js</p>
          <p>mom.html</p>
          <p>snacks.css</p>
          <p>chores.ignore</p>
        </aside>
        <div className="vscode-main">
          <pre className="vscode-code">
            {typed.map((run, i) => (
              <span key={i} className={`tok-${run.cls}`}>
                {run.text}
              </span>
            ))}
            {!built && <span className="win-cursor" />}
          </pre>
          <div className="vscode-status">
            <span>{built ? "✓ Build successful! 🎉" : "⏳ compiling birthday…"}</span>
            <span>main*</span>
          </div>
        </div>
      </div>
    </WinFrame>
  );
}

/* ── Terminal ──────────────────────────────────────────────── */
const TERMINAL_LINES = [
  { kind: "cmd", text: "npm install happiness" },
  { kind: "out", text: "added 1,000,000 packages in 0.42s" },
  { kind: "out", text: "audited by Mom ✓  0 vulnerabilities found" },
  { kind: "cmd", text: "npm run celebrate" },
  { kind: "out", text: "🎂 compiling joy… done" },
  { kind: "out", text: "wishes delivered → Bhaiya" },
  { kind: "cmd", text: "sudo nap --extended" },
  { kind: "out", text: "permission denied: ask Mom first 😅" },
];

export function TerminalWindow() {
  const progress = useTypedLines(TERMINAL_LINES, true);
  const done = progress.line >= TERMINAL_LINES.length;
  return (
    <WinFrame title="Terminal — bhaiyaOS" className="win--term">
      <div className="term">
        {TERMINAL_LINES.map((line, i) => {
          if (i > progress.line) return null;
          const text =
            i === progress.line ? line.text.slice(0, progress.chars) : line.text;
          if (line.kind === "cmd")
            return (
              <p key={i} className="term-line term-cmd">
                <span className="term-prompt">➜ ~</span> {text}
                {i === progress.line && !done && <span className="win-cursor" />}
              </p>
            );
          return (
            <p key={i} className={`term-line term-${line.kind}`}>
              {text}
            </p>
          );
        })}
        {done && <span className="win-cursor" />}
      </div>
    </WinFrame>
  );
}

/* ── Antigravity (AI agent) ────────────────────────────────── */
const AGENT_STEPS = [
  "🪐 Understanding the vibe…",
  "✍️ Writing HTML with love…",
  "🎯 Centering the div (hard mode)…",
  "🌷 Adding mom-approved colors…",
  "🚀 Shipping it…",
];

export function AntigravityWindow() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (step > AGENT_STEPS.length) return;
    const t = setTimeout(() => setStep((s) => s + 1), step === 0 ? 400 : 900);
    return () => clearTimeout(t);
  }, [step]);

  return (
    <WinFrame title="Antigravity — AI Agent" className="win--agent">
      <div className="agent">
        <div className="agent-msg agent-msg--user">
          build a website for Mom 🌷
        </div>
        {AGENT_STEPS.slice(0, step).map((line, i) => (
          <div key={i} className="agent-msg agent-msg--ai">
            {line} <span className="agent-ok">✓</span>
          </div>
        ))}
        {step > AGENT_STEPS.length && (
          <div className="agent-msg agent-msg--done">
            Done in 3.2s. Obviously. 🪐
          </div>
        )}
        {step <= AGENT_STEPS.length && <span className="win-cursor" />}
      </div>
    </WinFrame>
  );
}

/* ── Cloud Code ────────────────────────────────────────────── */
const CLOUD_LINES = [
  { kind: "cmd", text: "cloud deploy ./birthday-website" },
  { kind: "out", text: "▲ Cloud Code v9.1 (emotional edition)" },
  { kind: "out", text: "uploading love… ██████████ 100%" },
  { kind: "out", text: "scanning for bugs… 0 found (impressive)" },
  { kind: "info", text: "deployed to bhaiya.birthday ☁️❤️" },
];

export function CloudCodeWindow() {
  const progress = useTypedLines(CLOUD_LINES, true);
  return (
    <WinFrame title="Cloud Code — cloud shell" className="win--term">
      <div className="term">
        {CLOUD_LINES.map((line, i) => {
          if (i > progress.line) return null;
          const text =
            i === progress.line ? line.text.slice(0, progress.chars) : line.text;
          if (line.kind === "cmd")
            return (
              <p key={i} className="term-line term-cmd">
                <span className="term-prompt">☁️ ~</span> {text}
                {i === progress.line && <span className="win-cursor" />}
              </p>
            );
          return (
            <p key={i} className={`term-line term-${line.kind}`}>
              {text}
            </p>
          );
        })}
      </div>
    </WinFrame>
  );
}

/* ── Deploy ────────────────────────────────────────────────── */
export function DeployWindow({ onBuilt }) {
  const [progress, setProgress] = useState(0);
  const launched = progress >= 100;
  const builtRef = useRef(onBuilt);
  builtRef.current = onBuilt;

  useEffect(() => {
    if (launched) {
      const t = setTimeout(() => builtRef.current?.(), 300);
      return () => clearTimeout(t);
    }
    const id = setInterval(() => {
      setProgress((p) => Math.min(100, p + 2));
    }, 45);
    return () => clearInterval(id);
  }, [launched]);

  const restart = () => setProgress(0);

  return (
    <WinFrame title="Deploy — production" className="win--deploy">
      <div className={`deploy ${launched ? "is-launched" : ""}`}>
        <span className="deploy-rocket" aria-hidden="true">
          🚀
        </span>
        <div className="deploy-bar">
          <span style={{ width: `${progress}%` }} />
        </div>
        <p className="deploy-text">
          {launched
            ? "🎉 Live at bhaiya.birthday — zero downtime, full love"
            : `Deploying birthday magic… ${progress}%`}
        </p>
        {launched && (
          <button className="deploy-again" onClick={restart}>
            Deploy again 🔁
          </button>
        )}
      </div>
    </WinFrame>
  );
}
