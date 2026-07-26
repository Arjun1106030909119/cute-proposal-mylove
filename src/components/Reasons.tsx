"use client";

import { useRef } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Heart } from "lucide-react";
import { fadeUp, staggerContainer } from "@/utils/animations";

/* PERSONALIZE: Add your own reasons */
const reasons = [
  {
    title: "Your Smile",
    description: "It lights up every room and melts away every worry.",
  },
  {
    title: "Your Kindness",
    description: "The way you care for others shows the beauty of your soul.",
  },
  {
    title: "Your Laugh",
    description: "The most beautiful sound I've ever heard — pure magic.",
  },
  {
    title: "Your Eyes",
    description: "Windows to a world I never want to leave.",
  },
  {
    title: "Everything About You",
    description: "Every little thing that makes you uniquely, perfectly you.",
  },
];

function ReasonCard({
  reason,
  index,
}: {
  reason: (typeof reasons)[0];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-100, 100], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-8, 8]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className="glass group relative cursor-default overflow-hidden rounded-2xl p-8"
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02 }}
    >
      <div className="absolute -right-4 -top-4 opacity-10 transition-opacity group-hover:opacity-20">
        <Heart className="h-24 w-24 fill-primary text-primary" aria-hidden="true" />
      </div>

      <motion.div
        className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/20"
        whileHover={{ scale: 1.2 }}
      >
        <Heart className="h-5 w-5 fill-primary text-primary" aria-hidden="true" />
      </motion.div>

      <h3 className="font-display text-xl font-semibold text-white">
        {reason.title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-white/60">
        {reason.description}
      </p>

      {/* Heart particles on hover */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-primary/40"
            style={{
              left: `${20 + i * 15}%`,
              bottom: "20%",
            }}
            animate={{ y: [-10, -40], opacity: [0.6, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          >
            <Heart className="h-3 w-3 fill-current" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export function Reasons() {
  return (
    <section
      id="reasons"
      className="relative py-24 md:py-32"
      aria-label="Reasons I like you"
    >
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          className="mb-16 text-center"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.p variants={fadeUp} className="text-sm uppercase tracking-[0.3em] text-primary-light">
            Why You
          </motion.p>
          <motion.h2 variants={fadeUp} className="mt-4 font-display text-4xl font-bold text-white md:text-5xl">
            Reasons I Like You
          </motion.h2>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason, index) => (
            <ReasonCard key={reason.title} reason={reason} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
