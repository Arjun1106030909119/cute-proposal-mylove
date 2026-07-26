"use client";

import { useEffect, useRef } from "react";

interface FireworksProps {
  active: boolean;
  onComplete?: () => void;
}

export function Fireworks({ active, onComplete }: FireworksProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      color: string;
      size: number;
    }

    let particles: Particle[] = [];
    let animationId = 0;
    const colors = ["#ff4d6d", "#ff8fab", "#ffc2d1", "#ffffff", "#ffd700"];

    const createBurst = (x: number, y: number) => {
      const count = 60;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.3;
        const speed = Math.random() * 4 + 2;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          maxLife: Math.random() * 60 + 40,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 3 + 1,
        });
      }
    };

    // Initial bursts
    createBurst(canvas.width * 0.3, canvas.height * 0.4);
    setTimeout(() => createBurst(canvas.width * 0.7, canvas.height * 0.3), 300);
    setTimeout(() => createBurst(canvas.width * 0.5, canvas.height * 0.5), 600);
    setTimeout(() => createBurst(canvas.width * 0.2, canvas.height * 0.5), 900);
    setTimeout(() => createBurst(canvas.width * 0.8, canvas.height * 0.4), 1200);

    const draw = () => {
      ctx.fillStyle = "rgba(13, 17, 23, 0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles = particles.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05;
        p.life++;

        const alpha = 1 - p.life / p.maxLife;
        if (alpha <= 0) return false;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.fill();
        ctx.globalAlpha = 1;

        return true;
      });

      if (particles.length > 0) {
        animationId = requestAnimationFrame(draw);
      } else {
        // All particles have faded — notify parent
        onComplete?.();
      }
    };

    animationId = requestAnimationFrame(draw);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-20"
      aria-hidden="true"
    />
  );
}
