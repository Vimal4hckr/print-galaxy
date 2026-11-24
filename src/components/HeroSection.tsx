import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { ArrowDown, ArrowRight, Sparkles } from 'lucide-react';
import { COMPANY_INFO } from '../data/printGalaxyData';
import { BrandMark } from './Header';
import { MagneticButton } from './MagneticButton';
import { ResilientImage } from './ResilientImage';

interface HeroSectionProps {
  onExploreServices: () => void;
  onGetQuote: () => void;
}

export function HeroSection({ onExploreServices, onGetQuote }: HeroSectionProps) {
  const containerRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0.2]);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative flex min-h-screen items-center overflow-hidden bg-[#060B18] pt-20 pb-16"
    >
      {/* Parallax Background Studio Image */}
      <motion.div
        style={shouldReduceMotion ? undefined : { y: bgY }}
        className="absolute inset-0 z-0"
        aria-hidden="true"
      >
        <ResilientImage
          src="/src/assets/images/hero_print_studio_1795518067223.jpg"
          alt="Print Galaxy modern digital printing and LED signage studio"
          className="h-full w-full object-cover object-center opacity-55 scale-105"
          fallbackTitle="Print Galaxy Studio"
        />
        {/* Measured Contrast Scrims */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#060B18] via-[#060B18]/85 to-[#060B18]/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060B18] via-transparent to-[#060B18]/75" />
      </motion.div>

      {/* Ambient Animated Gradient Lighting */}
      {!shouldReduceMotion && (
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
          <motion.div
            animate={{ opacity: [0.22, 0.36, 0.22], scale: [1, 1.08, 1] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -left-24 top-1/4 h-[420px] w-[420px] rounded-full bg-orange-500/20 blur-[120px]"
          />
          <motion.div
            animate={{ opacity: [0.18, 0.3, 0.18], scale: [1, 1.1, 1] }}
            transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
            className="absolute right-0 bottom-1/4 h-[460px] w-[460px] rounded-full bg-blue-600/20 blur-[130px]"
          />
        </div>
      )}

      {/* Subtle Floating CMYK / Registration Graphic Elements */}
      {!shouldReduceMotion && (
        <div className="pointer-events-none absolute inset-0 z-10 hidden lg:block" aria-hidden="true">
          <motion.div
            animate={{ y: [-8, 8, -8] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute right-[10%] top-[24%] h-24 w-24 rounded-2xl border border-sky-400/20 bg-sky-500/5 backdrop-blur-sm"
          />
          <motion.div
            animate={{ y: [10, -10, 10] }}
            transition={{ duration: 8.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute right-[16%] bottom-[24%] h-14 w-14 rounded-full border border-orange-400/25 bg-orange-500/10 backdrop-blur-sm"
          />
        </div>
      )}

      <motion.div
        style={shouldReduceMotion ? undefined : { opacity: contentOpacity }}
        className="relative z-20 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-3xl">
          {/* Animated Company Logo Reveal & Clean Unboxed Identity Line */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mb-7 flex flex-wrap items-center gap-3"
          >
            <motion.div
              initial={shouldReduceMotion ? false : { scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="flex items-center gap-2.5"
            >
              <BrandMark className="h-9 w-9" />
              <span className="font-display text-base font-bold tracking-tight text-white">
                {COMPANY_INFO.name}
              </span>
            </motion.div>
            <span className="text-slate-500" aria-hidden="true">·</span>
            <span className="text-sm font-medium text-sky-300">
              {COMPANY_INFO.subBrand}
            </span>
            <span className="text-slate-500" aria-hidden="true">·</span>
            <span className="text-sm text-slate-300">
              {COMPANY_INFO.tagline}
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={shouldReduceMotion ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.08] [text-wrap:balance]"
          >
            Your Vision. Our Print.{' '}
            <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-sky-400 bg-clip-text text-transparent">
              Infinite Possibilities.
            </span>
          </motion.h1>

          {/* Supporting Text */}
          <motion.p
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg"
          >
            Transforming ideas into extraordinary visual experiences with premium digital printing,
            signage, banners, and advertising solutions.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.34, ease: [0.16, 1, 0.3, 1] }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <MagneticButton
              onClick={onGetQuote}
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition-all duration-150 hover:bg-orange-400 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#060B18]"
            >
              <span>Get a Free Quote</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </MagneticButton>

            <MagneticButton
              onClick={onExploreServices}
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-md transition-colors duration-150 hover:border-sky-400/50 hover:bg-sky-500/10 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#060B18]"
            >
              <span>Explore Our Services</span>
            </MagneticButton>
          </motion.div>

          {/* Verified Local Footnote (unboxed metadata) */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/10 pt-6 text-xs sm:text-sm text-slate-400"
          >
            <span className="font-medium text-slate-200">{COMPANY_INFO.location}</span>
            <span aria-hidden="true">·</span>
            <span>{COMPANY_INFO.category}</span>
            <span aria-hidden="true">·</span>
            <a
              href={COMPANY_INFO.mobileHref}
              className="font-mono tabular-nums text-slate-200 transition-colors hover:text-orange-400"
            >
              +91 {COMPANY_INFO.mobileDisplay}
            </a>
          </motion.div>
        </div>
      </motion.div>

      {/* Smooth Scroll Indicator */}
      <motion.a
        href="#about"
        onClick={(e) => {
          e.preventDefault();
          document.querySelector('#about')?.scrollIntoView({
            behavior: shouldReduceMotion ? 'auto' : 'smooth',
          });
        }}
        aria-label="Scroll to About Print Galaxy"
        animate={shouldReduceMotion ? undefined : { y: [0, 6, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-1.5 text-xs font-medium text-slate-400 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-lg p-2"
      >
        <span>Scroll</span>
        <ArrowDown className="h-4 w-4 text-orange-400" aria-hidden="true" />
      </motion.a>
    </section>
  );
}
