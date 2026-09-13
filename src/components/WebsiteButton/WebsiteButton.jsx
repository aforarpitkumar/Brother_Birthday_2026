import { useEffect, useRef, useState } from "react";
import "./WebsiteButton.css";

export default function WebsiteButton({ ideas }) {
  const [idea, setIdea] = useState("");
  const [typed, setTyped] = useState("");
  const [punchline, setPunchline] = useState(false);
  const lastIdea = useRef(-1);
  const timers = useRef([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const generate = () => {
    if (ideas.length === 0) return;
    let i;
    do {
      i = Math.floor(Math.random() * ideas.length);
    } while (i === lastIdea.current && ideas.length > 1);
    lastIdea.current = i;
    setPunchline(false);
    setIdea(ideas[i]);
  };

  // Typewriter for the chosen idea, then the punchline.
  useEffect(() => {
    if (!idea) return;
    setTyped("");
    let n = 0;
    const typer = setInterval(() => {
      n += 1;
      setTyped(idea.slice(0, n));
      if (n >= idea.length) {
        clearInterval(typer);
        timers.current.push(setTimeout(() => setPunchline(true), 400));
      }
    }, 36);
    return () => clearInterval(typer);
  }, [idea]);

  return (
    <div className="tech-card builder-card">
      <h3 className="builder-title">What should we build today? 🤔</h3>
      <div className="builder-screen" aria-live="polite">
        {idea ? (
          <span className="builder-idea">
            {typed}
            {!punchline && <span className="builder-cursor" />}
          </span>
        ) : (
          <span className="builder-placeholder">
            Press the button and see what he&apos;ll build next…
          </span>
        )}
        {punchline && <span className="builder-punch">Obviously... he can build it. 😎</span>}
      </div>
      <button className="btn btn-primary builder-btn" onClick={generate}>
        Generate idea ✨
      </button>
    </div>
  );
}
