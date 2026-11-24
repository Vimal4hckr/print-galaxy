import { Phone, Mail, MessageCircle, MapPin } from 'lucide-react';
import {
  COMPANY_INFO,
  SERVICES,
  buildWhatsAppUrl,
} from '../data/printGalaxyData';
import { BrandMark } from './Header';

interface FooterProps {
  onSelectService: (serviceName: string) => void;
}

const QUICK_LINKS = [
  { label: 'Home', href: '#hero' },
  { label: 'About Print Galaxy', href: '#about' },
  { label: 'Our Services', href: '#services' },
  { label: 'Featured Showcase', href: '#showcase' },
  { label: 'Why Choose Us', href: '#why-us' },
  { label: 'Working Process', href: '#process' },
  { label: 'Contact & Quote', href: '#contact' },
];

export function Footer({ onSelectService }: FooterProps) {
  return (
    <footer className="border-t border-white/10 bg-[#040812] text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <a
              href="#hero"
              className="inline-flex items-center gap-2.5 font-display text-xl font-bold tracking-tight text-white"
            >
              <BrandMark className="h-8 w-8" />
              <span>{COMPANY_INFO.name}</span>
            </a>
            <p className="mt-2 text-xs font-medium text-sky-400">
              {COMPANY_INFO.subBrand} · {COMPANY_INFO.tagline}
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              Digital printing, LED signage, flex banners, eco-latex vinyl, hoardings, and custom structural fabrication serving businesses across Coimbatore, Tamil Nadu.
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="lg:col-span-2">
            <h3 className="font-display text-sm font-semibold text-white">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-slate-400 transition-colors hover:text-orange-400"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* All 11 Printing Services */}
          <div className="lg:col-span-3">
            <h3 className="font-display text-sm font-semibold text-white">
              Printing &amp; Signage Services
            </h3>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              {SERVICES.map((service) => (
                <li key={service.id}>
                  <button
                    type="button"
                    onClick={() => onSelectService(service.name)}
                    className="text-left text-slate-400 transition-colors hover:text-orange-400 cursor-pointer"
                  >
                    {service.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-3">
            <h3 className="font-display text-sm font-semibold text-white">
              Contact Details
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="text-slate-300">
                Contact Person: <span className="font-medium text-white">{COMPANY_INFO.contactPerson}</span>
              </li>
              <li>
                <a
                  href={COMPANY_INFO.mobileHref}
                  className="inline-flex items-center gap-2 font-mono tabular-nums text-slate-300 transition-colors hover:text-orange-400"
                >
                  <Phone className="h-4 w-4 text-orange-400 shrink-0" aria-hidden="true" />
                  <span>{COMPANY_INFO.mobileDisplay}</span>
                </a>
              </li>
              <li>
                <a
                  href={COMPANY_INFO.officeHref}
                  className="inline-flex items-center gap-2 font-mono tabular-nums text-slate-300 transition-colors hover:text-sky-400"
                >
                  <Phone className="h-4 w-4 text-sky-400 shrink-0" aria-hidden="true" />
                  <span>Office: {COMPANY_INFO.officeDisplay}</span>
                </a>
              </li>
              <li>
                <a
                  href={COMPANY_INFO.emailHref}
                  className="inline-flex items-center gap-2 text-slate-300 transition-colors hover:text-sky-400 break-all"
                >
                  <Mail className="h-4 w-4 text-sky-400 shrink-0" aria-hidden="true" />
                  <span>{COMPANY_INFO.email}</span>
                </a>
              </li>
              <li className="inline-flex items-center gap-2 text-slate-400">
                <MapPin className="h-4 w-4 text-orange-400 shrink-0" aria-hidden="true" />
                <span>{COMPANY_INFO.location}</span>
              </li>
              <li className="pt-1">
                <a
                  href={buildWhatsAppUrl('Hello Print Galaxy (Ruban), I would like to enquire about your printing services.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-orange-400 transition-colors hover:text-orange-300"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  <span>Message on WhatsApp</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-7 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {COMPANY_INFO.name} – {COMPANY_INFO.subBrand}. All rights reserved.
          </p>
          <p>
            {COMPANY_INFO.category} · {COMPANY_INFO.shortLocation}
          </p>
        </div>
      </div>
    </footer>
  );
}
