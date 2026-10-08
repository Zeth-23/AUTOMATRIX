"use client";

import { useState, useRef, useEffect } from "react";
import ModelViewer3D from "./ModelViewer3D";

interface ModelItem {
  id: string;
  name: string;
  poly: string;
  tag: string;
  badgeColor?: string;
  iconBg: string;
}

export default function DreamframeStudio() {
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

  // Model selection
  const [activeTab, setActiveTab] = useState<"models" | "textures">("models");
  const [selectedModelId, setSelectedModelId] = useState<string>("model-1");

  // Audio Player State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLooping, setIsLooping] = useState<boolean>(true);
  const [audioProgress, setAudioProgress] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const modelsList: ModelItem[] = [
    {
      id: "model-1",
      name: "Orange Express 3D",
      poly: "142k Poly",
      tag: "PBR",
      iconBg: "from-amber-400 to-orange-500",
    },
    {
      id: "model-2",
      name: "The Wild Robot",
      poly: "120k Poly",
      tag: "Rigged",
      iconBg: "from-gray-300 to-slate-500",
    },
    {
      id: "model-3",
      name: "Aether Drone V4",
      poly: "86k Poly",
      tag: "SubD",
      iconBg: "from-sky-300 to-blue-500",
    },
    {
      id: "model-4",
      name: "Cyber Visor X-1",
      poly: "64k Poly",
      tag: "Glass",
      iconBg: "from-purple-500 to-indigo-700",
    },
  ];

  const selectedModel = modelsList.find((m) => m.id === selectedModelId) || modelsList[0];

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
    <div className="relative w-full min-h-[920px] bg-gradient-to-b from-[#f5f3f9] via-[#f0ecf6] to-[#ece8f4] text-slate-800 font-sans select-none overflow-hidden py-6 sm:py-8 md:py-10 px-4 sm:px-6 md:px-10 lg:px-12 flex flex-col justify-between">
      {/* Hidden HTML5 Audio Element */}
      <audio
        ref={audioRef}
        src="/audio/ambient.mp3"
        loop={isLooping}
        preload="metadata"
        onTimeUpdate={handleAudioTimeUpdate}
        onEnded={handleAudioEnded}
      />

      {/* Atmospheric Cloud Glow behind Knight Model */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] lg:w-[1300px] h-[650px] lg:h-[880px] bg-white/80 blur-[100px] rounded-[45%] pointer-events-none z-0" />
      <div className="absolute top-[35%] left-[48%] -translate-x-1/2 -translate-y-1/2 w-[580px] h-[480px] bg-purple-200/40 blur-[130px] rounded-full pointer-events-none z-0" />

      {/* TOP HEADER BAR */}
      <header className="relative z-30 flex flex-wrap items-center justify-between gap-4 w-full mb-4 sm:mb-6">
        {/* Left Badge: GLB 3D RUNTIME */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 backdrop-blur-md border border-white/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
          <span className="w-2 h-2 rounded-full bg-[#f97316] animate-pulse" />
          <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.16em] text-gray-600 uppercase">
            GLB 3D RUNTIME
          </span>
        </div>

        {/* Center Title: DREAMFRAME */}
        <div className="flex-1 flex justify-center order-first sm:order-none w-full sm:w-auto">
          <h1 className="text-xl sm:text-2xl font-black tracking-[0.28em] text-[#1e1b2e] uppercase font-sans">
            DREAMFRAME
          </h1>
        </div>

        {/* Right Controls: 360 Orbit Pill + Search Box */}
        <div className="flex items-center gap-3">
          {/* 360° ORBIT button */}
          <button
            onClick={() => setAutoRotate((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-semibold tracking-wider transition-all duration-200 shadow-[0_2px_10px_rgba(0,0,0,0.04)] border ${
              autoRotate
                ? "bg-white text-gray-900 border-white/90 shadow-sm"
                : "bg-white/60 text-gray-500 border-white/60 hover:bg-white"
            }`}
            title="Alternar rotación automática 360°"
          >
            <svg
              className={`w-3.5 h-3.5 text-gray-700 transition-transform duration-700 ${
                autoRotate ? "rotate-180" : ""
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

          {/* Search Input Box */}
          <div className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur-md border border-white/90 shadow-[0_2px_12px_rgba(0,0,0,0.03)] w-56 xl:w-64">
            <input
              type="text"
              placeholder="Search 3D models..."
              className="bg-transparent text-xs text-gray-700 placeholder-gray-400 outline-none w-full font-medium"
            />
            <svg
              className="w-3.5 h-3.5 text-gray-400 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <div className="w-5 h-5 rounded-md bg-gray-100 flex items-center justify-center shrink-0">
              <svg
                className="w-3 h-3 text-gray-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              </svg>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN STUDIO GRID */}
      <div className="relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center flex-1">
        {/* LEFT COLUMN: AMBIENCE & TEMPERATURE CARDS */}
        <div className="lg:col-span-3 flex flex-col gap-5 order-2 lg:order-1 max-w-sm mx-auto lg:mx-0 w-full">
          {/* CARD 1: CUSTOMIZABLE AMBIENCE */}
          <div className="p-5 rounded-[26px] bg-white/80 backdrop-blur-xl border border-white/90 shadow-[0_12px_35px_rgba(100,80,140,0.06)] flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-[13px] font-bold text-gray-800 tracking-tight">
                Customizable Ambience
              </h3>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 tracking-wider">
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
                    stroke="#e8e5ef"
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
                  <div className="w-5 h-0.5 bg-gray-300 rounded-full mb-1" />
                  <span className="text-2xl font-black text-gray-900 tracking-tight leading-none">
                    {lumen}%
                  </span>
                  <span className="text-[10px] font-bold text-gray-400 tracking-wider mt-1 uppercase">
                    LUMEN
                  </span>
                </div>
              </div>

              {/* Interactive Lumen Slider for User Adjustment */}
              <div className="w-full px-2 mt-2">
                <input
                  type="range"
                  min="20"
                  max="150"
                  value={lumen}
                  onChange={(e) => setLumen(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#f97316]"
                />
              </div>
            </div>

            {/* Light Color Swatches */}
            <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
              <div className="flex items-center justify-between px-3">
                {/* 1: Pure White */}
                <button
                  onClick={() => setLightMode("white")}
                  className={`w-7 h-7 rounded-full bg-white border-2 shadow-sm transition-all duration-200 ${
                    lightMode === "white"
                      ? "border-[#f97316] ring-2 ring-[#f97316]/30 scale-110"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                  title="White Daylight"
                />

                {/* 2: Ray Trace (Rose/Pink) */}
                <button
                  onClick={() => setLightMode("raytrace")}
                  className={`w-7 h-7 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 shadow-sm transition-all duration-200 flex items-center justify-center ${
                    lightMode === "raytrace"
                      ? "ring-4 ring-pink-500/30 scale-110"
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
                      ? "ring-4 ring-[#f97316]/30 scale-110"
                      : "opacity-80 hover:opacity-100"
                  }`}
                  title="Warm Diffuse"
                />

                {/* 4: Ambience Slate / Ice Blue */}
                <button
                  onClick={() => setLightMode("ambience")}
                  className={`w-7 h-7 rounded-full bg-[#475569] shadow-sm transition-all duration-200 ${
                    lightMode === "ambience"
                      ? "ring-4 ring-[#475569]/30 scale-110"
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
          <div className="p-5 rounded-[26px] bg-white/80 backdrop-blur-xl border border-white/90 shadow-[0_12px_35px_rgba(100,80,140,0.06)] flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-[13px] font-bold text-gray-800 tracking-tight">
                Set Temperature
              </h3>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 tracking-wider">
                THERMAL V2
              </span>
            </div>

            {/* Circular Dial Indicator */}
            <div className="relative flex flex-col items-center justify-center py-2">
              <div className="relative w-28 h-28 rounded-full border-4 border-dashed border-gray-200 flex flex-col items-center justify-center bg-white shadow-inner">
                {/* Active indicator dot */}
                <div className="absolute top-2 right-4 w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse ring-4 ring-rose-200" />

                <span className="text-[10px] text-gray-300 font-bold tracking-widest leading-none">
                  •••
                </span>
                <span className="text-2xl font-black text-gray-900 tracking-tight mt-0.5">
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
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
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
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 scale-[1.02]"
                    : "bg-[#2563eb] text-white hover:bg-blue-700 shadow-sm"
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
                    ? "bg-purple-600 text-white shadow-md shadow-purple-500/20 scale-[1.02]"
                    : "bg-[#7c3aed] text-white hover:bg-purple-700 shadow-sm"
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
                    ? "bg-amber-600 text-white shadow-md shadow-amber-500/20 scale-[1.02]"
                    : "bg-[#ea580c] text-white hover:bg-orange-700 shadow-sm"
                }`}
              >
                <span className="text-sm leading-none mb-1">🎛</span>
                <span>DENOISE</span>
              </button>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: 3D MODEL VIEWPORT & HERO TITLE */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center order-1 lg:order-2 relative py-1 w-full">
          {/* Main 3D Canvas — Amplio campo de acción sin límites restrictivos */}
          <div className="relative w-full h-[500px] xs:h-[580px] sm:h-[660px] md:h-[720px] lg:h-[780px] xl:h-[840px] flex items-center justify-center overflow-visible">
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
          <div className="relative z-30 -mt-6 sm:-mt-8 flex items-center gap-1.5 p-1 rounded-full bg-white/90 backdrop-blur-xl border border-white/90 shadow-[0_8px_25px_rgba(0,0,0,0.08)]">
            {/* Wireframe toggle */}
            <button
              onClick={() => setViewMode("wireframe")}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${
                viewMode === "wireframe"
                  ? "bg-gray-900 text-white shadow-sm"
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
                  ? "bg-gray-900 text-white shadow-sm"
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
              className="w-7 h-7 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              title="Centrar y reajustar cámara"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
              </svg>
            </button>
          </div>

          {/* Model Title & Description as in Reference Image 2 */}
          <div className="mt-4 sm:mt-6 text-center max-w-lg px-4">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1e1b2e] tracking-tight leading-none uppercase">
              360 <span className="text-[#f97316]">{selectedModel.name.replace(" 3D", "")}</span>
            </h2>
            <p className="mt-2.5 text-xs sm:text-[13px] text-gray-500 font-normal leading-relaxed max-w-md mx-auto">
              High-speed aerodynamic train asset generated with neural diffusion. Featuring full 4K PBR textures,
              optimized quad topology, and realistic physics geometry.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: 3D MODELS LIST & AUDIO PLAYER OVERLAY */}
        <div className="lg:col-span-3 flex flex-col gap-5 order-3 max-w-sm mx-auto lg:mx-0 w-full">
          {/* CARD 3: 3D MODELS / TEXTURES LIST */}
          <div className="p-5 rounded-[26px] bg-white/80 backdrop-blur-xl border border-white/90 shadow-[0_12px_35px_rgba(100,80,140,0.06)] flex flex-col gap-4">
            {/* Header Tabs */}
            <div className="flex items-center gap-4 border-b border-gray-100 pb-2">
              <button
                onClick={() => setActiveTab("models")}
                className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${
                  activeTab === "models" ? "text-gray-900" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <span>📦</span>
                <span>3D Models</span>
              </button>
              <button
                onClick={() => setActiveTab("textures")}
                className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${
                  activeTab === "textures" ? "text-purple-600" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <span>🔲</span>
                <span>Textures</span>
              </button>
            </div>

            {/* Model Items List */}
            <div className="flex flex-col gap-2.5">
              {modelsList.map((item) => {
                const isSelected = selectedModelId === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedModelId(item.id)}
                    className={`flex items-center justify-between p-2.5 rounded-2xl transition-all duration-200 text-left ${
                      isSelected
                        ? "bg-white border-2 border-amber-400 shadow-sm ring-2 ring-amber-100"
                        : "bg-white/60 hover:bg-white border border-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Avatar preview icon */}
                      <div
                        className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${item.iconBg} flex items-center justify-center text-white text-xs font-bold shadow-sm shrink-0`}
                      >
                        {item.name.substring(0, 1)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-800 leading-tight">
                          {item.name}
                        </span>
                        <span className="text-[10px] text-gray-400 font-medium">
                          {item.poly} • {item.tag}
                        </span>
                      </div>
                    </div>

                    {/* Active orange dot if selected */}
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-[#f97316] shrink-0 mr-1" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Pagination Dots */}
            <div className="flex items-center justify-center gap-1.5 pt-1">
              <span className="w-3.5 h-1 rounded-full bg-gray-700" />
              <span className="w-1.5 h-1 rounded-full bg-gray-300" />
              <span className="w-1.5 h-1 rounded-full bg-gray-300" />
            </div>
          </div>

          {/* CARD 4: REPRODUCTOR DE AUDIO OVERLAY */}
          <div className="p-5 rounded-[26px] bg-white/85 backdrop-blur-xl border border-white/90 shadow-[0_12px_35px_rgba(100,80,140,0.06)] flex flex-col gap-3">
            {/* Track Title */}
            <div className="text-center">
              <h4 className="text-xs font-bold text-gray-800 tracking-tight">
                {selectedModel.name}
              </h4>
              <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                {isPlaying ? "Ambient Sound • Playing" : "Ambient Sound • Paused"}
              </p>
            </div>

            {/* Dynamic Animated Audio Waveform */}
            <div className="flex items-center justify-center gap-1 h-9 py-1">
              {[35, 60, 40, 85, 95, 70, 50, 90, 100, 65, 45, 80, 55, 30].map((baseHeight, i) => {
                // Wave bounces smoothly when playing
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
                className="text-gray-400 hover:text-gray-700 transition-colors p-1"
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
                className="text-gray-400 hover:text-gray-700 transition-colors p-1"
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
                className="w-10 h-10 rounded-full bg-[#171720] hover:bg-black active:scale-95 text-white flex items-center justify-center shadow-md transition-all duration-200"
                title={isPlaying ? "Pausar música" : "Reproducir música"}
              >
                {isPlaying ? (
                  /* Pause Icon */
                  <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                    <rect x="6" y="5" width="4" height="14" rx="1.5" />
                    <rect x="14" y="5" width="4" height="14" rx="1.5" />
                  </svg>
                ) : (
                  /* Play Icon (slightly offset to visual center) */
                  <svg className="w-4 h-4 fill-white ml-0.5" viewBox="0 0 24 24">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                )}
              </button>

              {/* Loop Toggle button */}
              <button
                onClick={() => setIsLooping((prev) => !prev)}
                className={`transition-colors p-1 ${
                  isLooping ? "text-[#f97316]" : "text-gray-300 hover:text-gray-600"
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
                className="text-gray-400 hover:text-gray-700 transition-colors p-1"
                title="Siguiente"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
