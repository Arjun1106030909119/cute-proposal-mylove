import confetti from "canvas-confetti";

export function burstConfetti(options?: confetti.Options) {
  const defaults: confetti.Options = {
    particleCount: 120,
    spread: 70,
    origin: { y: 0.6 },
    colors: ["#ff4d6d", "#ff8fab", "#ffc2d1", "#ffffff"],
    ...options,
  };

  confetti(defaults);
}

export function fireworksConfetti() {
  const duration = 3000;
  const animationEnd = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.6 },
      colors: ["#ff4d6d", "#ff8fab", "#ffc2d1"],
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.6 },
      colors: ["#ff4d6d", "#ff8fab", "#ffc2d1"],
    });

    if (Date.now() < animationEnd) {
      requestAnimationFrame(frame);
    }
  };

  frame();
}

export function heartConfetti() {
  confetti({
    particleCount: 80,
    spread: 100,
    origin: { y: 0.5 },
    colors: ["#ff4d6d", "#ff8fab"],
    shapes: ["circle"],
    scalar: 1.2,
  });
}
