import { useState, type MouseEvent } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ArrowUpRight, Eye, MessageCircle, X, Check } from 'lucide-react';
import {
  SERVICES,
  buildWhatsAppUrl,
  type ServiceItem,
} from '../data/printGalaxyData';
import { ResilientImage } from './ResilientImage';

interface ServicesSectionProps {
  onSelectServiceForQuote: (serviceName: string) => void;
}

function ServiceCard({
  service,
  index,
  onOpenDetails,
}: {
  service: ServiceItem;
  index: number;
  onOpenDetails: (service: ServiceItem) => void;
}) {
  const shouldReduceMotion = useReducedMotion();
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    if (shouldReduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      rotateX: -yPct * 5,
      rotateY: xPct * 5,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  const whatsappHref = buildWhatsAppUrl(
    `Hello Print Galaxy (Ruban), I would like an enquiry/quote for ${service.name}.`
  );

  return (
    <motion.article
      initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.04, 0.28), ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={
        shouldReduceMotion
          ? undefined
          : {
              transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
              transition: 'transform 180ms cubic-bezier(0.16, 1, 0.3, 1)',
            }
      }
      className="group relative flex flex-col overflow-hidden rounded-2xl p-[1px] bg-white/10 transition-colors duration-300 hover:bg-gradient-to-br hover:from-orange-500/70 hover:via-sky-400/50 hover:to-blue-600/70"
    >
      <div className="flex h-full flex-col overflow-hidden rounded-[15px] bg-[#0B1325]">
        {/* Service Media */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0F172A]">
          <ResilientImage
            src={service.image}
            alt={`${service.name} by Print Galaxy`}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            fallbackTitle={service.name}
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B1325] via-[#0B1325]/20 to-transparent"
            aria-hidden="true"
          />
        </div>

        {/* Service Body */}
        <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
              <span className="font-mono tabular-nums text-orange-400">{service.index}</span>
              <span aria-hidden="true">·</span>
              <span>{service.categoryLabel}</span>
            </div>

            <h3 className="mt-2 font-display text-xl font-bold tracking-tight text-white">
              {service.name}
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              {service.shortDescription}
            </p>
          </div>

          <div className="mt-6 flex items-center gap-2.5 border-t border-white/10 pt-4">
            <button
              type="button"
              onClick={() => onOpenDetails(service)}
              className="inline-flex min-h-[40px] flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-100 transition-colors duration-150 hover:border-sky-400/50 hover:bg-sky-500/10 whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            >
              <Eye className="h-3.5 w-3.5 text-sky-400" aria-hidden="true" />
              <span>View Details</span>
            </button>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[40px] flex-1 items-center justify-center gap-1.5 rounded-lg bg-orange-500 px-3 py-2 text-xs font-semibold text-white transition-colors duration-150 hover:bg-orange-400 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
            >
              <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Enquire</span>
            </a>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export function ServicesSection({ onSelectServiceForQuote }: ServicesSectionProps) {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="services" className="relative border-t border-white/5 bg-[#060B18] py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
        >
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-orange-400">
              Our Services
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl [text-wrap:balance]">
              Eleven Specialized Print, Signage &amp; Fabrication Formats.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-slate-400">
            From illuminated 3D LED boards to odourless Eco Latex vinyl and oversized highway hoardings, every format is produced to match your site specifications.
          </p>
        </motion.div>

        {/* 11 Service Cards Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, idx) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={idx}
              onOpenDetails={setSelectedService}
            />
          ))}
        </div>
      </div>

      {/* Service Details Modal */}
      <AnimatePresence>
        {selectedService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            onClick={() => setSelectedService(null)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="service-modal-title"
          >
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/15 bg-[#0B1325] shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setSelectedService(null)}
                aria-label="Close service details"
                className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-[#060B18]/80 text-slate-200 transition-colors hover:bg-white/15 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="aspect-[16/9] w-full overflow-hidden bg-[#0F172A]">
                <ResilientImage
                  src={selectedService.image}
                  alt={selectedService.name}
                  className="h-full w-full object-cover"
                  fallbackTitle={selectedService.name}
                />
              </div>

              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                  <span className="font-mono tabular-nums text-orange-400">
                    {selectedService.index}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{selectedService.categoryLabel}</span>
                </div>

                <h3
                  id="service-modal-title"
                  className="mt-2 font-display text-2xl font-bold text-white"
                >
                  {selectedService.name}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
                  {selectedService.detailedOverview}
                </p>

                <div className="mt-6 grid grid-cols-1 gap-6 border-t border-white/10 pt-5 sm:grid-cols-2">
                  <div>
                    <h4 className="text-xs font-semibold tracking-wide text-sky-400">
                      Key Specifications
                    </h4>
                    <ul className="mt-2.5 space-y-2">
                      {selectedService.highlights.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-slate-300">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-orange-400" aria-hidden="true" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold tracking-wide text-sky-400">
                      Common Applications
                    </h4>
                    <p className="mt-2.5 text-sm leading-relaxed text-slate-300">
                      {selectedService.applications.join(' · ')}
                    </p>
                  </div>
                </div>

                <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-white/10 pt-6">
                  <button
                    type="button"
                    onClick={() => {
                      const name = selectedService.name;
                      setSelectedService(null);
                      onSelectServiceForQuote(name);
                    }}
                    className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-400 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
                  >
                    <span>Request Quote for {selectedService.name}</span>
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </button>

                  <a
                    href={buildWhatsAppUrl(
                      `Hello Print Galaxy (Ruban), I would like pricing and specs for ${selectedService.name}.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-slate-100 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                  >
                    <MessageCircle className="h-4 w-4 text-sky-400" aria-hidden="true" />
                    <span>Enquire on WhatsApp</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
