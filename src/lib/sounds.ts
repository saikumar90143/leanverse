/**
 * sounds.ts
 * Lightweight Web Audio API sound cues. No external dependencies.
 * All functions are safe to call even when AudioContext is blocked/unavailable.
 */

let _ctx: AudioContext | null = null;

/** Get or lazily create the shared AudioContext. Returns null if unsupported. */
function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!_ctx || _ctx.state === 'closed') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      if (!AC) return null;
      _ctx = new AC();
    }
    return _ctx;
  } catch {
    return null;
  }
}

/** Resume context on user interaction if it was suspended (autoplay policy). */
async function ensureRunning(ctx: AudioContext): Promise<boolean> {
  try {
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }
    return ctx.state === 'running';
  } catch {
    return false;
  }
}

/**
 * Plays a short satisfying "thud-click" when a set is marked complete.
 * Two quick sine bursts at low frequency.
 */
export async function playSetComplete(): Promise<void> {
  const ctx = getCtx();
  if (!ctx) return;
  const ok = await ensureRunning(ctx);
  if (!ok) return;

  const now = ctx.currentTime;

  // First thud
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(220, now);
  osc1.frequency.exponentialRampToValueAtTime(80, now + 0.07);
  gain1.gain.setValueAtTime(0.4, now);
  gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
  osc1.connect(gain1);
  gain1.connect(ctx.destination);
  osc1.start(now);
  osc1.stop(now + 0.12);

  // Second click
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = 'square';
  osc2.frequency.setValueAtTime(440, now + 0.05);
  osc2.frequency.exponentialRampToValueAtTime(220, now + 0.1);
  gain2.gain.setValueAtTime(0.15, now + 0.05);
  gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
  osc2.connect(gain2);
  gain2.connect(ctx.destination);
  osc2.start(now + 0.05);
  osc2.stop(now + 0.18);
}

/**
 * Plays a bright ascending 3-beep tone when the rest timer hits 0:00.
 */
export async function playTimerEnd(): Promise<void> {
  const ctx = getCtx();
  if (!ctx) return;
  const ok = await ensureRunning(ctx);
  if (!ok) return;

  const now = ctx.currentTime;
  const freqs = [523, 659, 784]; // C5, E5, G5 — pleasant major chord
  const startOffsets = [0, 0.18, 0.36];

  freqs.forEach((freq, i) => {
    const start = now + startOffsets[i];
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, start);
    gain.gain.setValueAtTime(0.0, start);
    gain.gain.linearRampToValueAtTime(0.35, start + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.22);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + 0.25);
  });
}
