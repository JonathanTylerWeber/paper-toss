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

// export function prime(sound: Sound) {
//   if (sound._primed) return;

//   const { el } = sound;
//   const vol = el.volume;
//   el.volume = 0; // silent
//   el.play().catch(() => {});
//   el.pause(); // pauses immediately, but keeps buffer
//   el.currentTime = 0;
//   el.volume = vol; // restore

//   sound._primed = true;
// }

export function prime(sound: Sound) {
  if (sound._primed) return; // already unlocked

  const { el } = sound;
  const v0 = el.volume;
  const muted0 = el.muted;

  el.volume = 0;
  el.muted = true; // double‑silence ‑ no leaks

  const finish = () => {
    el.pause();
    el.currentTime = 0;
    el.volume = v0;
    el.muted = muted0;
    sound._primed = true; // mark done
  };

  const maybe = el.play(); // browser unlock + start buffering

  if (maybe && typeof maybe.then === "function") {
    // Modern browsers: wait until play() is actually accepted
    maybe.then(finish).catch(finish);
  } else {
    // Older Safari/WebViews: fall back to a 60‑ms micro‑timeout
    setTimeout(finish, 60);
  }
}
