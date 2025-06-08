// src/audioManager.ts
type Sound = {
  el: HTMLAudioElement;
  play: () => void;
  pause: () => void;
  _primed?: boolean;
};

function make(loop: boolean, src: string, volume = 0.35): Sound {
  const el = new Audio(src);
  el.loop = loop;
  el.volume = volume;
  el.preload = "auto";
  el.load(); // ← kicks off the download right now
  return {
    el,
    play: () => el.play().catch(() => {}),
    pause: () => el.pause(),
  };
}

/* --- export the sounds you need everywhere --- */
export const bgm = make(true, "/sounds/officeNoise.m4a", 0.3);
export const fan = make(true, "/sounds/fan.m4a", 0.4);
export const clap = make(false, "/sounds/clapping.m4a", 0.4);
export const metalHit = make(false, "/sounds/metalHit.m4a", 0.3);
export const paperRustle = make(false, "/sounds/paperRustle.m4a", 0.15);
export const awh = make(false, "/sounds/awh.m4a", 0.4);

export function prime(sound: Sound) {
  // Skip if we primed this clip before
  if (sound._primed) return;

  const { el } = sound;
  if (el.readyState >= 2) {
    // already has data
    sound._primed = true;
    return;
  }

  const origVol = el.volume;
  const origMuted = el.muted;

  el.muted = true; // absolutely no audible leak
  el.volume = 0;

  const p = el.play();
  if (p && typeof p.then === "function") {
    p.then(() => {
      // Now the browser has activated + buffered the clip
      el.pause();
      el.currentTime = 0;
      el.volume = origVol;
      el.muted = origMuted;
      sound._primed = true; // mark as done
    }).catch(() => {
      // e.g. user toggled mute before play resolved
      el.volume = origVol;
      el.muted = origMuted;
    });
  } else {
    // Very old browsers where play() is sync/void
    el.pause();
    el.currentTime = 0;
    el.volume = origVol;
    el.muted = origMuted;
    sound._primed = true;
  }
}
