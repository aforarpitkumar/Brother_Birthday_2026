/**
 * Tiny pub/sub "effects" bus — lets any component (even deep inside a modal
 * or a canvas game) fire confetti or show a toast without prop drilling.
 */
const listeners = new Set();

export function onFx(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function emit(event) {
  listeners.forEach((fn) => fn(event));
}

/** Fire a confetti burst. opts: { count, x, y } in 0..1 viewport fractions. */
export const burstConfetti = (opts) => emit({ type: "confetti", opts });

/** Show a short toast message at the bottom of the screen. */
export const toast = (message, emoji = "🎉") => emit({ type: "toast", message, emoji });
