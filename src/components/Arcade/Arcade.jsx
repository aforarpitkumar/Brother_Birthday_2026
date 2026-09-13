import { useState } from "react";
import CatchGadgets from "./games/CatchGadgets.jsx";
import DodgeChores from "./games/DodgeChores.jsx";
import BuildWebsite from "./games/BuildWebsite.jsx";
import "./Arcade.css";

const GAMES = [
  {
    id: "catch",
    emoji: "🕹️",
    name: "Catch the Gadgets",
    blurb: "Catch falling phones, watches & laptops. Don't drop his babies.",
    comp: CatchGadgets,
  },
  {
    id: "dodge",
    emoji: "😴",
    name: "Dodge Mom's Chores",
    blurb: "Dishes, laundry, vegetables… and the dreaded “GET UP!”.",
    comp: DodgeChores,
  },
  {
    id: "build",
    emoji: "🧱",
    name: "Build a Website",
    blurb: "Tap the build steps in order and ship it like Bhaiya.",
    comp: BuildWebsite,
  },
];

export default function Arcade() {
  const [active, setActive] = useState(null);
  const ActiveGame = GAMES.find((g) => g.id === active)?.comp;

  return (
    <section id="arcade" className="section">
      <p className="eyebrow">🎮 Mini Arcade</p>
      <h2>Bhaiya Arcade</h2>
      <p className="section-sub">Three tiny games. Zero loading time. Full chaos.</p>

      <div className="arcade-grid">
        {GAMES.map((game) => (
          <button key={game.id} className="arcade-card" onClick={() => setActive(game.id)}>
            <span className="arcade-card-emoji" aria-hidden="true">
              {game.emoji}
            </span>
            <h3>{game.name}</h3>
            <p>{game.blurb}</p>
            <span className="arcade-play">Play ▶</span>
          </button>
        ))}
      </div>

      {ActiveGame && <ActiveGame onClose={() => setActive(null)} />}
    </section>
  );
}
