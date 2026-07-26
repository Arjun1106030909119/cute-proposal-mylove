"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Heart, Sparkles, Star, Sun, Moon } from "lucide-react";
import { fadeUp, staggerContainer } from "@/utils/animations";

/* PERSONALIZE: Replace images/videos/text with your own memories */
const timelineItems = [
  {
    id: "first-meet",
    title: "First Meet",
    description:
      "The moment our paths crossed — I didn't know then that my whole world was about to change.",
    icon: Sparkles,
    // Replace with your photo: "/images/first-meet.jpg"
    image: "https://images.unsplash.com/photo-1518199266791-5375a57590ae?w=600&q=80",
    date: "The Beginning",
  },
  {
    id: "first-smile",
    title: "First Smile",
    description:
      "That smile of yours stopped time. In that instant, everything else faded away.",
    icon: Sun,
    image: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&q=80",
    date: "A Beautiful Moment",
  },
  {
    id: "favorite-memory",
    title: "Favorite Memory",
    description:
      "Every laugh we shared, every quiet moment — they all became treasures I hold close.",
    icon: Heart,
    image: "https://images.unsplash.com/photo-1516589178581-6dee7827a31c?w=600&q=80",
    date: "Unforgettable",
  },
  {
    id: "best-moment",
    title: "Best Moment",
    description:
      "When I realized that being with you feels like coming home — warm, safe, and perfect.",
    icon: Star,
    image: "https://images.unsplash.com/photo-1474557159969-7e31ee945f9c?w=600&q=80",
    date: "Pure Joy",
  },
  {
    id: "dream-together",
    title: "Dream Together",
    description:
      "I dream of countless sunsets with you, adventures unwritten, and a love that grows forever.",
    icon: Moon,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
    date: "Forever & Always",
  },
];

function TimelineCard({
  item,
  index,
}: {
  item: (typeof timelineItems)[0];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const Icon = item.icon;

  return (
    <motion.article
      ref={ref}
      className="glass group relative w-[85vw] shrink-0 overflow-hidden rounded-3xl md:w-[420px]"
      initial={{ opacity: 0, x: 60, rotateY: -8 }}
      animate={isInView ? { opacity: 1, x: 0, rotateY: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
    >
      <div className="relative h-56 overflow-hidden md:h-64">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-transparent to-transparent" />
        <div className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 backdrop-blur-sm">
          <Icon className="h-5 w-5 text-primary-light" aria-hidden="true" />
        </div>
      </div>

      <div className="p-6">
        <p className="text-xs font-medium uppercase tracking-widest text-primary-light">
          {item.date}
        </p>
        <h3 className="mt-2 font-display text-2xl font-semibold text-white">
          {item.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-white/60">
          {item.description}
        </p>
      </div>
    </motion.article>
  );
}

export function Timeline() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section
      id="timeline"
      className="relative py-24 md:py-32"
      aria-label="Our love story timeline"
    >
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          className="mb-16 text-center"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.p
            variants={fadeUp}
            className="text-sm uppercase tracking-[0.3em] text-primary-light"
          >
            Our Story
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="mt-4 font-display text-4xl font-bold text-white md:text-5xl"
          >
            Love Story Timeline
          </motion.h2>
        </motion.div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto px-6 pb-8 scrollbar-hide md:gap-8 md:px-[max(1.5rem,calc((100vw-1280px)/2+1.5rem))]"
        role="list"
        aria-label="Timeline cards - scroll horizontally"
      >
        {timelineItems.map((item, index) => (
          <TimelineCard key={item.id} item={item} index={index} />
        ))}
      </div>
    </section>
  );
}
