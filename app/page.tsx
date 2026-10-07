import Link from "next/link";
import ScrollCanvas from "./components/ScrollCanvas";

export default function Home() {
  return (
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
  );
}
