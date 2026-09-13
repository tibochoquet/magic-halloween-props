"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Drives the image → video swap on a product card.
 *
 * Why this is not plain CSS :hover any more:
 *
 *  1. Touch browsers apply :hover when a finger passes over an element while
 *     scrolling, and keep it applied afterwards. The old CSS hid the product
 *     image (`group-hover:opacity-0`) the moment that happened.
 *  2. The card videos are 2–11 MB and are not preloaded, so on a phone there
 *     was usually nothing decoded to show yet.
 *
 * Together those made the product simply disappear while scrolling.
 *
 * So: the image is only faded out once the video is genuinely playing, and the
 * activation trigger differs per input type —
 *   • pointer devices  → hover, as before
 *   • touch devices    → the card nearest the middle of the viewport, chosen by
 *                        the coordinator below so exactly ONE video plays at a
 *                        time. Several cards can straddle the centre at once,
 *                        and decoding three or four together is rough on older
 *                        phones and on mobile data.
 */

/* ── Single-video coordinator (touch devices only) ─────────────────────────
   One scroll listener for the whole page rather than one per card. On each
   animation frame it picks the visible card whose centre sits closest to the
   viewport centre, and activates only that one.                             */

type Registration = { el: HTMLElement; setActive: (v: boolean) => void };

const registry = new Set<Registration>();
let frame = 0;
let listening = false;

function pickCentreCard() {
  frame = 0;
  const middle = window.innerHeight / 2;
  let winner: Registration | null = null;
  let bestDistance = Infinity;

  // Array.from: the project targets ES5, where Sets are not directly iterable.
  for (const entry of Array.from(registry)) {
    const r = entry.el.getBoundingClientRect();
    // The card must actually straddle the horizontal centre line.
    if (r.top > middle || r.bottom < middle) continue;
    const distance = Math.abs(r.top + r.height / 2 - middle);
    if (distance < bestDistance) {
      bestDistance = distance;
      winner = entry;
    }
  }

  for (const entry of Array.from(registry)) entry.setActive(entry === winner);
}

function schedule() {
  if (frame) return;
  frame = requestAnimationFrame(pickCentreCard);
}

function startListening() {
  if (listening) return;
  listening = true;
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
}

function stopListening() {
  if (!listening || registry.size > 0) return;
  listening = false;
  window.removeEventListener("scroll", schedule);
  window.removeEventListener("resize", schedule);
  if (frame) {
    cancelAnimationFrame(frame);
    frame = 0;
  }
}

export function useCardVideo(hasVideo: boolean) {
  const containerRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  /** Should the video be trying to play right now? */
  const [active, setActive] = useState(false);
  /** Is the video actually rendering frames? Only then may we hide the image. */
  const [playing, setPlaying] = useState(false);

  // Register with the coordinator on touch devices.
  useEffect(() => {
    if (!hasVideo || typeof window === "undefined") return;

    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (canHover) return; // pointer devices use the hover handlers below

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return; // never auto-play looping video for these users

    const el = containerRef.current;
    if (!el) return;

    const registration: Registration = { el, setActive };
    registry.add(registration);
    startListening();
    schedule(); // evaluate immediately, don't wait for the first scroll

    return () => {
      registry.delete(registration);
      setActive(false);
      stopListening();
    };
  }, [hasVideo]);

  // Start/stop playback when activation changes.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    if (active) {
      // play() rejects if the browser blocks autoplay; never let that throw.
      v.play().catch(() => setPlaying(false));
    } else {
      v.pause();
      v.currentTime = 0;
      setPlaying(false);
    }
  }, [active]);

  const onPointerEnter = useCallback((e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setActive(true);
  }, []);

  const onPointerLeave = useCallback((e: React.PointerEvent) => {
    if (e.pointerType === "mouse") setActive(false);
  }, []);

  const videoProps = {
    ref: videoRef,
    muted: true,
    loop: true,
    playsInline: true,
    // Metadata only: enough to start quickly without pulling megabytes on 4G.
    preload: "metadata" as const,
    onPlaying: () => setPlaying(true),
    onPause: () => setPlaying(false),
    onStalled: () => setPlaying(false),
    onError: () => setPlaying(false),
  };

  return {
    containerRef,
    videoProps,
    /** True only when the video is really on screen — safe to hide the image. */
    showVideo: playing,
    onPointerEnter,
    onPointerLeave,
  };
}
