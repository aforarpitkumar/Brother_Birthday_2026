import { useState } from "react";
import Desktop from "./Desktop/Desktop.jsx";
import { burstConfetti, toast } from "../../lib/fx.js";
import "./Laptop.css";

export default function Laptop() {
  const [open, setOpen] = useState(false);

  const handleBuilt = () => {
    burstConfetti({ count: 70, x: 0.5, y: 0.45 });
    toast("Build successful! 🎉", "✅");
  };

  return (
    <>
      <button
        className="tech-card laptop-card"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
      >
        <div className="laptop" aria-hidden="true">
          <div className="laptop-lid">
            <div className="laptop-screen">
              <div className="laptop-bar">
                <i />
                <i />
                <i />
              </div>
              <div className="laptop-static">
                <p>
                  <span className="ltok-cm">// ready to code</span>
                </p>
                <p>
                  <span className="ltok-kw">import</span>{" "}
                  <span className="ltok-fn">birthday</span>
                  <span className="ltok-pl">;</span>
                  <span className="laptop-cursor" />
                </p>
              </div>
            </div>
          </div>
          <div className="laptop-base">
            <span className="laptop-notch" />
          </div>
        </div>
        <h3>Laptop 💻</h3>
        <p>Boot his dev machine</p>
        <p className="tech-hint">VS Code · Terminal · Antigravity · Deploy</p>
      </button>

      {open && <Desktop onClose={() => setOpen(false)} onBuilt={handleBuilt} />}
    </>
  );
}
