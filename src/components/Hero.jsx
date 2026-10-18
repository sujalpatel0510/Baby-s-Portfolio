import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { Sparkles, Moon, ArrowDown } from 'lucide-react';
import { gsap, prefersReducedMotion } from '../lib/anim';
import NimbusAvatar from './NimbusAvatar';
import StarField from './StarField';
import ShinyText from './reactbits/ShinyText';
import StarBorder from './reactbits/StarBorder';
import Magnet from './reactbits/Magnet';

const TICKS = [
  { k: 'Shift', v: 'Nightly · 17:17 IST' },
  { k: 'Craft', v: 'Marshmallow Rain' },
  { k: 'Status', v: 'Awake (barely)' },
];

export default function Hero({ onPoke, isRaining, isNight, soundFX, introDone }) {
  const rootRef = useRef(null);

  useGSAP(
    () => {
      const layers = gsap.utils.toArray('[data-hero-layer]');
      layers.forEach((layer, i) => {
        gsap.to(layer, {
          y: (i + 1) * 46,
          ease: 'none',
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      });
    },
    { scope: rootRef },
  );

  useGSAP(
    () => {
      if (!introDone || prefersReducedMotion()) return;
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from('[data-hero-anim]', {
        y: 42,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        clearProps: 'opacity,transform',
      }).from(
        '[data-hero-avatar]',
        { scale: 0.82, opacity: 0, duration: 0.9, ease: 'back.out(1.4)', clearProps: 'opacity,transform' },
        0.1,
      );
    },
    { scope: rootRef, dependencies: [introDone] },
  );

  return (
    <section
      id="hero"
      ref={rootRef}
      className="band theme-night relative flex min-h-[calc(100svh-var(--nimbus-header-h,64px))] items-center overflow-hidden"
      aria-label="Meet Nimbus, the sleepy cloud"
      data-float-scope
    >
      {/* Atmosphere */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <StarField count={90} seed={3} layer="far" className="opacity-80" />
        <div
          data-hero-layer
          className="absolute -left-[10%] top-[-14%] h-[52vw] w-[52vw] max-h-[680px] max-w-[680px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(143,157,255,0.35), transparent 66%)' }}
        />
        <div
          data-hero-layer
          className="absolute -bottom-[18%] right-[-8%] h-[46vw] w-[46vw] max-h-[600px] max-w-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(232,160,189,0.32), transparent 66%)' }}
        />
        <div
          data-hero-layer
          className="absolute right-[12%] top-[18%] h-[26vw] w-[26vw] max-h-[360px] max-w-[360px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(232,182,76,0.28), transparent 70%)' }}
        />
        <span className="animate-sway absolute left-[46%] top-[8%] hidden text-3xl md:block">☁️</span>
        <span className="animate-float-reverse absolute bottom-[16%] left-[8%] text-2xl opacity-80">🌙</span>
      </div>

      <div className="shell relative z-10 py-16 md:py-20">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-6">
          {/* Left: the file header */}
          <div className="order-2 space-y-6 lg:order-1 lg:col-span-7">
            <span data-hero-anim className="sticker ins-label text-[color:var(--band-accent)]">
              <Sparkles size={12} aria-hidden="true" />
              <ShinyText
                text="Midnight Observatory · Subject File 001"
                color="var(--band-accent)"
                shineColor="#ffeaa7"
                speed={2.8}
                trigger="view"
                glow={0.4}
                shineWidth={28}
                softness={0.7}
              />
            </span>

            <h1
              data-hero-anim
              className="display text-[clamp(2.9rem,8.5vw,7rem)] text-[color:var(--band-fg)]"
            >
              <span className="block">Nimbus,</span>
              <span className="block italic text-[color:var(--band-accent)]">the Sleepy Cloud</span>
            </h1>

            <p
              data-hero-anim
              className="max-w-xl font-bubbly text-base leading-relaxed text-[color:var(--band-muted)] sm:text-lg"
            >
              A toddler weather sprite — Cumulus Dream Sprite by species, Junior Dream Engineer by
              trade — who crafts marshmallow rain, soothing nightlights, and bedtime lullabies for
              little creatures who can’t fall asleep.
            </p>

            <div data-hero-anim className="flex flex-wrap items-center gap-3 pt-1">
              <Magnet padding={70} magnetStrength={5} wrapperClassName="inline-block">
                <StarBorder
                  as="a"
                  href="#projects"
                  onClick={() => soundFX.playClick()}
                  backgroundColor="transparent"
                  textColor="var(--band-fg)"
                  color="#e8b64c"
                  trailColor="#ffd1a4"
                  glow={0.8}
                  sparkle
                  radius={18}
                  thickness={1.6}
                  duration={4.5}
                  hover="lap"
                  theme="dark"
                  className="font-bubbly text-sm font-bold"
                >
                  Enter the Dream Workshop ↓
                </StarBorder>
              </Magnet>

              <a
                href="#character"
                onClick={() => soundFX.playClick()}
                className="tactile rounded-2xl border border-[color:var(--band-line)] px-6 py-3 font-bubbly text-sm font-bold text-[color:var(--band-fg)] transition-colors hover:bg-[color:var(--band-accent-soft)]"
              >
                Read Nimbus’s File
              </a>
            </div>

            {/* Instrument ticks */}
            <dl
              data-hero-anim
              className="grid max-w-lg grid-cols-3 gap-px overflow-hidden rounded-2xl border border-[color:var(--band-line)] bg-[color:var(--band-line)]"
            >
              {TICKS.map((t) => (
                <div key={t.k} className="bg-[color:var(--band-bg)]/60 px-4 py-3 backdrop-blur-sm">
                  <dt className="ins-label text-[color:var(--band-muted)]">{t.k}</dt>
                  <dd className="mt-1 font-mono text-xs font-semibold text-[color:var(--band-fg)]">{t.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Right: the character, in its porthole */}
          <div className="order-1 flex justify-center lg:order-2 lg:col-span-5">
            <div data-hero-avatar className="relative">
              <div
                className="pointer-events-none absolute inset-0 -z-10 rounded-full blur-2xl"
                style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.18), transparent 70%)' }}
                aria-hidden="true"
              />
              <NimbusAvatar onPoke={onPoke} isRaining={isRaining} isNight={isNight} />
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="mt-12 flex items-center gap-4">
          <div className="tick-rule flex-1" />
          <a
            href="#character"
            onClick={() => soundFX.playClick()}
            className="tactile flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--band-muted)] hover:text-[color:var(--band-fg)]"
          >
            Scroll the night sky
            <ArrowDown size={14} className="animate-bounce" aria-hidden="true" />
          </a>
          <div className="tick-rule flex-1" />
          <span className="hidden items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--band-muted)] sm:flex">
            <Moon size={12} aria-hidden="true" /> Dream Atlas
          </span>
        </div>
      </div>
    </section>
  );
}
