"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface Firefly {
  x: number;
  y: number;
  phase: number;
  speed: number;
}

export function Fireflies() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId = 0;
    let fireflies: Firefly[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      fireflies = Array.from({ length: 25 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.5 + 0.2,
      }));
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      fireflies.forEach((f) => {
        const glow = 0.3 + 0.7 * Math.sin(time * 0.002 * f.speed + f.phase);
        f.x += Math.sin(time * 0.001 + f.phase) * 0.3;
        f.y += Math.cos(time * 0.0008 + f.phase) * 0.2;

        if (f.x < 0) f.x = canvas.width;
        if (f.x > canvas.width) f.x = 0;
        if (f.y < 0) f.y = canvas.height;
        if (f.y > canvas.height) f.y = 0;

        const gradient = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, 8);
        gradient.addColorStop(0, `rgba(255, 194, 209, ${glow})`);
        gradient.addColorStop(1, "rgba(255, 194, 209, 0)");

        ctx.beginPath();
        ctx.arc(f.x, f.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[3]"
      aria-hidden="true"
    />
  );
}
