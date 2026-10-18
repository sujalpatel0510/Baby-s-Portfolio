import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { useGSAP } from '@gsap/react';
import { useSoundFX } from './hooks/useSoundFX';
import { useScrollReveal } from './hooks/useScrollReveal';
import { gsap, ScrollTrigger, prefersReducedMotion } from './lib/anim';
import SparkleTrail from './components/SparkleTrail';
import RetroHeader from './components/RetroHeader';
import CustomCursor from './components/CustomCursor';
import IntroOverlay from './components/IntroOverlay';
import ScrollProgress from './components/ScrollProgress';
import HoverTilt from './components/HoverTilt';
import NimbusAvatar from './components/NimbusAvatar';
import LullabyLab from './components/projects/LullabyLab';
import LanternGallery from './components/projects/LanternGallery';
import DeliveryRoutes from './components/projects/DeliveryRoutes';
import OriginStory from './components/OriginStory';
import Guestbook from './components/Guestbook';
import EasterEggModal from './components/EasterEggModal';
import { Sparkles, Award } from 'lucide-react';

export default function App() {
  const [isNight, setIsNight] = useState(false);
  const [sparkTrailActive, setSparkTrailActive] = useState(true);
  const [isRaining, setIsRaining] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const soundFX = useSoundFX();

  const heroRef = useRef(null);
  const projectsRef = useRef(null);
  const projectsGridRef = useRef(null);
  const storyRef = useRef(null);
  const guestbookRef = useRef(null);

  // Synchronize dark class to <html> for Tailwind
  useEffect(() => {
    if (isNight) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isNight]);

  // Lock scroll while the (very short) intro plays
  useEffect(() => {
    document.body.style.overflow = introDone ? '' : 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [introDone]);

  // Scroll-triggered section reveals
  useScrollReveal(projectsRef);
  useScrollReveal(storyRef);
  useScrollReveal(guestbookRef);

  // ---- Hero entrance (after intro) + scroll choreography ----
  useGSAP(() => {
    // Refresh ScrollTrigger once fonts/layout settle
    const refresh = () => ScrollTrigger.refresh();
    if (document.readyState === 'complete') refresh();
    else window.addEventListener('load', refresh, { once: true });

    if (!introDone || prefersReducedMotion()) return undefined;

    const els = heroRef.current?.querySelectorAll('[data-hero-anim]');
    if (els?.length) {
      gsap.from(els, {
        y: 36,
        opacity: 0,
        duration: 0.75,
        stagger: 0.09,
        ease: 'power2.out',
        delay: 0.05,
      });
    }
    return () => window.removeEventListener('load', refresh);
  }, [introDone]);

  // ---- Project cards entrance + parallax decor + story glow scrub ----
  useGSAP(() => {
    if (prefersReducedMotion()) return;

    const grid = projectsGridRef.current;
    if (grid?.children?.length) {
      gsap.from(grid.children, {
        y: 70,
        opacity: 0,
        scale: 0.96,
        duration: 0.85,
        ease: 'back.out(1.3)',
        stagger: 0.13,
        scrollTrigger: {
          trigger: grid,
          start: 'top 82%',
          toggleActions: 'play none none none',
        },
      });
    }

    // Floating decorations: varied-speed parallax (transform only)
    document.querySelectorAll('[data-float]').forEach((el) => {
      const speed = parseFloat(el.dataset.float) || 40;
      gsap.to(el, {
        y: -speed,
        ease: 'none',
        scrollTrigger: {
          trigger: el.closest('section') || el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    });

    // Story background glow responds to scroll progress
    const glow = storyRef.current?.querySelector('[data-story-glow]');
    if (glow) {
      gsap.fromTo(
        glow,
        { opacity: 0.2, scale: 0.92 },
        {
          opacity: 1,
          scale: 1.08,
          ease: 'none',
          scrollTrigger: {
            trigger: storyRef.current,
            start: 'top bottom',
            end: 'center center',
            scrub: true,
          },
        },
      );
    }

    // Occasional subtle reaction: hero stars twinkle softly
    gsap.to('.hero-twinkle', {
      opacity: 0.35,
      duration: 1.6,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      stagger: { each: 0.5, from: 'random' },
    });
  }, []);

  // Handle poking Nimbus
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
    setTimeout(() => setIsRaining(false), 2000);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        isNight ? 'bg-midnight-deep text-cream-100' : 'bg-cream-100 text-earth'
      } relative overflow-x-hidden selection:bg-berry selection:text-white`}
    >
      {/* Keyboard skip link */}
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      {/* Short, skippable page-load intro */}
      {!introDone && <IntroOverlay onDone={() => setIntroDone(true)} />}

      {/* Scroll progress ribbon */}
      <ScrollProgress />

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

      <main id="main-content">
        {/* ============ HERO: full-bleed, 100svh ============ */}
        <section
          id="hero"
          ref={heroRef}
          className="relative min-h-[100svh] flex items-center overflow-hidden"
          aria-label="Meet Nimbus"
        >
          {/* Edge-to-edge decorative atmosphere (no blur filters) */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div
              className="absolute -top-[12%] -left-[8%] w-[45vw] h-[45vw] max-w-[620px] max-h-[620px] rounded-full opacity-70"
              style={{ background: 'radial-gradient(circle, rgba(255,158,187,0.35), transparent 68%)' }}
            />
            <div
              className="absolute -bottom-[14%] -right-[6%] w-[42vw] h-[42vw] max-w-[580px] max-h-[580px] rounded-full opacity-70"
              style={{ background: 'radial-gradient(circle, rgba(161,196,253,0.4), transparent 68%)' }}
            />
            <div
              className="absolute top-[30%] right-[8%] w-[28vw] h-[28vw] max-w-[400px] max-h-[400px] rounded-full opacity-60"
              style={{ background: 'radial-gradient(circle, rgba(255,234,167,0.45), transparent 70%)' }}
            />

            {/* Sticker-like floating stars & clouds with parallax */}
            <span data-float="70" className="absolute top-[16%] left-[10%] text-xl md:text-2xl hero-twinkle">✦</span>
            <span data-float="120" className="absolute top-[26%] right-[18%] text-lg md:text-xl hero-twinkle">★</span>
            <span data-float="55" className="absolute bottom-[24%] left-[16%] text-lg md:text-2xl hero-twinkle">✧</span>
            <span data-float="95" className="absolute top-[62%] right-[7%] text-xl hero-twinkle">✦</span>
            <span data-float="40" className="absolute bottom-[14%] right-[30%] text-base opacity-70">☁️</span>
            <span data-float="80" className="absolute top-[10%] left-[38%] text-base opacity-70">🌙</span>
            <span data-float="60" className="absolute bottom-[32%] left-[44%] text-sm opacity-60">✨</span>
          </div>

          <div className="relative z-10 w-full max-w-[1400px] mx-auto px-5 sm:px-8 py-16 md:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
              {/* Left Text Column: Who Nimbus is */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                <div
                  data-hero-anim
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-berry/10 dark:bg-berry/20 text-berry font-mono text-xs font-bold tracking-wide border border-berry/20"
                >
                  <Sparkles size={14} aria-hidden="true" /> Baby’s First Portfolio · Track 2 (Original Baby)
                </div>

                <h1
                  data-hero-anim
                  className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-serif font-extrabold tracking-tight leading-[1.1] text-earth dark:text-cream-50"
                >
                  Meet <span className="text-berry italic">Nimbus</span>, the Sleepy Cloud.
                </h1>

                {/* Hand-drawn accent squiggle */}
                <svg
                  data-hero-anim
                  className="w-44 h-3.5 text-berry/70 mx-auto lg:mx-0 -mt-2"
                  viewBox="0 0 176 14"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 9C27 3 44 11 68 7s48-6 72-2 27 4 33 2"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>

                <p
                  data-hero-anim
                  className="text-base sm:text-lg text-stone-700 dark:text-stone-300 font-bubbly max-w-xl mx-auto lg:mx-0 leading-relaxed"
                >
                  Nimbus is a toddler weather sprite who crafts marshmallow rain, soothing nightlights,
                  and bedtime lullabies for little creatures who can’t fall asleep.
                </p>

                {/* Character Sheet Pills */}
                <div
                  data-hero-anim
                  className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-2"
                >
                  <span className="px-3 py-1.5 rounded-xl bg-white/80 dark:bg-midnight-card border border-berry/20 text-xs font-mono">
                    🧸 <strong>Species:</strong> Cumulus Dream Sprite
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-white/80 dark:bg-midnight-card border border-berry/20 text-xs font-mono">
                    ✨ <strong>Profession:</strong> Junior Dream Engineer
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-white/80 dark:bg-midnight-card border border-berry/20 text-xs font-mono">
                    🎀 <strong>Quirk:</strong> Giggles when tickled by stars
                  </span>
                </div>

                <div
                  data-hero-anim
                  className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-3"
                >
                  <a
                    href="#projects"
                    onClick={() => soundFX.playClick()}
                    className="px-6 py-3 bg-berry hover:bg-berry-dark text-white rounded-2xl text-sm font-bubbly font-bold shadow-lg transition-all hover:scale-105 active:scale-95 inline-flex items-center gap-2 tactile"
                  >
                    Explore Dream Projects ↓
                  </a>
                  <a
                    href="#origin-story"
                    onClick={() => soundFX.playClick()}
                    className="px-6 py-3 bg-white/80 dark:bg-midnight-card hover:bg-berry/10 text-berry border-2 border-berry/30 rounded-2xl text-sm font-bubbly font-bold transition-all tactile"
                  >
                    Read Origin Tale
                  </a>
                </div>
              </div>

              {/* Right Column: Interactive Nimbus Avatar */}
              <div data-hero-anim className="lg:col-span-5 flex justify-center">
                <NimbusAvatar onPoke={handlePokeNimbus} isRaining={isRaining} isNight={isNight} />
              </div>
            </div>
          </div>
        </section>

        {/* ============ SECTION 02: Projects (full-width band) ============ */}
        <section
          id="projects"
          ref={projectsRef}
          className="relative py-20 md:py-28 bg-cream-200/60 dark:bg-midnight-card/40 border-y border-berry/10 dark:border-midnight-border transition-colors duration-500"
        >
          {/* Full-bleed band decorations */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
            <span data-float="65" className="absolute top-8 left-[6%] text-xl text-amber-400/70">★</span>
            <span data-float="110" className="absolute top-16 right-[8%] text-lg text-berry/40">✦</span>
            <span data-float="50" className="absolute bottom-10 left-[48%] text-base text-sky-400/60">✧</span>
          </div>

          <div className="relative z-10 w-full max-w-[1400px] mx-auto px-5 sm:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 md:mb-14" data-reveal>
              <span className="px-3.5 py-1.5 bg-berry/10 dark:bg-berry/20 text-berry font-mono text-xs uppercase tracking-widest rounded-full font-bold inline-flex items-center gap-2">
                <Award size={14} aria-hidden="true" /> What Nimbus Does · 3 Showcase Inventions
              </span>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-earth dark:text-cream-50 mt-3">
                The Dream Workshop
              </h2>
              <p className="text-stone-600 dark:text-stone-300 text-sm mt-2">
                Every project is fully playable, sound-reactive, and designed with cozy early-web whimsy.
              </p>
            </div>

            {/* Project grid grows naturally across the viewport */}
            <div
              ref={projectsGridRef}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 items-stretch"
            >
              <HoverTilt label="Play the synth!" className="h-full">
                <LullabyLab soundFX={soundFX} />
              </HoverTilt>
              <HoverTilt label="Light a lantern" className="h-full">
                <LanternGallery soundFX={soundFX} />
              </HoverTilt>
              <HoverTilt label="Trace the route" className="h-full">
                <DeliveryRoutes soundFX={soundFX} />
              </HoverTilt>
            </div>
          </div>
        </section>

        {/* ============ SECTION 03: Origin Story (story scroll) ============ */}
        <div
          ref={storyRef}
          className="relative py-16 md:py-24 overflow-hidden transition-colors duration-500"
        >
          {/* Scroll-responsive story glow + stars */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div
              data-story-glow
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[60vw] max-w-[900px] max-h-[700px] rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(194,182,247,0.3), transparent 65%)' }}
            />
            <span data-float="90" className="absolute top-[12%] right-[10%] text-xl text-amber-400/70">✦</span>
            <span data-float="60" className="absolute top-[40%] left-[5%] text-lg text-berry/40">★</span>
            <span data-float="130" className="absolute bottom-[18%] right-[16%] text-lg text-sky-400/70">✧</span>
            <span data-float="45" className="absolute bottom-[8%] left-[30%] text-base opacity-60">☁️</span>
          </div>

          <div className="relative z-10">
            <OriginStory soundFX={soundFX} />
          </div>
        </div>

        {/* Side Quest: Guestbook */}
        <div ref={guestbookRef} className="relative overflow-hidden">
          <Guestbook soundFX={soundFX} />
        </div>

        {/* Secret Easter Egg */}
        <EasterEggModal soundFX={soundFX} />
      </main>

      {/* Early-Web Footer & Badges */}
      <footer className="w-full border-t border-berry/20 bg-cream-200/50 dark:bg-midnight-card/40 transition-colors duration-500">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 py-10 text-center font-mono text-xs text-stone-500 dark:text-stone-400 space-y-4">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="px-2.5 py-1 bg-berry/10 text-berry rounded border border-berry/20">
              Made with 💖 for haX.baby
            </span>
            <span className="px-2.5 py-1 bg-amber-500/10 text-amber-700 dark:text-amber-400 rounded border border-amber-500/20">
              Best viewed on any cozy screen
            </span>
            <span className="px-2.5 py-1 bg-sky-500/10 text-sky-700 dark:text-sky-300 rounded border border-sky-500/20">
              100% Client-Side Web Audio
            </span>
          </div>
          <p>Baby's First Website Hackathon (17–19 October 2026) · "Good things start small."</p>
        </div>
      </footer>
    </div>
  );
}
