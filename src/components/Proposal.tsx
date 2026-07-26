"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { heartConfetti, fireworksConfetti, burstConfetti } from "@/utils/confetti";
import { Fireworks } from "@/components/Fireworks";
import { ReactionCapture } from "@/components/ReactionCapture";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type ProposalState = "intro" | "question" | "yes" | "not-yet";

function createGalaxyStars(count: number) {
  return Array.from({ length: count }, () => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    opacity: Math.random() * 0.8 + 0.2,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 2,
  }));
}

function createRosePetals(count: number) {
  return Array.from({ length: count }, () => ({
    left: `${Math.random() * 100}%`,
    xDrift: Math.random() * 100 - 50,
    duration: Math.random() * 8 + 6,
    delay: Math.random() * 5,
  }));
}

export function Proposal() {
  const [state, setState] = useState<ProposalState>("intro");
  const [showFireworks, setShowFireworks] = useState(false);
  const [showForwardMsg, setShowForwardMsg] = useState(false);
  const [showReaction, setShowReaction] = useState(false);
  const [celebrationReady, setCelebrationReady] = useState(false);
  const [noCount, setNoCount] = useState(0);
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const reducedMotion = useReducedMotion();
  const galaxyStars = useMemo(() => createGalaxyStars(100), []);
  const rosePetals = useMemo(() => createRosePetals(15), []);

  const handleFireworksComplete = useCallback(() => {
    setShowFireworks(false);
    setShowForwardMsg(true);
  }, []);

  const handleYes = () => {
    setState("yes");
    setShowFireworks(true);
    setShowForwardMsg(false);
    heartConfetti();
    setTimeout(() => fireworksConfetti(), 500);
    setTimeout(() => burstConfetti({ particleCount: 200, spread: 120 }), 1000);
  };

  const handleNotYet = () => {
    const next = noCount + 1;
    setNoCount(next);
    // After 6 clicks → just trigger yes (she has no choice 😂)
    if (next >= 6) {
      handleYes();
      return;
    }
    // Jump the button to a random spot
    const maxX = Math.min(200, window.innerWidth * 0.25);
    const maxY = Math.min(120, window.innerHeight * 0.15);
    setNoPos({
      x: (Math.random() - 0.5) * maxX * 2,
      y: (Math.random() - 0.5) * maxY * 2,
    });
  };

  const handleContinue = () => {
    setState("intro");
    setShowFireworks(false);
    setNoCount(0);
    setNoPos({ x: 0, y: 0 });
    document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="proposal"
      className="relative flex min-h-screen items-center justify-center overflow-hidden py-24"
      aria-label="Love proposal"
    >
      <Fireworks active={showFireworks} onComplete={handleFireworksComplete} />

      {/* Reaction capture modal */}
      <AnimatePresence>
        {showReaction && (
          <ReactionCapture onClose={() => setShowReaction(false)} />
        )}
      </AnimatePresence>

      {/* Forward message — appears after crackers end */}
      <AnimatePresence>
        {showForwardMsg && (
          <motion.div
            className="fixed inset-0 z-[150] flex flex-col items-center justify-center bg-black/60 px-6 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            aria-label="Forward message"
          >
            {/* Sparkle rain */}
            {!reducedMotion &&
              [...Array(20)].map((_, i) => (
                <motion.span
                  key={i}
                  className="pointer-events-none absolute text-xl"
                  style={{ left: `${Math.random() * 100}%`, top: -30 }}
                  animate={{ y: "110vh", opacity: [0, 1, 0], rotate: [0, 360] }}
                  transition={{
                    duration: 4 + Math.random() * 3,
                    repeat: Infinity,
                    delay: Math.random() * 4,
                    ease: "linear",
                  }}
                  aria-hidden="true"
                >
                  {["✨", "💖", "🌹", "⭐", "💕"][i % 5]}
                </motion.span>
              ))}

            <motion.div
              className="text-center"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            >
              {/* Big emoji burst */}
              <motion.div
                className="mb-6 text-7xl"
                animate={reducedMotion ? {} : { scale: [1, 1.15, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                💑
              </motion.div>

              {/* Forward message text */}
              <motion.h2
                className="font-display text-3xl font-bold leading-snug text-white md:text-5xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.9 }}
              >
                This is only the beginning,
                <br />
                <span className="bg-gradient-to-r from-[#ff4d6d] to-[#ffd700] bg-clip-text text-transparent">
                  my love. 💖
                </span>
              </motion.h2>

              <motion.p
                className="mx-auto mt-6 max-w-md text-lg leading-relaxed text-white/70"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.9 }}
              >
                Every moment from here forward, every laugh, every adventure,
                every quiet night — I want to live it all with you. 🌙
                <br />
                <span className="mt-2 block text-white/50">
                  Forever starts right now. ✨
                </span>
              </motion.p>

              <motion.div
                className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.8 }}
              >
                <Button
                  size="lg"
                  onClick={() => setShowReaction(true)}
                  aria-label="Open camera for reaction"
                >
                  📸 Capture My Reaction!
                </Button>
                <Button
                  variant="glass"
                  size="lg"
                  onClick={() => setShowForwardMsg(false)}
                  aria-label="Close forward message"
                >
                  Continue ❤️
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Galaxy background */}
      <div className="absolute inset-0 bg-[#0d1117]" aria-hidden="true">
        {!reducedMotion && (
          <>
            {galaxyStars.map((star, i) => (
              <motion.div
                key={i}
                className="absolute h-1 w-1 rounded-full bg-white"
                style={{
                  left: star.left,
                  top: star.top,
                  opacity: star.opacity,
                }}
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{
                  duration: star.duration,
                  repeat: Infinity,
                  delay: star.delay,
                }}
              />
            ))}
          </>
        )}
      </div>

      {/* Rose petals */}
      {!reducedMotion && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          {rosePetals.map((petal, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl"
              style={{ left: petal.left, top: -20 }}
              animate={{ y: ["0vh", "110vh"], rotate: [0, 360], x: [0, petal.xDrift] }}
              transition={{
                duration: petal.duration,
                repeat: Infinity,
                delay: petal.delay,
                ease: "linear",
              }}
            >
              🌹
            </motion.div>
          ))}
        </div>
      )}

      <div className="relative z-30 mx-auto max-w-2xl rounded-[2rem] bg-[#0d1117]/35 px-6 py-10 text-center backdrop-blur-sm">
        <AnimatePresence mode="wait">
          {state === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.div
                animate={reducedMotion ? {} : { scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="mx-auto mb-8 flex h-24 w-24 items-center justify-center"
              >
                <Heart className="h-full w-full fill-primary text-primary drop-shadow-[0_0_40px_rgba(255,77,109,0.6)]" />
              </motion.div>

              <motion.p
                className="font-display text-2xl leading-relaxed text-white/90 md:text-3xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                You make my world brighter every day.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2, duration: 0.8 }}
                className="mt-12"
              >
                <Button size="lg" onClick={() => setState("question")}>
                  Continue
                </Button>
              </motion.div>
            </motion.div>
          )}

          {state === "question" && (
            <motion.div
              key="question"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, filter: "blur(10px)" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Giant YES takeover after 5 No clicks */}
              {noCount >= 5 ? (
                <motion.div
                  key="takeover"
                  className="flex flex-col items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                >
                  <motion.div
                    className="mb-4 text-6xl"
                    animate={{ rotate: [-10, 10, -10] }}
                    transition={{ duration: 0.4, repeat: Infinity }}
                  >
                    😤
                  </motion.div>
                  <p className="mb-6 font-display text-xl text-white/80">
                    There is literally no other option now 😂
                  </p>
                  <motion.button
                    onClick={handleYes}
                    className="w-full rounded-2xl bg-gradient-to-r from-[#ff4d6d] to-[#ffd700] px-8 py-8 font-display text-5xl font-black text-white shadow-[0_0_60px_rgba(255,77,109,0.8)] md:text-7xl"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    aria-label="The only option is YES"
                  >
                    YES ❤️❤️❤️
                  </motion.button>
                </motion.div>
              ) : (
                <>
                  <motion.div
                    animate={reducedMotion ? {} : { scale: [1, 1.08, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="mx-auto mb-10 flex h-32 w-32 items-center justify-center"
                  >
                    <Heart className="h-full w-full fill-primary text-primary drop-shadow-[0_0_60px_rgba(255,77,109,0.8)]" />
                  </motion.div>

                  <h2 className="font-display text-4xl font-bold text-white md:text-6xl">
                    Will you be mine?
                  </h2>

                  {/* Pleading sub-text that changes each time she clicks No */}
                  {noCount > 0 && (
                    <motion.p
                      key={noCount}
                      className="mt-4 font-display text-lg text-primary"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {[
                        "Wait… what? 😨",
                        "No no no, try again 🙈",
                        "That button is broken, ignore it 😤",
                        "I thought you loved me 😭",
                        "LAST CHANCE before YES takes over 💀",
                      ][noCount - 1]}
                    </motion.p>
                  )}

                  <div className="relative mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                    {/* YES grows bigger each time she clicks No */}
                    <Button
                      size="lg"
                      onClick={handleYes}
                      aria-label="Yes"
                      style={{
                        transform: `scale(${1 + noCount * 0.2})`,
                        transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1)",
                      }}
                    >
                      YES ❤️
                    </Button>

                    {/* No button flies away on click */}
                    <motion.div
                      animate={{ x: noPos.x, y: noPos.y }}
                      transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    >
                      <Button
                        variant="glass"
                        size="lg"
                        onClick={handleNotYet}
                        aria-label="No"
                        style={{
                          opacity: Math.max(0.3, 1 - noCount * 0.15),
                          fontSize: `${Math.max(10, 16 - noCount * 2)}px`,
                          transition: "font-size 0.3s, opacity 0.3s",
                        }}
                      >
                        {[
                          "Not Yet 🙈",
                          "What? 😟",
                          "Why…",
                          "Please no 😢",
                          "Ok fine… 😭",
                        ][Math.min(noCount, 4)]}
                      </Button>
                    </motion.div>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {state === "yes" && (
            <motion.div
              key="yes"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, repeat: 3 }}
                className="mx-auto mb-8 text-8xl"
              >
                💕
              </motion.div>

              <h2 className="font-display text-3xl font-bold text-white md:text-5xl">
                You just made me the happiest person alive.
              </h2>

              <p className="mt-6 text-lg text-white/70">
                Thank you for saying yes. This is just the beginning of our forever. ❤️
              </p>
            </motion.div>
          )}

          {state === "not-yet" && (
            <motion.div
              key="not-yet"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="mx-auto mb-8 text-6xl">🤗</div>

              <h2 className="font-display text-2xl font-semibold leading-relaxed text-white md:text-3xl">
                Thank you for taking this journey with me.
              </h2>

              <p className="mt-6 text-lg leading-relaxed text-white/70">
                No matter what, I hope today made you smile.
                <br />
                Happy Birthday ❤️
              </p>

              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Button size="lg" onClick={handleContinue}>
                  Explore Again
                </Button>
                <Button
                  variant="glass"
                  size="lg"
                  onClick={() => {
                    setState("question");
                  }}
                >
                  Back to the Question
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
