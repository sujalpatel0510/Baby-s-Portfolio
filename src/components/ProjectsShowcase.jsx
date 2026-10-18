import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { Award } from 'lucide-react';
import { gsap, prefersReducedMotion } from '../lib/anim';
import HoverTilt from './HoverTilt';
import GlareHover from './reactbits/GlareHover';
import LullabyLab from './projects/LullabyLab';
import LanternGallery from './projects/LanternGallery';
import DeliveryRoutes from './projects/DeliveryRoutes';

const PROJECTS = [
  {
    id: '01',
    name: 'LullabyLab',
    title: 'Lullaby Lab',
    kind: 'Sound Toy',
    blurb:
      'A pocket synthesizer that turns pentatonic taps into soft dream melodies. Every note is a tiny bedtime spell.',
    tags: ['Web Audio', 'Pentatonic', 'Sleep-safe volume'],
    hint: 'Play the synth',
    glow: 'rgba(161,196,253,0.4)',
    Component: LullabyLab,
  },
  {
    id: '02',
    name: 'LanternGallery',
    title: 'Lantern Gallery',
    kind: 'Light Toy',
    blurb:
      'Catch wandering fireflies and tuck them into paper lanterns. The whole nursery glows warmer with every one you light.',
    tags: ['Canvas', 'Fireflies', 'Glow states'],
    hint: 'Light a lantern',
    glow: 'rgba(232,182,76,0.4)',
    Component: LanternGallery,
  },
  {
    id: '03',
    name: 'DeliveryRoutes',
    title: 'Delivery Routes',
    kind: 'Path Game',
    blurb:
      'Steer a very sleepy stork across rooftops, chimneys and sleepy trees — and deliver the last dream before dawn.',
    tags: ['Grid path', 'Timing', 'Rooftops'],
    hint: 'Trace the route',
    glow: 'rgba(212,106,140,0.4)',
    Component: DeliveryRoutes,
  },
];

export default function ProjectsShowcase({ soundFX }) {
  const rootRef = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.utils.toArray('[data-project-row]').forEach((row) => {
        const parts = row.querySelectorAll('[data-project-part]');
        gsap.fromTo(
          parts,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            ease: 'none',
            stagger: 0.06,
            scrollTrigger: {
              trigger: row,
              start: 'top 88%',
              end: 'top 52%',
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
    <section
      id="projects"
      ref={rootRef}
      className="band relative overflow-hidden border-y border-[color:var(--band-line)]"
      aria-label="The dream workshop — Nimbus's inventions"
    >
      <div className="shell py-20 md:py-28">
        <div className="mb-14 flex flex-col gap-3 md:mb-20" data-reveal>
          <span className="ins-label flex items-center gap-2 text-[color:var(--band-accent)]">
            <Award size={13} aria-hidden="true" /> The Dream Workshop · 3 Inventions
          </span>
          <h2 className="display max-w-3xl text-4xl text-[color:var(--band-fg)] md:text-6xl">
            Three little machines built for better sleep
          </h2>
          <p className="max-w-xl font-bubbly text-sm text-[color:var(--band-muted)]">
            Each one is fully playable, sound-reactive, and overflowing with cozy early-web whimsy.
            Go on — touch everything.
          </p>
        </div>

        <div className="space-y-24 md:space-y-32">
          {PROJECTS.map(({ id, name, title, kind, blurb, tags, hint, glow, Component }, i) => {
            const flip = i % 2 === 1;
            return (
              <article
                key={name}
                data-project-row
                className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12"
                aria-labelledby={`project-${name}`}
              >
                {/* Meta column */}
                <div
                  data-project-part
                  className={`lg:col-span-4 ${flip ? 'lg:order-2 lg:col-start-9' : 'lg:order-1'}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="display text-5xl text-[color:var(--band-accent)]/40 md:text-6xl">{id}</span>
                    <span className="ins-label text-[color:var(--band-accent)]">{kind}</span>
                  </div>
                  <h3 id={`project-${name}`} className="display mt-3 text-3xl text-[color:var(--band-fg)] md:text-4xl">
                    {title}
                  </h3>
                  <p className="mt-3 max-w-md font-bubbly text-sm leading-relaxed text-[color:var(--band-muted)]">
                    {blurb}
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {tags.map((t) => (
                      <li key={t} className="sticker font-mono text-[10px] uppercase tracking-wider text-[color:var(--band-muted)]">
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* The object itself */}
                <div
                  data-project-part
                  className={`relative lg:col-span-7 ${flip ? 'lg:order-1 lg:col-start-1' : 'lg:order-2 lg:col-start-6'}`}
                >
                  <div
                    className="pointer-events-none absolute -inset-6 -z-10 rounded-[48px] blur-2xl"
                    style={{ background: `radial-gradient(circle at 50% 40%, ${glow}, transparent 70%)` }}
                    aria-hidden="true"
                  />
                  <HoverTilt label={hint} className="h-full">
                    <GlareHover
                      className="w-full h-full rounded-3xl"
                      borderRadius="24px"
                      glareColor="#ffffff"
                      glareOpacity={0.35}
                      glareSize={28}
                      softness={0.65}
                      rimGlint={false}
                      mode="hover"
                    >
                      <Component soundFX={soundFX} />
                    </GlareHover>
                  </HoverTilt>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
