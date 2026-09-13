import { useEffect, useState } from "react";
import Modal from "../Modal/Modal.jsx";
import "./SmartWatch.css";

const APPS = [
  { id: "face", icon: "🕐", label: "Faces" },
  { id: "steps", icon: "👟", label: "Steps" },
  { id: "heart", icon: "❤️", label: "Heart" },
  { id: "weather", icon: "⛅", label: "Weather" },
  { id: "music", icon: "🎵", label: "Music" },
  { id: "video", icon: "🎬", label: "Video" },
  { id: "alerts", icon: "🔔", label: "Alerts" },
];

const WEEK_BARS = [14, 8, 20, 6, 10, 8, 100];
const WEEK_DAYS = ["M", "T", "W", "T", "F", "S", "S"];

function useNow(active) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, [active]);
  return now;
}

function AnalogFace({ now }) {
  const h = now.getHours() % 12;
  const m = now.getMinutes();
  const s = now.getSeconds();
  const hourDeg = h * 30 + m * 0.5;
  const minDeg = m * 6 + s * 0.1;
  const secDeg = s * 6;
  return (
    <svg viewBox="0 0 100 100" className="watch-analog" aria-hidden="true">
      <circle cx="50" cy="50" r="44" className="watch-analog-dial" />
      {Array.from({ length: 12 }, (_, i) => (
        <line
          key={i}
          x1="50"
          y1="10"
          x2="50"
          y2={i % 3 === 0 ? "16" : "14"}
          transform={`rotate(${i * 30} 50 50)`}
          className="watch-analog-tick"
        />
      ))}
      <line x1="50" y1="50" x2="50" y2="27" transform={`rotate(${hourDeg} 50 50)`} className="watch-hand watch-hand--hour" />
      <line x1="50" y1="50" x2="50" y2="19" transform={`rotate(${minDeg} 50 50)`} className="watch-hand watch-hand--min" />
      <line x1="50" y1="50" x2="50" y2="15" transform={`rotate(${secDeg} 50 50)`} className="watch-hand watch-hand--sec" />
      <circle cx="50" cy="50" r="2.6" className="watch-analog-pin" />
    </svg>
  );
}

function FaceScreen({ now, face }) {
  if (face === 0) {
    return (
      <div className="wapp wapp--face">
        <span className="watch-clock-big">
          {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
        <span className="watch-date">
          {now.toLocaleDateString([], { weekday: "short", day: "numeric", month: "short" })}
        </span>
        <span className="watch-batt">🔋 97% — never dies, like his hobbies</span>
      </div>
    );
  }
  if (face === 1) {
    return (
      <div className="wapp wapp--face">
        <AnalogFace now={now} />
        <span className="watch-batt">fancy mode ⌚✨</span>
      </div>
    );
  }
  return (
    <div className="wapp wapp--face">
      <span className="watch-face-cake">🎂</span>
      <span className="watch-face-hbd">Happy Birthday mode</span>
      <span className="watch-batt">24 hrs of being the favorite ❤️</span>
    </div>
  );
}

function StepsScreen() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    setCount(0);
    const id = setInterval(() => {
      setCount((c) => {
        if (c >= 12) {
          clearInterval(id);
          return c;
        }
        return c + 1;
      });
    }, 90);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="wapp">
      <p className="wapp-title">👟 Today&apos;s steps</p>
      <p className="wapp-steps">{count}</p>
      <div className="wapp-bars">
        {WEEK_BARS.map((v, i) => (
          <div key={i} className="wapp-bar-col">
            <span className="wapp-bar" style={{ height: `${v}%` }} />
            <span className="wapp-bar-day">{WEEK_DAYS[i]}</span>
          </div>
        ))}
      </div>
      <p className="wapp-note">Goal: 1,000 · Mom&apos;s review: “disappointing” 😤</p>
    </div>
  );
}

function HeartScreen() {
  const [bpm, setBpm] = useState(72);
  const [spike, setSpike] = useState(false);
  useEffect(() => {
    const id = setInterval(() => setBpm(66 + Math.round(Math.random() * 12)), 900);
    const t = setTimeout(() => setSpike(true), 6500);
    return () => {
      clearInterval(id);
      clearTimeout(t);
    };
  }, []);
  return (
    <div className="wapp">
      <p className="wapp-title">❤️ Heart rate</p>
      <span className="wapp-heart">{spike ? "💥" : "❤️"}</span>
      <p className="wapp-bpm">{spike ? 152 : bpm} bpm</p>
      <p className="wapp-note">
        {spike
          ? "⚠️ Spike detected: Mom entered the room."
          : "Resting: yes. Lazy: also yes."}
      </p>
    </div>
  );
}

function WeatherScreen() {
  return (
    <div className="wapp">
      <p className="wapp-title">⛅ Home weather</p>
      <p className="wapp-temp">28° 🌩️</p>
      <p className="wapp-forecast-main">Mom&apos;s Mood: stormy</p>
      <div className="wapp-forecast">
        <div><span>Today</span>🌩️</div>
        <div><span>Tomorrow</span>☀️</div>
        <div><span>+2 days</span>🍰</div>
      </div>
      <p className="wapp-note">Clearing after food. Carry manners. ☂️</p>
    </div>
  );
}

