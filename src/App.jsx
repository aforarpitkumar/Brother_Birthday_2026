import { useCallback, useEffect, useRef, useState } from "react";
import config, { asset } from "./config.js";
import BootScreen from "./components/BootScreen/BootScreen.jsx";
import WelcomeScreen from "./components/WelcomeScreen/WelcomeScreen.jsx";
import Navbar from "./components/Navbar/Navbar.jsx";
import BirthdayHero from "./components/BirthdayHero/BirthdayHero.jsx";
import PhotoSlideshow from "./components/PhotoSlideshow/PhotoSlideshow.jsx";
import MusicPlayer from "./components/MusicPlayer/MusicPlayer.jsx";
import SmartWatch from "./components/SmartWatch/SmartWatch.jsx";
import Laptop from "./components/Laptop/Laptop.jsx";
import WebsiteButton from "./components/WebsiteButton/WebsiteButton.jsx";
import ToyShelf from "./components/ToyShelf/ToyShelf.jsx";
import DeveloperStatus from "./components/DeveloperStatus/DeveloperStatus.jsx";
import Arcade from "./components/Arcade/Arcade.jsx";
import BirthdayMessage from "./components/BirthdayMessage/BirthdayMessage.jsx";
import Confetti from "./components/Confetti/Confetti.jsx";
import ToastHost from "./components/Toast/ToastHost.jsx";
import { burstConfetti, toast } from "./lib/fx.js";

export default function App() {
  // boot → welcome → leaving → party
  const [phase, setPhase] = useState("boot");
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [eggTaps, setEggTaps] = useState(0);
  const audioRef = useRef(null);
  const confettiRef = useRef(null);

  useEffect(() => {
    const audio = new Audio(asset(config.song));
    audio.loop = true;
    audio.preload = "auto";
    audioRef.current = audio;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    return () => {
      audio.pause();
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, []);

  // Start loading the first photo while the welcome screen is up.
  useEffect(() => {
    if (config.photos[0]) {
      const img = new Image();
      img.src = config.photos[0].src;
    }
  }, []);

  const handleBootDone = useCallback(() => setPhase("welcome"), []);

  const handleStart = useCallback(() => {
    setPhase((prev) => {
      if (prev !== "welcome") return prev;
      audioRef.current?.play().catch(() => {});
      const confetti = confettiRef.current;
      confetti?.burst({ count: 140 });
      setTimeout(() => confetti?.burst({ count: 90, x: 0.3 }), 450);
      setTimeout(() => confetti?.burst({ count: 90, x: 0.7 }), 700);
      setTimeout(() => setPhase("party"), 750);
      return "leaving";
    });
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) audio.play().catch(() => {});
    else audio.pause();
  }, []);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
    setMuted(audio.muted);
  }, []);

  const restartSong = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }, []);

  const music = { playing, toggle: togglePlay, restart: restartSong };

  // Easter egg: tap the footer cake 5 times.
  const footerEgg = () => {
    const next = eggTaps + 1;
    if (next >= 5) {
      setEggTaps(0);
      burstConfetti({ count: 130 });
      toast("Achievement unlocked: Chief Birthday Officer!", "🏅");
    } else {
      setEggTaps(next);
      if (next === 3) toast("keep tapping… 👀");
    }
  };

  const showMain = phase === "leaving" || phase === "party";

  return (
    <div className="app">
      {phase === "boot" && <BootScreen onDone={handleBootDone} />}

      {showMain && (
        <>
          <Navbar config={config} />
          <main>
            <BirthdayHero config={config} />
            <PhotoSlideshow photos={config.photos} />
            <section id="developer" className="section">
              <p className="eyebrow">💻 Developer Mode</p>
              <h2>
                Things He Loves <span className="heart">❤️</span>
              </h2>
              <p className="section-sub">Go ahead — click everything. He would.</p>
              <div className="tech-grid">
                <SmartWatch
                  messages={config.smartwatchMessages}
                  notifications={config.watchNotifications}
                  music={music}
                />
                <Laptop />
                <WebsiteButton ideas={config.buildIdeas} />
              </div>
              <ToyShelf music={music} />
              <DeveloperStatus />
            </section>
            <Arcade />
            <BirthdayMessage config={config} />
          </main>
          <footer className="footer">
            <button className="footer-cake" onClick={footerEgg} aria-label="A mysterious cake">
              🎂
            </button>
            <p>
              Made with <span aria-hidden="true">❤️</span>, ☕ &amp; a questionable sleep
              schedule — for {config.name}&apos;s birthday
            </p>
          </footer>
          <MusicPlayer
            playing={playing}
            muted={muted}
            onToggle={togglePlay}
            onMuteToggle={toggleMute}
            onRestart={restartSong}
          />
        </>
      )}

      {(phase === "welcome" || phase === "leaving") && (
        <WelcomeScreen
          config={config}
          leaving={phase === "leaving"}
          onStart={handleStart}
        />
      )}

      <Confetti ref={confettiRef} />
      <ToastHost />
    </div>
  );
}
