import "./BirthdayHero.css";

const FLOATIES = ["⌚", "💻", "🧸", "🎈"];

export default function BirthdayHero({ config }) {
  return (
    <section id="birthday" className="hero">
      <div className="hero-floaties" aria-hidden="true">
        {FLOATIES.map((emoji, i) => (
          <span key={emoji} style={{ "--i": i }}>
            {emoji}
          </span>
        ))}
      </div>
      <p className="eyebrow">🎉 Official Birthday Mode: ON</p>
      <h1>
        Happy Birthday,
        <br />
        <span className="grad">{config.name}</span> 🎂
      </h1>
      <p className="hero-sub">“{config.subtitle}”</p>
      <a className="btn btn-primary hero-cta" href="#memories">
        See the Memories 📸
      </a>
    </section>
  );
}
