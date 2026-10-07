"use client";

import { useEffect, useRef, useState } from "react";

const FRAME_COUNT = 150;
const PRELOAD_BATCH_SIZE = 10;

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
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(FRAME_COUNT + 1).fill(null));
  const loadedFramesRef = useRef<Set<number>>(new Set());
  const currentFrameRef = useRef(1);
  const targetFrameRef = useRef(1);
  const rafIdRef = useRef<number | null>(null);
  
  // Expose state to UI for debugging since we can't see the console
  const [debugMsg, setDebugMsg] = useState("Initializing...");

  useEffect(() => {
    setDebugMsg("Started Preloading");
    
    const preloadFrames = async () => {
      // First preload frame 1 to show something immediately
      await loadFrame(1);
      
      // Then preload the rest progressively
      for (let i = 2; i <= FRAME_COUNT; i += PRELOAD_BATCH_SIZE) {
        const batch = [];
        for (let j = 0; j < PRELOAD_BATCH_SIZE && i + j <= FRAME_COUNT; j++) {
          batch.push(loadFrame(i + j));
        }
        await Promise.all(batch);
      }
      setDebugMsg("Preloading complete");
    };

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
            setDebugMsg("Frame 1 Loaded!");
            renderFrame(1);
          }
          resolve();
        };
        img.onerror = () => {
          if (index === 1) setDebugMsg("Frame 1 FAILED to load!");
          resolve();
        };
      });
    };

    preloadFrames();

    const renderFrame = (index: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      let img = imagesRef.current[index];
      
      // Fallback to the closest loaded frame if the target isn't loaded yet
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

      // Only resize canvas if needed to avoid flickering/clearing
      if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        ctx.scale(dpr, dpr);
      }

      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, rect.width, rect.height);

      if (!img) {
        ctx.fillStyle = "white";
        ctx.font = "20px sans-serif";
        ctx.fillText(`Waiting for img ${index}...`, 50, 50);
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

    const onScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const scrollFraction = Math.max(0, Math.min(1, scrollY / maxScroll));
      
      const target = Math.min(FRAME_COUNT, Math.max(1, Math.floor(scrollFraction * FRAME_COUNT) + 1));
      targetFrameRef.current = target;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    
    // Initial scroll check in case they are already scrolled
    onScroll();

    const onResize = () => {
      // Force resize on next render
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
      
      if (Math.abs(diff) > 0.05) {
        currentFrameRef.current += diff * 0.15; // Smooth Lerp
      } else {
        currentFrameRef.current = target;
      }

      const renderIndex = Math.round(currentFrameRef.current);
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
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      {/* Debug Overlay */}
      <div className="absolute top-4 left-4 z-50 bg-black/80 text-white p-2 text-xs font-mono rounded">
        {debugMsg}
      </div>
    </>
  );
}
