/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, MotionConfig, useReducedMotion } from 'motion/react';
import { ArrowUp } from 'lucide-react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { ServicesSection } from './components/ServicesSection';
import { ShowcaseSection } from './components/ShowcaseSection';
import { WhyChooseSection } from './components/WhyChooseSection';
import { ProcessSection } from './components/ProcessSection';
import { CtaSection } from './components/CtaSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';

export default function App() {
  const [preselectedService, setPreselectedService] = useState('LED Boards');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [mapsQuotaExceeded, setMapsQuotaExceeded] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const onQuotaExceeded = () => setMapsQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', onQuotaExceeded);
    return () => window.removeEventListener('gmp-quota-exceeded', onQuotaExceeded);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setShowBackToTop(window.scrollY > 560);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToSection = useCallback(
    (selector: string) => {
      const target = document.querySelector(selector);
      if (target) {
        target.scrollIntoView({ behavior: shouldReduceMotion ? 'auto' : 'smooth' });
      }
    },
    [shouldReduceMotion]
  );

  const handleSelectServiceForQuote = useCallback(
    (serviceName: string) => {
      setPreselectedService(serviceName);
      scrollToSection('#contact');
    },
    [scrollToSection]
  );

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[#060B18] text-slate-100">
        {mapsQuotaExceeded && (
          <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
            <span>
              Google Maps Platform quota reached. If you are the app owner, visit{' '}
              <a
                href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-semibold text-amber-950 hover:text-amber-800"
              >
                maps developer site
              </a>{' '}
              for instructions to update your account.
            </span>
          </div>
        )}

        <Header onRequestQuote={() => scrollToSection('#contact')} />

        <motion.main
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          <HeroSection
            onExploreServices={() => scrollToSection('#services')}
            onGetQuote={() => scrollToSection('#contact')}
          />

          <AboutSection />

          <ServicesSection onSelectServiceForQuote={handleSelectServiceForQuote} />

          <ShowcaseSection onEnquireFormat={handleSelectServiceForQuote} />

          <WhyChooseSection />

          <ProcessSection />

          <CtaSection onContactClick={() => scrollToSection('#contact')} />

          <ContactSection preselectedService={preselectedService} />
        </motion.main>

        <Footer onSelectService={handleSelectServiceForQuote} />

        {/* Back-to-Top Floating Button */}
        <AnimatePresence>
          {showBackToTop && (
            <motion.button
              type="button"
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
              transition={{ duration: 0.18 }}
              onClick={() =>
                window.scrollTo({
                  top: 0,
                  behavior: shouldReduceMotion ? 'auto' : 'smooth',
                })
              }
              aria-label="Back to top"
              className="fixed bottom-5 right-5 z-30 flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-[#0F172A]/90 text-white shadow-lg backdrop-blur-md transition-colors hover:border-orange-500/60 hover:bg-orange-500 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
            >
              <ArrowUp className="h-5 w-5" aria-hidden="true" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
