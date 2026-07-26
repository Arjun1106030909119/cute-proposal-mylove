# Happy Birthday + Love Proposal Website 💕

A premium, cinematic birthday and love proposal experience built with Next.js 15, featuring Apple-quality animations, 3D elements, and an emotional interactive story.

## Tech Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **Framer Motion** — UI animations
- **GSAP** — Advanced motion (available for extension)
- **Three.js / React Three Fiber** — 3D birthday cake
- **Shadcn UI** — Button components
- **Lucide Icons**
- **Canvas Confetti** — Celebration effects
- **Lenis** — Smooth scrolling

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Personalization Guide

Search for `PERSONALIZE` comments throughout the codebase to find all customizable content:

| Section | File | What to Change |
|---------|------|----------------|
| Timeline | `src/components/Timeline.tsx` | Photos, dates, story text |
| Reasons | `src/components/Reasons.tsx` | Reasons you like them |
| Gallery | `src/components/Gallery.tsx` | Photo paths and captions |
| Cake Wish | `src/components/Cake.tsx` | Birthday wish message |
| Love Letter | `src/components/LoveLetter.tsx` | Full love letter text |
| Birthday Wishes | `src/components/BirthdayWishes.tsx` | Wish messages |
| Music | `src/components/MusicPlayer.tsx` | Playlist tracks |
| Footer | `src/components/Footer.tsx` | Your names/message |
| Photos | `public/images/` | Your personal photos |
| Music | `public/music/` | Background music (.mp3) |

## Project Structure

```
src/
├── app/              # Next.js app router
├── components/       # All UI sections
│   ├── background/   # Starry sky, aurora, particles
│   └── ui/           # Shadcn button
├── hooks/            # Custom React hooks
├── lib/              # Utilities
└── utils/            # Animation & confetti helpers
public/
├── images/           # Your photos
└── music/            # Background music
```

## Features

- ✨ Cinematic loading screen with animated heart
- 🌙 Starry night hero with typewriter effect
- 📖 Horizontal scrolling love story timeline
- 💝 Floating glass "reasons" cards with 3D tilt
- 📸 Polaroid photo gallery with drag & lightbox
- 🎂 Interactive 3D birthday cake with candles
- 💌 Animated envelope love letter
- 🌌 Click-to-sparkle interactive sky
- 🎵 Floating music player (starts after interaction)
- 🎆 Birthday wishes with petals & butterflies
- 💕 Galaxy proposal section with confetti
- ♿ Full accessibility & reduced-motion support

## Build for Production

```bash
npm run build
npm start
```

## License

Private — made with love ❤️
"# cute-proposal-love" 
