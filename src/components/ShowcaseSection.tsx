import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ZoomIn, X, ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import {
  SHOWCASE_CATEGORIES,
  SHOWCASE_ITEMS,
  type ShowcaseCategory,
  type ShowcaseItem,
} from '../data/printGalaxyData';
import { ResilientImage } from './ResilientImage';

interface ShowcaseSectionProps {
  onEnquireFormat: (serviceName: string) => void;
}

export function ShowcaseSection({ onEnquireFormat }: ShowcaseSectionProps) {
  const [activeCategory, setActiveCategory] = useState<ShowcaseCategory>('All');
  const [lightboxItem, setLightboxItem] = useState<ShowcaseItem | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const filteredItems =
    activeCategory === 'All'
      ? SHOWCASE_ITEMS
      : SHOWCASE_ITEMS.filter((item) => item.category === activeCategory);

  const navigateLightbox = useCallback(
    (direction: -1 | 1) => {
      if (!lightboxItem || filteredItems.length === 0) return;
      const currentIndex = filteredItems.findIndex((item) => item.id === lightboxItem.id);
      if (currentIndex === -1) return;
      const nextIndex = (currentIndex + direction + filteredItems.length) % filteredItems.length;
      setLightboxItem(filteredItems[nextIndex]);
    },
    [lightboxItem, filteredItems]
  );

  useEffect(() => {
    if (!lightboxItem) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxItem(null);
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
      if (e.key === 'ArrowRight') navigateLightbox(1);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxItem, navigateLightbox]);

  return (
    <section id="showcase" className="relative border-t border-white/5 bg-[#080E1E] py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"
        >
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-sky-400">
              Featured Format Showcase
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl [text-wrap:balance]">
              Our Work Speaks for Itself.
            </h2>
          </div>
          <p className="max-w-lg text-sm leading-relaxed text-slate-400">
            Illustrative format gallery demonstrating print clarity, illumination, and structural finishing across outdoor, retail, and event media.
          </p>
        </motion.div>

        {/* Interactive Category Filter Bar */}
        <div
          role="tablist"
          aria-label="Filter showcase formats by category"
          className="mt-9 flex flex-wrap items-center gap-2 border-b border-white/10 pb-5"
        >
          {SHOWCASE_CATEGORIES.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                role="tab"
                aria-selected={isActive}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`min-h-[40px] rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 ${
                  isActive
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Staggered Showcase Grid */}
        <motion.div
          layout={!shouldReduceMotion}
          className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, idx) => (
              <motion.article
                key={item.id}
                layout={!shouldReduceMotion}
                initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.96 }}
                transition={{
                  duration: 0.25,
                  delay: Math.min(idx * 0.03, 0.18),
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-[#0B1325]"
              >
                <button
                  type="button"
                  onClick={() => setLightboxItem(item)}
                  className="relative block aspect-[4/3] w-full overflow-hidden bg-[#0F172A] text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
                  aria-label={`Preview ${item.title}`}
                >
                  <ResilientImage
                    src={item.image}
                    alt={`${item.title} — ${item.category}`}
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    fallbackTitle={item.title}
                  />
                  <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#060B18]/85 via-transparent to-transparent opacity-80 transition-opacity duration-200 group-hover:opacity-95"
                    aria-hidden="true"
                  />
                  <div className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-[#060B18]/75 text-white opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100">
                    <ZoomIn className="h-4 w-4" aria-hidden="true" />
                  </div>
                </button>

                <div className="p-5">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                    <span className="font-medium text-sky-400">{item.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.formatSpec}</span>
                  </div>
                  <h3 className="mt-1.5 font-display text-lg font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
                    {item.description}
                  </p>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox Preview Modal */}
      <AnimatePresence>
        {lightboxItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setLightboxItem(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
            role="dialog"
            aria-modal="true"
            aria-labelledby="lightbox-title"
          >
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-white/15 bg-[#0B1325] shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setLightboxItem(null)}
                aria-label="Close lightbox preview"
                className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-[#060B18]/85 text-white transition-colors hover:bg-white/20 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="relative aspect-[16/10] w-full bg-[#060B18]">
                <ResilientImage
                  src={lightboxItem.image}
                  alt={lightboxItem.title}
                  className="h-full w-full object-cover"
                  fallbackTitle={lightboxItem.title}
                />

                {filteredItems.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => navigateLightbox(-1)}
                      aria-label="Previous showcase item"
                      className="absolute left-3 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-[#060B18]/75 text-white backdrop-blur-sm transition-colors hover:bg-orange-500 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => navigateLightbox(1)}
                      aria-label="Next showcase item"
                      className="absolute right-3 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-[#060B18]/75 text-white backdrop-blur-sm transition-colors hover:bg-orange-500 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>

              <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                    <span className="font-medium text-sky-400">{lightboxItem.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{lightboxItem.formatSpec}</span>
                  </div>
                  <h3 id="lightbox-title" className="mt-1 font-display text-xl font-bold text-white">
                    {lightboxItem.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-300">
                    {lightboxItem.description}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const targetService = lightboxItem.serviceMatch;
                    setLightboxItem(null);
                    onEnquireFormat(targetService);
                  }}
                  className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-400 whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
                >
                  <span>Enquire About This Format</span>
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
