import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { useGSAP } from '@gsap/react';
import { useSoundFX } from './hooks/useSoundFX';
import { useScrollReveal } from './hooks/useScrollReveal';
import { ScrollTrigger } from './lib/anim';
import SparkleTrail from './components/SparkleTrail';
import RetroHeader from './components/RetroHeader';
import CustomCursor from './components/CustomCursor';
import IntroOverlay from './components/IntroOverlay';
import ScrollProgress from './components/ScrollProgress';
import Hero from './components/Hero';
import CharacterFile from './components/CharacterFile';
import ProjectsShowcase from './components/ProjectsShowcase';
import StoryScenes from './components/StoryScenes';
import ClosingScene from './components/ClosingScene';
import EasterEggModal from './components/EasterEggModal';

export default function App() {
  const [isNight, setIsNight] = useState(false);
  const [sparkTrailActive, setSparkTrailActive] = useState(true);
  const [isRaining, setIsRaining] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const soundFX = useSoundFX();

  const characterRef = useRef(null);
  const projectsRef = useRef(null);
  const closingRef = useRef(null);

  // Synchronize dark class to <html> for Tailwind
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isNight);
  }, [isNight]);

  // Lock scroll while the (very short) intro plays
  useEffect(() => {
    document.body.style.overflow = introDone ? '' : 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [introDone]);

  // Scroll-triggered reveals for the bands that use [data-reveal]
  useScrollReveal(characterRef);
  useScrollReveal(projectsRef);
  useScrollReveal(closingRef);

  // Refresh ScrollTrigger once fonts/layout settle (web-font reflow changes
  // measured positions after triggers were created — matters for pinning)
  useGSAP(() => {
    let cancelled = false;
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(() => {
      if (!cancelled) refresh();
    });
    if (document.readyState === 'complete') refresh();
    else window.addEventListener('load', refresh, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener('load', refresh);
    };
  }, []);

  // Refresh again after the intro unlocks body scroll (scrollbar/layout shift)
  useEffect(() => {
    if (!introDone) return undefined;
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 80);
    return () => window.clearTimeout(id);
  }, [introDone]);

  // Handle poking Nimbus
  const pokeTimeoutRef = useRef(null);
  useEffect(() => () => window.clearTimeout(pokeTimeoutRef.current), []);

  const handlePokeNimbus = (e) => {
    setIsRaining(true);
    soundFX.playRainDrop();
    soundFX.playChime(783.99);
    const clientX = e.clientX ?? window.innerWidth / 2;
    const clientY = e.clientY ?? window.innerHeight / 2;
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { x: clientX / window.innerWidth, y: clientY / window.innerHeight },
      colors: ['#a1c4fd', '#c2b6f7', '#ffd1a4', '#a8e6cf'],
    });
    window.clearTimeout(pokeTimeoutRef.current);
    pokeTimeoutRef.current = window.setTimeout(() => setIsRaining(false), 2000);
  };

  return (
    // overflow-x-clip (NOT hidden): hidden would compute overflow-y to auto,
    // creating a scroll container where the sticky header can never stick.
    <div className="band relative min-h-screen overflow-x-clip selection:bg-berry selection:text-white">
      {/* Keyboard skip link */}
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      {/* Short, skippable page-load intro */}
      {!introDone && <IntroOverlay onDone={() => setIntroDone(true)} />}

      {/* Scroll progress ribbon + atmosphere */}
      <ScrollProgress />
      <div className="grain-layer" aria-hidden="true" />

      {/* Sparkle Cursor Trail (Side Quest +2 pts) */}
      <SparkleTrail active={sparkTrailActive} />

      {/* Nimbus custom character cursor */}
      <CustomCursor active />

      {/* Global Retro Header & Controls */}
      <RetroHeader
        isNight={isNight}
        setIsNight={setIsNight}
        soundFX={soundFX}
        sparkTrailActive={sparkTrailActive}
        setSparkTrailActive={setSparkTrailActive}
      />

      <main id="main-content" tabIndex={-1}>
        <Hero
          onPoke={handlePokeNimbus}
          isRaining={isRaining}
          isNight={isNight}
          soundFX={soundFX}
          introDone={introDone}
        />

        <div ref={characterRef}>
          <CharacterFile />
        </div>

        <div ref={projectsRef}>
          <ProjectsShowcase soundFX={soundFX} />
        </div>

        <StoryScenes soundFX={soundFX} />

        <div ref={closingRef}>
          <ClosingScene soundFX={soundFX} />
        </div>

        {/* Secret Easter Egg */}
        <EasterEggModal soundFX={soundFX} />
      </main>

      {/* Footer continues the closing night sky rather than snapping to a new bar */}
      <footer className="band theme-night border-t border-[color:var(--band-line)]">
        <div className="shell py-10 text-center font-mono text-xs text-[color:var(--band-muted)]">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="sticker text-[color:var(--band-accent)]">Made with 💖 for haX.baby</span>
            <span className="sticker">Best viewed on any cozy screen</span>
            <span className="sticker">100% Client-Side Web Audio</span>
          </div>
          <p className="mt-4">
            Baby’s First Website Hackathon (17–19 October 2026) · “Good things start small.”
          </p>
        </div>
      </footer>
    </div>
  );
}
