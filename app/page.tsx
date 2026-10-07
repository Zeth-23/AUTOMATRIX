import Link from "next/link";
import ScrollCanvas from "./components/ScrollCanvas";
import ModelViewer3D from "./components/ModelViewer3D";

export const runtime = 'edge';

export default function Home() {
  return (
    <>
      <div className="relative font-sans bg-black h-[400vh]">
      {/* Sticky container that stays in view while scrolling */}
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col">

        {/* Background Image Sequence */}
        <div className="absolute inset-0 z-0">
          <ScrollCanvas />
          {/* Subtle gradient overlay to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 z-10 pointer-events-none" />
        </div>

        {/* Content wrapper */}
        <div className="relative z-20 flex flex-col flex-1 w-full max-w-screen-2xl mx-auto px-6 py-8 md:px-12 lg:px-20">
          {/* Header / Navbar */}
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Minimal SVG Logo Placeholder */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
              </svg>
              <span className="text-white font-semibold text-sm tracking-widest uppercase">DREAMFRAME</span>
            </div>

            {/* Navigation - hidden on small screens */}
            <nav className="hidden md:flex items-center gap-10">
              <Link href="#features" className="text-gray-300 hover:text-white transition-colors text-xs tracking-wider uppercase">Features</Link>
              <Link href="#gallery" className="text-gray-300 hover:text-white transition-colors text-xs tracking-wider uppercase">Gallery</Link>
              <Link href="#pricing" className="text-gray-300 hover:text-white transition-colors text-xs tracking-wider uppercase">Pricing</Link>
              <Link href="#api" className="text-gray-300 hover:text-white transition-colors text-xs tracking-wider uppercase">API</Link>
            </nav>

            {/* Auth Button */}
            <div className="hidden sm:block">
              <Link
                href="/login"
                className="px-6 py-2 rounded-full border border-white/30 text-white hover:bg-white/10 transition-colors text-xs tracking-wider uppercase inline-flex items-center gap-2"
              >
                Sign In
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </Link>
            </div>
          </header>

          {/* Main Hero Content */}
          <main className="flex-1 flex flex-col justify-center max-w-2xl mt-12 md:mt-0">
            <div className="flex items-center gap-4 mb-8">
              <span className="text-gray-400 text-xs tracking-[0.2em] uppercase font-medium"></span>
              <div className="h-[1px] w-12 bg-gray-600"></div>
            </div>

            <h1 className="font-[family-name:var(--font-playfair)] text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.1] text-white mb-6 font-normal tracking-tight">
              Team<br />
              Automatrix
            </h1>

            <p className="text-gray-300 text-lg md:text-xl font-light leading-relaxed mb-12 max-w-md">
              Creacion de.
              <br />
              Sistemas a Medida.
            </p>

            <Link href="/create" className="inline-flex items-center gap-3 text-white text-sm font-medium tracking-wider uppercase group w-fit">
              <span className="relative pb-1">
                Start Creating
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-orange-400 to-purple-500 scale-x-100 origin-left transition-transform duration-300"></span>
              </span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-1 text-purple-400">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </Link>
          </main>

          {/* Footer elements */}
          <footer className="mt-auto pt-12 pb-4 flex justify-between items-end">
            {/* Slider Indicators */}
            <div className="flex items-center gap-6 text-gray-400 text-sm font-medium">
              <span className="text-white">01</span>
              <div className="h-[1px] w-12 bg-gray-500"></div>
              <span className="hover:text-white transition-colors cursor-pointer">02</span>
              <span className="hover:text-white transition-colors cursor-pointer">03</span>
            </div>

            {/* Scroll to explore */}
            <div className="flex flex-col items-center gap-4 hidden sm:flex">
              <div className="w-[1px] h-16 bg-gradient-to-b from-gray-500 to-transparent"></div>
              <span className="text-gray-400 text-[10px] uppercase tracking-widest" style={{ writingMode: 'vertical-rl' }}>Scroll to explore</span>
            </div>
          </footer>
        </div>
      </div>
    </div>

    {/* New Sections Container */}
    <div className="relative z-30 bg-[#050505] w-full overflow-hidden">
      {/* Infinite Logo Carousel */}
      <section className="py-24 relative border-t border-white/5">
        {/* Cosmic background effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-purple-900/20 blur-[120px] rounded-full pointer-events-none"></div>
        
        {/* Edge fades */}
        <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none"></div>

        {/* Row 1: Right to Left */}
        <div className="flex w-[200%] animate-marquee">
          <div className="flex w-1/2 justify-around items-center">
            <span className="text-2xl md:text-3xl font-bold text-gray-500 hover:text-[#61DAFB] transition-colors duration-300 cursor-pointer uppercase tracking-[0.2em]">REACT</span>
            <span className="text-2xl md:text-3xl font-bold text-gray-500 hover:text-white transition-colors duration-300 cursor-pointer uppercase tracking-[0.2em]">NEXT.JS</span>
            <span className="text-2xl md:text-3xl font-bold text-gray-500 hover:text-[#3178C6] transition-colors duration-300 cursor-pointer uppercase tracking-[0.2em]">TYPESCRIPT</span>
            <span className="text-2xl md:text-3xl font-bold text-gray-500 hover:text-[#339933] transition-colors duration-300 cursor-pointer uppercase tracking-[0.2em]">NODE.JS</span>
            <span className="text-2xl md:text-3xl font-bold text-gray-500 hover:text-[#FFD43B] transition-colors duration-300 cursor-pointer uppercase tracking-[0.2em]">PYTHON</span>
          </div>
          <div className="flex w-1/2 justify-around items-center">
            <span className="text-2xl md:text-3xl font-bold text-gray-500 hover:text-[#61DAFB] transition-colors duration-300 cursor-pointer uppercase tracking-[0.2em]">REACT</span>
            <span className="text-2xl md:text-3xl font-bold text-gray-500 hover:text-white transition-colors duration-300 cursor-pointer uppercase tracking-[0.2em]">NEXT.JS</span>
            <span className="text-2xl md:text-3xl font-bold text-gray-500 hover:text-[#3178C6] transition-colors duration-300 cursor-pointer uppercase tracking-[0.2em]">TYPESCRIPT</span>
            <span className="text-2xl md:text-3xl font-bold text-gray-500 hover:text-[#339933] transition-colors duration-300 cursor-pointer uppercase tracking-[0.2em]">NODE.JS</span>
            <span className="text-2xl md:text-3xl font-bold text-gray-500 hover:text-[#FFD43B] transition-colors duration-300 cursor-pointer uppercase tracking-[0.2em]">PYTHON</span>
          </div>
        </div>

        {/* Row 2: Left to Right */}
        <div className="flex w-[200%] animate-marquee-reverse mt-12 md:mt-16">
          <div className="flex w-1/2 justify-around items-center">
            <span className="text-2xl md:text-3xl font-bold text-gray-500 hover:text-[#FF9900] transition-colors duration-300 cursor-pointer uppercase tracking-[0.2em]">AWS</span>
            <span className="text-2xl md:text-3xl font-bold text-gray-500 hover:text-[#2496ED] transition-colors duration-300 cursor-pointer uppercase tracking-[0.2em]">DOCKER</span>
            <span className="text-2xl md:text-3xl font-bold text-gray-500 hover:text-[#E10098] transition-colors duration-300 cursor-pointer uppercase tracking-[0.2em]">GRAPHQL</span>
            <span className="text-2xl md:text-3xl font-bold text-gray-500 hover:text-[#06B6D4] transition-colors duration-300 cursor-pointer uppercase tracking-[0.2em]">TAILWIND</span>
            <span className="text-2xl md:text-3xl font-bold text-gray-500 hover:text-[#336791] transition-colors duration-300 cursor-pointer uppercase tracking-[0.2em]">POSTGRES</span>
          </div>
          <div className="flex w-1/2 justify-around items-center">
            <span className="text-2xl md:text-3xl font-bold text-gray-500 hover:text-[#FF9900] transition-colors duration-300 cursor-pointer uppercase tracking-[0.2em]">AWS</span>
            <span className="text-2xl md:text-3xl font-bold text-gray-500 hover:text-[#2496ED] transition-colors duration-300 cursor-pointer uppercase tracking-[0.2em]">DOCKER</span>
            <span className="text-2xl md:text-3xl font-bold text-gray-500 hover:text-[#E10098] transition-colors duration-300 cursor-pointer uppercase tracking-[0.2em]">GRAPHQL</span>
            <span className="text-2xl md:text-3xl font-bold text-gray-500 hover:text-[#06B6D4] transition-colors duration-300 cursor-pointer uppercase tracking-[0.2em]">TAILWIND</span>
            <span className="text-2xl md:text-3xl font-bold text-gray-500 hover:text-[#336791] transition-colors duration-300 cursor-pointer uppercase tracking-[0.2em]">POSTGRES</span>
          </div>
        </div>
      </section>

      {/* Bento Grid Section */}
      <section className="py-24 relative max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-pink-900/10 blur-[150px] rounded-full pointer-events-none"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Text Content */}
          <div className="lg:col-span-4 flex flex-col items-start gap-6 relative z-10">
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
              <span className="text-xs text-purple-200 font-medium tracking-wide">01 Our Value</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-normal text-white font-[family-name:var(--font-playfair)] leading-[1.1] tracking-tight">
              Not Your Boring<br/>
              Software Agency
            </h2>
            
            <p className="text-gray-400 text-lg font-light leading-relaxed max-w-sm mt-2">
              We design and build custom, scalable systems with premium aesthetics and robust architecture.
            </p>
            
            <Link href="/contact" className="mt-6 px-8 py-4 rounded-full bg-white text-black font-medium text-sm hover:bg-gray-200 transition-colors inline-flex items-center gap-2">
              Book a Call
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </Link>
          </div>

          {/* Right Column: Bento Grid */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 relative z-10">
            {/* Card 1: Tall (Left) */}
            <div className="md:mt-12 rounded-[2rem] overflow-hidden relative group h-[400px] border border-white/10 bg-[#111] backdrop-blur-sm transition-transform duration-500 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
              {/* Simulated image/graphic */}
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay group-hover:scale-105 transition-transform duration-700"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-20"></div>
              
              <div className="absolute bottom-0 left-0 p-8 w-full z-30">
                <h3 className="text-white text-xl font-medium mb-1">Scalable Architecture</h3>
                <p className="text-gray-400 text-sm font-light">Enterprise-grade infrastructure</p>
              </div>
            </div>

            {/* Card 2: Medium (Center) */}
            <div className="md:-mt-4 rounded-[2rem] overflow-hidden relative group h-[320px] border border-white/10 bg-[#111] backdrop-blur-sm transition-transform duration-500 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
              {/* Simulated image/graphic */}
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay group-hover:scale-105 transition-transform duration-700"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-20"></div>
              
              <div className="absolute bottom-0 left-0 p-8 w-full z-30">
                <h3 className="text-white text-xl font-medium mb-1">Modern UI/UX</h3>
                <p className="text-gray-400 text-sm font-light">Pixel-perfect experiences</p>
              </div>
            </div>

            {/* Card 3: Small/Offset (Right) */}
            <div className="md:mt-24 rounded-[2rem] overflow-hidden relative group h-[280px] border border-white/10 bg-[#111] backdrop-blur-sm transition-transform duration-500 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
              {/* Simulated image/graphic */}
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay group-hover:scale-105 transition-transform duration-700"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-20"></div>
              
              <div className="absolute bottom-0 left-0 p-8 w-full z-30">
                <h3 className="text-white text-xl font-medium mb-1">AI Integration</h3>
                <p className="text-gray-400 text-sm font-light">Next-gen intelligence</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Platform Showcase Section — Light background */}
      <section className="relative bg-[#f2f2f0] overflow-hidden py-16 md:py-24">
        {/* Full-width container */}
        <div className="max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-20 relative z-10">

          {/* Giant headline */}
          <h2
            className="font-[family-name:var(--font-playfair)] text-[clamp(3.5rem,12vw,11rem)] leading-[0.95] font-normal text-black tracking-tight select-none"
          >
            DREAM<span className="text-transparent" style={{ WebkitTextStroke: '2px #000' }}>FRAME</span>.
          </h2>

          {/* Bottom row: stats left, description center-left, metrics right */}
          <div className="mt-12 md:mt-20 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-6 items-end">

            {/* Left block: avatar stack + big stat */}
            <div className="md:col-span-3 flex flex-col gap-6">
              {/* Avatar stack */}
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 border-2 border-[#f2f2f0]"></div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 border-2 border-[#f2f2f0]"></div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-yellow-400 border-2 border-[#f2f2f0]"></div>
                </div>
                <div>
                  <span className="text-3xl md:text-4xl font-bold text-black leading-none">2M+</span>
                  <p className="text-gray-500 text-xs mt-0.5">Images generated</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-black text-lg md:text-xl font-medium leading-snug max-w-xs">
                The AI platform that keeps your flow with smart generation and built-in editing tools.
              </p>
            </div>

            {/* Center 3D Model Creator with interactive rotation */}
            <div className="md:col-span-6 flex items-center justify-center relative -my-8 md:-my-24 lg:-my-32 z-10">
              <ModelViewer3D modelPath="/3D-model/Caballero_Corona.glb" />
            </div>

            {/* Right block: vertical stat pills + CTA */}
            <div className="md:col-span-3 flex flex-col justify-between h-full gap-8 z-20">
              {/* Stat rows */}
              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between border-b border-black/10 pb-4">
                  <span className="text-sm text-gray-500 uppercase tracking-wider">Styles Available</span>
                  <span className="text-2xl font-bold text-black">150+</span>
                </div>
                <div className="flex items-center justify-between border-b border-black/10 pb-4">
                  <span className="text-sm text-gray-500 uppercase tracking-wider">Collaboration</span>
                  <span className="text-2xl font-bold text-black">Real-time</span>
                </div>
                <div className="flex items-center justify-between pb-2">
                  <span className="text-sm text-gray-500 uppercase tracking-wider">AI Models</span>
                  <span className="text-2xl font-bold text-black">Next-gen</span>
                </div>
              </div>

              {/* Circular CTA button matching the reference */}
              <div className="flex justify-end pt-2">
                <Link
                  href="#how-it-works"
                  className="w-28 h-28 rounded-full bg-[#d4f842] text-black font-semibold text-xs flex items-center justify-center gap-1.5 shadow-lg hover:scale-105 active:scale-95 transition-transform duration-300 group cursor-pointer text-center px-2"
                >
                  <span className="text-[10px]">▶</span>
                  <span>How it works?</span>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
    </>
  );
}
