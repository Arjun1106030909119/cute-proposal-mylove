"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative border-t border-white/5 py-12" role="contentinfo">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <Heart
            className="mx-auto h-6 w-6 fill-primary/40 text-primary/40"
            aria-hidden="true"
          />
          <p className="mt-4 font-display text-sm text-white/40">
            {/* PERSONALIZE: Add your names or a personal message */}
            Made with love, just for you
          </p>
          <p className="mt-2 text-xs text-white/20">
            © {new Date().getFullYear()} • A special birthday surprise
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
