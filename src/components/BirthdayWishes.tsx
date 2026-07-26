"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/utils/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/* PERSONALIZE: Customize birthday wishes */
const WISHES = [
  "May your day be as beautiful as you are",
  "Wishing you endless joy and laughter",
  "May all your dreams come true",
  "Here's to another year of adventures together",
  "You deserve all the happiness in the world",
];

function Petals() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId = 0;

    interface Petal {
      x: number;
      y: number;
      size: number;
      speed: number;
      rotation: number;
      rotationSpeed: number;
      opacity: number;
      color: string;
    }

    let petals: Petal[] = [];
    const colors = ["#ff4d6d", "#ff8fab", "#ffc2d1", "#ffb3c6"];

    const resize = () => {
      const section = canvas.parentElement;
      if (section) {
        canvas.width = section.clientWidth;
        canvas.height = section.clientHeight;
      }
    };

    resize();
    window.addEventListener("resize", resize);

    petals = Array.from({ length: 20 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      size: Math.random() * 8 + 4,
      speed: Math.random() * 1 + 0.5,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      opacity: Math.random() * 0.6 + 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      petals.forEach((p) => {
        p.y += p.speed;
        p.x += Math.sin(p.y * 0.01) * 0.5;
        p.rotation += p.rotationSpeed;

        if (p.y > canvas.height + 20) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
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
      className="pointer-events-none absolute inset-0"
      aria-hidden="true"
    />
  );
}

function SparkleText({ text, delay }: { text: string; delay: number }) {
  return (
    <motion.p
      className="relative font-display text-lg text-white/80 md:text-xl"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {text}
      <motion.span
        className="ml-2 inline-block"
        animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
        transition={{ duration: 2, repeat: Infinity, delay: delay * 0.5 }}
        aria-hidden="true"
      >
        ✨
      </motion.span>
    </motion.p>
  );
}

export function BirthdayWishes() {
  return (
    <section
      id="wishes"
      className="relative overflow-hidden py-24 md:py-32"
      aria-label="Birthday wishes"
    >
      <Petals />

      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.p variants={fadeUp} className="text-sm uppercase tracking-[0.3em] text-primary-light">
            With Love
          </motion.p>
          <motion.h2 variants={fadeUp} className="mt-4 font-display text-4xl font-bold text-white md:text-5xl">
            Birthday Wishes
          </motion.h2>
        </motion.div>

        <div className="mt-12 space-y-6">
          {WISHES.map((wish, index) => (
            <SparkleText key={index} text={wish} delay={index * 0.2} />
          ))}
        </div>

        {/* Butterflies */}
        <div className="mt-12 flex justify-center gap-12" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="text-3xl"
              animate={{
                y: [0, -15, 0],
                x: [0, i % 2 === 0 ? 10 : -10, 0],
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5,
              }}
            >
              🦋
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}
