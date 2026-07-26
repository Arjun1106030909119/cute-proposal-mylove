"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail } from "lucide-react";
import { fadeUp, staggerContainer } from "@/utils/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/* PERSONALIZE: Write your love letter here */
const LOVE_LETTER = `My Dearest,

From the moment you entered my life, everything changed. You brought colors I never knew existed, laughter that fills my soul, and a love so deep it takes my breath away.

On your special day, I want you to know that you are the most precious gift I've ever received. Every sunrise reminds me of your smile, every starry night of your eyes.

You make ordinary moments extraordinary. You make me want to be the best version of myself. You make my heart feel full in ways I never imagined possible.

Thank you for being you. Thank you for choosing me. Thank you for every moment we've shared and every moment yet to come.

With all my love, forever and always.

Yours truly ❤️`;

function TypewriterLetter({ text, active }: { text: string; active: boolean }) {
  const reducedMotion = useReducedMotion();
  const [displayed, setDisplayed] = useState(reducedMotion ? text : "");

  useEffect(() => {
    if (!active || reducedMotion) return;

    let index = 0;
    const interval = setInterval(() => {
      index++;
      setDisplayed(text.slice(0, index));
      if (index >= text.length) clearInterval(interval);
    }, 25);

    return () => clearInterval(interval);
  }, [active, text, reducedMotion]);

  return (
    <p className="whitespace-pre-line font-sans text-sm leading-relaxed text-gray-700 md:text-base">
      {displayed}
    </p>
  );
}

export function LoveLetter() {
  const [opened, setOpened] = useState(false);

  return (
    <section
      id="love-letter"
      className="relative py-24 md:py-32"
      aria-label="Love letter"
    >
      <div className="mx-auto max-w-2xl px-6">
        <motion.div
          className="mb-16 text-center"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.p variants={fadeUp} className="text-sm uppercase tracking-[0.3em] text-primary-light">
            From My Heart
          </motion.p>
          <motion.h2 variants={fadeUp} className="mt-4 font-display text-4xl font-bold text-white md:text-5xl">
            Love Letter
          </motion.h2>
        </motion.div>

        <div className="flex justify-center">
          <AnimatePresence mode="wait">
            {!opened ? (
              <motion.button
                key="envelope"
                className="group relative cursor-pointer"
                onClick={() => setOpened(true)}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, rotateX: 90 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.05, y: -5 }}
                aria-label="Open love letter envelope"
              >
                {/* Envelope body */}
                <div className="relative h-48 w-72 md:h-56 md:w-80">
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/80 to-primary-light/60 shadow-2xl shadow-primary/20" />
                  {/* Envelope flap */}
                  <motion.div
                    className="absolute left-0 right-0 top-0 h-24 origin-top md:h-28"
                    style={{
                      background: "linear-gradient(135deg, #ff8fab 0%, #ffc2d1 100%)",
                      clipPath: "polygon(0 0, 50% 70%, 100% 0)",
                    }}
                    whileHover={{ rotateX: -15 }}
                  />
                  {/* Heart seal */}
                  <div className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-transform group-hover:scale-110">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                </div>
                <p className="mt-4 text-center text-sm text-white/50">
                  Click to open
                </p>
              </motion.button>
            ) : (
              <motion.div
                key="letter"
                className="relative w-full max-w-lg"
                initial={{ opacity: 0, y: 50, rotateX: -20 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Paper */}
                <div className="relative rounded-sm bg-[#fffef8] p-8 shadow-2xl md:p-12">
                  <div className="absolute left-8 top-0 h-full w-px bg-primary/10" />
                  <TypewriterLetter text={LOVE_LETTER} active={opened} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
