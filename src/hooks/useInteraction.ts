"use client";

import { useCallback, useEffect, useState } from "react";

export function useInteraction() {
  const [hasInteracted, setHasInteracted] = useState(false);

  const markInteracted = useCallback(() => {
    setHasInteracted(true);
  }, []);

  useEffect(() => {
    if (hasInteracted) return;

    const events = ["click", "keydown", "touchstart"] as const;
    const handler = () => markInteracted();

    events.forEach((event) => {
      window.addEventListener(event, handler, { once: true, passive: true });
    });

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handler);
      });
    };
  }, [hasInteracted, markInteracted]);

  return { hasInteracted, markInteracted };
}
