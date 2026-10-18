import React, { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/anim';
import StarField from './StarField';
import DecryptedText from './reactbits/DecryptedText';

const SCENES = [
  {
    chapter: 'Scene 01',
    title: 'Born from a Teapot’s Steam',
    subtitle: 'Where Nimbus Came From',
    body: 'On a drizzly autumn dusk, an old grandmother brewed a kettle of chamomile tea with two drops of star-blossom honey. As the steam whistled up toward the open window, the cool night breeze wrapped it in a sleepy swirl. Instead of vanishing, the steam giggled, yawned, and blinked two glowing amber eyes. Nimbus was born!',
    accent: '☕ Chamomile Tea & Starhoney',
    icon: '✨',
  },
  {
    chapter: 'Scene 02',
    title: 'Apprentice to the Night Sky',
    subtitle: 'The Craft of Cloud Painting',
    body: 'Nimbus couldn’t make thunderclaps — far too noisy, they hurt little ears. Instead, Nimbus learned that soft puffs of marshmallow mist could cushion restless thoughts. By gathering stray moonlight and humming gentle pentatonic tunes, Nimbus discovered how to weave warm rainbow dreams into soft bedtime showers.',
    accent: '🌈 Rainbow Dream Weaving',
    icon: '🎨',
  },
  {
    chapter: 'Scene 03',
    title: 'The Midnight Slumber Mission',
    subtitle: 'A Purpose Every Evening',
    body: 'Now, as the clock chimes 17:17 IST, Nimbus floats across roof tiles, chimney tops, and sleepy trees. With a pocket full of firefly jars and starlight lullabies, Nimbus makes sure no little creature — human, puppy, kitten, or friendly skull baby — ever faces the dark alone. Every good thing starts small.',
    accent: '🌙 Sweet Dreams Forever',
    icon: '💖',
  },
];

export default function StoryScenes({ soundFX }) {
  const sectionRef = useRef(null);
  const frameRef = useRef(null);
  const stackRef = useRef(null);
  const avatarRef = useRef(null);
  const progressRef = useRef(null);
  const triggerRef = useRef(null);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const frame = frameRef.current;
      if (!section || !frame) return undefined;

      if (prefersReducedMotion()) {
        frame.closest('section')?.classList.add('story-static');
        return undefined;
      }

      const slides = gsap.utils.toArray('.story-slide', stackRef.current);
      const mm = gsap.matchMedia();

      const build = (distance) => {
        gsap.set(slides, { autoAlpha: 0 });
        gsap.set(slides[0], { autoAlpha: 1 });

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: `+=${distance}`,
            pin: frame,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (progressRef.current) {
                progressRef.current.style.transform = `scaleX(${self.progress})`;
              }
              const idx = self.progress < 0.34 ? 0 : self.progress < 0.68 ? 1 : 2;
              if (idx !== activeRef.current) {
                activeRef.current = idx;
                setActive(idx);
              }
            },
          },
        });

        // Drifting atmosphere + travelling character
        tl.fromTo('[data-story-orb]', { yPercent: -6, scale: 1 }, { yPercent: 10, scale: 1.15 }, 0)
          .fromTo(avatarRef.current, { x: '-40vw', y: '14vh', rotate: -10 }, { x: '-4vw', y: '-4vh', rotate: 8 }, 0)
          .to(avatarRef.current, { x: '32vw', y: '-18vh', rotate: -6 }, 0.5)
          .fromTo('[data-story-glow="a"]', { opacity: 0.25, scale: 0.85 }, { opacity: 0.85, scale: 1.15 }, 0)
          .fromTo('[data-story-glow="b"]', { opacity: 0.1, scale: 0.9 }, { opacity: 0.7, scale: 1.2 }, 0.34)
          .fromTo('[data-story-glow="c"]', { opacity: 0.1, scale: 0.9 }, { opacity: 0.8, scale: 1.25 }, 0.68);

        // Scene 0 lines in, then out
        tl.fromTo(gsap.utils.toArray('[data-line="0"]', stackRef.current), { y: 34, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.14, stagger: 0.025 }, 0)
          .to(slides[0], { autoAlpha: 0, y: -30, duration: 0.07 }, 0.27);

        // Scene 1 in, out
        tl.fromTo(slides[1], { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.08 }, 0.32)
          .fromTo(gsap.utils.toArray('[data-line="1"]', stackRef.current), { y: 34, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.12, stagger: 0.025 }, 0.33)
          .to(slides[1], { autoAlpha: 0, y: -30, duration: 0.07 }, 0.61);

        // Scene 2 in (stays)
        tl.fromTo(slides[2], { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.08 }, 0.66)
          .fromTo(gsap.utils.toArray('[data-line="2"]', stackRef.current), { y: 34, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.12, stagger: 0.025 }, 0.67);

        return tl;
      };

      mm.add('(min-width: 768px)', () => {
        const tl = build('260%');
        triggerRef.current = tl.scrollTrigger;
      });
      mm.add('(max-width: 767px)', () => {
        const tl = build('170%');
        triggerRef.current = tl.scrollTrigger;
      });

      return () => {
        mm.revert();
        triggerRef.current = null;
        ScrollTrigger.refresh();
      };
    },
    { scope: sectionRef },
  );

  const goToChapter = (i) => {
    const st = triggerRef.current;
    soundFX?.playChime(523.25 + i * 110);
    if (!st) {
      document.getElementById('story')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    const span = st.end - st.start;
    const frac = i === 0 ? 0.02 : i === 1 ? 0.5 : 0.98;
    window.scrollTo({ top: st.start + span * frac, behavior: 'smooth' });
  };

  return (
    <section
      id="story"
      ref={sectionRef}
      className="band theme-night relative"
      aria-label="Nimbus's origin story — a three-chapter bedtime scroll"
    >
      <div ref={frameRef} className="story-frame relative h-[100svh] overflow-hidden">
        {/* Night atmosphere */}
        <StarField count={70} seed={11} layer="story" className="opacity-70" />
        <div
          data-story-orb
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
        >
          <div
            data-story-glow="a"
            className="absolute left-[8%] top-[12%] h-[42vw] w-[42vw] max-h-[520px] max-w-[520px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(143,157,255,0.35), transparent 68%)' }}
          />
          <div
            data-story-glow="b"
            className="absolute right-[6%] top-[34%] h-[40vw] w-[40vw] max-h-[500px] max-w-[500px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(232,160,189,0.3), transparent 68%)' }}
          />
          <div
            data-story-glow="c"
            className="absolute bottom-[6%] left-[34%] h-[38vw] w-[38vw] max-h-[480px] max-w-[480px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(232,182,76,0.26), transparent 70%)' }}
          />
        </div>

        <div className="shell relative z-10 flex h-full flex-col justify-between py-10 md:py-12">
          {/* Header */}
          <header className="max-w-3xl">
            <span className="ins-label text-[color:var(--band-accent)]">The Bedtime Storybook · Origin Tale</span>
            <h2 className="display mt-2 text-3xl text-[color:var(--band-fg)] md:text-5xl">
              <DecryptedText
                text="How Nimbus Got Their Nightcap"
                animateOn="view"
                sequential
                revealDirection="start"
                speed={40}
                maxIterations={12}
                scrambleColor="var(--band-accent)"
                characters="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
              />
            </h2>
            <div className="mt-5 h-px w-full overflow-hidden bg-[color:var(--band-line)]" data-story-progress>
              <div
                ref={progressRef}
                className="h-full w-full origin-left bg-[color:var(--band-accent)]"
                style={{ transform: 'scaleX(0)' }}
              />
            </div>
          </header>

          {/* Chapter slides */}
          <div ref={stackRef} className="relative my-6 min-h-[300px] flex-1 md:min-h-[320px]">
            {SCENES.map((s, i) => (
              <article
                key={s.chapter}
                className="story-slide absolute inset-0 flex max-w-2xl flex-col justify-center gap-4 md:max-w-3xl"
              >
                <div data-line={i} className="flex items-center gap-3">
                  <span className="sticker text-2xl" aria-hidden="true">{s.icon}</span>
                  <span className="ins-label text-[color:var(--band-accent)]">
                    {s.chapter} · {s.subtitle}
                  </span>
                </div>
                <h3 data-line={i} className="display text-2xl text-[color:var(--band-fg)] md:text-4xl">
                  {s.title}
                </h3>
                <p data-line={i} className="font-bubbly text-[13px] leading-relaxed text-[color:var(--band-muted)] md:text-base">
                  {s.body}
                </p>
                <span data-line={i} className="sticker w-fit font-mono text-[11px] text-[color:var(--band-accent)]">
                  {s.accent}
                </span>
              </article>
            ))}
          </div>

          {/* Chapter rail */}
          <footer className="flex flex-wrap items-center gap-3 md:gap-4" data-story-rail>
            {SCENES.map((s, i) => (
              <button
                key={s.chapter}
                type="button"
                onClick={() => goToChapter(i)}
                aria-current={active === i ? 'true' : undefined}
                className={`tactile flex items-center gap-2 rounded-full border px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors ${
                  active === i
                    ? 'border-[color:var(--band-accent)] bg-[color:var(--band-accent-soft)] text-[color:var(--band-accent)]'
                    : 'border-[color:var(--band-line)] text-[color:var(--band-muted)] hover:text-[color:var(--band-fg)]'
                }`}
              >
                <span className="hidden sm:inline">{s.chapter}</span>
                <span className="sm:hidden">{String(i + 1).padStart(2, '0')}</span>
              </button>
            ))}
            <span className="ml-auto hidden font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--band-muted)] md:block">
              Chapter {String(active + 1).padStart(2, '0')} / 03 · scroll to turn the page
            </span>
          </footer>
        </div>

        {/* Travelling character */}
        <div
          ref={avatarRef}
          data-story-avatar
          className="pointer-events-none absolute left-1/2 top-1/2 z-20 -ml-10 -mt-10 md:-ml-12 md:-mt-12"
          aria-hidden="true"
        >
          <span className="animate-float-slow block">
            <span
              className="grid h-20 w-20 place-items-center rounded-full text-5xl md:h-24 md:w-24"
              style={{
                background: 'radial-gradient(circle at 35% 30%, #ffffff, #dbe8ff 68%, #a1c4fd)',
                boxShadow: '0 0 40px rgba(161,196,253,0.55)',
              }}
            >
              ☁️
            </span>
          </span>
        </div>
      </div>
    </section>
  );
}
