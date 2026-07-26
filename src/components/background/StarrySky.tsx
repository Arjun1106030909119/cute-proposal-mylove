"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

export function StarrySky() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId = 0;
    let stars: Star[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      stars = Array.from({ length: 180 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleOffset: Math.random() * Math.PI * 2,
      }));
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        const twinkle = reducedMotion
          ? star.opacity
          : star.opacity *
            (0.5 + 0.5 * Math.sin(time * star.twinkleSpeed + star.twinkleOffset));

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${twinkle})`;
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

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    />
  );
}

export function Moon() {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      className="pointer-events-none absolute right-[8%] top-[12%] z-10"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        className="relative h-24 w-24 md:h-32 md:w-32"
        animate={reducedMotion ? {} : { y: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/90 to-white/60 shadow-[0_0_60px_rgba(255,255,255,0.3)]" />
        <div className="absolute left-4 top-3 h-4 w-4 rounded-full bg-white/10 md:h-5 md:w-5" />
        <div className="absolute right-6 top-8 h-3 w-3 rounded-full bg-white/10 md:h-4 md:w-4" />
        <div className="absolute bottom-6 left-8 h-2 w-2 rounded-full bg-white/10" />
      </motion.div>
    </motion.div>
  );
}

export function Clouds() {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-[5] overflow-hidden" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute h-16 w-48 rounded-full bg-white/[0.03] blur-xl md:h-24 md:w-72"
          style={{ top: `${15 + i * 20}%` }}
          initial={{ x: "-30%" }}
          animate={{ x: "130%" }}
          transition={{
            duration: 40 + i * 15,
            repeat: Infinity,
            ease: "linear",
            delay: i * 8,
          }}
        />
      ))}
    </div>
  );
}

export function AuroraBackground() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d1117] via-[#0d1117] to-[#1a0a12]" />
      {!reducedMotion && (
        <>
          <motion.div
            className="absolute -left-1/4 top-0 h-[60vh] w-[80vw] rounded-full bg-primary/10 blur-[120px]"
            animate={{ x: [0, 50, 0], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -right-1/4 top-1/4 h-[50vh] w-[70vw] rounded-full bg-primary-light/10 blur-[100px]"
            animate={{ x: [0, -40, 0], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-0 left-1/4 h-[40vh] w-[60vw] rounded-full bg-[#ffc2d1]/5 blur-[80px]"
            animate={{ y: [0, -20, 0], opacity: [0.15, 0.3, 0.15] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      )}
    </div>
  );
}
