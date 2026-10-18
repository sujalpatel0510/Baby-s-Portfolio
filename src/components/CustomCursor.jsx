import { useEffect, useRef } from 'react';
import { isCoarsePointer, prefersReducedMotion } from '../lib/anim';

// Fixed particle pool — allocated once, reused forever (no DOM growth).
const MAX_PARTICLES = 46;
const BURST_COUNT = 8; // quick click burst

// Champagne gold / soft cream / blush pink, tuned per background tone.
const DAY_PALETTE = ['#ff9ebb', '#ffeaa7', '#e8b64c', '#f7dfa5', '#fff8f1'];
const NIGHT_PALETTE = ['#e8a0bd', '#ffeaa7', '#8f9dff', '#f7dfa5', '#fff8f1'];

// Refined four-point star (curved arms), centered in a 24×24 box
const STAR_PATH =
  'M12 2 C12.9 8.5 15.5 11.1 22 12 C15.5 12.9 12.9 15.5 12 22 C11.1 15.5 8.5 12.9 2 12 C8.5 11.1 11.1 8.5 12 2 Z';

const INTERACTIVE = 'a, button, [role="button"], [data-cursor], input, textarea, select, label';
const TEXT_FIELDS = 'input, textarea, select, [contenteditable="true"]';

// Exponential smoothing time-constants (seconds). The star stays responsive;
// the glow drifts a little further behind for a dreamy, ambient feel.
const STAR_TAU = 0.075;
const GLOW_TAU = 0.17;
const TONE_CHECK_MS = 130;

/**
 * Stardust cursor — ONE coordinated pointer system driving three layers:
 *   1. a champagne-gold four-point star (the cursor),
 *   2. a speed-reactive trail of tiny pink/cream/gold sparkles,
 *   3. a soft radial ambient glow that drifts across the background (z-index:1).
 *
 * Everything is positioned by a single requestAnimationFrame loop using
 * exponential smoothing (frame-rate independent) and CSS transforms — no React
 * re-renders on pointer move. All layers are pointer-events:none. The native
 * text cursor is restored over fields/selection; touch + reduced-motion are
 * handled. The glow lives at a low z-index (below the z-10 content shells) so it
 * only ever lights the background, never the text.
 */
