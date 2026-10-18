import { useEffect, useRef } from 'react';
import { gsap, isCoarsePointer, prefersReducedMotion } from '../lib/anim';

const TRAIL_COUNT = 8;
const BURST_COUNT = 8;
const TRAIL_THROTTLE_MS = 45;

const DAY_COLORS = ['#ff9ebb', '#ffd1a4', '#ffeaa7', '#a8e6cf', '#a1c4fd', '#c2b6f7'];
const NIGHT_COLORS = ['#ffeaa7', '#a1c4fd', '#c2b6f7', '#d46a8c', '#a8e6cf'];

/**
 * Nimbus-themed custom cursor:
 * - Mini cloud pointer + springy follower ring + contextual label
 * - Fixed-size particle pool (no unbounded DOM growth)
 * - Hover states via data attributes (no React state per move)
 * - Disabled on touch/coarse pointers, native cursor retained
 * - pointer-events:none everywhere so clicks/selection/tooltips are never blocked
 */
export default function CustomCursor({ active = true }) {
  const rootRef = useRef(null);
  const pointerRef = useRef(null);
  const followerRef = useRef(null);
  const labelRef = useRef(null);

  const disabled = !active || isCoarsePointer();

  useEffect(() => {
    if (disabled) return;
    document.documentElement.classList.add('has-custom-cursor');
    const root = rootRef.current;
    const pointer = pointerRef.current;
    const follower = followerRef.current;
    if (!root || !pointer || !follower) return;

    // Fixed pool of particle nodes, reused forever
    const pool = Array.from({ length: TRAIL_COUNT + BURST_COUNT }, () => {
      const el = document.createElement('div');
      el.className = 'cursor-particle';
      el.style.background = 'var(--nimbus-cursor-star)';
      root.appendChild(el);
      return { el, tween: null };
    });
    let poolIdx = 0;

    const reduced = prefersReducedMotion();

    const setState = (state) => {
      root.dataset.cursorState = state || 'idle';
    };

    const setLabel = (text) => {
      const label = labelRef.current;
      if (!label) return;
      label.textContent = text || '';
      root.dataset.cursorLabel = text ? '1' : '0';
    };

    // ---- Interactive state delegation (no React state involved) ----
    const onEnter = (e) => {
      const target = e.target.closest?.('[data-cursor], button, a, [role="button"], input, textarea, select');
      if (!target) return;
      let state = target.dataset.cursorState;
      if (!state) {
        state = target.matches('button, a, [role="button"], input, textarea, select')
          ? 'attract'
          : 'hover';
      }
      setState(state);
      // Label is derived purely from the innermost interactive target
      setLabel(target.dataset.cursorLabel || '');
    };

    const onLeave = (e) => {
      const to = e.relatedTarget?.closest?.('[data-cursor], button, a, [role="button"], input, textarea, select');
      if (!to) {
        setState('idle');
        setLabel('');
      }
    };

    document.addEventListener('mouseover', onEnter);
    document.addEventListener('mouseout', onLeave);

    // ---- Particle spawning from the fixed pool ----
    const spawn = (x, y, { size = 5, life = 0.7, spread = 36, rise = 26 } = {}) => {
      const item = pool[poolIdx % pool.length];
      poolIdx += 1;
      if (item.tween) item.tween.kill();
      const isNight = document.documentElement.classList.contains('dark');
      const palette = isNight ? NIGHT_COLORS : DAY_COLORS;
      const { el } = item;
      gsap.set(el, {
        x,
        y,
        xPercent: -50,
        yPercent: -50,
        width: size,
        height: size,
        opacity: 0.95,
        scale: 1,
        background: palette[Math.floor(Math.random() * palette.length)],
      });
      item.tween = gsap.to(el, {
        x: x + (Math.random() - 0.5) * spread * 2,
        y: y - rise - Math.random() * rise,
        scale: 0,
        opacity: 0,
        duration: life,
        ease: 'power2.out',
      });
    };

    // ---- Pointer tracking (GSAP tweens, never React state) ----
    gsap.set(pointer, { x: '-50%', y: '-50%' });
    gsap.set(follower, { x: '-50%', y: '-50%' });
    // Park elements offscreen until first move so they don't flash at 0,0
    gsap.set([pointer, follower], { autoAlpha: 0 });
    let revealed = false;

    let lastTrail = 0;
    const onMove = (e) => {
      const { clientX: x, clientY: y } = e;
      gsap.to(pointer, {
        x,
        y,
        duration: 0.12,
        ease: 'power2.out',
        overwrite: 'auto',
      });
      if (!revealed) {
        revealed = true;
        gsap.set([pointer, follower], { autoAlpha: 1 });
      }
      if (reduced) return;
      gsap.to(follower, {
        x,
        y,
        duration: 0.55,
        ease: 'power2.out',
        overwrite: 'auto',
      });
      const now = performance.now();
      if (now - lastTrail > TRAIL_THROTTLE_MS) {
        lastTrail = now;
        spawn(x, y, { size: 3.5 + Math.random() * 3, life: 0.55, spread: 22, rise: 18 });
      }
    };

    const onDown = (e) => {
      if (reduced) return;
      for (let i = 0; i < BURST_COUNT; i++) {
        spawn(e.clientX, e.clientY, {
          size: 4 + Math.random() * 4,
          life: 0.65,
          spread: 44,
          rise: 30,
        });
      }
      // Gentle press feedback on the pointer itself
      gsap.fromTo(pointer, { scale: 0.8 }, { scale: 1, duration: 0.4, ease: 'back.out(3)' });
    };

    const onLeaveWindow = () => {
      revealed = false;
      gsap.to([pointer, follower], { autoAlpha: 0, duration: 0.2 });
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mousedown', onDown, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeaveWindow);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      document.documentElement.removeEventListener('mouseleave', onLeaveWindow);
      document.removeEventListener('mouseover', onEnter);
      document.removeEventListener('mouseout', onLeave);
      pool.forEach(({ el, tween }) => {
        tween?.kill();
        el.remove();
      });
      gsap.killTweensOf([pointer, follower]);
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, [disabled]);

  if (disabled) return null;

  return (
    <div ref={rootRef} data-cursor-state="idle" data-cursor-label="0" className="custom-cursor-root" aria-hidden="true">
      {/* Springy follower ring with contextual label */}
      <div ref={followerRef} className="custom-cursor__follower">
        <div className="custom-cursor__follower-inner">
          <span ref={labelRef} className="custom-cursor__label" />
        </div>
      </div>

      {/* Mini Nimbus pointer: cloud face + twinkle star */}
      <div ref={pointerRef} className="custom-cursor__pointer">
        <svg viewBox="0 0 32 32" width="28" height="28" fill="none" aria-hidden="true">
          <g fill="var(--nimbus-cursor-pointer)">
            <circle cx="11" cy="19" r="6.5" />
            <circle cx="19" cy="19" r="6.5" />
            <circle cx="15" cy="14.5" r="7" />
          </g>
          <circle cx="12.5" cy="15.5" r="1.25" fill="var(--nimbus-cursor-pointer-inner)" />
          <circle cx="17.5" cy="15.5" r="1.25" fill="var(--nimbus-cursor-pointer-inner)" />
          <path
            d="M26 3.5l.85 2.15L29 6.5l-2.15.85L26 9.5l-.85-2.15L23 6.5l2.15-.85z"
            fill="var(--nimbus-cursor-star)"
          />
        </svg>
      </div>
    </div>
  );
}
