import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useSoundFX } from './hooks/useSoundFX';
import SparkleTrail from './components/SparkleTrail';
import RetroHeader from './components/RetroHeader';
import NimbusAvatar from './components/NimbusAvatar';
import LullabyLab from './components/projects/LullabyLab';
import LanternGallery from './components/projects/LanternGallery';
import DeliveryRoutes from './components/projects/DeliveryRoutes';
import OriginStory from './components/OriginStory';
import Guestbook from './components/Guestbook';
import EasterEggModal from './components/EasterEggModal';
import { Sparkles, Heart, Award, ArrowUpRight, Cloud, Star } from 'lucide-react';

export default function App() {
  const [isNight, setIsNight] = useState(false);
  const [sparkTrailActive, setSparkTrailActive] = useState(true);
  const [isRaining, setIsRaining] = useState(false);
  const soundFX = useSoundFX();

  // Synchronize dark class to <html> for Tailwind
  useEffect(() => {
    if (isNight) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isNight]);

  // Handle poking Nimbus
  const handlePokeNimbus = (e) => {
    setIsRaining(true);
    soundFX.playRainDrop();
    soundFX.playChime(783.99);
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight },
      colors: ['#a1c4fd', '#c2b6f7', '#ffd1a4', '#a8e6cf'],
    });
    setTimeout(() => setIsRaining(false), 2000);
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      isNight ? 'bg-midnight-deep text-cream-100' : 'bg-cream-100 text-earth'
    } relative overflow-x-hidden selection:bg-berry selection:text-white`}>

      {/* Sparkle Cursor Trail (Side Quest +2 pts) */}
      <SparkleTrail active={sparkTrailActive} />

      {/* Global Retro Header & Controls */}
      <RetroHeader
        isNight={isNight}
        setIsNight={setIsNight}
        soundFX={soundFX}
        sparkTrailActive={sparkTrailActive}
        setSparkTrailActive={setSparkTrailActive}
      />

      {/* Hero Section: Character Identity & Introduction */}
      <main className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-20">
          {/* Left Text Column: Who Nimbus is */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-berry/10 dark:bg-berry/20 text-berry font-mono text-xs font-bold tracking-wide border border-berry/20">
              <Sparkles size={14} /> Baby’s First Portfolio · Track 2 (Original Baby)
            </div>

            <h1 className="text-4xl sm:text-6xl font-serif font-extrabold tracking-tight leading-[1.1] text-earth dark:text-cream-50">
              Meet <span className="text-berry italic">Nimbus</span>, the Sleepy Cloud.
            </h1>

            <p className="text-base sm:text-lg text-stone-700 dark:text-stone-300 font-bubbly max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Nimbus is a toddler weather sprite who crafts marshmallow rain, soothing nightlights, and bedtime lullabies for little creatures who can’t fall asleep.
            </p>

            {/* Character Sheet Pills */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-2">
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

            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <a
                href="#projects"
                onClick={() => soundFX.playClick()}
                className="px-6 py-3 bg-berry hover:bg-berry-dark text-white rounded-2xl text-sm font-bubbly font-bold shadow-lg transition-all hover:scale-105 active:scale-95 inline-flex items-center gap-2"
              >
                Explore Dream Projects ↓
              </a>
              <a
                href="#origin-story"
                onClick={() => soundFX.playClick()}
                className="px-6 py-3 bg-white/80 dark:bg-midnight-card hover:bg-berry/10 text-berry border-2 border-berry/30 rounded-2xl text-sm font-bubbly font-bold transition-all"
              >
                Read Origin Tale
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Nimbus Avatar */}
          <div className="lg:col-span-5 flex justify-center">
            <NimbusAvatar
              onPoke={handlePokeNimbus}
              isRaining={isRaining}
              isNight={isNight}
            />
          </div>
        </div>

        {/* Section 02: Projects Showcase (At least 3 projects) */}
        <section id="projects" className="py-12">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="px-3.5 py-1.5 bg-berry/10 dark:bg-berry/20 text-berry font-mono text-xs uppercase tracking-widest rounded-full font-bold inline-flex items-center gap-2">
              <Award size={14} /> What Nimbus Does · 3 Showcase Inventions
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-earth dark:text-cream-50 mt-3">
              The Dream Workshop
            </h2>
            <p className="text-stone-600 dark:text-stone-300 text-sm mt-2">
              Every project is fully playable, sound-reactive, and designed with cozy early-web whimsy.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <LullabyLab soundFX={soundFX} />
            <LanternGallery soundFX={soundFX} />
            <DeliveryRoutes soundFX={soundFX} />
          </div>
        </section>

        {/* Section 03: Origin Story (Bedtime Scroll, <150 words/scene) */}
        <OriginStory soundFX={soundFX} />

        {/* Side Quest: Guestbook */}
        <Guestbook soundFX={soundFX} />

        {/* Secret Easter Egg */}
        <EasterEggModal soundFX={soundFX} />

        {/* Early-Web Footer & Badges */}
        <footer className="mt-20 pt-8 border-t border-berry/20 text-center font-mono text-xs text-stone-500 dark:text-stone-400 space-y-4">
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
          <p>
            Baby's First Website Hackathon (17–19 October 2026) · "Good things start small."
          </p>
        </footer>
      </main>
    </div>
  );
}
