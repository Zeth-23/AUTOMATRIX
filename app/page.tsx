import Link from "next/link";
import ScrollCanvas from "./components/ScrollCanvas";
import DreamframeStudio from "./components/DreamframeStudio";

export default function Home() {
  return (
    <>
      <div id="hero-track" className="relative font-sans bg-black h-[450vh]">
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
                <span className="text-white font-semibold text-sm tracking-widest uppercase">Automatrix</span>
              </div>

              {/* Navigation - hidden on small screens */}
              <nav className="hidden md:flex items-center gap-10">
                <Link href="#features" className="text-gray-300 hover:text-white transition-colors text-xs tracking-wider uppercase">Características</Link>
                <Link href="#gallery" className="text-gray-300 hover:text-white transition-colors text-xs tracking-wider uppercase">Galería</Link>
                <Link href="#pricing" className="text-gray-300 hover:text-white transition-colors text-xs tracking-wider uppercase">Precios</Link>
                <Link href="#api" className="text-gray-300 hover:text-white transition-colors text-xs tracking-wider uppercase">Demos</Link>
              </nav>
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
                  Solicitanos tu Creación
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
        <section className="py-16 md:py-24 relative border-t border-white/5 overflow-hidden">
          {/* Cosmic background effects */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] md:w-[800px] h-[200px] md:h-[300px] bg-purple-900/20 blur-[100px] md:blur-[120px] rounded-full pointer-events-none"></div>

          {/* Edge fades with responsive widths */}
          <div className="absolute top-0 left-0 w-12 sm:w-20 md:w-32 h-full bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-12 sm:w-20 md:w-32 h-full bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none"></div>

          {/* Row 1: Right to Left */}
          <div className="flex overflow-hidden select-none group">
            <div className="flex shrink-0 animate-marquee items-center group-hover:[animation-play-state:paused]">
              {/* Track 1 */}
              <div className="flex shrink-0 items-center gap-6 sm:gap-10 md:gap-16 lg:gap-20 pr-6 sm:pr-10 md:pr-16 lg:pr-20">
                <span className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-500 hover:text-[#61DAFB] transition-colors duration-300 cursor-pointer uppercase tracking-[0.15em] sm:tracking-[0.2em] whitespace-nowrap">REACT</span>
                <span className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-500 hover:text-white transition-colors duration-300 cursor-pointer uppercase tracking-[0.15em] sm:tracking-[0.2em] whitespace-nowrap">NEXT.JS</span>
                <span className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-500 hover:text-[#3178C6] transition-colors duration-300 cursor-pointer uppercase tracking-[0.15em] sm:tracking-[0.2em] whitespace-nowrap">TYPESCRIPT</span>
                <span className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-500 hover:text-[#339933] transition-colors duration-300 cursor-pointer uppercase tracking-[0.15em] sm:tracking-[0.2em] whitespace-nowrap">NODE.JS</span>
                <span className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-500 hover:text-[#FFD43B] transition-colors duration-300 cursor-pointer uppercase tracking-[0.15em] sm:tracking-[0.2em] whitespace-nowrap">PYTHON</span>
                <span className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-500 hover:text-[#61DAFB] transition-colors duration-300 cursor-pointer uppercase tracking-[0.15em] sm:tracking-[0.2em] whitespace-nowrap">REACT</span>
                <span className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-500 hover:text-white transition-colors duration-300 cursor-pointer uppercase tracking-[0.15em] sm:tracking-[0.2em] whitespace-nowrap">NEXT.JS</span>
                <span className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-500 hover:text-[#3178C6] transition-colors duration-300 cursor-pointer uppercase tracking-[0.15em] sm:tracking-[0.2em] whitespace-nowrap">TYPESCRIPT</span>
                <span className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-500 hover:text-[#339933] transition-colors duration-300 cursor-pointer uppercase tracking-[0.15em] sm:tracking-[0.2em] whitespace-nowrap">NODE.JS</span>
                <span className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-500 hover:text-[#FFD43B] transition-colors duration-300 cursor-pointer uppercase tracking-[0.15em] sm:tracking-[0.2em] whitespace-nowrap">PYTHON</span>
              </div>
              {/* Track 2 (Clone for infinite seamless loop) */}
              <div className="flex shrink-0 items-center gap-6 sm:gap-10 md:gap-16 lg:gap-20 pr-6 sm:pr-10 md:pr-16 lg:pr-20" aria-hidden="true">
                <span className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-500 hover:text-[#61DAFB] transition-colors duration-300 cursor-pointer uppercase tracking-[0.15em] sm:tracking-[0.2em] whitespace-nowrap">REACT</span>
                <span className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-500 hover:text-white transition-colors duration-300 cursor-pointer uppercase tracking-[0.15em] sm:tracking-[0.2em] whitespace-nowrap">NEXT.JS</span>
                <span className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-500 hover:text-[#3178C6] transition-colors duration-300 cursor-pointer uppercase tracking-[0.15em] sm:tracking-[0.2em] whitespace-nowrap">TYPESCRIPT</span>
                <span className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-500 hover:text-[#339933] transition-colors duration-300 cursor-pointer uppercase tracking-[0.15em] sm:tracking-[0.2em] whitespace-nowrap">NODE.JS</span>
                <span className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-500 hover:text-[#FFD43B] transition-colors duration-300 cursor-pointer uppercase tracking-[0.15em] sm:tracking-[0.2em] whitespace-nowrap">PYTHON</span>
                <span className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-500 hover:text-[#61DAFB] transition-colors duration-300 cursor-pointer uppercase tracking-[0.15em] sm:tracking-[0.2em] whitespace-nowrap">REACT</span>
                <span className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-500 hover:text-white transition-colors duration-300 cursor-pointer uppercase tracking-[0.15em] sm:tracking-[0.2em] whitespace-nowrap">NEXT.JS</span>
                <span className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-500 hover:text-[#3178C6] transition-colors duration-300 cursor-pointer uppercase tracking-[0.15em] sm:tracking-[0.2em] whitespace-nowrap">TYPESCRIPT</span>
                <span className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-500 hover:text-[#339933] transition-colors duration-300 cursor-pointer uppercase tracking-[0.15em] sm:tracking-[0.2em] whitespace-nowrap">NODE.JS</span>
                <span className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-500 hover:text-[#FFD43B] transition-colors duration-300 cursor-pointer uppercase tracking-[0.15em] sm:tracking-[0.2em] whitespace-nowrap">PYTHON</span>
              </div>
            </div>
          </div>

          {/* Row 2: Left to Right */}
          <div className="flex overflow-hidden select-none mt-8 sm:mt-12 md:mt-16 group">
            <div className="flex shrink-0 animate-marquee-reverse items-center group-hover:[animation-play-state:paused]">
              {/* Track 1 */}
              <div className="flex shrink-0 items-center gap-6 sm:gap-10 md:gap-16 lg:gap-20 pr-6 sm:pr-10 md:pr-16 lg:pr-20">
                <span className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-500 hover:text-[#FF9900] transition-colors duration-300 cursor-pointer uppercase tracking-[0.15em] sm:tracking-[0.2em] whitespace-nowrap">AWS</span>
                <span className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-500 hover:text-[#2496ED] transition-colors duration-300 cursor-pointer uppercase tracking-[0.15em] sm:tracking-[0.2em] whitespace-nowrap">DOCKER</span>
                <span className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-500 hover:text-[#E10098] transition-colors duration-300 cursor-pointer uppercase tracking-[0.15em] sm:tracking-[0.2em] whitespace-nowrap">GRAPHQL</span>
                <span className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-500 hover:text-[#06B6D4] transition-colors duration-300 cursor-pointer uppercase tracking-[0.15em] sm:tracking-[0.2em] whitespace-nowrap">TAILWIND</span>
                <span className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-500 hover:text-[#336791] transition-colors duration-300 cursor-pointer uppercase tracking-[0.15em] sm:tracking-[0.2em] whitespace-nowrap">POSTGRES</span>
                <span className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-500 hover:text-[#FF9900] transition-colors duration-300 cursor-pointer uppercase tracking-[0.15em] sm:tracking-[0.2em] whitespace-nowrap">AWS</span>
                <span className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-500 hover:text-[#2496ED] transition-colors duration-300 cursor-pointer uppercase tracking-[0.15em] sm:tracking-[0.2em] whitespace-nowrap">DOCKER</span>
                <span className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-500 hover:text-[#E10098] transition-colors duration-300 cursor-pointer uppercase tracking-[0.15em] sm:tracking-[0.2em] whitespace-nowrap">GRAPHQL</span>
                <span className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-500 hover:text-[#06B6D4] transition-colors duration-300 cursor-pointer uppercase tracking-[0.15em] sm:tracking-[0.2em] whitespace-nowrap">TAILWIND</span>
                <span className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-500 hover:text-[#336791] transition-colors duration-300 cursor-pointer uppercase tracking-[0.15em] sm:tracking-[0.2em] whitespace-nowrap">POSTGRES</span>
              </div>
              {/* Track 2 (Clone for infinite seamless loop) */}
              <div className="flex shrink-0 items-center gap-6 sm:gap-10 md:gap-16 lg:gap-20 pr-6 sm:pr-10 md:pr-16 lg:pr-20" aria-hidden="true">
                <span className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-500 hover:text-[#FF9900] transition-colors duration-300 cursor-pointer uppercase tracking-[0.15em] sm:tracking-[0.2em] whitespace-nowrap">AWS</span>
                <span className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-500 hover:text-[#2496ED] transition-colors duration-300 cursor-pointer uppercase tracking-[0.15em] sm:tracking-[0.2em] whitespace-nowrap">DOCKER</span>
                <span className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-500 hover:text-[#E10098] transition-colors duration-300 cursor-pointer uppercase tracking-[0.15em] sm:tracking-[0.2em] whitespace-nowrap">GRAPHQL</span>
                <span className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-500 hover:text-[#06B6D4] transition-colors duration-300 cursor-pointer uppercase tracking-[0.15em] sm:tracking-[0.2em] whitespace-nowrap">TAILWIND</span>
                <span className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-500 hover:text-[#336791] transition-colors duration-300 cursor-pointer uppercase tracking-[0.15em] sm:tracking-[0.2em] whitespace-nowrap">POSTGRES</span>
                <span className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-500 hover:text-[#FF9900] transition-colors duration-300 cursor-pointer uppercase tracking-[0.15em] sm:tracking-[0.2em] whitespace-nowrap">AWS</span>
                <span className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-500 hover:text-[#2496ED] transition-colors duration-300 cursor-pointer uppercase tracking-[0.15em] sm:tracking-[0.2em] whitespace-nowrap">DOCKER</span>
                <span className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-500 hover:text-[#E10098] transition-colors duration-300 cursor-pointer uppercase tracking-[0.15em] sm:tracking-[0.2em] whitespace-nowrap">GRAPHQL</span>
                <span className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-500 hover:text-[#06B6D4] transition-colors duration-300 cursor-pointer uppercase tracking-[0.15em] sm:tracking-[0.2em] whitespace-nowrap">TAILWIND</span>
                <span className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-500 hover:text-[#336791] transition-colors duration-300 cursor-pointer uppercase tracking-[0.15em] sm:tracking-[0.2em] whitespace-nowrap">POSTGRES</span>
              </div>
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
                <span className="text-xs text-purple-200 font-medium tracking-wide">01 Nuestro valor</span>
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-normal text-white font-[family-name:var(--font-playfair)] leading-[1.1] tracking-tight">
                Sistemas, como<br />
                tú lo quieres
              </h2>

              <p className="text-gray-400 text-lg font-light leading-relaxed max-w-sm mt-2">
                Diseñamos y construimos sistemas personalizados y escalables con una estética de primera calidad y una arquitectura robusta.
              </p>

              <Link href="/contact" className="mt-6 px-8 py-4 rounded-full bg-white text-black font-medium text-sm hover:bg-gray-200 transition-colors inline-flex items-center gap-2">
                Reserva una llamada
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
                  <h3 className="text-white text-xl font-medium mb-1">Automatizaciones</h3>
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
                  <h3 className="text-white text-xl font-medium mb-1">Diseños Modernos</h3>
                  <p className="text-gray-400 text-sm font-light">plasmamos lo que te imaginas</p>
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

        {/* AI Platform Showcase Section — Dreamframe 3D Studio & Audio Player Overlay */}
        <section className="relative w-full overflow-hidden border-t border-black/5">
          <DreamframeStudio />
        </section>
      </div>
    </>
  );
}
