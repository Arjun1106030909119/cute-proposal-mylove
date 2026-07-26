"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Moon, Clouds } from "@/components/background/StarrySky";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface HeroProps {
  onBegin: () => void;
}

function TypewriterText({ text, delay = 0 }: { text: string; delay?: number }) {
  const reducedMotion = useReducedMotion();
  const [displayed, setDisplayed] = useState(reducedMotion ? text : "");

  useEffect(() => {
    if (reducedMotion) return;

    let index = 0;
    let interval: ReturnType<typeof setInterval> | undefined;
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        index++;
        setDisplayed(text.slice(0, index));
        if (index >= text.length && interval) clearInterval(interval);
      }, 50);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [text, delay, reducedMotion]);

  return (
    <span>
      {displayed}
      {!reducedMotion && displayed.length < text.length && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="inline-block w-[2px]"
        >
          |
        </motion.span>
      )}
    </span>
  );
}

export function Hero({ onBegin }: HeroProps) {
  const reducedMotion = useReducedMotion();

  const scrollToTimeline = () => {
    onBegin();
    document.getElementById("timeline")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6"
      aria-label="Hero section"
    >
      <Moon />
      <Clouds />

      <motion.div
        className="relative z-20 text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.h1
          className="font-display text-5xl font-bold leading-tight text-white md:text-7xl lg:text-8xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <TypewriterText text="Happy Birthday" delay={800} />
          <motion.span
            className="ml-3 inline-block text-primary"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 2, type: "spring", stiffness: 200 }}
          >
            ❤️
          </motion.span>
        </motion.h1>

        <motion.p
          className="mt-6 max-w-lg font-sans text-lg text-white/70 md:text-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
        >
          <TypewriterText
            text="I made something special only for you."
            delay={2500}
          />
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10"
        >
          <Button size="lg" onClick={scrollToTimeline} aria-label="Begin the journey">
            Begin the Journey
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-10 z-20"
        animate={reducedMotion ? {} : { y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown className="h-6 w-6 text-white/30" aria-hidden="true" />
      </motion.div>

      {!reducedMotion && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-10"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 8, ease: "easeOut" }}
        />
      )}
    </section>
  );
}
