"use client";

import { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp, staggerContainer } from "@/utils/animations";
import { burstConfetti, fireworksConfetti } from "@/utils/confetti";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/* PERSONALIZE: Change the birthday wish message */
const WISH_MESSAGE = "May all your dreams come true, and may our love grow stronger with every passing day. Happy Birthday, my love! 🎂";

function Candle({ position, lit, onClick }: { position: [number, number, number]; lit: boolean; onClick: () => void }) {
  const flameRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (flameRef.current && lit) {
      flameRef.current.scale.y = 1 + Math.sin(clock.elapsedTime * 8) * 0.15;
      flameRef.current.position.y = position[1] + 0.55 + Math.sin(clock.elapsedTime * 6) * 0.02;
    }
  });

  return (
    <group position={position}>
      <mesh onClick={onClick} onPointerOver={() => document.body.style.cursor = "pointer"} onPointerOut={() => document.body.style.cursor = "auto"}>
        <cylinderGeometry args={[0.04, 0.04, 0.3, 8]} />
        <meshStandardMaterial color="#fff5e6" />
      </mesh>
      {lit && (
        <mesh ref={flameRef} position={[0, 0.55, 0]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color="#ff6b35" emissive="#ff4500" emissiveIntensity={2} />
        </mesh>
      )}
    </group>
  );
}

function CakeModel({ candlesLit, onCandleClick }: { candlesLit: boolean[]; onCandleClick: (i: number) => void }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.3) * 0.1;
    }
  });

  const candlePositions: [number, number, number][] = [
    [-0.2, 0.5, -0.1],
    [0.2, 0.5, -0.1],
    [0, 0.5, 0.15],
  ];

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={groupRef}>
        {/* Bottom tier */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[1, 1.1, 0.6, 32]} />
          <meshStandardMaterial color="#ffc2d1" roughness={0.3} />
        </mesh>
        {/* Middle tier */}
        <mesh position={[0, 0.45, 0]}>
          <cylinderGeometry args={[0.75, 0.85, 0.5, 32]} />
          <meshStandardMaterial color="#ff8fab" roughness={0.3} />
        </mesh>
        {/* Top tier */}
        <mesh position={[0, 0.85, 0]}>
          <cylinderGeometry args={[0.5, 0.6, 0.4, 32]} />
          <meshStandardMaterial color="#ff4d6d" roughness={0.3} />
        </mesh>
        {/* Frosting dots */}
        {[...Array(12)].map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(angle) * 0.9, 0.31, Math.sin(angle) * 0.9]}>
              <sphereGeometry args={[0.06, 8, 8]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
          );
        })}
        {candlePositions.map((pos, i) => (
          <Candle key={i} position={pos} lit={candlesLit[i]} onClick={() => onCandleClick(i)} />
        ))}
        <Sparkles count={30} scale={3} size={2} speed={0.3} color="#ffc2d1" />
      </group>
    </Float>
  );
}

function SmokeParticles({ show }: { show: boolean }) {
  if (!show) return null;

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-3 w-3 rounded-full bg-white/20 blur-sm"
          initial={{ opacity: 0.6, y: 0, x: (i - 4) * 10 }}
          animate={{ opacity: 0, y: -80, x: (i - 4) * 30 }}
          transition={{ duration: 2, delay: i * 0.1 }}
        />
      ))}
    </div>
  );
}

export function Cake() {
  const [candlesLit, setCandlesLit] = useState([true, true, true]);
  const [blown, setBlown] = useState(false);
  const [showWish, setShowWish] = useState(false);
  const [showSmoke, setShowSmoke] = useState(false);
  const reducedMotion = useReducedMotion();

  const handleCandleClick = (index: number) => {
    if (blown) return;

    const newLit = [...candlesLit];
    newLit[index] = false;
    setCandlesLit(newLit);

    if (newLit.every((c) => !c)) {
      setShowSmoke(true);
      setTimeout(() => {
        setBlown(true);
        setShowWish(true);
        burstConfetti();
        setTimeout(() => fireworksConfetti(), 500);
      }, 800);
    }
  };

  return (
    <section
      id="cake"
      className="relative py-24 md:py-32"
      aria-label="Birthday cake"
    >
      <div className="mx-auto max-w-4xl px-6">
        <motion.div
          className="mb-12 text-center"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.p variants={fadeUp} className="text-sm uppercase tracking-[0.3em] text-primary-light">
            Make a Wish
          </motion.p>
          <motion.h2 variants={fadeUp} className="mt-4 font-display text-4xl font-bold text-white md:text-5xl">
            Birthday Cake
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-white/50">
            Click each candle to blow them out
          </motion.p>
        </motion.div>

        <div className="relative mx-auto h-[400px] w-full max-w-lg">
          {!reducedMotion ? (
            <Canvas camera={{ position: [0, 1.5, 4], fov: 45 }}>
              <ambientLight intensity={0.4} />
              <pointLight position={[5, 5, 5]} intensity={1} color="#ffc2d1" />
              <pointLight position={[-5, 3, -5]} intensity={0.5} color="#ff4d6d" />
              <Suspense fallback={null}>
                <CakeModel candlesLit={candlesLit} onCandleClick={handleCandleClick} />
              </Suspense>
            </Canvas>
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="glass rounded-3xl p-12 text-center">
                <p className="text-6xl">🎂</p>
                <button
                  onClick={() => {
                    setBlown(true);
                    setShowWish(true);
                    burstConfetti();
                  }}
                  className="mt-4 text-primary-light underline"
                >
                  Blow out candles
                </button>
              </div>
            </div>
          )}
          <SmokeParticles show={showSmoke} />
        </div>

        <AnimatePresence>
          {showWish && (
            <motion.div
              className="mx-auto mt-8 max-w-lg text-center"
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="font-display text-xl leading-relaxed text-white/90 md:text-2xl">
                {WISH_MESSAGE}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
