import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { CheckCircle2, PhoneCall } from 'lucide-react';
import { COMPANY_INFO } from '../data/printGalaxyData';
import { ResilientImage } from './ResilientImage';

const HIGHLIGHTS = [
  {
    title: 'Quality printing',
    detail: 'High-resolution digital, Flex, and Eco Latex output calibrated for crisp typography and rich colour density.',
  },
  {
    title: 'Creative advertising solutions',
    detail: 'Visual formats built for storefronts, highway hoardings, indoor retail walls, and commercial launch events.',
  },
  {
    title: 'Professional fabrication',
    detail: 'Structural metal frames, ACP profiles, and custom illuminated signage assemblies engineered for durability.',
  },
  {
    title: 'Custom printing services',
    detail: 'Tailored dimensions, vinyl finishes, fabric tension systems, and illuminated media built to brief.',
  },
  {
    title: 'Customer-focused service',
    detail: 'Direct coordination with Ruban and our Coimbatore team from artwork review through final delivery.',
  },
];

function VerifiedCounter({ target, label }: { target: number; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const shouldReduceMotion = useReducedMotion();
  const [count, setCount] = useState(shouldReduceMotion ? target : 0);

  useEffect(() => {
    if (!inView || shouldReduceMotion) {
      if (inView) setCount(target);
      return;
    }
    let frame = 0;
    const totalFrames = 24;
    const timer = window.setInterval(() => {
      frame += 1;
      const next = Math.round((frame / totalFrames) * target);
      setCount(next);
      if (frame >= totalFrames) {
        window.clearInterval(timer);
      }
    }, 28);
    return () => window.clearInterval(timer);
  }, [inView, target, shouldReduceMotion]);

  return (
    <div ref={ref} className="border-t border-white/10 pt-4">
      <div className="font-mono text-2xl font-semibold tabular-nums text-white sm:text-3xl">
        {String(count).padStart(2, '0')}
      </div>
      <div className="mt-1 text-xs font-medium text-slate-400">{label}</div>
    </div>
  );
}

export function AboutSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="about" className="relative border-t border-white/5 bg-[#080E1E] py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-stretch gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Left Split Image */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 flex flex-col"
          >
            <div className="relative h-full min-h-[340px] overflow-hidden rounded-2xl border border-white/10 bg-[#0F172A]">
              <ResilientImage
                src="/src/assets/images/about_workshop_team_1795518067808.jpg"
                alt="Print Galaxy signage and digital printing technicians inspecting illuminated acrylic letters and large format print"
                className="h-full w-full object-cover lg:h-full"
                fallbackTitle="Print Galaxy Production Facility"
              />
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#060B18]/85 via-[#060B18]/20 to-transparent"
                aria-hidden="true"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="text-xs font-medium text-orange-400">
                  {COMPANY_INFO.name} · {COMPANY_INFO.subBrand}
                </div>
                <p className="mt-1 text-sm text-slate-200">
                  {COMPANY_INFO.location} — Serving businesses across commercial signage, display boards, and wide-format print.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Split Copy & Highlights */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 flex flex-col justify-between"
          >
            <div>
              <p className="text-sm font-medium text-sky-400">
                About {COMPANY_INFO.name}
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl [text-wrap:balance]">
                We Bring Your Ideas to Life.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-300">
                Based in Coimbatore, Tamil Nadu, <strong className="font-semibold text-white">{COMPANY_INFO.name} – {COMPANY_INFO.subBrand}</strong>{' '}
                is a dedicated digital printing, advertising, signage, and fabrication studio. True to our motto{' '}
                <span className="text-orange-400 font-medium">&ldquo;{COMPANY_INFO.tagline}&rdquo;</span>, we partner with retail brands,
                commercial establishments, event organizers, and growing businesses to turn brand concepts into bold physical presence.
              </p>

              {/* Five Core Highlights */}
              <ul className="mt-8 space-y-4">
                {HIGHLIGHTS.map((item) => (
                  <li key={item.title} className="flex items-start gap-3.5">
                    <CheckCircle2
                      className="mt-0.5 h-5 w-5 shrink-0 text-orange-400"
                      aria-hidden="true"
                    />
                    <div>
                      <h3 className="font-display text-sm font-semibold text-white sm:text-base">
                        {item.title}
                      </h3>
                      <p className="mt-0.5 text-sm leading-relaxed text-slate-400">
                        {item.detail}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Verified Scope Counters & Direct Contact Link */}
            <div className="mt-10 grid grid-cols-3 gap-6">
              <VerifiedCounter target={11} label="Core Print & Signage Services" />
              <VerifiedCounter target={4} label="Stage Production Flow" />
              <div className="border-t border-white/10 pt-4">
                <a
                  href={COMPANY_INFO.mobileHref}
                  className="inline-flex items-center gap-1.5 font-mono text-sm font-semibold tabular-nums text-sky-400 transition-colors hover:text-sky-300 sm:text-base"
                >
                  <PhoneCall className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>{COMPANY_INFO.mobileDisplay}</span>
                </a>
                <div className="mt-1 text-xs font-medium text-slate-400">
                  Direct Desk · {COMPANY_INFO.contactPerson}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
