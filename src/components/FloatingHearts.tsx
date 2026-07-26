"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import { randomBetween } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface FloatingHeart {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
}

export function FloatingHearts() {
  const [hearts, setHearts] = useState<FloatingHeart[]>([]);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const interval = setInterval(() => {
      setHearts((prev) => {
        const next = [
          ...prev,
          {
            id: Date.now() + Math.random(),
            x: randomBetween(5, 95),
            size: randomBetween(12, 24),
            duration: randomBetween(6, 12),
            delay: 0,
          },
        ];
        return next.slice(-15);
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[4] overflow-hidden" aria-hidden="true">
      <AnimatePresence>
        {hearts.map((heart) => (
          <motion.div
            key={heart.id}
            className="absolute bottom-0 text-primary/30"
            style={{ left: `${heart.x}%`, width: heart.size, height: heart.size }}
            initial={{ y: 0, opacity: 0, rotate: 0 }}
            animate={{ y: "-110vh", opacity: [0, 0.6, 0], rotate: 360 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: heart.duration,
              ease: "easeOut",
            }}
          >
            <Heart className="h-full w-full fill-current" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
