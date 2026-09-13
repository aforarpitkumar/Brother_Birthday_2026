import { useEffect, useState } from "react";
import "./BootScreen.css";

const LINES = [
  "Initializing Birthday...",
  "Installing Happiness...",
  "Downloading Cake... 🎂",
  "Compiling Memories...",
  "Build successful! 🎉",
];

export default function BootScreen({ onDone }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (count >= LINES.length) {
      const t = setTimeout(onDone, 550);
      return () => clearTimeout(t);
    }
    const t = setTimeout(
      () => setCount((c) => c + 1),
      count === LINES.length - 1 ? 620 : 420
    );
    return () => clearTimeout(t);
  }, [count, onDone]);

  const done = count >= LINES.length;

  return (
    <div className="boot" onClick={onDone} role="presentation">
      <div className="boot-terminal">
        <div className="boot-bar">
          <i />
          <i />
          <i />
          <span className="boot-title">birthday.exe</span>
        </div>
        <div className="boot-body">
          {LINES.slice(0, count).map((line, i) => (
            <p key={line} className={i === LINES.length - 1 ? "boot-ok" : ""}>
              <span className="boot-check">{i === LINES.length - 1 ? "✔" : "›"}</span>{" "}
              {line}
            </p>
          ))}
          {!done && <span className="boot-cursor" />}
          <div className="boot-progress">
            <span style={{ width: `${(count / LINES.length) * 100}%` }} />
          </div>
        </div>
      </div>
      <p className="boot-skip">tap to skip</p>
    </div>
  );
}
