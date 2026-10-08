"use client";

import { useEffect, useRef } from "react";

const FRAME_COUNT = 150;
// Breakpoint exclusively for smartphones / mobile phones (< 768px).
// Tablets (>= 768px, e.g. iPad 768px/810px) and desktops use the 16:9 desktop sequence.
const MOBILE_BREAKPOINT = 768;

// Memory management:
// Mobile 9:16 frames (1536x2752) decode to ~17MB uncompressed bitmap in RAM per image.
// Capping mobile active images to a sliding window of ~14 frames prevents mobile OOM browser crashes.
const MAX_MOBILE_CACHED_FRAMES = 14;
const MOBILE_AHEAD_BUFFER = 6;
const MOBILE_BEHIND_BUFFER = 2;

// Desktop 16:9 frames (1280x720) are ~3.6MB each, desktop RAM is abundant
const DESKTOP_PRELOAD_BATCH_SIZE = 15;

const pad = (num: number, size: number) => {
  let s = num + "";
  while (s.length < size) s = "0" + s;
  return s;
};

const getFramePath = (index: number, isMobile: boolean) => {
  const padded = pad(index, 3);
  if (isMobile) {
    return `/fotosCompletasmobil/foto_${padded}.webp`;
  }
  return `/fotosCompletas/frame_${padded}.webp`;
};

