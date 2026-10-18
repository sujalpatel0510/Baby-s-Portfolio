import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { Fingerprint, Star, Sparkles, CloudRain, Moon } from 'lucide-react';
import { gsap, prefersReducedMotion } from '../lib/anim';
import SpotlightCard from './reactbits/SpotlightCard';
import GlareHover from './reactbits/GlareHover';

const FACTS = [
  { k: 'Species', v: 'Cumulus Dream Sprite' },
  { k: 'Habitat', v: 'Above sleepy rooftops' },
  { k: 'Temperament', v: 'Gentle · Giggly · Drowsy' },
  { k: 'Diet', v: 'Chamomile steam & starblossom honey' },
];

const ABILITIES = [
  { label: 'Cozy Rainmaking', level: 92, tint: '#a1c4fd' },
  { label: 'Lullaby Humming', level: 88, tint: '#d46a8c' },
  { label: 'Nightlight Craft', level: 81, tint: '#e8b64c' },
  { label: 'Cloud Painting', level: 74, tint: '#c2b6f7' },
];

const LOVES = ['firefly jars', 'naps at dusk', 'pentatonic hums', 'marshmallow mist', 'window breezes', 'warm tea steam'];

const QUIRKS = [
  'Giggles when tickled by falling stars.',
  'Cannot make thunderclaps — far too noisy.',
  'Always, always loses the nightcap’s pom-pom.',
];

export default function CharacterFile() {
  const rootRef = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const bars = gsap.utils.toArray('[data-ability]');
      bars.forEach((bar) => {
        gsap.fromTo(
          bar,
          { scaleX: 0 },
          {
            scaleX: 1,
            transformOrigin: 'left center',
            ease: 'none',
            scrollTrigger: {
              trigger: bar,
              start: 'top 92%',
              end: 'top 58%',
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );
      });
    },
    { scope: rootRef },
  );

  return (
    <section id="character" ref={rootRef} className="band relative overflow-hidden" aria-label="The Nimbus file">
      <div className="shell py-20 md:py-28">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-3 md:mb-14" data-reveal>
          <span className="ins-label flex items-center gap-2 text-[color:var(--band-accent)]">
            <Fingerprint size={13} aria-hidden="true" /> Subject File 001 · Character Sheet
          </span>
          <h2 className="display text-4xl text-[color:var(--band-fg)] md:text-6xl">The Nimbus File</h2>
          <p className="max-w-xl font-bubbly text-sm text-[color:var(--band-muted)]">
            Everything the Observatory knows about its smallest engineer — measured, stamped, and
            mostly accurate.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          {/* ID card */}
          <div className="lg:col-span-5" data-reveal>
            <GlareHover
              className="w-full rounded-3xl"
              borderRadius="24px"
              glareColor="#ffffff"
              glareOpacity={0.28}
              glareSize={30}
              softness={0.7}
              rimGlint={false}
              mode="hover"
            >
              <SpotlightCard
                className="flex h-full flex-col gap-6 p-7 md:p-9"
                theme="light"
                spotlightColor="#ffeaa7"
                intensity={0.22}
                spotlightSize={320}
                proximity={120}
                style={{
                  '--spotlight-card-surface': 'var(--band-surface)',
                  '--spotlight-card-border': 'var(--band-line)',
                  '--spotlight-card-shadow': '0 30px 60px -30px rgba(0,0,0,0.45)',
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="ins-label text-[color:var(--band-muted)]">NMB · 001</span>
                  <span className="sticker ins-label text-[color:var(--band-accent)]">
                    <Sparkles size={11} aria-hidden="true" /> Junior Dream Engineer
                  </span>
                </div>

                <div className="flex items-center gap-5">
                  <span
                    className="grid h-24 w-24 shrink-0 place-items-center rounded-full text-6xl"
                    style={{ background: 'radial-gradient(circle at 35% 30%, #fff, #dbe8ff 70%, #a1c4fd)' }}
                    aria-hidden="true"
                  >
                    ☁️
                  </span>
                  <div>
                    <p className="display text-3xl text-[color:var(--band-fg)]">Nimbus</p>
                    <p className="font-mono text-xs text-[color:var(--band-muted)]">.cloud · the sleepy one</p>
                  </div>
                </div>

                <div className="tick-rule" />

                <dl className="space-y-3">
                  {FACTS.map((f) => (
                    <div key={f.k} className="flex items-baseline justify-between gap-4">
                      <dt className="ins-label text-[color:var(--band-muted)]">{f.k}</dt>
                      <dd className="text-right font-bubbly text-sm text-[color:var(--band-fg)]">{f.v}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-auto flex items-end justify-between pt-4">
                  <div className="flex items-center gap-2 text-[color:var(--band-muted)]">
                    <CloudRain size={15} aria-hidden="true" />
                    <Moon size={15} aria-hidden="true" />
                    <Star size={15} aria-hidden="true" />
                  </div>
                  <p className="font-serif text-lg italic text-[color:var(--band-accent)]">“good things start small”</p>
                </div>
              </SpotlightCard>
            </GlareHover>
          </div>

          {/* Data columns */}
          <div className="space-y-10 lg:col-span-7">
            <div data-reveal>
              <h3 className="ins-label mb-5 text-[color:var(--band-muted)]">Ability Readouts</h3>
              <ul className="space-y-4">
                {ABILITIES.map((a) => (
                  <li key={a.label}>
                    <div className="mb-1.5 flex items-baseline justify-between">
                      <span className="font-bubbly text-sm font-semibold text-[color:var(--band-fg)]">{a.label}</span>
                      <span className="font-mono text-xs text-[color:var(--band-muted)]">{a.level}%</span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full border border-[color:var(--band-line)] bg-[color:var(--band-accent-soft)]">
                      <div
                        data-ability
                        className="h-full rounded-full"
                        style={{ width: `${a.level}%`, background: `linear-gradient(90deg, ${a.tint}, ${a.tint}b0)` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div data-reveal>
                <h3 className="ins-label mb-4 text-[color:var(--band-muted)]">Favorite Things</h3>
                <div className="flex flex-wrap gap-2">
                  {LOVES.map((l) => (
                    <span key={l} className="sticker font-bubbly text-xs text-[color:var(--band-fg)]">
                      {l}
                    </span>
                  ))}
                </div>
              </div>

              <div data-reveal>
                <h3 className="ins-label mb-4 text-[color:var(--band-muted)]">Known Quirks</h3>
                <ul className="space-y-3">
                  {QUIRKS.map((q) => (
                    <li key={q} className="flex gap-2.5 font-bubbly text-sm text-[color:var(--band-fg)]">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--band-accent)]" />
                      {q}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
