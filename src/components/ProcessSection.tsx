import { motion, useReducedMotion } from 'motion/react';
import { PROCESS_STEPS } from '../data/printGalaxyData';

export function ProcessSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="process" className="relative border-t border-white/5 bg-[#080E1E] py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl"
        >
          <p className="text-sm font-medium text-sky-400">
            Our Working Process
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl [text-wrap:balance]">
            From Initial Concept to Crisp Final Installation.
          </h2>
        </motion.div>

        {/* Connected 4-Step Animated Timeline */}
        <div className="relative mt-14">
          {/* Desktop Horizontal Connector */}
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-7 hidden h-[1px] bg-white/10 lg:block"
          >
            <motion.div
              initial={shouldReduceMotion ? { scaleX: 1 } : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="h-full origin-left bg-gradient-to-r from-orange-500 via-sky-400 to-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {PROCESS_STEPS.map((item, idx) => (
              <motion.div
                key={item.step}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.45,
                  delay: idx * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="relative flex flex-col"
              >
                {/* Step Node */}
                <div className="relative z-10 flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-orange-500/40 bg-[#0B1325] font-mono text-base font-semibold tabular-nums text-orange-400 shadow-sm">
                    {item.step}
                  </div>
                  <div className="h-[1px] flex-1 bg-white/10 lg:hidden" aria-hidden="true" />
                </div>

                <div className="mt-5 rounded-2xl border border-white/10 bg-[#0B1325]/80 p-6 flex-1">
                  <h3 className="font-display text-lg font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-slate-400">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
