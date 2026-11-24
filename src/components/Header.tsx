import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useReducedMotion } from 'motion/react';
import { Menu, X, Phone, MessageCircle, ArrowUpRight } from 'lucide-react';
import { COMPANY_INFO, buildWhatsAppUrl } from '../data/printGalaxyData';

interface HeaderProps {
  onRequestQuote: () => void;
}

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Showcase', href: '#showcase' },
  { label: 'Process', href: '#process' },
  { label: 'Contact', href: '#contact' },
];

export function BrandMark({ className = 'h-7 w-7' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="2" width="32" height="32" rx="8" fill="#0F172A" stroke="rgba(255,255,255,0.16)" strokeWidth="1.5" />
      <path d="M11 25V11H19.5C22.5376 11 25 13.4624 25 16.5C25 19.5376 22.5376 22 19.5 22H14.5" stroke="#F97316" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="23.5" cy="24.5" r="2.5" fill="#38BDF8" />
    </svg>
  );
}

export function Header({ onRequestQuote }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: shouldReduceMotion ? 'auto' : 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-200 ${
          scrolled
            ? 'border-b border-white/10 bg-[#060B18]/85 backdrop-blur-xl'
            : 'border-b border-white/5 bg-[#060B18]/50 backdrop-blur-md'
        }`}
      >
        {/* Scroll progress bar */}
        <motion.div
          style={{ scaleX }}
          className="absolute bottom-0 left-0 right-0 h-[2px] origin-left bg-gradient-to-r from-orange-500 via-amber-400 to-sky-400"
          aria-hidden="true"
        />

        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#hero');
            }}
            className="flex items-center gap-2.5 font-display text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-md"
          >
            <BrandMark className="h-7 w-7 shrink-0" />
            <span>Print Galaxy</span>
          </a>

          {/* Zone 2: 5 concise single-line nav links */}
          <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="group relative py-1 text-sm font-medium text-slate-300 transition-colors duration-150 hover:text-white whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-orange-500 transition-all duration-200 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Zone 3: 1 primary CTA + Mobile Drawer Trigger */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onRequestQuote}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-orange-500 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors duration-150 hover:bg-orange-400 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#060B18]"
            >
              <span>Get Free Quote</span>
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-200 transition-colors hover:bg-white/10 md:hidden cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-x-0 top-16 z-30 border-b border-white/10 bg-[#080F21]/98 px-4 py-6 backdrop-blur-xl md:hidden"
          >
            <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className="flex min-h-[44px] items-center rounded-lg px-3 text-base font-medium text-slate-200 transition-colors hover:bg-white/5 hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/10 pt-5">
              <a
                href={COMPANY_INFO.mobileHref}
                className="flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 text-sm font-medium text-slate-100 hover:bg-white/10"
              >
                <Phone className="h-4 w-4 text-sky-400" aria-hidden="true" />
                <span>Call Ruban</span>
              </a>
              <a
                href={buildWhatsAppUrl('Hello Print Galaxy, I would like to discuss a printing or signage requirement.')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-orange-500 px-3 text-sm font-semibold text-white hover:bg-orange-400"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                <span>WhatsApp</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
