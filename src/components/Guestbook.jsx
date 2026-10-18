import React, { useState, useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { Sparkles, Star, Send, PenLine, Cloud, Loader2 } from 'lucide-react';
import { gsap, prefersReducedMotion } from '../lib/anim';
import NimbusAvatar from './NimbusAvatar';
import StarBorder from './reactbits/StarBorder';
import Magnet from './reactbits/Magnet';

const STORAGE_KEY = 'nimbus_guestbook';
const MAX_LEN = 240;
const STICKERS = ['☁️', '🌙', '⭐', '🌈', '🍼', '💖', '🧸'];

const DEFAULT_MESSAGES = [
  {
    name: 'Pip the Skull Baby',
    text: 'Sleep tight little cloud! Thank you for the soft rain lullabies over Midnight Nursery! 🦴💖',
    sticker: '⭐',
    time: 'Just now',
  },
  {
    name: 'Hardik from haX',
    text: 'Good things start small. Welcome to your first website, Nimbus!',
    sticker: '🌈',
    time: '17 Oct 17:17',
  },
];

export default function Guestbook({ soundFX }) {
  const [messages, setMessages] = useState([]);
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [selectedSticker, setSelectedSticker] = useState('☁️');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [celebration, setCelebration] = useState(0);

  const rootRef = useRef(null);
  const burstRef = useRef(null);
  const submittingRef = useRef(false);
  const timeoutsRef = useRef([]);

  // Load persisted dreams (same key + shape as before — no backend involved).
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setMessages(Array.isArray(parsed) ? parsed : []);
      } catch {
        setMessages([]);
      }
    } else {
      setMessages(DEFAULT_MESSAGES);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_MESSAGES));
      } catch {
        /* private mode / quota — in-memory is fine */
      }
    }
    return () => {
      timeoutsRef.current.forEach((id) => window.clearTimeout(id));
      timeoutsRef.current = [];
    };
  }, []);

  // Scroll reveals are scrub-linked, so they play forward and reverse
  // consistently whether the visitor scrolls down or back up.
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      rootRef.current.querySelectorAll('[data-dreambook]').forEach((el) => {
        gsap.fromTo(
          el,
          { y: 44, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top 92%',
              end: 'top 62%',
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );
      });
    },
    { scope: rootRef },
  );

  // Delightful confirmation: a few stars drift up from the dreambook and the
  // freshest note glows in. Reduced motion gets a single soft flash instead.
  useGSAP(
    () => {
      if (!celebration) return;
      const host = burstRef.current;
      if (!host) return;

      if (prefersReducedMotion()) {
        gsap.fromTo(host, { opacity: 0.55 }, { opacity: 0, duration: 0.7, ease: 'power1.out' });
        return;
      }

      const glyphs = ['✦', '✧', '★', '·'];
      const stars = Array.from({ length: 12 }, () => {
        const s = document.createElement('span');
        s.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
        s.style.position = 'absolute';
        s.style.left = `${10 + Math.random() * 78}%`;
        s.style.bottom = `${4 + Math.random() * 26}%`;
        s.style.fontSize = `${10 + Math.random() * 16}px`;
        s.style.color = Math.random() > 0.45 ? '#e8b64c' : '#ffeaa7';
        s.style.opacity = '0';
        host.appendChild(s);
        return s;
      });

      gsap
        .to(stars, { opacity: 1, duration: 0.28, stagger: 0.02 })
        .then(() =>
          gsap.to(stars, {
            y: -130 - Math.random() * 140,
            opacity: 0,
            scale: 0.6,
            duration: 1.1 + Math.random() * 0.6,
            ease: 'power1.out',
            stagger: 0.03,
            onComplete: () => stars.forEach((s) => s.remove()),
          }),
        );

      const note = rootRef.current.querySelector('[data-latest-note]');
      if (note) {
        gsap.fromTo(
          note,
          { boxShadow: '0 0 0 0 rgba(232,182,76,0)' },
          {
            boxShadow: '0 0 36px -4px rgba(232,182,76,0.8)',
            duration: 0.5,
            yoyo: true,
            repeat: 1,
            onComplete: () => gsap.set(note, { clearProps: 'boxShadow' }),
          },
        );
      }
    },
    { dependencies: [celebration], scope: rootRef },
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    // Duplicate-submission guard: ignore while a send is already in flight.
    if (submittingRef.current) return;

    const trimmedName = name.trim();
    const trimmedText = text.trim().slice(0, MAX_LEN);
    if (!trimmedName || !trimmedText) return; // native `required` also guards

    setError('');
    setStatus('sending');
    submittingRef.current = true;

    const send = window.setTimeout(() => {
      try {
        const newMsg = {
          name: trimmedName,
          text: trimmedText,
          sticker: selectedSticker,
          time: 'Just now',
        };
        const updated = [newMsg, ...messages];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        setMessages(updated);
        setName('');
        setText('');
        setStatus('success');
        setCelebration((c) => c + 1);
        soundFX?.playSparkle();
      } catch {
        setStatus('error');
        setError('The night sky hiccuped and your dream couldn’t be saved. Please try again.');
      } finally {
        const reset = window.setTimeout(() => {
          setStatus((s) => (s === 'sending' || s === 'success' ? 'idle' : s));
          submittingRef.current = false;
        }, 1500);
        timeoutsRef.current.push(reset);
      }
    }, 650);
    timeoutsRef.current.push(send);
  };

  const label = {
    idle: 'Send to the stars ✦',
    sending: 'Sending to the stars…',
    success: 'Sent with stardust ✦',
    error: 'Try again ✦',
  }[status];

  return (
    <section id="guestbook" ref={rootRef} className="relative" aria-labelledby="guestbook-title">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
        {/* Intro side */}
        <div className="lg:col-span-5" data-dreambook>
          <div className="flex flex-wrap items-center gap-2">
            <span className="ins-label flex items-center gap-2 text-[color:var(--band-accent)]">
              <PenLine size={13} aria-hidden="true" /> Leave a little dream
            </span>
            <span className="sticker font-mono text-[10px] uppercase tracking-wider text-[color:var(--band-muted)]">
              Side quest · +2 pts
            </span>
          </div>

          <h3
            id="guestbook-title"
            className="display mt-4 text-[clamp(2rem,5vw,3.4rem)] text-[color:var(--band-fg)]"
          >
            Leave a little <span className="italic text-[color:var(--band-accent)]">stardust.</span>
          </h3>

          <p className="mt-4 max-w-md font-bubbly text-sm leading-relaxed text-[color:var(--band-muted)] md:text-base">
            The Slumber Crib Dreambook is where visitors pin a tiny dream for Nimbus to read before
            drifting off. Write your note and it floats up to the cloud wall.
          </p>

          <div className="mt-8">
            <div className="animate-float-slow inline-block">
              <NimbusAvatar
                size="sm"
                badge="Nimbus is listening…"
                onPoke={() => soundFX?.playChime(783.99)}
                isNight
                isRaining={false}
              />
            </div>
          </div>
        </div>

        {/* The dreambook */}
        <div className="lg:col-span-7" data-dreambook>
          <div className="relative">
            <div
              className="pointer-events-none absolute -inset-8 -z-10 rounded-[48px]"
              style={{ background: 'radial-gradient(circle at 50% 28%, rgba(143,157,255,0.22), transparent 70%)' }}
              aria-hidden="true"
            />

            <span
              className="animate-float-slow pointer-events-none absolute -right-2 -top-3 text-lg text-[#e8b64c]"
              aria-hidden="true"
            >
              ✦
            </span>
            <span
              className="animate-float-reverse pointer-events-none absolute -left-3 bottom-12 text-sm text-[color:var(--band-accent)]"
              aria-hidden="true"
            >
              ✧
            </span>

            <div className="dream-panel p-6 md:p-8">
              {/* Star burst lives inside the panel so the drift stays contained */}
              <div
                ref={burstRef}
                className="pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-[28px]"
                aria-hidden="true"
              />

              <div className="relative z-20">
                <div className="flex items-center justify-between gap-3">
                  <span className="ins-label flex items-center gap-2 text-[color:var(--band-accent)]">
                    <Cloud size={13} aria-hidden="true" /> The Slumber Crib Dreambook
                  </span>
                  <span className="hidden items-center gap-1 font-mono text-[10px] text-[color:var(--band-muted)] sm:flex">
                    <Star size={11} className="text-[#e8b64c]" aria-hidden="true" />
                    {messages.length} pinned
                  </span>
                </div>

                <form onSubmit={handleSubmit} className="mt-6">
                  <label htmlFor="gb-name" className="ins-label mb-2 block text-[color:var(--band-muted)]">
                    Your name
                  </label>
                  <input
                    id="gb-name"
                    name="name"
                    type="text"
                    required
                    maxLength={40}
                    autoComplete="name"
                    placeholder="Your name or creature species…"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="dream-field px-4 py-3 font-bubbly text-sm"
                  />

                  <label htmlFor="gb-dream" className="ins-label mb-2 mt-5 block text-[color:var(--band-muted)]">
                    Your dream for Nimbus
                  </label>
                  <textarea
                    id="gb-dream"
                    name="dream"
                    required
                    rows={3}
                    maxLength={MAX_LEN}
                    placeholder="Whisper something sweet to Nimbus…"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="dream-field resize-none px-4 py-3 font-bubbly text-sm leading-relaxed"
                  />
                  <div className="mt-1.5 flex justify-end">
                    <span aria-hidden="true" className="font-mono text-[10px] text-[color:var(--band-muted)]">
                      {text.length}/{MAX_LEN}
                    </span>
                  </div>

                  <fieldset className="mt-5">
                    <legend className="ins-label mb-2 text-[color:var(--band-muted)]">Choose a badge</legend>
                    <div className="flex flex-wrap gap-2">
                      {STICKERS.map((s) => (
                        <button
                          type="button"
                          key={s}
                          onClick={() => {
                            setSelectedSticker(s);
                            soundFX?.playClick();
                          }}
                          aria-pressed={selectedSticker === s}
                          aria-label={`Choose badge ${s}`}
                          className={`tactile grid h-11 w-11 place-items-center rounded-2xl border text-lg transition-all ${
                            selectedSticker === s
                              ? 'scale-105 border-[color:var(--band-accent)] bg-[color:var(--band-accent-soft)] shadow-[0_0_22px_-6px_rgba(232,160,189,0.85)]'
                              : 'border-[color:var(--band-line)] opacity-70 hover:opacity-100'
                          }`}
                        >
                          <span aria-hidden="true">{s}</span>
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
                    <p className="max-w-[17rem] font-mono text-[10px] leading-relaxed text-[color:var(--band-muted)]">
                      Pinned to the cloud wall on this device — no accounts, no data leaves your browser.
                    </p>

                    <Magnet padding={80} magnetStrength={5} wrapperClassName="inline-block">
                      <StarBorder
                        as="button"
                        type="submit"
                        disabled={status === 'sending'}
                        onClick={() => soundFX?.playClick()}
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
                        <span className="inline-flex items-center gap-2">
                          {status === 'sending' ? (
                            <Loader2 className="animate-spin" size={15} aria-hidden="true" />
                          ) : (
                            <Send size={15} aria-hidden="true" />
                          )}
                          {label}
                        </span>
                      </StarBorder>
                    </Magnet>
                  </div>

                  <p role="status" aria-live="polite" className="mt-3 min-h-[1rem] font-mono text-[10px] text-[color:var(--band-accent)]">
                    {status === 'sending' && 'Carrying your dream up to the clouds…'}
                    {status === 'success' && 'Your dream is pinned to the cloud wall ✦'}
                  </p>
                  {error && (
                    <p role="alert" className="mt-1 font-mono text-[10px] text-rose-300">
                      {error}
                    </p>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Previously pinned dreams */}
      <div className="mt-12 md:mt-16" data-dreambook>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="ins-label flex items-center gap-2 text-[color:var(--band-accent)]">
              <Sparkles size={13} aria-hidden="true" /> Already tucked in
            </span>
            <h4 className="display mt-1 text-2xl text-[color:var(--band-fg)]">Dreams on the cloud wall</h4>
          </div>
          <span className="sticker font-mono text-[10px] uppercase tracking-wider text-[color:var(--band-muted)]">
            {messages.length} {messages.length === 1 ? 'dream' : 'dreams'} pinned
          </span>
        </div>

        {messages.length === 0 ? (
          <p className="dream-note p-6 text-center font-bubbly text-sm text-[color:var(--band-muted)]">
            No dreams pinned yet — be the first to whisper one to Nimbus.
          </p>
        ) : (
          <div className="grid max-h-[22rem] grid-cols-1 gap-3 overflow-y-auto pr-1 sm:grid-cols-2">
            {messages.map((m, idx) => (
              <article
                key={`${m.name}-${idx}`}
                data-latest-note={idx === 0 ? '' : undefined}
                className="dream-note relative p-4 transition-transform duration-300 hover:-translate-y-0.5"
              >
                <div className="mb-1.5 flex items-start justify-between gap-3">
                  <span className="flex items-center gap-2 font-serif text-sm font-semibold text-[color:var(--band-fg)]">
                    <span
                      className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[color:var(--band-accent-soft)] text-sm"
                      aria-hidden="true"
                    >
                      {m.sticker}
                    </span>
                    {m.name}
                  </span>
                  <time className="shrink-0 font-mono text-[10px] text-[color:var(--band-muted)]">{m.time}</time>
                </div>
                <p className="font-bubbly text-xs leading-relaxed text-[color:var(--band-muted)]">“{m.text}”</p>
                <span
                  className="pointer-events-none absolute bottom-2 right-3 text-[10px] text-[color:var(--band-accent)] opacity-60"
                  aria-hidden="true"
                >
                  ✦
                </span>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
