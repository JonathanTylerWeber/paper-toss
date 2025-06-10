// src/audioManager.ts
/* ------------------------------------------------------------------ */
/*  Shared AudioContext                                               */
/* ------------------------------------------------------------------ */
declare global {
  interface Window {
    /** Safari‑/‑old‑Chrome prefixed constructor */
    webkitAudioContext?: typeof AudioContext;
  }
}

const AudioCtx = window.AudioContext ?? window.webkitAudioContext;

if (!AudioCtx) {
  throw new Error("Web Audio API is not supported in this browser.");
}

export const ctx = new AudioCtx();

/** Call once (e.g. in App.tsx) after the first user tap/click. */
export function unlockAudioContext() {
  if (ctx.state !== "suspended") return; // already running
  const resume = () => {
    ctx.resume();
    document.removeEventListener("touchstart", resume);
    document.removeEventListener("click", resume);
  };
  document.addEventListener("touchstart", resume, { once: true });
  document.addEventListener("click", resume, { once: true });
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */
async function fetchBuffer(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);

  const array = await res.arrayBuffer();
  try {
    return await ctx.decodeAudioData(array);
  } catch (err) {
    console.error("decodeAudioData failed for", url, err);
    throw err; // surface as a rejected promise
  }
}

type Sound = {
  play: () => void;
  pause: () => void;
  /** true while playing (looping sounds only) */
  isPlaying: () => boolean;
};

/* ------------------------------------------------------------------ */
/*  One‑shot sounds (clap, metalHit, etc.)                            */
/* ------------------------------------------------------------------ */
async function makeOneShot(src: string, volume = 1): Promise<Sound> {
  const buffer = await fetchBuffer(src);
  const gain = ctx.createGain();
  gain.gain.value = volume;
  gain.connect(ctx.destination);

  return {
    play() {
      const node = ctx.createBufferSource();
      node.buffer = buffer;
      node.connect(gain);
      node.start();
    },
    pause: () => {}, // no‑op for SFX
    isPlaying: () => false, // always momentary
  };
}

/* ------------------------------------------------------------------ */
/*  Looping sounds (bgm, fan)                                         */
/* ------------------------------------------------------------------ */
async function makeLoop(src: string, volume = 1): Promise<Sound> {
  const buffer = await fetchBuffer(src);
  const gain = ctx.createGain();
  gain.gain.value = volume;
  gain.connect(ctx.destination);

  let source: AudioBufferSourceNode | null = null;
  let startedAt = 0; // ctx.currentTime when playback started
  let offset = 0; // where we paused

  const buildSource = () => {
    const node = ctx.createBufferSource();
    node.buffer = buffer;
    node.loop = true;
    node.connect(gain);
    return node;
  };

  return {
    play() {
      if (source) return; // already playing
      source = buildSource();
      startedAt = ctx.currentTime - offset;
      source.start(0, offset);
    },
    pause() {
      if (!source) return;
      offset = ctx.currentTime - startedAt;
      source.stop();
      source.disconnect();
      source = null;
    },
    isPlaying: () => !!source,
  };
}

/* ------------------------------------------------------------------ */
/*  Exported sounds + init helper                                     */
/* ------------------------------------------------------------------ */
export let bgm: Sound,
  fan: Sound,
  clap: Sound,
  metalHit: Sound,
  paperRustle: Sound,
  awh: Sound;

/** Pre‑load every audio file – call once before you enter the game. */
export async function initAudio() {
  // load in parallel
  const [bgm_, fan_, clap_, hit_, rustle_, awh_] = await Promise.all([
    makeLoop("/sounds/officeNoise.m4a", 0.2),
    makeLoop("/sounds/fan.m4a", 0.3),
    makeOneShot("/sounds/newClap.m4a", 0.4),
    makeOneShot("/sounds/newMetalHit.m4a", 0.3),
    makeOneShot("/sounds/paperRustle.m4a", 0.15),
    makeOneShot("/sounds/awh.m4a", 0.2),
  ]);

  bgm = bgm_;
  fan = fan_;
  clap = clap_;
  metalHit = hit_;
  paperRustle = rustle_;
  awh = awh_;
}

export const audioReady = initAudio();
