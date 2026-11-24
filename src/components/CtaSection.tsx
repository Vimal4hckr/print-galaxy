import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { buildWhatsAppUrl } from '../data/printGalaxyData';
import { MagneticButton } from './MagneticButton';

interface CtaSectionProps {
  onContactClick: () => void;
}

export function CtaSection({ onContactClick }: CtaSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden border-t border-white/5 bg-[#060B18] py-20 lg:py-24">
      {/* Ambient gradient glow */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-1/4 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-orange-500/15 blur-[120px]" />
        <div className="absolute right-1/4 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-blue-600/20 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-3xl border border-white/15 bg-gradient-to-br from-[#0F182E]/95 via-[#0B1325]/95 to-[#091122]/95 px-6 py-12 text-center shadow-2xl backdrop-blur-xl sm:px-12 sm:py-16"
        >
          <p className="text-sm font-medium text-orange-400">
            Print Galaxy · Coimbatore
          </p>

          <h2 className="mx-auto mt-3 max-w-3xl font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl [text-wrap:balance]">
            Ready to Make Your Brand Stand Out?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Let&rsquo;s turn your next advertising idea into something unforgettable.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <MagneticButton
              onClick={onContactClick}
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-orange-500 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition-colors hover:bg-orange-400 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1325]"
            >
              <span>Contact Us</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </MagneticButton>

            <MagneticButton
              href={buildWhatsAppUrl(
                'Hello Print Galaxy (Ruban), I am ready to discuss a printing / signage project.'
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-7 py-3 text-sm font-semibold text-white transition-colors hover:border-sky-400/50 hover:bg-sky-500/10 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1325]"
            >
              <MessageCircle className="h-4 w-4 text-sky-400" aria-hidden="true" />
              <span>Chat on WhatsApp</span>
            </MagneticButton>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
