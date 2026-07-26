"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, Music } from "lucide-react";
import { cn } from "@/lib/utils";

// PERSONALIZE: Replace the video ID with your own YouTube video when needed.
const YOUTUBE_VIDEO_ID = "ISbwK-Ftm74";
const TRACK_TITLE = "A song for you";

interface MusicPlayerProps {
  hasInteracted: boolean;
}

type PlayerCommand = "playVideo" | "pauseVideo" | "setVolume" | "mute" | "unMute";

export function MusicPlayer({ hasInteracted }: MusicPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [userExpanded, setUserExpanded] = useState(false);
  const [started, setStarted] = useState(false);
  const [playerLoaded, setPlayerLoaded] = useState(false);

  const sendCommand = useCallback((func: PlayerCommand, args: number[] = []) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func, args }),
      "https://www.youtube-nocookie.com"
    );
  }, []);

  const showPlayerHint = hasInteracted && !started;
  const expanded = userExpanded || showPlayerHint;

  const togglePlay = () => {
    if (!hasInteracted) return;

    if (!started) {
      setStarted(true);
      setIsPlaying(true);
      return;
    }

    if (isPlaying) {
      sendCommand("pauseVideo");
      setIsPlaying(false);
    } else {
      sendCommand("playVideo");
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    if (!started || !playerLoaded) return;

    sendCommand("setVolume", [Math.round(volume * 100)]);
    sendCommand(muted ? "mute" : "unMute");
    if (isPlaying) sendCommand("playVideo");
  }, [isPlaying, muted, playerLoaded, sendCommand, started, volume]);

  return (
    <>
      {started && (
        <iframe
          ref={iframeRef}
          title="Background music"
          src={`https://www.youtube-nocookie.com/embed/${YOUTUBE_VIDEO_ID}?enablejsapi=1&autoplay=1&playsinline=1&rel=0`}
          className="pointer-events-none fixed -left-px -top-px h-px w-px opacity-0"
          allow="autoplay; encrypted-media; picture-in-picture"
          onLoad={() => setPlayerLoaded(true)}
        />
      )}

      <motion.div
        className="fixed bottom-6 right-6 z-[80]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        <AnimatePresence>
          {expanded && (
            <motion.div
              className="glass mb-3 rounded-2xl p-4 shadow-xl"
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
            >
              <p className="mb-3 text-xs text-white/50">Now Playing</p>
              <p className="font-display text-sm text-white">{TRACK_TITLE}</p>

              <div className="mt-3 flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={muted ? 0 : volume}
                  onChange={(event) => {
                    setVolume(Number(event.target.value));
                    setMuted(false);
                  }}
                  className="h-1 w-20 cursor-pointer appearance-none rounded-full bg-white/20 accent-primary"
                  aria-label="Volume"
                />
                <button
                  onClick={() => setMuted((value) => !value)}
                  className="text-white/60 transition-colors hover:text-white"
                  aria-label={muted ? "Unmute" : "Mute"}
                >
                  {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-2">
          <button
            onClick={togglePlay}
            disabled={!hasInteracted}
            className={cn(
              "glass flex h-12 w-12 items-center justify-center rounded-full transition-all hover:scale-105",
              !hasInteracted && "cursor-not-allowed opacity-50"
            )}
            aria-label={isPlaying ? "Pause music" : "Play music"}
          >
            {isPlaying ? <Pause className="h-5 w-5 text-white" /> : <Play className="h-5 w-5 text-white" />}
          </button>

          <button
            onClick={() => setUserExpanded((value) => !value)}
            className="glass flex h-10 w-10 items-center justify-center rounded-full transition-all hover:scale-105"
            aria-label="Toggle music player info"
          >
            <Music className="h-4 w-4 text-white/60" />
          </button>
        </div>
      </motion.div>
    </>
  );
}
