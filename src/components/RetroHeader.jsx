import React, { useState, useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { Volume2, VolumeX, Moon, Sun, Sparkles } from 'lucide-react';
import { ScrollTrigger } from '../lib/anim';
import CountUp from './reactbits/CountUp';

const NAV_LINKS = [
  { id: 'hero', label: 'Home' },
  { id: 'character', label: 'The File' },
  { id: 'projects', label: 'Workshop' },
  { id: 'story', label: 'Story' },
  { id: 'guestbook', label: 'Guestbook' },
];

export default function RetroHeader({ isNight, setIsNight, soundFX, sparkTrailActive, setSparkTrailActive }) {
  const [hits, setHits] = useState(1048);
  const [activeSection, setActiveSection] = useState('hero');
  const headerRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('nimbus_visitor_count');
    const count = saved ? parseInt(saved, 10) + 1 : 1048;
    setHits(count);
    localStorage.setItem('nimbus_visitor_count', count.toString());
  }, []);

  // Publish header height as a CSS var (hero sizing + anchor scroll-margin
  // both depend on it, and the header grows to two rows on mobile)
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return undefined;
    const set = () =>
      document.documentElement.style.setProperty('--nimbus-header-h', `${el.offsetHeight}px`);
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Active section indicator: one deterministic pass that picks the section
  // whose top has most recently crossed the header line. Per-section
  // onToggle triggers can leave a stale highlight after a jump (and overlap
  // badly with the pinned story), so we resolve it from live rects instead.
  useGSAP(
    () => {
      const resolve = () => {
        const headerH = parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue('--nimbus-header-h'),
        ) || 64;
        const line = headerH + 48;
        let current = NAV_LINKS[0].id;
        for (const link of NAV_LINKS) {
          const el = document.getElementById(link.id);
          if (el && el.getBoundingClientRect().top <= line) current = link.id;
        }
        setActiveSection((prev) => (prev === current ? prev : current));
      };
      const st = ScrollTrigger.create({
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: resolve,
        onRefresh: resolve,
      });
      resolve();
      return () => st.kill();
    },
    { scope: headerRef },
  );

  const toggleTheme = () => {
    setIsNight((prev) => !prev);
    soundFX.playClick();
    soundFX.playChime(isNight ? 523.25 : 783.99);
  };

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-40 w-full backdrop-blur-md bg-cream-100/90 dark:bg-midnight-deep/90 border-b border-berry/15 dark:border-midnight-border transition-colors duration-300"
    >
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-2 flex-wrap">
        {/* Brand Lockup */}
        <a
          href="#hero"
          className="flex items-center gap-2.5 group tactile rounded-xl px-1"
          aria-label="Nimbus cloud — back to top"
          onClick={() => soundFX.playClick()}
        >
          <span className="text-2xl animate-float-slow" aria-hidden="true">
            ☁️
          </span>
          <span className="block">
            <span className="font-serif font-bold text-lg md:text-xl text-earth dark:text-cream-50 leading-tight block group-hover:text-berry transition-colors">
              Nimbus <span className="text-berry">.cloud</span>
            </span>
            <span className="text-[10px] font-mono text-stone-500 dark:text-stone-400 hidden sm:block">
              Junior Dream Engineer · Midnight Observatory
            </span>
          </span>
        </a>

        {/* Section Navigation — full-width second row on mobile, inline on md+ */}
        <nav
          className="order-3 w-full md:order-none md:w-auto md:mx-auto mt-1 md:mt-0 flex items-center justify-center gap-0.5 md:gap-1"
          aria-label="Section navigation"
        >
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={() => soundFX.playClick()}
                aria-current={isActive ? 'true' : undefined}
                className={`px-3.5 py-2 rounded-full text-xs font-mono font-semibold transition-all tactile ${
                  isActive
                    ? 'bg-berry text-white shadow-md shadow-berry/25'
                    : 'text-stone-500 dark:text-stone-400 hover:text-berry hover:bg-berry/10'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Vintage Visitor Odometer Side Quest (+1 pt) */}
        <div className="hidden lg:flex items-center gap-2 bg-stone-900 text-amber-400 px-3 py-1 rounded-lg font-mono text-xs border border-stone-800 shadow-inner">
          <span className="text-[10px] text-stone-400 uppercase tracking-widest">Visitors</span>
          <span className="font-bold tracking-widest" aria-label={`${hits} visitors`}>
            <CountUp
              to={hits}
              from={hits - 1}
              trigger="load"
              duration={1.6}
              mode="roll"
              easing="spring"
              replayOnHover
            />
          </span>
        </div>

        {/* Action Toggles */}
        <div className="flex items-center gap-2 ml-auto lg:ml-0">
          {/* Sparkle Trail Toggle (+2 pts) */}
          <button
            onClick={() => {
              setSparkTrailActive((p) => !p);
              soundFX.playClick();
            }}
            aria-pressed={sparkTrailActive}
            className={`px-2.5 py-2 rounded-xl border text-xs font-mono flex items-center gap-1.5 transition-all tactile ${
              sparkTrailActive
                ? 'bg-amber-400/20 border-amber-500 text-amber-700 dark:text-amber-300'
                : 'border-stone-300 dark:border-stone-700 opacity-60 hover:opacity-100'
            }`}
            title="Toggle Sparkle Cursor Trail"
          >
            <Sparkles size={14} aria-hidden="true" />
            <span className="hidden sm:inline">Sparkles</span>
          </button>

          {/* Day / Night Mood Shift Toggle */}
          <button
            onClick={toggleTheme}
            aria-label={isNight ? 'Switch to Day' : 'Switch to Night'}
            aria-pressed={isNight}
            className="p-2.5 rounded-xl border border-berry/30 bg-berry/5 hover:bg-berry/15 text-berry transition-all tactile"
            title="Day / Night Sleep Mode"
          >
            {isNight ? <Sun size={17} aria-hidden="true" /> : <Moon size={17} aria-hidden="true" />}
          </button>

          {/* Web Audio Mute Switch */}
          <button
            onClick={soundFX.toggleMute}
            aria-label={soundFX.isMuted ? 'Unmute sounds' : 'Mute sounds'}
            aria-pressed={soundFX.isMuted}
            className={`p-2.5 rounded-xl border transition-all tactile ${
              soundFX.isMuted
                ? 'border-red-400/50 bg-red-500/10 text-red-500'
                : 'border-berry/30 bg-berry/5 hover:bg-berry/15 text-berry'
            }`}
            title={soundFX.isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {soundFX.isMuted ? <VolumeX size={17} aria-hidden="true" /> : <Volume2 size={17} aria-hidden="true" />}
          </button>
        </div>
      </div>
    </header>
  );
}
