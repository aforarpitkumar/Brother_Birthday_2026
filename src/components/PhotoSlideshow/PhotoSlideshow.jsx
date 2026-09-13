import { useCallback, useEffect, useRef, useState } from "react";
import "./PhotoSlideshow.css";

const AUTO_MS = 4600;

export default function PhotoSlideshow({ photos }) {
  const [index, setIndex] = useState(0);
  // Only render photos up to "current + 1" so images load lazily.
  const [rendered, setRendered] = useState(Math.min(2, photos.length));
  const touchX = useRef(null);

  const goTo = useCallback(
    (n) => {
      const next = ((n % photos.length) + photos.length) % photos.length;
      setIndex(next);
      setRendered((r) => Math.max(r, Math.min(next + 2, photos.length)));
    },
    [photos.length]
  );

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    const id = setInterval(() => {
      if (!document.hidden) goTo(index + 1);
    }, AUTO_MS);
    return () => clearInterval(id);
  }, [index, goTo]);

  const current = photos[index];

  return (
    <section id="memories" className="section">
      <p className="eyebrow">📸 Memories</p>
      <h2>Through the Years</h2>
      <p className="section-sub">Sit back — the highlights reel plays itself.</p>

      <div
        className="slideshow"
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current == null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 42) (dx < 0 ? next : prev)();
          touchX.current = null;
        }}
      >
        <div className="slideshow-frame">
          {photos.slice(0, rendered).map((photo, i) => (
            <img
              key={photo.src}
              src={photo.src}
              alt={photo.caption || `Photo ${i + 1}`}
              className={`slide ${i === index ? "is-active" : ""}`}
              loading={i === 0 ? "eager" : "lazy"}
              draggable="false"
            />
          ))}

          <button className="slide-btn slide-btn--prev" onClick={prev} aria-label="Previous photo">
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button className="slide-btn slide-btn--next" onClick={next} aria-label="Next photo">
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className="slideshow-meta">
          <p className="slideshow-caption">{current?.caption}</p>
          <div className="slideshow-controls">
            <div className="slideshow-dots" role="tablist" aria-label="Choose photo">
              {photos.map((photo, i) => (
                <button
                  key={photo.src}
                  className={`dot ${i === index ? "is-active" : ""}`}
                  onClick={() => goTo(i)}
                  aria-label={`Go to photo ${i + 1}`}
                />
              ))}
            </div>
            <span className="slideshow-count">
              {index + 1} / {photos.length}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
