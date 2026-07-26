"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X, Download, RefreshCw, Send, CheckCircle, AlertCircle } from "lucide-react";
import emailjs from "@emailjs/browser";
import { Button } from "@/components/ui/button";

// ─── EmailJS credentials ───────────────────────────────────────────────────
const EMAILJS_SERVICE_ID  = "service_qbiy1j7";
const EMAILJS_TEMPLATE_ID = "template_fm8cuzg";
const EMAILJS_PUBLIC_KEY  = "5YQbT0xELE2rjKO60";
// ──────────────────────────────────────────────────────────────────────────

type CaptureState = "ask" | "live" | "countdown" | "captured" | "denied";
type SendState    = "idle" | "sending" | "sent" | "error";

interface ReactionCaptureProps {
  onClose?: () => void;
}

export function ReactionCapture({ onClose }: ReactionCaptureProps) {
  const [state,      setState]      = useState<CaptureState>("ask");
  const [sendState,  setSendState]  = useState<SendState>("idle");
  const [countdown,  setCountdown]  = useState(3);
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);

  const videoRef  = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // ── Helpers ──────────────────────────────────────────────────────────────

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setState("live");
    } catch {
      setState("denied");
    }
  }, []);

  /** Send photo to your email via EmailJS */
  const sendPhoto = useCallback(async (dataUrl: string) => {
    setSendState("sending");
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          name    : "She said YES! 💍",
          message : "She just said YES to your proposal! Here is her reaction photo 😍❤️",
          photo   : dataUrl,
          time    : new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
        },
        EMAILJS_PUBLIC_KEY,
      );
      setSendState("sent");
    } catch (err) {
      console.error("EmailJS error:", err);
      setSendState("error");
    }
  }, []);

  const startCountdown = useCallback(() => {
    setState("countdown");
    setCountdown(3);
    let count = 3;

    const interval = setInterval(() => {
      count -= 1;
      setCountdown(count);

      if (count <= 0) {
        clearInterval(interval);

        // Take the photo
        if (videoRef.current && canvasRef.current) {
          const v = videoRef.current;
          const c = canvasRef.current;
          c.width  = v.videoWidth;
          c.height = v.videoHeight;

          // Mirror horizontally so it matches what she saw in preview
          const ctx = c.getContext("2d")!;
          ctx.translate(c.width, 0);
          ctx.scale(-1, 1);
          ctx.drawImage(v, 0, 0);

          const dataUrl = c.toDataURL("image/jpeg", 0.85);
          setPhotoDataUrl(dataUrl);
          stopStream();
          setState("captured");

          // 🚀 Auto-send to your email!
          sendPhoto(dataUrl);
        }
      }
    }, 1000);
  }, [stopStream, sendPhoto]);

  const retake = useCallback(() => {
    setPhotoDataUrl(null);
    setSendState("idle");
    setState("live");
    startCamera();
  }, [startCamera]);

  const download = useCallback(() => {
    if (!photoDataUrl) return;
    const a = document.createElement("a");
    a.href     = photoDataUrl;
    a.download = "her-reaction-moment.jpg";
    a.click();
  }, [photoDataUrl]);

  const handleClose = useCallback(() => {
    stopStream();
    onClose?.();
  }, [stopStream, onClose]);

  useEffect(() => () => stopStream(), [stopStream]);

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        aria-label="Reaction capture dialog"
        role="dialog"
      >
        {/* Floating hearts */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl"
              style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
              animate={{ y: [0, -30, 0], opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 3 }}
            >
              ❤️
            </motion.div>
          ))}
        </div>

        <motion.div
          className="relative mx-4 w-full max-w-lg rounded-3xl border border-white/10 bg-[#0d1117]/90 p-8 shadow-2xl backdrop-blur-xl"
          initial={{ scale: 0.8, y: 40 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 40 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Close */}
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 rounded-full p-2 text-white/40 transition hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          {/* ── ASK ──────────────────────────────────────────────────────── */}
          {state === "ask" && (
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                className="mx-auto mb-6 text-6xl"
                animate={{ rotate: [-5, 5, -5] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                📸
              </motion.div>
              <h2 className="font-display text-2xl font-bold text-white md:text-3xl">
                Capture Your Reaction? 🥺
              </h2>
              <p className="mt-4 leading-relaxed text-white/60">
                I want to see the look on your face right now! 😍
                <br />
                Can I open your front camera for a moment?
              </p>
              <p className="mt-2 text-xs text-white/30">
                Your photo stays only on your device ❤️
              </p>
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Button size="lg" onClick={startCamera} aria-label="Allow camera access">
                  <Camera className="mr-2 h-5 w-5" />
                  Yes, capture me! 📷
                </Button>
                <Button variant="glass" size="lg" onClick={handleClose} aria-label="Skip">
                  Maybe later 🙈
                </Button>
              </div>
            </motion.div>
          )}

          {/* ── LIVE / COUNTDOWN ─────────────────────────────────────────── */}
          {(state === "live" || state === "countdown") && (
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <p className="mb-4 font-display text-lg font-semibold text-white/80">
                {state === "countdown" ? "Smile! 😄" : "Look at this beautiful person! 🥰"}
              </p>

              <div className="relative overflow-hidden rounded-2xl bg-black">
                <video
                  ref={videoRef}
                  className="w-full rounded-2xl"
                  autoPlay
                  playsInline
                  muted
                  style={{ transform: "scaleX(-1)" }}
                  aria-label="Camera preview"
                />
                {state === "countdown" && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.span
                      key={countdown}
                      className="font-display text-9xl font-bold text-white drop-shadow-[0_0_30px_rgba(255,77,109,0.8)]"
                      initial={{ scale: 1.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      {countdown || "❤️"}
                    </motion.span>
                  </div>
                )}
                <div className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-primary/40" aria-hidden="true" />
              </div>

              {state === "live" && (
                <motion.div
                  className="mt-6 flex justify-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Button size="lg" onClick={startCountdown} aria-label="Take photo">
                    <Camera className="mr-2 h-5 w-5" />
                    Take Photo (3s countdown) 📸
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Hidden canvas */}
          <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

          {/* ── CAPTURED ─────────────────────────────────────────────────── */}
          {state === "captured" && photoDataUrl && (
            <motion.div
              className="text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="mb-4 font-display text-lg font-bold text-white">
                You are absolutely gorgeous! 😍❤️
              </p>

              <div className="relative overflow-hidden rounded-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photoDataUrl}
                  alt="Your beautiful reaction"
                  className="w-full rounded-2xl"
                />
                <div className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-primary/60" aria-hidden="true" />
                <motion.div
                  className="pointer-events-none absolute inset-0 flex items-end justify-center pb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  aria-hidden="true"
                >
                  <span className="rounded-full bg-black/50 px-4 py-1 text-sm text-white/80 backdrop-blur-sm">
                    ✨ Captured forever ✨
                  </span>
                </motion.div>
              </div>

              {/* ── Email send status ── */}
              <motion.div
                className="mt-4 flex items-center justify-center gap-2 rounded-xl px-4 py-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {sendState === "sending" && (
                  <div className="flex items-center gap-2 text-yellow-400">
                    <motion.div
                      className="h-4 w-4 rounded-full border-2 border-yellow-400 border-t-transparent"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <span className="text-sm">Sending to him… 💌</span>
                  </div>
                )}
                {sendState === "sent" && (
                  <motion.div
                    className="flex items-center gap-2 text-green-400"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <CheckCircle className="h-5 w-5" />
                    <span className="text-sm font-semibold">Photo sent to him! 💌✅</span>
                  </motion.div>
                )}
                {sendState === "error" && (
                  <div className="flex items-center gap-2 text-red-400">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">Couldn&apos;t send — save it manually below!</span>
                  </div>
                )}
              </motion.div>

              <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Button size="lg" onClick={download} aria-label="Save photo">
                  <Download className="mr-2 h-4 w-4" />
                  Save This Moment 💾
                </Button>
                {sendState === "error" && (
                  <Button variant="glass" size="sm" onClick={() => sendPhoto(photoDataUrl)} aria-label="Retry sending">
                    <Send className="mr-2 h-4 w-4" />
                    Retry Send
                  </Button>
                )}
                <Button variant="glass" size="sm" onClick={retake} aria-label="Retake">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Retake
                </Button>
              </div>
            </motion.div>
          )}

          {/* ── DENIED ───────────────────────────────────────────────────── */}
          {state === "denied" && (
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-4 text-5xl">😢</div>
              <h3 className="font-display text-xl font-bold text-white">Camera access denied</h3>
              <p className="mt-3 text-white/60">
                No worries! I can imagine how beautiful your reaction is. 🥺❤️
              </p>
              <div className="mt-6">
                <Button variant="glass" size="lg" onClick={handleClose}>
                  Close
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
