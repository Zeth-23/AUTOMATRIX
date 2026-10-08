"use client";

import { useState, useRef } from "react";
import ModelViewer3D from "./ModelViewer3D";

export default function DreamframeStudio() {
  // Theme Mode (Default true to match the Dark Studio aesthetic)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  // Studio Interactive State
  const [lumen, setLumen] = useState<number>(85);
  const [lightMode, setLightMode] = useState<"white" | "diffuse" | "raytrace" | "ambience">("raytrace");
  const [temperature, setTemperature] = useState<number>(32);
  const [coolActive, setCoolActive] = useState<boolean>(false);
  const [windActive, setWindActive] = useState<boolean>(false);
  const [denoiseActive, setDenoiseActive] = useState<boolean>(false);

  // 3D Model Mode
  const [viewMode, setViewMode] = useState<"pbr" | "wireframe">("pbr");
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [resetTrigger, setResetTrigger] = useState<number>(0);

  // Audio Player State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLooping, setIsLooping] = useState<boolean>(true);
  const [, setAudioProgress] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Map light modes to colors for 3D Viewer
  const lightColors: Record<string, string> = {
    white: "#ffffff",
    diffuse: "#ffedd5", // Warm peach
    raytrace: "#f43f5e", // Rose/Pink glow
    ambience: "#38bdf8", // Cyber sky blue
  };

  // Audio Play / Pause handler respecting modern browser autoplay policies
  const togglePlayAudio = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (err) {
        console.warn("Audio playback interrupted or blocked by browser:", err);
        setIsPlaying(false);
      }
    }
  };

  const restartAudio = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = 0;
      if (!isPlaying) {
        togglePlayAudio();
      }
    }
  };

  const handleAudioTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio && audio.duration) {
      setAudioProgress((audio.currentTime / audio.duration) * 100);
    }
  };

  const handleAudioEnded = () => {
    if (!isLooping) {
      setIsPlaying(false);
      setAudioProgress(0);
    }
  };

  const handleResetCamera = () => {
    setResetTrigger((prev) => prev + 1);
  };

  return (
    <div
      className={`relative w-full min-h-[960px] font-sans select-none overflow-hidden py-6 sm:py-8 md:py-10 px-4 sm:px-6 md:px-10 lg:px-12 flex flex-col justify-between transition-colors duration-500 ${
        isDarkMode
          ? "bg-gradient-to-b from-[#09080e] via-[#0d0c14] to-[#07060b] text-gray-100"
          : "bg-gradient-to-b from-[#f5f3f9] via-[#f0ecf6] to-[#ece8f4] text-slate-800"
      }`}
    >
      {/* Hidden HTML5 Audio Element */}
      <audio
        ref={audioRef}
        src="/audio/ambient.mp3"
        loop={isLooping}
        preload="metadata"
        onTimeUpdate={handleAudioTimeUpdate}
        onEnded={handleAudioEnded}
      />

      {/* Atmospheric Ambient Glow behind 3D Model on the right */}
      {isDarkMode ? (
        <>
          <div className="absolute top-1/2 right-[10%] lg:right-[15%] -translate-y-1/2 w-[700px] lg:w-[1050px] h-[650px] lg:h-[850px] bg-purple-950/25 blur-[140px] rounded-[45%] pointer-events-none z-0" />
          <div className="absolute top-[35%] right-[12%] lg:right-[20%] -translate-y-1/2 w-[500px] h-[450px] bg-rose-950/20 blur-[150px] rounded-full pointer-events-none z-0" />
        </>
      ) : (
        <>
          <div className="absolute top-1/2 right-[10%] lg:right-[15%] -translate-y-1/2 w-[700px] lg:w-[1050px] h-[650px] lg:h-[850px] bg-white/80 blur-[100px] rounded-[45%] pointer-events-none z-0" />
          <div className="absolute top-[35%] right-[12%] lg:right-[20%] -translate-y-1/2 w-[500px] h-[450px] bg-purple-200/40 blur-[130px] rounded-full pointer-events-none z-0" />
        </>
      )}

      {/* TOP HEADER BAR: All tags/controls on the left, Title centered/right */}
      <header className="relative z-30 flex flex-wrap items-center justify-between gap-4 w-full mb-6 sm:mb-8">
        {/* Left Side: Badge + Theme Toggle + 360 Orbit Button */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* Badge: GLB 3D RUNTIME */}
          <div
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full backdrop-blur-md border shadow-[0_2px_8px_rgba(0,0,0,0.03)] transition-colors ${
              isDarkMode
                ? "bg-white/[0.05] border-white/10"
                : "bg-white/60 border-white/80"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#f97316] animate-pulse" />
            <span
              className={`text-[10px] sm:text-[11px] font-bold tracking-[0.16em] uppercase ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              GLB 3D RUNTIME
            </span>
          </div>

          {/* Theme Toggle Button (Dark / Light) */}
          <button
            onClick={() => setIsDarkMode((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-semibold tracking-wider transition-all duration-200 border shadow-sm ${
              isDarkMode
                ? "bg-white/10 hover:bg-white/15 text-amber-300 border-white/15"
                : "bg-white/80 hover:bg-white text-gray-700 border-gray-200"
            }`}
            title={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
          >
            <span>{isDarkMode ? "🌙 Dark" : "☀️ Light"}</span>
          </button>

          {/* 360° ORBIT button */}
          <button
            onClick={() => setAutoRotate((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-semibold tracking-wider transition-all duration-200 border ${
              isDarkMode
                ? autoRotate
                  ? "bg-white/15 text-white border-white/20 shadow-sm"
                  : "bg-white/[0.05] text-gray-400 border-white/10 hover:bg-white/10"
                : autoRotate
                ? "bg-white text-gray-900 border-white/90 shadow-sm"
                : "bg-white/60 text-gray-500 border-white/60 hover:bg-white"
            }`}
            title="Alternar rotación automática 360°"
          >
            <svg
              className={`w-3.5 h-3.5 transition-transform duration-700 ${
                autoRotate ? "rotate-180 text-[#f97316]" : isDarkMode ? "text-gray-400" : "text-gray-700"
              }`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
            </svg>
            <span>360° ORBIT</span>
          </button>
        </div>

        {/* Center / Right Title: DREAMFRAME */}
        <div className="flex items-center">
          <h1
            className={`text-xl sm:text-2xl font-black tracking-[0.28em] uppercase font-sans ${
              isDarkMode ? "text-white" : "text-[#1e1b2e]"
            }`}
          >
            DREAMFRAME
          </h1>
        </div>
      </header>

      {/* MAIN STUDIO GRID: Left Column (Controls & Audio) + Right Column (3D Model) */}
      <div className="relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-start lg:items-center flex-1">
        {/* LEFT COLUMN: ALL 3 ORGANIZED CARDS (Ambience, Temperature, Audio Player) */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-5 sm:gap-6 order-2 lg:order-1 max-w-sm sm:max-w-md mx-auto lg:mx-0 w-full">
          {/* CARD 1: CUSTOMIZABLE AMBIENCE */}
          <div
            className={`p-5 sm:p-6 rounded-[26px] backdrop-blur-xl border transition-all duration-300 ${
              isDarkMode
                ? "bg-[#14121d]/90 border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.5)]"
                : "bg-white/85 border-white/90 shadow-[0_12px_35px_rgba(100,80,140,0.06)]"
            } flex flex-col gap-4`}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className={`text-xs sm:text-[13px] font-bold tracking-tight ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                Customizable Ambience
              </h3>
              <span
                className={`text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wider ${
                  isDarkMode ? "bg-white/10 text-gray-300" : "bg-gray-100 text-gray-500"
                }`}
              >
                PBR LIGHT
              </span>
            </div>

            {/* Circular Arc Lumen Gauge */}
            <div className="relative flex flex-col items-center justify-center py-2">
              <div className="relative w-36 h-28 flex items-end justify-center">
                {/* SVG Radial Arc */}
                <svg className="w-36 h-36 absolute -top-4 overflow-visible" viewBox="0 0 120 120">
                  {/* Background Track Arc */}
                  <path
                    d="M 20 90 A 45 45 0 1 1 100 90"
                    fill="none"
                    stroke={isDarkMode ? "#232030" : "#e8e5ef"}
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  {/* Dynamic Active Progress Arc */}
                  <path
                    d="M 20 90 A 45 45 0 1 1 100 90"
                    fill="none"
                    stroke="url(#lumenGradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray="210"
                    strokeDashoffset={210 - (lumen / 100) * 160}
                    className="transition-all duration-300"
                  />
                  <defs>
                    <linearGradient id="lumenGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#f43f5e" />
                      <stop offset="50%" stopColor="#fb923c" />
                      <stop offset="100%" stopColor="#f97316" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Center Gauge Value */}
                <div className="flex flex-col items-center justify-center text-center z-10 mb-1">
                  <div className={`w-5 h-0.5 rounded-full mb-1 ${isDarkMode ? "bg-gray-600" : "bg-gray-300"}`} />
                  <span className={`text-2xl font-black tracking-tight leading-none ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    {lumen}%
                  </span>
                  <span className="text-[10px] font-bold text-gray-400 tracking-wider mt-1 uppercase">
                    LUMEN
                  </span>
                </div>
              </div>

              {/* Interactive Lumen Slider */}
              <div className="w-full px-2 mt-2">
                <input
                  type="range"
                  min="20"
                  max="150"
                  value={lumen}
                  onChange={(e) => setLumen(Number(e.target.value))}
                  className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-[#f97316] ${
                    isDarkMode ? "bg-white/10" : "bg-gray-200"
                  }`}
                />
              </div>
            </div>

            {/* Light Color Swatches */}
            <div className={`pt-3 border-t flex flex-col gap-2.5 ${isDarkMode ? "border-white/10" : "border-gray-100"}`}>
              <div className="flex items-center justify-between px-3">
                {/* 1: Pure White */}
                <button
                  onClick={() => setLightMode("white")}
                  className={`w-7 h-7 rounded-full bg-white border-2 shadow-sm transition-all duration-200 ${
                    lightMode === "white"
                      ? "border-[#f97316] ring-2 ring-[#f97316]/40 scale-110"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  title="White Daylight"
                />

                {/* 2: Ray Trace (Rose/Pink) */}
                <button
                  onClick={() => setLightMode("raytrace")}
                  className={`w-7 h-7 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 shadow-sm transition-all duration-200 flex items-center justify-center ${
                    lightMode === "raytrace"
                      ? "ring-4 ring-pink-500/40 scale-110"
                      : "opacity-80 hover:opacity-100"
                  }`}
                  title="Ray Trace Rose"
                >
                  <span className="w-2 h-2 rounded-full bg-white" />
                </button>

                {/* 3: Diffuse Warm */}
                <button
                  onClick={() => setLightMode("diffuse")}
                  className={`w-7 h-7 rounded-full bg-[#f97316] shadow-sm transition-all duration-200 ${
                    lightMode === "diffuse"
                      ? "ring-4 ring-[#f97316]/40 scale-110"
                      : "opacity-80 hover:opacity-100"
                  }`}
                  title="Warm Diffuse"
                />

                {/* 4: Ambience Slate / Ice Blue */}
                <button
                  onClick={() => setLightMode("ambience")}
                  className={`w-7 h-7 rounded-full bg-[#38bdf8] shadow-sm transition-all duration-200 ${
                    lightMode === "ambience"
                      ? "ring-4 ring-sky-400/40 scale-110"
                      : "opacity-80 hover:opacity-100"
                  }`}
                  title="Cold Ambience"
                />
              </div>

              {/* Swatch Labels */}
              <div className="flex items-center justify-between text-[9px] font-bold text-gray-400 tracking-wider px-1 uppercase">
                <span>DIFFUSE</span>
                <span>RAY TRACE</span>
                <span>AMBIENCE</span>
              </div>
            </div>
          </div>

          {/* CARD 2: SET TEMPERATURE */}
          <div
            className={`p-5 sm:p-6 rounded-[26px] backdrop-blur-xl border transition-all duration-300 ${
              isDarkMode
                ? "bg-[#14121d]/90 border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.5)]"
                : "bg-white/85 border-white/90 shadow-[0_12px_35px_rgba(100,80,140,0.06)]"
            } flex flex-col gap-4`}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className={`text-xs sm:text-[13px] font-bold tracking-tight ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                Set Temperature
              </h3>
              <span
                className={`text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wider ${
                  isDarkMode ? "bg-white/10 text-gray-300" : "bg-gray-100 text-gray-500"
                }`}
              >
                THERMAL V2
              </span>
            </div>

            {/* Circular Dial Indicator */}
            <div className="relative flex flex-col items-center justify-center py-2">
              <div
                className={`relative w-28 h-28 rounded-full border-4 border-dashed flex flex-col items-center justify-center shadow-inner transition-colors ${
                  isDarkMode ? "bg-[#0d0c15] border-white/15" : "bg-white border-gray-200"
                }`}
              >
                {/* Active indicator dot */}
                <div className="absolute top-2 right-4 w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse ring-4 ring-rose-500/30" />

                <span className="text-[10px] text-gray-500 font-bold tracking-widest leading-none">
                  •••
                </span>
                <span className={`text-2xl font-black tracking-tight mt-0.5 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  {temperature}°C
                </span>
                <span className="text-[9px] font-bold text-gray-400 tracking-widest uppercase mt-0.5">
                  SAMPLING
                </span>
              </div>

              {/* Slider for Temperature */}
              <div className="w-full px-2 mt-3">
                <input
                  type="range"
                  min="16"
                  max="64"
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-rose-500 ${
                    isDarkMode ? "bg-white/10" : "bg-gray-200"
                  }`}
                />
              </div>
            </div>

            {/* Action Buttons: COOL / WIND / DENOISE */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              {/* Cool button */}
              <button
                onClick={() => setCoolActive((prev) => !prev)}
                className={`flex flex-col items-center justify-center py-2.5 rounded-xl font-bold text-[10px] tracking-wider transition-all duration-200 ${
                  coolActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/30 scale-[1.02]"
                    : "bg-[#2563eb] text-white hover:bg-blue-600 shadow-sm"
                }`}
              >
                <span className="text-sm leading-none mb-1">❄</span>
                <span>COOL</span>
              </button>

              {/* Wind button */}
              <button
                onClick={() => setWindActive((prev) => !prev)}
                className={`flex flex-col items-center justify-center py-2.5 rounded-xl font-bold text-[10px] tracking-wider transition-all duration-200 ${
                  windActive
                    ? "bg-purple-600 text-white shadow-md shadow-purple-500/30 scale-[1.02]"
                    : "bg-[#7c3aed] text-white hover:bg-purple-600 shadow-sm"
                }`}
              >
                <span className="text-sm leading-none mb-1">💨</span>
                <span>WIND</span>
              </button>

              {/* Denoise button */}
              <button
                onClick={() => setDenoiseActive((prev) => !prev)}
                className={`flex flex-col items-center justify-center py-2.5 rounded-xl font-bold text-[10px] tracking-wider transition-all duration-200 ${
                  denoiseActive
                    ? "bg-amber-600 text-white shadow-md shadow-amber-500/30 scale-[1.02]"
                    : "bg-[#ea580c] text-white hover:bg-orange-600 shadow-sm"
                }`}
              >
                <span className="text-sm leading-none mb-1">🎛</span>
                <span>DENOISE</span>
              </button>
            </div>
          </div>

          {/* CARD 3: REPRODUCTOR DE AUDIO FLOTANTE (Moved to Left Side) */}
          <div
            className={`p-5 sm:p-6 rounded-[26px] backdrop-blur-xl border transition-all duration-300 ${
              isDarkMode
                ? "bg-[#14121d]/90 border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.5)]"
                : "bg-white/85 border-white/90 shadow-[0_12px_35px_rgba(100,80,140,0.06)]"
            } flex flex-col gap-3.5`}
          >
            {/* Track Title */}
            <div className="text-center">
              <h4 className={`text-xs sm:text-[13px] font-bold tracking-tight ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                Caballero Corona 3D
              </h4>
              <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                {isPlaying ? "Ambient Sound • Playing" : "Ambient Sound • Paused"}
              </p>
            </div>

            {/* Dynamic Animated Audio Waveform */}
            <div className="flex items-center justify-center gap-1.5 h-10 py-1">
              {[35, 60, 40, 85, 95, 70, 50, 90, 100, 65, 45, 80, 55, 30].map((baseHeight, i) => {
                return (
                  <div
                    key={i}
                    style={{
                      height: isPlaying ? `${Math.max(15, baseHeight)}%` : "18%",
                      transition: "height 250ms ease",
                    }}
                    className={`w-1 rounded-full ${
                      isPlaying
                        ? "bg-gradient-to-t from-[#f97316] to-[#fb923c] animate-pulse"
                        : isDarkMode
                        ? "bg-white/15"
                        : "bg-gray-200"
                    }`}
                  />
                );
              })}
            </div>

            {/* Media Controls Row */}
            <div className="flex items-center justify-center gap-4 pt-1">
              {/* Previous button */}
              <button
                onClick={restartAudio}
                className={`transition-colors p-1 ${isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-400 hover:text-gray-700"}`}
                title="Volver al inicio"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                </svg>
              </button>

              {/* Rewind 10s button */}
              <button
                onClick={() => {
                  if (audioRef.current) audioRef.current.currentTime -= 10;
                }}
                className={`transition-colors p-1 ${isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-400 hover:text-gray-700"}`}
                title="Retroceder 10s"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 4v6h6" />
                  <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                </svg>
              </button>

              {/* Central Minimalist Play / Pause Button */}
              <button
                onClick={togglePlayAudio}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95 shadow-md ${
                  isDarkMode
                    ? isPlaying
                      ? "bg-white text-black hover:bg-gray-100 shadow-[0_0_20px_rgba(255,255,255,0.25)]"
                      : "bg-[#1e1b2c] border border-white/20 text-white hover:bg-black hover:border-white/40"
                    : "bg-[#171720] hover:bg-black text-white"
                }`}
                title={isPlaying ? "Pausar música" : "Reproducir música"}
              >
                {isPlaying ? (
                  /* Pause Icon */
                  <svg className={`w-4 h-4 ${isDarkMode ? "fill-black" : "fill-white"}`} viewBox="0 0 24 24">
                    <rect x="6" y="5" width="4" height="14" rx="1.5" />
                    <rect x="14" y="5" width="4" height="14" rx="1.5" />
                  </svg>
                ) : (
                  /* Play Icon (slightly offset to visual center) */
                  <svg className={`w-4 h-4 ml-0.5 ${isDarkMode ? "fill-white" : "fill-white"}`} viewBox="0 0 24 24">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                )}
              </button>

              {/* Loop Toggle button */}
              <button
                onClick={() => setIsLooping((prev) => !prev)}
                className={`transition-colors p-1 ${
                  isLooping ? "text-[#f97316]" : isDarkMode ? "text-gray-500 hover:text-gray-300" : "text-gray-300 hover:text-gray-600"
                }`}
                title={isLooping ? "Bucle activado" : "Bucle desactivado"}
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 2l4 4-4 4" />
                  <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
                  <path d="M7 22l-4-4 4-4" />
                  <path d="M21 13v1a4 4 0 0 1-4 4H3" />
                </svg>
              </button>

              {/* Next button */}
              <button
                onClick={restartAudio}
                className={`transition-colors p-1 ${isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-400 hover:text-gray-700"}`}
                title="Siguiente"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: 3D MODEL VIEWPORT & HERO TITLE */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col items-center justify-center order-1 lg:order-2 relative py-1 w-full">
          {/* Main 3D Canvas */}
          <div className="relative w-full h-[520px] xs:h-[580px] sm:h-[660px] md:h-[720px] lg:h-[780px] xl:h-[840px] flex items-center justify-center overflow-visible">
            <ModelViewer3D
              modelPath="/3D-model/Caballero_Corona.glb"
              lumen={lumen}
              lightColor={lightColors[lightMode]}
              viewMode={viewMode}
              windActive={windActive}
              coolActive={coolActive}
              denoiseActive={denoiseActive}
              resetTrigger={resetTrigger}
              autoRotate={autoRotate}
            />
          </div>

          {/* Mode Pill Dock Floating Below Model */}
          <div
            className={`relative z-30 -mt-6 sm:-mt-8 flex items-center gap-1.5 p-1 rounded-full backdrop-blur-xl border shadow-[0_8px_25px_rgba(0,0,0,0.15)] transition-colors ${
              isDarkMode
                ? "bg-[#161422]/90 border-white/15"
                : "bg-white/90 border-white/90"
            }`}
          >
            {/* Wireframe toggle */}
            <button
              onClick={() => setViewMode("wireframe")}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${
                viewMode === "wireframe"
                  ? isDarkMode
                    ? "bg-white text-black shadow-sm font-bold"
                    : "bg-gray-900 text-white shadow-sm"
                  : isDarkMode
                  ? "text-gray-300 hover:text-white"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
              </svg>
              <span>Wireframe</span>
            </button>

            {/* PBR toggle */}
            <button
              onClick={() => setViewMode("pbr")}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${
                viewMode === "pbr"
                  ? isDarkMode
                    ? "bg-white text-black shadow-sm font-bold"
                    : "bg-gray-900 text-white shadow-sm"
                  : isDarkMode
                  ? "text-gray-300 hover:text-white"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              <svg className="w-3.5 h-3.5 text-purple-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <span>PBR</span>
            </button>

            {/* Reset Camera button */}
            <button
              onClick={handleResetCamera}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                isDarkMode ? "text-gray-400 hover:text-white hover:bg-white/10" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              }`}
              title="Centrar y reajustar cámara"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
              </svg>
            </button>
          </div>

          {/* Model Title & Description */}
          <div className="mt-4 sm:mt-6 text-center max-w-lg px-4">
            <h2
              className={`text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-none uppercase ${
                isDarkMode ? "text-white" : "text-[#1e1b2e]"
              }`}
            >
              360 <span className="text-[#f97316]">CABALLERO</span>
            </h2>
            <p
              className={`mt-2.5 text-xs sm:text-[13px] font-normal leading-relaxed max-w-md mx-auto ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              High-fidelity 3D character asset generated with neural diffusion. Featuring full 4K PBR textures,
              optimized quad topology, and realistic physics geometry.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