export default function ScrollCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const desktopImagesRef = useRef<(HTMLImageElement | null)[]>(
    new Array(FRAME_COUNT + 1).fill(null)
  );
  const mobileImagesRef = useRef<(HTMLImageElement | null)[]>(
    new Array(FRAME_COUNT + 1).fill(null)
  );
  const desktopLoadedFramesRef = useRef<Set<number>>(new Set());
  const mobileLoadedFramesRef = useRef<Set<number>>(new Set());
  const preloadedModesRef = useRef<Set<boolean>>(new Set());

  const isMobileRef = useRef(false);
  const currentFrameRef = useRef(1);
  const targetFrameRef = useRef(1);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    const checkIsMobile = () => {
      if (typeof window === "undefined") return false;
      return window.innerWidth < MOBILE_BREAKPOINT;
    };

    isMobileRef.current = checkIsMobile();

    // Evicts distant mobile frames to keep mobile RAM strictly bounded
    const pruneMobileCache = (currentCenter: number) => {
      const loadedSet = mobileLoadedFramesRef.current;
      const images = mobileImagesRef.current;

      if (loadedSet.size <= MAX_MOBILE_CACHED_FRAMES) return;

      // Keep frames within active window: [currentCenter - BEHIND, currentCenter + AHEAD]
      const minKeep = Math.max(1, currentCenter - MOBILE_BEHIND_BUFFER);
      const maxKeep = Math.min(FRAME_COUNT, currentCenter + MOBILE_AHEAD_BUFFER);

      // Collect candidates to evict (always keep frame 1 as instant fallback)
      const toEvict: number[] = [];
      for (const idx of loadedSet) {
        if (idx !== 1 && (idx < minKeep || idx > maxKeep)) {
          toEvict.push(idx);
        }
      }

      // Evict furthest frames first
      toEvict.sort((a, b) => Math.abs(b - currentCenter) - Math.abs(a - currentCenter));

      for (const idx of toEvict) {
        if (loadedSet.size <= MAX_MOBILE_CACHED_FRAMES) break;
        const img = images[idx];
        if (img) {
          img.src = ""; // Release underlying decoded bitmap memory
          images[idx] = null;
        }
        loadedSet.delete(idx);
      }
    };

    const loadFrame = (index: number, isMobileMode: boolean): Promise<void> => {
      return new Promise((resolve) => {
        const loadedSet = isMobileMode
          ? mobileLoadedFramesRef.current
          : desktopLoadedFramesRef.current;
        const images = isMobileMode
          ? mobileImagesRef.current
          : desktopImagesRef.current;

        if (loadedSet.has(index)) {
          resolve();
          return;
        }

        const img = new window.Image();
        img.src = getFramePath(index, isMobileMode);
        img.onload = () => {
          images[index] = img;
          loadedSet.add(index);

          if (isMobileMode) {
            pruneMobileCache(Math.round(currentFrameRef.current));
          }

          if (isMobileMode === isMobileRef.current) {
            const currentInt = Math.round(currentFrameRef.current);
            if (index === 1 || index === currentInt) {
              renderFrame(currentInt);
            }
          }
          resolve();
        };
        img.onerror = () => {
          resolve();
        };
      });
    };

    // Preload mobile frames around an active center frame
    const preloadMobileWindow = (centerFrame: number) => {
      const start = Math.max(1, centerFrame - MOBILE_BEHIND_BUFFER);
      const end = Math.min(FRAME_COUNT, centerFrame + MOBILE_AHEAD_BUFFER);

      // Priority 1: center frame itself
      loadFrame(centerFrame, true);

      // Priority 2: frames immediately ahead
      for (let i = centerFrame + 1; i <= end; i++) {
        loadFrame(i, true);
      }
      // Priority 3: frames immediately behind
      for (let i = centerFrame - 1; i >= start; i--) {
        loadFrame(i, true);
      }
    };

    const preloadDesktopFrames = async () => {
      if (preloadedModesRef.current.has(false)) return;
      preloadedModesRef.current.add(false);

      // Preload frame 1 first to display immediately
      await loadFrame(1, false);

      // Preload remaining frames progressively in batches
      for (let i = 2; i <= FRAME_COUNT; i += DESKTOP_PRELOAD_BATCH_SIZE) {
        const batch: Promise<void>[] = [];
        for (let j = 0; j < DESKTOP_PRELOAD_BATCH_SIZE && i + j <= FRAME_COUNT; j++) {
          batch.push(loadFrame(i + j, false));
        }
        await Promise.all(batch);
      }
    };

    const startPreloading = (forMobile: boolean) => {
      if (forMobile) {
        // Only load the initial small window on mobile to avoid tab memory crashes
        preloadMobileWindow(1);
      } else {
        preloadDesktopFrames();
      }
    };

    // Preload initial frames for current device
    startPreloading(isMobileRef.current);

    const renderFrame = (index: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        return;
      }

      // Cap DPR at 2 on mobile to avoid giant buffers and GPU VRAM exhaustion
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const targetWidth = Math.round(rect.width * dpr);
      const targetHeight = Math.round(rect.height * dpr);

      if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
      }

      const cw = canvas.width;
      const ch = canvas.height;

      const isMobile = isMobileRef.current;
      const images = isMobile
        ? mobileImagesRef.current
        : desktopImagesRef.current;

      let img = images[index];

      // Fallback to the closest loaded frame in current mode
      if (!img) {
        let fallbackIndex = index;
        while (fallbackIndex > 1 && !images[fallbackIndex]) {
          fallbackIndex--;
        }
        img = images[fallbackIndex];
      }

      // If still not loaded in current mode, check alternative mode as fallback
      if (!img) {
        const otherImages = isMobile
          ? desktopImagesRef.current
          : mobileImagesRef.current;
        let fallbackIndex = index;
        while (fallbackIndex > 1 && !otherImages[fallbackIndex]) {
          fallbackIndex--;
        }
        img = otherImages[fallbackIndex];
      }

      // Clear the canvas buffer completely
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, cw, ch);

      if (!img || img.width === 0 || img.height === 0) {
        return;
      }

      // Calculate cover dimensions directly using the real canvas buffer dimensions (cw, ch)
      // This completely avoids DPR desynchronization and ensures 100% full-screen coverage!
      const canvasRatio = cw / ch;
      const imgRatio = img.width / img.height;

      let drawWidth = cw;
      let drawHeight = ch;
      let offsetX = 0;
      let offsetY = 0;

      if (canvasRatio > imgRatio) {
        // Canvas is wider than image (cover by width, center vertically)
        drawHeight = cw / imgRatio;
        offsetY = (ch - drawHeight) / 2;
      } else {
        // Image is wider than canvas (cover by height, center horizontally)
        drawWidth = ch * imgRatio;
        offsetX = (cw - drawWidth) / 2;
      }

      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };

    // Synchronize frame progress strictly with the Hero track scroll distance
    const onScroll = () => {
      const track = document.getElementById("hero-track");
      if (!track) return;

      const rect = track.getBoundingClientRect();
      const maxScroll = rect.height - window.innerHeight;

      if (maxScroll <= 0) return;

      // Distance scrolled within the hero section track
      const scrollY = -rect.top;
      const scrollFraction = Math.max(0, Math.min(1, scrollY / maxScroll));

      // Exactly map scroll progress to frames: 0% -> Frame 1, 100% -> Frame 150
      const target = Math.min(
        FRAME_COUNT,
        Math.max(1, Math.round(scrollFraction * (FRAME_COUNT - 1)) + 1)
      );
      targetFrameRef.current = target;

      if (isMobileRef.current) {
        // Dynamically stream and preload active mobile window around target
        preloadMobileWindow(target);
      } else {
        // Desktop: load target if batch hasn't reached it yet
        if (!desktopLoadedFramesRef.current.has(target)) {
          loadFrame(target, false);
        }
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    // Initial check on load
    onScroll();

    const onResize = () => {
      const isMobileNow = checkIsMobile();
      if (isMobileNow !== isMobileRef.current) {
        isMobileRef.current = isMobileNow;
        startPreloading(isMobileNow);
      }

      renderFrame(Math.round(currentFrameRef.current));
      onScroll();
    };
    window.addEventListener("resize", onResize);

    const update = () => {
      const current = currentFrameRef.current;
      const target = targetFrameRef.current;
      const diff = target - current;

      if (Math.abs(diff) > 0.04) {
        currentFrameRef.current += diff * 0.35; // Fast, responsive, silky smooth interpolation
      } else {
        currentFrameRef.current = target;
      }

      const renderIndex = Math.min(
        FRAME_COUNT,
        Math.max(1, Math.round(currentFrameRef.current))
      );
      renderFrame(renderIndex);

      rafIdRef.current = requestAnimationFrame(update);
    };

    rafIdRef.current = requestAnimationFrame(update);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full object-cover z-0"
    />
  );
}
