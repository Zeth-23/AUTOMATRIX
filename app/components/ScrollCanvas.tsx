"use client";

import { useEffect, useRef } from "react";

const FRAME_COUNT = 150;
const PRELOAD_BATCH_SIZE = 15;

const pad = (num: number, size: number) => {
  let s = num + "";
  while (s.length < size) s = "0" + s;
  return s;
};

const getFramePath = (index: number) => {
  return `/fotosCompletas/frame_${pad(index, 3)}.webp`;
};

export default function ScrollCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(
    new Array(FRAME_COUNT + 1).fill(null)
  );
  const loadedFramesRef = useRef<Set<number>>(new Set());
  const currentFrameRef = useRef(1);
  const targetFrameRef = useRef(1);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    const loadFrame = (index: number): Promise<void> => {
      return new Promise((resolve) => {
        if (loadedFramesRef.current.has(index)) {
          resolve();
          return;
        }

        const img = new window.Image();
        img.src = getFramePath(index);
        img.onload = () => {
          imagesRef.current[index] = img;
          loadedFramesRef.current.add(index);
          if (index === 1) {
            renderFrame(1);
          }
          resolve();
        };
        img.onerror = () => {
          resolve();
        };
      });
    };

    const preloadFrames = async () => {
      // First preload frame 1 to show something immediately
      await loadFrame(1);

      // Preload the remaining frames progressively in batches
      for (let i = 2; i <= FRAME_COUNT; i += PRELOAD_BATCH_SIZE) {
        const batch: Promise<void>[] = [];
        for (let j = 0; j < PRELOAD_BATCH_SIZE && i + j <= FRAME_COUNT; j++) {
          batch.push(loadFrame(i + j));
        }
        await Promise.all(batch);
      }
    };

    preloadFrames();

    const renderFrame = (index: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      let img = imagesRef.current[index];

      // Fallback to the closest loaded frame if target frame isn't ready
      if (!img) {
        let fallbackIndex = index;
        while (fallbackIndex > 1 && !imagesRef.current[fallbackIndex]) {
          fallbackIndex--;
        }
        img = imagesRef.current[fallbackIndex];
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
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    // Initial check on load
    onScroll();

    const onResize = () => {
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