function MusicScreen({ music }) {
  return (
    <div className="wapp">
      <p className="wapp-title">🎵 Now playing</p>
      <div className={`wapp-disc ${music.playing ? "is-playing" : ""}`}>
        <span>♪</span>
      </div>
      <p className="wapp-song">भाई का जन्मदिन</p>
      <p className="wapp-artist">The Family Band 🎤</p>
      <div className="wapp-music-btns">
        <button
          onClick={music.onToggle}
          aria-label={music.playing ? "Pause song" : "Play song"}
        >
          {music.playing ? "⏸" : "▶️"}
        </button>
        <button onClick={music.onRestart} aria-label="Restart song">
          ↻
        </button>
      </div>
    </div>
  );
}

function VideoScreen() {
  const [playing, setPlaying] = useState(true);
  return (
    <div className="wapp">
      <p className="wapp-title">🎬 Now playing</p>
      <div className={`wapp-video ${playing ? "is-playing" : ""}`}>
        <span className="wapp-rec">● REC</span>
        <span className="wapp-sleep">😴</span>
        <span className="wapp-z z1">Z</span>
        <span className="wapp-z z2">z</span>
        <span className="wapp-z z3">Z</span>
        <div className="wapp-video-progress"><span /></div>
      </div>
      <p className="wapp-video-title">Bhaiya Sleeping — Director&apos;s Cut 😴 (4K)</p>
      <div className="wapp-music-btns">
        <button onClick={() => setPlaying((p) => !p)} aria-label={playing ? "Pause video" : "Play video"}>
          {playing ? "⏸" : "▶️"}
        </button>
      </div>
    </div>
  );
}

function AlertsScreen({ notifications }) {
  const [cleared, setCleared] = useState(false);
  const [resent, setResent] = useState(false);
  useEffect(() => () => clearTimeout(AlertsScreen._t), []);

  const clearAll = () => {
    clearTimeout(AlertsScreen._t);
    setResent(false);
    setCleared(true);
    AlertsScreen._t = setTimeout(() => {
      setCleared(false);
      setResent(true);
    }, 1800);
  };

  if (cleared) {
    return (
      <div className="wapp">
        <p className="wapp-title">🔔 Notifications</p>
        <p className="wapp-note wapp-note--center">All clear… for 2 seconds. ⏳</p>
        <button className="wapp-clear" onClick={clearAll}>Clear all</button>
      </div>
    );
  }

  const list = resent
    ? [...notifications, { app: "📞", text: "Mom: GET UP! (re-sent)", time: "just now" }]
    : notifications;

  return (
    <div className="wapp">
      <p className="wapp-title">🔔 Notifications</p>
      <div className="wapp-notifs">
        {list.map((n, i) => (
          <div key={i} className="wapp-notif">
            <span className="wapp-notif-icon">{n.app}</span>
            <span>{n.text}</span>
            <span className="wapp-notif-time">{n.time}</span>
          </div>
        ))}
      </div>
      <button className="wapp-clear" onClick={clearAll}>Clear all</button>
    </div>
  );
}

export default function SmartWatch({ messages, notifications, music }) {
  const [open, setOpen] = useState(false);
  const [screen, setScreen] = useState("face");
  const [face, setFace] = useState(0);
  const [tick, setTick] = useState(0);
  const now = useNow(open || true);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 2600);
    return () => clearInterval(id);
  }, []);

  const tickerText = messages.length
    ? messages[tick % messages.length]
    : "All quiet 👀";

  const tapScreen = () => {
    if (screen === "face") setFace((f) => (f + 1) % 3);
  };

  return (
    <>
      <button className="tech-card" onClick={() => setOpen(true)}>
        <div className="watch" aria-hidden="true">
          <span className="watch-strap watch-strap--top" />
          <span className="watch-strap watch-strap--bottom" />
          <span className="watch-body">
            <span className="watch-screen">
              <span className="watch-mini">
                <span className="watch-mini-time">
                  {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
                <span className="watch-mini-cake">🎂</span>
              </span>
            </span>
          </span>
        </div>
        <h3>Smartwatch ⌚</h3>
        <p>{tickerText}</p>
        <p className="tech-hint">tap to open · {APPS.length - 1} apps inside</p>
      </button>

      {open && (
        <Modal title="Bhaiya's Watch ⌚" onClose={() => setOpen(false)}>
          <div className="watch watch--big">
            <span className="watch-strap watch-strap--top" />
            <span className="watch-strap watch-strap--bottom" />
            <span className="watch-body">
              <span
                className="watch-screen watch-screen--big"
                onClick={tapScreen}
                role={screen === "face" ? "button" : undefined}
                title={screen === "face" ? "Tap to change face" : undefined}
              >
                {screen === "face" && <FaceScreen now={now} face={face} />}
                {screen === "steps" && <StepsScreen />}
                {screen === "heart" && <HeartScreen />}
                {screen === "weather" && <WeatherScreen />}
                {screen === "music" && <MusicScreen music={music} />}
                {screen === "video" && <VideoScreen />}
                {screen === "alerts" && (
                  <AlertsScreen notifications={notifications} />
                )}
              </span>
            </span>
          </div>
          {screen === "face" && (
            <p className="watch-face-hint">tap the screen to change faces ({face + 1}/3)</p>
          )}
          <div className="watch-apps">
            {APPS.map((app) => (
              <button
                key={app.id}
                className={`watch-app ${screen === app.id ? "is-active" : ""}`}
                onClick={() => setScreen(app.id)}
              >
                <span className="watch-app-icon">{app.icon}</span>
                <span className="watch-app-label">{app.label}</span>
              </button>
            ))}
          </div>
        </Modal>
      )}
    </>
  );
}
