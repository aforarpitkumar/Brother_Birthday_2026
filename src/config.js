/**
 * ─────────────────────────────────────────────────────────────
 *  EDIT THIS FILE TO PERSONALIZE THE WEBSITE ✏️
 *
 *  • Change the name, subtitle and messages below.
 *  • Photos: drop ANY images into  src/assets/photos/  — they are
 *    picked up automatically (sorted by file name). No code needed.
 *  • Song:   public/assets/audio/birthday-song.mp3
 * ─────────────────────────────────────────────────────────────
 */

const birthdayConfig = {
  // Brother's name (shown on the welcome screen and the hero)
  name: "Ankur Bhaiya",
  shortName: "Bhaiya",

  // Welcome screen subtitle
  subtitle: "The only developer who can build a website for literally everything.",

  // Start button label
  startButton: "Start the Birthday 🎉",

  // Song — file lives at public/assets/audio/birthday-song.mp3
  song: "/assets/audio/birthday-song.mp3",

  // Random messages shown on the smartwatch card + its notifications app
  smartwatchMessages: [
    "Time to build another website. 💻",
    "Mom says get up! 😤",
    "Coding streak: 999 days 🔥",
    "New gadget detected 👀",
    "Steps today: 12 (kitchen → desk)",
    "Hydration reminder: chai is not water ☕",
    "Reminder: you're awesome. Set automatically.",
  ],

  // Notifications inside the smartwatch (app: emoji, text, time label)
  watchNotifications: [
    { app: "📞", text: "Mom: GET UP!! (12th missed call)", time: "now" },
    { app: "👀", text: "New gadget detected nearby", time: "2m ago" },
    { app: "💬", text: "Dad: beta, remote de na 📺", time: "9m ago" },
    { app: "🔥", text: "Coding streak: 999 days — don't break it", time: "1h ago" },
    { app: "🛒", text: "Price drop on something you don't need", time: "3h ago" },
    { app: "🎂", text: "Birthday protocol: cake levels critical", time: "today" },
  ],

  // Random ideas for the “What should we build today?” generator
  buildIdeas: [
    "Website for Mom 🌷",
    "Website for the Birthday Cake 🎂",
    "Website for a Watch ⌚",
    "Website for Sleeping 😴",
    "Website for Eating 🍕",
    "Website for Doing Nothing 😂",
    "Website for Counting His Own Websites 🔢",
  ],

  // The emotional message at the end
  message: {
    heading: "For Our Favorite Developer",
    paragraphs: [
      "You're the guy who hears “someone should build an app for that” and has a working website by dinner. Funny, brilliant, and quietly the official tech support of the entire family.",
      "We love that you love watches, gadgets and keyboards a little more than most humans. We also love that “five more minutes” is your default setting — Mom has the receipts, and yes, you still irritate her daily. You're still her favorite. Don't tell the others.",
      "And that laziness? That's just highly efficient resting. Behind all the jokes is the one person this family simply can't do without. Stay exactly as you are.",
    ],
    chips: [
      "👨‍💻 Software Developer",
      "⌚ Gadget Collector",
      "😂 Chief Comedy Officer",
      "😴 Professional “5 more minutes”",
      "❤️ Family's Favorite",
    ],
    signOff: "Happy Birthday! 🎂❤️",
  },

  /**
   * Photos are AUTO-DISCOVERED from src/assets/photos/ below —
   * every .jpg/.png/.webp in that folder appears in the slideshow
   * (sorted by file name). You only need to edit anything here if
   * you want a custom caption for a specific photo:
   */
  captions: {
    // "photo-01.jpg": "One of the many legendary moments ❤️",
  },
};

// ── Photo auto-discovery (no need to touch anything below) ──
const photoFiles = import.meta.glob(
  "./assets/photos/*.{jpg,jpeg,png,webp}",
  { eager: true, import: "default" }
);

const defaultCaptions = [
  "Just another day of debugging life 😎",
  "One of the many legendary moments ❤️",
  "Main character energy, as always 😎",
  "Certified favorite child (Mom denies everything)",
  "New gadget acquired. Personality upgraded.",
  "The family's official tech support at work",
  "Too cool to explain 🕶️",
  "Peak performance mode: activated",
  "Mom's patience: under attack again 💀",
  "A rare photo of him not holding a device",
  "Some memories need no caption ❤️",
  "Legend. Icon. Professional sleeper 😴",
];

const photos = Object.entries(photoFiles)
  .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
  .map(([path, src], i) => {
    const file = path.split("/").pop();
    return {
      src,
      file,
      caption:
        birthdayConfig.captions[file] ??
        defaultCaptions[i % defaultCaptions.length],
    };
  });

birthdayConfig.photos = photos;

export default birthdayConfig;

/**
 * Resolves a config path like "/assets/audio/birthday-song.mp3" against the
 * site base URL, so it works locally AND on GitHub Pages project sites
 * (https://user.github.io/repo/).
 */
export const asset = (path) => import.meta.env.BASE_URL + path.replace(/^\//, "");
