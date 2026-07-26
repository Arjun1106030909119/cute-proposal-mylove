"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Heart, Star } from "lucide-react";
import { fadeUp, staggerContainer } from "@/utils/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface ClickEffect {
  id: number;
  x: number;
  y: number;
  type: "heart" | "star";
}

export function InteractiveSky() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const effectsRef = useRef<ClickEffect[]>([]);
  const reducedMotion = useReducedMotion();

  const addEffect = useCallback((x: number, y: number) => {
    effectsRef.current.push({
      id: Date.now() + Math.random(),
      x,
      y,
      type: Math.random() > 0.5 ? "heart" : "star",
    });
    if (effectsRef.current.length > 20) {
      effectsRef.current = effectsRef.current.slice(-20);
    }
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const section = canvas.parentElement;
    if (!section) return;

    const handleClick = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      addEffect(e.clientX - rect.left, e.clientY - rect.top);
    };

    section.addEventListener("click", handleClick);
    return () => section.removeEventListener("click", handleClick);
  }, [addEffect, reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId = 0;

    const resize = () => {
      const section = canvas.parentElement;
      if (section) {
        canvas.width = section.clientWidth;
        canvas.height = section.clientHeight;
      }
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      effectsRef.current = effectsRef.current.filter((effect) => {
        const age = Date.now() - effect.id;
        if (age > 2000) return false;

        const progress = age / 2000;
        const size = 20 * (1 - progress * 0.5);
        const alpha = 1 - progress;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.font = `${size}px serif`;
        ctx.fillText(effect.type === "heart" ? "❤️" : "✨", effect.x, effect.y - progress * 60);
        ctx.restore();

        return true;
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
    <section
      id="interactive-sky"
      className="relative min-h-[60vh] cursor-pointer py-24 md:py-32"
      aria-label="Interactive sky - click anywhere"
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-10"
        aria-hidden="true"
      />

      <div className="relative z-20 mx-auto max-w-3xl px-6 text-center">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.p variants={fadeUp} className="text-sm uppercase tracking-[0.3em] text-primary-light">
            Touch the Sky
          </motion.p>
          <motion.h2 variants={fadeUp} className="mt-4 font-display text-4xl font-bold text-white md:text-5xl">
            Interactive Sky
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-white/50">
            Click anywhere to spread love ✨
          </motion.p>
        </motion.div>

        <motion.div
          className="mt-12 flex justify-center gap-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <Heart className="h-8 w-8 animate-pulse text-primary/40" aria-hidden="true" />
          <Star className="h-8 w-8 animate-pulse text-primary-light/40" aria-hidden="true" />
          <Heart className="h-8 w-8 animate-pulse text-primary/40" aria-hidden="true" />
        </motion.div>
      </div>
    </section>
  );
}
