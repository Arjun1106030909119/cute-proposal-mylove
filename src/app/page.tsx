"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence } from "framer-motion";
import { LoadingScreen } from "@/components/LoadingScreen";
import { Hero } from "@/components/Hero";
import { Timeline } from "@/components/Timeline";
import { Reasons } from "@/components/Reasons";
import { Gallery } from "@/components/Gallery";
import { LoveLetter } from "@/components/LoveLetter";
import { InteractiveSky } from "@/components/InteractiveSky";
import { BirthdayWishes } from "@/components/BirthdayWishes";
import { Proposal } from "@/components/Proposal";
import { Footer } from "@/components/Footer";
import { MusicPlayer } from "@/components/MusicPlayer";
import { CursorGlow } from "@/components/CursorGlow";
import { FloatingHearts } from "@/components/FloatingHearts";
import { AuroraBackground, StarrySky } from "@/components/background/StarrySky";
import { FloatingParticles } from "@/components/background/FloatingParticles";
import { Fireflies } from "@/components/background/Fireflies";
import { useLenis } from "@/hooks/useLenis";
import { useInteraction } from "@/hooks/useInteraction";

const Cake = dynamic(() => import("@/components/Cake").then((m) => m.Cake), {
  ssr: false,
  loading: () => (
    <div className="flex h-[400px] items-center justify-center">
      <div className="h-12 w-12 animate-pulse rounded-full bg-primary/20" />
    </div>
  ),
});

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const { hasInteracted, markInteracted } = useInteraction();

  useLenis(!loading);

  const handleLoadingComplete = useCallback(() => {
    setLoading(false);
    setTimeout(() => setShowContent(true), 100);
  }, []);

  const handleInteraction = useCallback(() => {
    markInteracted();
  }, [markInteracted]);

  return (
    <main className="relative overflow-x-hidden">
      {/* Global backgrounds */}
      <AuroraBackground />
      <StarrySky />
      <FloatingParticles />
      <Fireflies />
      <FloatingHearts />
      <CursorGlow />

      {/* Loading screen */}
      <AnimatePresence>
        {loading && (
          <LoadingScreen
            onComplete={handleLoadingComplete}
            onInteraction={handleInteraction}
          />
        )}
      </AnimatePresence>

      {/* Main content */}
      {showContent && (
        <>
          <Hero onBegin={handleInteraction} />
          <Timeline />
          <Reasons />
          <Gallery />
          <Cake />
          <LoveLetter />
          <InteractiveSky />
          <BirthdayWishes />
          <Proposal />
          <Footer />
        </>
      )}

      {/* Music player - only active after interaction */}
      <MusicPlayer hasInteracted={hasInteracted} />
    </main>
  );
}
