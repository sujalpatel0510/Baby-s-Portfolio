import React from 'react';
import { ArrowUp, MoonStar } from 'lucide-react';
import StarField from './StarField';
import Guestbook from './Guestbook';
import StarBorder from './reactbits/StarBorder';
import Magnet from './reactbits/Magnet';

export default function ClosingScene({ soundFX }) {
  const backToTop = () => {
    soundFX.playClick();
    soundFX.playChime(783.99);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section id="closing" className="band theme-night relative overflow-hidden" aria-label="Closing scene">
      <StarField count={80} seed={23} layer="closing" className="opacity-70" />

      {/* Moon + sleeping cloud */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute right-[8%] top-[14%] h-24 w-24 rounded-full md:h-32 md:w-32"
          style={{ background: 'radial-gradient(circle at 35% 30%, #fff7e0, #e8b64c 75%)', boxShadow: '0 0 60px rgba(232,182,76,0.45)' }}
        />
        <div className="animate-float-slow absolute left-[9%] top-[26%] text-5xl opacity-90 md:text-7xl">☁️</div>
        <span className="animate-float-reverse absolute left-[16%] top-[20%] font-mono text-xs text-[color:var(--band-muted)] md:text-sm">
          z
        </span>
        <span className="animate-float-slow absolute left-[19%] top-[15%] font-mono text-[10px] text-[color:var(--band-muted)] md:text-xs">
          z
        </span>
        <div
          className="absolute -bottom-[20%] left-1/2 h-[44vw] w-[80vw] -translate-x-1/2 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(143,157,255,0.22), transparent 70%)' }}
        />
      </div>

      <div className="shell relative z-10 py-20 md:py-28">
        {/* The finale line */}
        <div className="max-w-4xl" data-reveal>
          <span className="ins-label flex items-center gap-2 text-[color:var(--band-accent)]">
            <MoonStar size={13} aria-hidden="true" /> Closing Transmission
          </span>
          <h2 className="display mt-4 text-[clamp(2.4rem,7vw,5.5rem)] text-[color:var(--band-fg)]">
            Every good thing
            <br />
            <span className="italic text-[color:var(--band-accent)]">starts small.</span>
          </h2>
          <p className="mt-5 max-w-xl font-bubbly text-sm leading-relaxed text-[color:var(--band-muted)] md:text-base">
            Nimbus tucks in at the Observatory, nightcap on, ready for tomorrow’s dreams. Leave a
            whisper on the cloud wall, and Nimbus will read it before drifting off.
          </p>

          <div className="mt-8">
            <Magnet padding={90} magnetStrength={6} wrapperClassName="inline-block">
              <StarBorder
                as="button"
                onClick={backToTop}
                backgroundColor="transparent"
                textColor="var(--band-fg)"
                color="#8f9dff"
                trailColor="#c2b6f7"
                glow={0.75}
                sparkle
                radius={18}
                thickness={1.6}
                duration={5}
                hover="lap"
                theme="dark"
                className="font-bubbly text-sm font-bold"
              >
                <span className="inline-flex items-center gap-2">
                  Return to the Night Sky <ArrowUp size={15} aria-hidden="true" />
                </span>
              </StarBorder>
            </Magnet>
          </div>
        </div>

        {/* The guestbook lives inside the closing scene */}
        <div className="mt-20 md:mt-28" data-reveal>
          <Guestbook soundFX={soundFX} />
        </div>
      </div>
    </section>
  );
}
