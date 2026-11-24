import { motion, useReducedMotion } from 'motion/react';
import {
  Layers,
  Compass,
  Grid3x3,
  Wrench,
  PhoneCall,
  Sliders,
} from 'lucide-react';
import { WHY_CHOOSE_FEATURES } from '../data/printGalaxyData';

const ICON_MAP = {
  Layers,
  Compass,
  Grid3x3,
  Wrench,
  PhoneCall,
  Sliders,
} as const;

export function WhyChooseSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="why-us" className="relative border-t border-white/5 bg-[#060B18] py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl"
        >
          <p className="text-sm font-medium text-orange-400">
            Why Print Galaxy
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl [text-wrap:balance]">
            Why Choose Print Galaxy?
          </h2>
          <p className="mt-3 text-base leading-relaxed text-slate-400">
            Consistent colour calibration, precision structural fabrication, and responsive local support across every order.
          </p>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {WHY_CHOOSE_FEATURES.map((feature, idx) => {
            const IconComponent = ICON_MAP[feature.iconName];
            return (
              <motion.div
                key={feature.id}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.45,
                  delay: Math.min(idx * 0.06, 0.3),
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group rounded-2xl border border-white/10 bg-[#0B1325]/90 p-6 transition-colors duration-200 hover:border-sky-400/35"
              >
                <motion.div
                  whileHover={shouldReduceMotion ? undefined : { scale: 1.08, rotate: 3 }}
                  transition={{ duration: 0.18 }}
                  className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-[#111C36] text-orange-400 transition-colors group-hover:border-orange-500/40 group-hover:text-orange-300"
                >
                  <IconComponent className="h-5 w-5" aria-hidden="true" />
                </motion.div>

                <h3 className="mt-5 font-display text-lg font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
