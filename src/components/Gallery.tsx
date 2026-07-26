"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { X, ZoomIn } from "lucide-react";
import { fadeUp, staggerContainer } from "@/utils/animations";

/* PERSONALIZE: Replace with your own photos in /public/images/ */
const photos = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1529333166437-7750a871ead2?w=600&q=80",
    caption: "Us together 💕",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1518199266791-5375a57590ae?w=600&q=80",
    caption: "Beautiful moments",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&q=80",
    caption: "Adventures await",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1516589178581-6dee7827a31c?w=600&q=80",
    caption: "Forever memories",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1474557159969-7e31ee945f9c?w=600&q=80",
    caption: "My favorite person",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
    caption: "Together always",
  },
];

export function Gallery() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxPhoto, setLightboxPhoto] = useState<(typeof photos)[0] | null>(null);
  const constraintsRef = useRef(null);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const threshold = 80;
    if (info.offset.x < -threshold && currentIndex < photos.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else if (info.offset.x > threshold && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <section
      id="gallery"
      className="relative py-24 md:py-32"
      aria-label="Photo gallery"
    >
      <div className="mx-auto max-w-4xl px-6">
        <motion.div
          className="mb-16 text-center"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.p variants={fadeUp} className="text-sm uppercase tracking-[0.3em] text-primary-light">
            Memories
          </motion.p>
          <motion.h2 variants={fadeUp} className="mt-4 font-display text-4xl font-bold text-white md:text-5xl">
            Photo Gallery
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-white/50">
            Drag to browse • Tap to zoom
          </motion.p>
        </motion.div>

        <div ref={constraintsRef} className="relative mx-auto h-[420px] w-full max-w-sm md:h-[480px] md:max-w-md">
          {photos.map((photo, index) => {
            const offset = index - currentIndex;
            const isVisible = Math.abs(offset) <= 2;

            if (!isVisible) return null;

            return (
              <motion.div
                key={photo.id}
                className="polaroid absolute inset-0 cursor-grab active:cursor-grabbing"
                style={{
                  zIndex: photos.length - Math.abs(offset),
                }}
                drag={offset === 0 ? "x" : false}
                dragConstraints={constraintsRef}
                dragElastic={0.2}
                onDragEnd={offset === 0 ? handleDragEnd : undefined}
                animate={{
                  x: offset * 30,
                  y: Math.abs(offset) * 8,
                  rotate: offset * 4,
                  scale: 1 - Math.abs(offset) * 0.05,
                  opacity: 1 - Math.abs(offset) * 0.3,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="overflow-hidden rounded-sm bg-white p-3 pb-12 shadow-2xl shadow-black/40">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.src}
                    alt={photo.caption}
                    className="h-72 w-full object-cover md:h-80"
                    loading="lazy"
                    draggable={false}
                  />
                  <p className="mt-4 text-center font-display text-sm text-gray-700">
                    {photo.caption}
                  </p>
                </div>

                {offset === 0 && (
                  <button
                    onClick={() => setLightboxPhoto(photo)}
                    className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
                    aria-label={`Zoom ${photo.caption}`}
                  >
                    <ZoomIn className="h-5 w-5" />
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>

        <div className="mt-8 flex justify-center gap-2" role="tablist" aria-label="Gallery navigation">
          {photos.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "w-8 bg-primary"
                  : "w-2 bg-white/20 hover:bg-white/40"
              }`}
              role="tab"
              aria-selected={index === currentIndex}
              aria-label={`Photo ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxPhoto && (
          <motion.div
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/90 p-6 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxPhoto(null)}
            role="dialog"
            aria-label="Image lightbox"
          >
            <button
              className="absolute right-6 top-6 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
              onClick={() => setLightboxPhoto(null)}
              aria-label="Close lightbox"
            >
              <X className="h-6 w-6" />
            </button>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={lightboxPhoto.src}
                alt={lightboxPhoto.caption}
                className="max-h-[80vh] max-w-[90vw] rounded-lg object-contain"
              />
              <p className="mt-4 text-center font-display text-lg text-white">
                {lightboxPhoto.caption}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
