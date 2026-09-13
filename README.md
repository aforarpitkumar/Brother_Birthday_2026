# 🎂 Birthday Website — for Ankur Bhaiya

A cute, minimal, interactive birthday website. It opens with a fake developer
boot screen, plays his birthday song, runs a photo slideshow, and is full of
clickable tech toys (smartwatch, laptop that writes code, a toy, and a
"what should we build today" generator).

Built with **React + Vite**, no backend, no external services. Deploys free on
**GitHub Pages**.

---

## 1. Run it locally

```bash
npm install
npm run dev
```

Then open the printed URL (usually http://localhost:5173).

## 2. Put in YOUR photos and song 📸🎵

Everything you need to change lives in two places:

### Photos → `src/assets/photos/` (auto-discovered ✨)

Just drop any images into this folder — the website finds them **automatically**
and adds them to the slideshow (sorted by file name). No code, no config:

```
src/assets/photos/
├── photo-01.jpg
├── photo-02.jpg
├── my-holiday.png     ← any name works, any .jpg/.jpeg/.png/.webp
└── ...
```

Want a custom caption for a specific photo? Open `src/config.js` and add it
under `captions` (keyed by file name). Photos without a custom caption get a
random funny one from the built-in list. Landscape photos look best; the
slideshow uses `object-fit: cover` so images never look stretched.

### Song → `public/assets/audio/birthday-song.mp3`

Replace the file with your own song using exactly this name:

```
public/assets/audio/birthday-song.mp3
```

(Or use another name/folder and point the `song` path in the config at it.)

### Name, messages & everything else → `src/config.js`

Open `src/config.js` — it's one small file with comments, and it controls
everything:

| What                    | Config key                                    |
| ----------------------- | --------------------------------------------- |
| His name                | `name`, `shortName`                           |
| Welcome subtitle        | `subtitle`                                    |
| Custom photo captions   | `captions` (optional, keyed by file name)     |
| Song location           | `song`                                        |
| Smartwatch messages     | `smartwatchMessages`                          |
| Watch notifications     | `watchNotifications`                          |
| "What should we build" ideas | `buildIdeas`                             |
| Final message text      | `message`                                     |

## 3. Deploy to GitHub Pages (free) 🚀

The repo already includes the workflow file
`.github/workflows/deploy.yml` — deployment is automatic on every push.

One-time setup:

1. Create a new repository on GitHub (e.g. `birthday-website`), and push this
   folder's contents to the `main` branch:

   ```bash
   git init
   git add .
   git commit -m "Happy birthday 🎂"
   git branch -M main
   git remote add origin https://github.com/<your-username>/birthday-website.git
   git push -u origin main
   ```

2. On GitHub, open the repo → **Settings** → **Pages** → under **Build and
   deployment**, set **Source** to **GitHub Actions**.

3. Done. Every push to `main` builds and publishes automatically. The site
   will be live at:

   ```
   https://<your-username>.github.io/birthday-website/
   ```

> The Vite config uses `base: "./"`, so the site works at any repository
> sub-path — no extra configuration needed if you rename the repo.

To publish photo/song changes later, just commit and push:

```bash
git add src/assets/photos
git commit -m "Add real photos"
git push
```

## 4. What's inside (for the curious) 🔍

**Things He Loves ❤️** — everything is a toy:

- ⌚ **Smartwatch** — opens a full watch UI: 3 tap-to-switch faces (digital,
  analog, birthday), step tracker, heart rate, weather, a music player that
  controls the real song, a fake video player ("Bhaiya Sleeping — Director's
  Cut 😴 (4K)"), and a notifications inbox.
- 💻 **Laptop** — boots a fake developer desktop: VS Code (live typing +
  "Build successful! 🎉"), a Terminal that narrates itself, an AI agent
  ("Antigravity") that center divs for Mom, Cloud Code, and a rocket Deploy
  animation.
- 🚗 **Toy Shelf** — a remote-control car you actually drive (d-pad + horn),
  a handheld console (A = jump, B = secrets), a robot with opinions, and a
  smart speaker that plays/pauses the song.

**Bhaiya Arcade 🎮** — three games built for touch:

1. **Catch the Gadgets** — drag the basket, catch falling tech (⭐ = +5).
2. **Dodge Mom's Chores** — survive dishes, vegetables and "GET UP!".
3. **Build a Website** — tap the build steps in order; three clients, ending
   in BUILD SUCCESSFUL 🎉.

All games have scores, a saved best score, restart, keyboard support on
desktop and touch controls on mobile.

**Easter eggs 🥚** — a few, as requested. Tap things that don't look
tappable. Especially cakes.

## 5. Project structure

```
birthday-website/
├── public/
│   └── assets/
│       └── audio/             ← your song goes here (birthday-song.mp3)
├── src/
│   ├── assets/
│   │   └── photos/            ← ✨ drop photos here — auto-discovered
│   ├── components/
│   │   ├── BootScreen/        ← funny "Installing Happiness…" terminal
│   │   ├── WelcomeScreen/     ← birthday greeting + Start button
│   │   ├── BirthdayHero/      ← post-start hero section
│   │   ├── PhotoSlideshow/    ← auto-playing slideshow with captions
│   │   ├── MusicPlayer/       ← floating play/pause · mute · restart
│   │   ├── SmartWatch/        ← full watch UI: faces + 6 apps
│   │   ├── Laptop/            ← dev desktop: VS Code, Terminal, Antigravity,
│   │   │                         Cloud Code, rocket Deploy
│   │   ├── WebsiteButton/     ← random "website for…" idea generator
│   │   ├── ToyShelf/          ← RC car, handheld console, robot, speaker
│   │   ├── Arcade/            ← 3 mini games (catch, dodge, build)
│   │   ├── DeveloperStatus/   ← SYSTEM STATUS progress bars
│   │   ├── BirthdayMessage/   ← the emotional bit ❤️
│   │   ├── Confetti/          ← canvas confetti (no libraries)
│   │   ├── Modal/ + Toast/    ← shared building blocks
│   │   └── Navbar/            ← top nav + mobile bottom tab bar
│   ├── App.jsx
│   ├── App.css
│   ├── config.js              ← ✏️ EDIT THIS to personalize everything
│   └── main.jsx
├── .github/workflows/deploy.yml  ← GitHub Pages auto-deploy
├── index.html
├── vite.config.js
└── package.json
```

## 5. Tips

- **Sound**: browsers block autoplay, so the song starts only after the
  "Start the Birthday 🎉" button is clicked — this is intentional.
- **Photos**: landscape (e.g. 1600×1000 or 4:3) crops least; the slideshow
  uses `object-fit: cover` so images never look stretched.
- **Big files**: the song is ~4 MB; keep photos reasonably sized (a few
  hundred KB each) so the site loads fast even on mobile data.

Happy birthday to Bhaiya! 🎂❤️
