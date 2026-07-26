"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface LoadingScreenProps {
  onComplete: () => void;
  onInteraction: () => void;
}

export function LoadingScreen({ onComplete, onInteraction }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const duration = reducedMotion ? 800 : 2800;
    const startTime = Date.now();

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const next = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(next);

      if (next < 100) {
        requestAnimationFrame(tick);
      } else {
        setTimeout(onComplete, reducedMotion ? 200 : 600);
      }
    };

    requestAnimationFrame(tick);
  }, [onComplete, reducedMotion]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0d1117]"
        exit={{ opacity: 0, filter: "blur(20px)" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        onClick={onInteraction}
        onKeyDown={onInteraction}
        role="dialog"
        aria-label="Loading"
        aria-live="polite"
      >
        <motion.div
          animate={
            reducedMotion
              ? {}
              : {
                  scale: [1, 1.15, 1],
                }
          }
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Heart
            className="h-16 w-16 fill-primary text-primary drop-shadow-[0_0_30px_rgba(255,77,109,0.6)] md:h-20 md:w-20"
            aria-hidden="true"
          />
        </motion.div>

        <motion.p
          className="mt-8 font-display text-xl text-white/80 md:text-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {progress}%
        </motion.p>

        <motion.div
          className="mt-6 h-1 w-48 overflow-hidden rounded-full bg-white/10 md:w-64"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-primary to-primary-light"
            style={{ width: `${progress}%` }}
            transition={{ ease: "easeOut" }}
          />
        </motion.div>

        <motion.p
          className="mt-8 text-sm text-white/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Tap anywhere to begin the magic ✨
        </motion.p>
      </motion.div>
    </AnimatePresence>
  );
}
