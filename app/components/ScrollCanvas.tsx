"use client";

import { useEffect, useRef } from "react";

const FRAME_COUNT = 150;
const PRELOAD_BATCH_SIZE = 15;
// Breakpoint exclusively for smartphones / mobile phones (< 768px).
// Tablets (>= 768px, e.g. iPad 768px/810px) and desktops use the 16:9 desktop sequence.
const MOBILE_BREAKPOINT = 768;

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

    const preloadFrames = async (isMobileMode: boolean) => {
      if (preloadedModesRef.current.has(isMobileMode)) return;
      preloadedModesRef.current.add(isMobileMode);

      // Preload frame 1 first to display immediately
      await loadFrame(1, isMobileMode);

      // Preload remaining frames progressively in batches
      for (let i = 2; i <= FRAME_COUNT; i += PRELOAD_BATCH_SIZE) {
        const batch: Promise<void>[] = [];
        for (let j = 0; j < PRELOAD_BATCH_SIZE && i + j <= FRAME_COUNT; j++) {
          batch.push(loadFrame(i + j, isMobileMode));
        }
        await Promise.all(batch);
      }
    };

    // Preload initial frames for the current device
    preloadFrames(isMobileRef.current);

    const renderFrame = (index: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

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

      // If still not loaded in current mode, check alternative mode as fallback during switch
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

      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();

      if (rect.width === 0 || rect.height === 0) {
        return;
      }

      const targetWidth = Math.round(rect.width * dpr);
      const targetHeight = Math.round(rect.height * dpr);

      if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        ctx.scale(dpr, dpr);
      }

      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, rect.width, rect.height);

      if (!img) {
        return;
      }

      const canvasRatio = rect.width / rect.height;
      const imgRatio = img.width / img.height;

      let drawWidth = rect.width;
      let drawHeight = rect.height;
      let offsetX = 0;
      let offsetY = 0;

      if (canvasRatio > imgRatio) {
        // Canvas is wider than image
        drawHeight = rect.width / imgRatio;
        offsetY = (rect.height - drawHeight) / 2;
      } else {
        // Image is wider than canvas
        drawWidth = rect.height * imgRatio;
        offsetX = (rect.width - drawWidth) / 2;
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

      // Proactively request loading target frame if not loaded yet
      const loadedSet = isMobileRef.current
        ? mobileLoadedFramesRef.current
        : desktopLoadedFramesRef.current;
      if (!loadedSet.has(target)) {
        loadFrame(target, isMobileRef.current);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    // Initial check on load
    onScroll();

    const onResize = () => {
      const isMobileNow = checkIsMobile();
      if (isMobileNow !== isMobileRef.current) {
        isMobileRef.current = isMobileNow;
        preloadFrames(isMobileNow);
      }

      if (canvasRef.current) {
        canvasRef.current.width = 0;
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
