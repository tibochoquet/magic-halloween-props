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
 *   • touch devices    → the card being centred in the viewport, which is what
 *                        "play when it's in the middle of the screen" means.
 */
export function useCardVideo(hasVideo: boolean) {
  const containerRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  /** Should the video be trying to play right now? */
  const [active, setActive] = useState(false);
  /** Is the video actually rendering frames? Only then may we hide the image. */
  const [playing, setPlaying] = useState(false);

  // Attach/detach the intersection observer on touch devices only.
  useEffect(() => {
    if (!hasVideo) return;
    if (typeof window === "undefined") return;

    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (canHover) return; // pointer devices use the hover handlers below

    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    // A horizontal band across the middle of the viewport. A card counts as
    // "in the middle" when it overlaps that band.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) setActive(entry.isIntersecting);
      },
      { rootMargin: "-38% 0px -38% 0px", threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
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

  // Respect reduced-motion: never auto-play looping video for those users.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) setActive(false);
  }, []);

  const onPointerEnter = useCallback((e: React.PointerEvent) => {
    if (e.pointerType === "mouse") setActive(true);
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