export default function CustomCursor({ active = true, trail = true }) {
  const rootRef = useRef(null);
  const glowRef = useRef(null);
  const starRef = useRef(null);
  const labelRef = useRef(null);
  const trailRef = useRef(trail);

  const disabled = !active || isCoarsePointer();

  useEffect(() => {
    trailRef.current = trail;
  }, [trail]);

  useEffect(() => {
    if (disabled) return undefined;

    const html = document.documentElement;
    html.classList.add('has-custom-cursor');

    const root = rootRef.current;
    const glow = glowRef.current;
    const star = starRef.current;
    if (!root || !glow || !star) return undefined;

    const reduced = prefersReducedMotion();

    // ---- particle pool ----
    const particles = [];
    if (!reduced) {
      for (let i = 0; i < MAX_PARTICLES; i++) {
        const el = document.createElement('span');
        el.className = 'stardust-spark';
        el.style.opacity = '0';
        root.appendChild(el);
        particles.push({
          el, active: false, x: 0, y: 0, vx: 0, vy: 0,
          life: 0, maxLife: 1, size: 6, alpha: 1, rot: 0, rotV: 0,
        });
      }
    }
    let pIdx = 0;

    const spawnParticle = (x, y, speed) => {
      if (!particles.length) return;
      const p = particles[pIdx % particles.length];
      pIdx += 1;
      const dark = html.classList.contains('dark') || glow.dataset.tone === 'dark';
      const pal = dark ? NIGHT_PALETTE : DAY_PALETTE;
      const fast = speed > 900;
      p.active = true;
      p.x = x + (Math.random() - 0.5) * 10;
      p.y = y + (Math.random() - 0.5) * 10;
      const ang = Math.random() * Math.PI * 2;
      const sp = 8 + Math.random() * (fast ? 42 : 22);
      p.vx = Math.cos(ang) * sp;
      p.vy = Math.sin(ang) * sp - (8 + Math.random() * 16);
      p.maxLife = 0.5 + Math.random() * 0.5;
      p.life = p.maxLife;
      p.size = (fast ? 5 : 4) + Math.random() * 4;
      p.alpha = 0.75 + Math.random() * 0.25;
      p.rot = Math.random() * 90;
      p.rotV = (Math.random() - 0.5) * 160;
      p.el.style.width = `${p.size}px`;
      p.el.style.height = `${p.size}px`;
      p.el.style.background = pal[(Math.random() * pal.length) | 0];
    };

    // ---- coordinated pointer state ----
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const starPos = { x: target.x, y: target.y };
    const glowPos = { x: target.x, y: target.y };
    let prevX = target.x;
    let prevY = target.y;
    let accum = 0;
    let visible = false;
    let raf = 0;
    let last = performance.now();
    let lastTone = 0;
    let pressTimer = 0;

    const setVisible = (v) => {
      if (visible === v) return;
      visible = v;
      root.classList.toggle('is-visible', v);
      glow.classList.toggle('is-visible', v);
    };

    // Sample the backdrop under the pointer to pick a glow tone (throttled).
    const readTone = () => {
      let node = null;
      try {
        node = document.elementFromPoint(target.x, target.y);
      } catch {
        node = null;
      }
      let guard = 0;
      while (node && guard++ < 40) {
        const m = /^rgba?\(([^)]+)\)$/.exec(getComputedStyle(node).backgroundColor);
        if (m) {
          const parts = m[1].split(',').map(Number);
          const a = parts.length > 3 ? parts[3] : 1;
          if (a > 0.4) {
            const lum = (0.299 * parts[0] + 0.587 * parts[1] + 0.114 * parts[2]) / 255;
            return lum < 0.5 ? 'dark' : 'light';
          }
        }
        node = node.parentElement;
      }
      return html.classList.contains('dark') ? 'dark' : 'light';
    };

    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000) || 0.016;
      last = now;

      const pdx = target.x - prevX;
      const pdy = target.y - prevY;
      prevX = target.x;
      prevY = target.y;
      const speed = Math.hypot(pdx, pdy) / dt;

      // star — responsive smoothing
      const ks = reduced ? 1 : 1 - Math.exp(-dt / STAR_TAU);
      starPos.x += (target.x - starPos.x) * ks;
      starPos.y += (target.y - starPos.y) * ks;
      star.style.transform =
        `translate3d(${starPos.x.toFixed(2)}px, ${starPos.y.toFixed(2)}px, 0) translate(-50%, -50%)`;

      // glow — softer, slower drift (skipped under reduced motion)
      if (!reduced) {
        const kg = 1 - Math.exp(-dt / GLOW_TAU);
        glowPos.x += (target.x - glowPos.x) * kg;
        glowPos.y += (target.y - glowPos.y) * kg;
        glow.style.transform =
          `translate3d(${glowPos.x.toFixed(2)}px, ${glowPos.y.toFixed(2)}px, 0) translate(-50%, -50%)`;
        if (now - lastTone > TONE_CHECK_MS) {
          lastTone = now;
          glow.dataset.tone = readTone();
        }
      }

      // trail — spawn rate rises with pointer speed
      if (!reduced && trailRef.current && visible && root.dataset.cursorState !== 'text') {
        accum += Math.hypot(pdx, pdy);
        const gap = Math.max(8, 24 - speed * 0.012);
        let guard = 0;
        while (accum >= gap && guard++ < 4) {
          accum -= gap;
          spawnParticle(starPos.x, starPos.y, speed);
        }
      } else {
        accum = 0;
      }

      // particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (!p.active) continue;
        p.life -= dt;
        if (p.life <= 0) {
          p.active = false;
          p.el.style.opacity = '0';
          continue;
        }
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vx *= 0.9;
        p.vy = p.vy * 0.9 - 30 * dt;
        p.rot += p.rotV * dt;
        const t = p.life / p.maxLife;
        p.el.style.transform =
          `translate3d(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px, 0) translate(-50%, -50%) ` +
          `rotate(${p.rot.toFixed(1)}deg) scale(${(0.3 + 0.7 * t).toFixed(3)})`;
        p.el.style.opacity = (p.alpha * t).toFixed(3);
      }

      raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);

    // ---- interaction states (data-attributes, no React state) ----
    let mouseDown = false;
    const syncNativeText = () => {
      let selecting = false;
      if (mouseDown) {
        try {
          const sel = window.getSelection();
          selecting = !!sel && !sel.isCollapsed;
        } catch {
          /* ignore */
        }
      }
      const overText = root.dataset.cursorState === 'text';
      html.classList.toggle('cursor-native-text', overText || selecting);
    };

    const setState = (state) => {
      root.dataset.cursorState = state || 'idle';
      syncNativeText();
    };
    const setLabel = (text) => {
      if (!labelRef.current) return;
      labelRef.current.textContent = text || '';
      root.dataset.cursorLabel = text ? '1' : '0';
    };

    const stateFor = (el) => {
      if (el.matches(TEXT_FIELDS) || el.isContentEditable) return 'text';
      if (el.dataset.cursorState) return el.dataset.cursorState;
      if (el.matches('a, button, [role="button"], label')) return 'attract';
      if (el.dataset.cursor !== undefined) return 'card';
      return 'idle';
    };

    const onMove = (e) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!visible) {
        // snap on first reveal so the star doesn't fly in from the centre
        starPos.x = glowPos.x = target.x;
        starPos.y = glowPos.y = target.y;
        prevX = target.x;
        prevY = target.y;
        last = performance.now();
        setVisible(true);
      }
    };

    const onOver = (e) => {
      const el = e.target.closest?.(INTERACTIVE);
      if (!el) {
        setState('idle');
        setLabel('');
        return;
      }
      setState(stateFor(el));
      setLabel(el.dataset.cursorLabel || '');
    };

    const onOut = (e) => {
      const to = e.relatedTarget?.closest?.(INTERACTIVE);
      if (!to) {
        setState('idle');
        setLabel('');
      }
    };

    const onDown = (e) => {
      mouseDown = true;
      syncNativeText();
      if (!reduced && trailRef.current) {
        for (let i = 0; i < BURST_COUNT; i++) {
          spawnParticle(e.clientX, e.clientY, 1400);
        }
      }
      root.classList.add('is-press');
      window.clearTimeout(pressTimer);
      pressTimer = window.setTimeout(() => root.classList.remove('is-press'), 380);
    };

    const onUp = () => {
      mouseDown = false;
      syncNativeText();
    };

    const onLeaveWindow = () => setVisible(false);

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mousedown', onDown, { passive: true });
    window.addEventListener('mouseup', onUp, { passive: true });
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    document.addEventListener('selectionchange', syncNativeText);
    html.addEventListener('mouseleave', onLeaveWindow);

    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(pressTimer);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      document.removeEventListener('selectionchange', syncNativeText);
      html.removeEventListener('mouseleave', onLeaveWindow);
      particles.forEach(({ el }) => el.remove());
      html.classList.remove('has-custom-cursor', 'cursor-native-text');
    };
  }, [disabled]);

  if (disabled) return null;

  return (
    <>
      {/* Background ambient glow (low z-index: behind all content) */}
      <div ref={glowRef} className="stardust-glow" data-tone="dark" aria-hidden="true" />

      {/* The star + its trail */}
      <div
        ref={rootRef}
        data-cursor-state="idle"
        data-cursor-label="0"
        className="stardust-root"
        aria-hidden="true"
      >
        <div ref={starRef} className="stardust-star">
          <div className="stardust-inner">
            <svg className="stardust-glyph" viewBox="0 0 24 24" fill="currentColor">
              <path d={STAR_PATH} />
            </svg>
            <span ref={labelRef} className="stardust-label" />
          </div>
        </div>
      </div>
    </>
  );
}
