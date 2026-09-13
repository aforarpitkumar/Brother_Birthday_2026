import "./Navbar.css";

const LINKS = [
  { href: "#birthday", emoji: "🎂", label: "Birthday" },
  { href: "#memories", emoji: "📸", label: "Memories" },
  { href: "#developer", emoji: "💻", label: "Developer Mode" },
  { href: "#arcade", emoji: "🎮", label: "Arcade" },
  { href: "#message", emoji: "❤️", label: "Message" },
];

export default function Navbar({ config }) {
  return (
    <>
      <header className="nav">
        <a className="nav-brand" href="#birthday">
          <span aria-hidden="true">🎂</span> {config.shortName}&apos;s Day
        </a>
        <nav className="nav-links" aria-label="Sections">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href}>
              <span aria-hidden="true">{link.emoji}</span> {link.label}
            </a>
          ))}
        </nav>
      </header>

      <nav className="tabbar" aria-label="Sections">
        {LINKS.map((link) => (
          <a key={link.href} href={link.href}>
            <span className="tabbar-emoji" aria-hidden="true">
              {link.emoji}
            </span>
            <span className="tabbar-label">{link.label}</span>
          </a>
        ))}
      </nav>
    </>
  );
}
