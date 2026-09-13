import "./MusicPlayer.css";

export default function MusicPlayer({ playing, muted, onToggle, onMuteToggle, onRestart }) {
  return (
    <div className="music" role="group" aria-label="Music controls">
      <button
        className={`music-disc ${playing ? "is-playing" : ""}`}
        onClick={onToggle}
        aria-label={playing ? "Pause song" : "Play song"}
        title={playing ? "Pause" : "Play"}
      >
        <span className="music-note" aria-hidden="true">♪</span>
      </button>

      <button
        className="music-btn"
        onClick={onMuteToggle}
        aria-label={muted ? "Unmute" : "Mute"}
        title={muted ? "Unmute" : "Mute"}
      >
        {muted ? (
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
            <path d="M16 9.5l5 5m0-5l-5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
            <path d="M16.5 8.5a5 5 0 010 7M19 6a8.5 8.5 0 010 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}
      </button>

      <button className="music-btn" onClick={onRestart} aria-label="Restart song" title="Restart song">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path d="M12 5V2L7 6l5 4V7a6 6 0 11-6 6H4a8 8 0 108-8z" fill="currentColor" />
        </svg>
      </button>
    </div>
  );
}
