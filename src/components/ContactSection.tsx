import { useState, useEffect, type FormEvent } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  Phone,
  Building2,
  Mail,
  MapPin,
  MessageCircle,
  User,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import {
  APIProvider,
  Map as GoogleMap,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useMap,
  useMapsLibrary,
  useAdvancedMarkerRef,
  useApiLoadingStatus,
  APILoadingStatus,
} from '@vis.gl/react-google-maps';
import {
  COMPANY_INFO,
  SERVICES,
  buildWhatsAppUrl,
} from '../data/printGalaxyData';

interface ContactSectionProps {
  preselectedService: string;
}

interface LatLngLiteral {
  lat: number;
  lng: number;
}

interface VerifiedPlaceState {
  location: LatLngLiteral;
  displayName: string;
  formattedAddress: string;
}

const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;

function CoimbatorePlaceResolver({
  onResolved,
}: {
  onResolved: (place: VerifiedPlaceState) => void;
}) {
  const map = useMap();
  const placesLib = useMapsLibrary('places');

  useEffect(() => {
    if (!placesLib || !map) return;

    let cancelled = false;

    const resolveCoimbatore = async () => {
      try {
        const { places } = await placesLib.Place.searchByText({
          textQuery: 'Coimbatore, Tamil Nadu, India',
          fields: ['id', 'displayName', 'formattedAddress', 'location', 'viewport'],
          maxResultCount: 1,
        });

        const match = places?.[0];
        if (!cancelled && match?.location) {
          const lat = match.location.lat();
          const lng = match.location.lng();
          if (match.viewport) {
            map.fitBounds(match.viewport);
            map.setZoom(12);
          } else {
            map.setCenter({ lat, lng });
            map.setZoom(12);
          }
          onResolved({
            location: { lat, lng },
            displayName: match.displayName ?? 'Coimbatore',
            formattedAddress: match.formattedAddress ?? COMPANY_INFO.location,
          });
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        if (
          msg.includes('RESOURCE_EXHAUSTED') ||
          msg.includes('OVER_QUERY_LIMIT') ||
          msg.includes('429')
        ) {
          window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
        }
        console.error('Unable to resolve Coimbatore map viewport:', err);
      }
    };

    void resolveCoimbatore();

    return () => {
      cancelled = true;
    };
  }, [placesLib, map, onResolved]);

  return null;
}

function CoimbatoreMapView() {
  const loadingStatus = useApiLoadingStatus();
  const [resolvedPlace, setResolvedPlace] = useState<VerifiedPlaceState | null>(null);
  const [infoOpen, setInfoOpen] = useState(true);
  const [markerRef, marker] = useAdvancedMarkerRef();

  if (
    loadingStatus === APILoadingStatus.FAILED ||
    loadingStatus === APILoadingStatus.AUTH_FAILURE
  ) {
    return (
      <div className="flex h-[320px] flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#0B1325] p-6 text-center">
        <MapPin className="h-8 w-8 text-orange-400" aria-hidden="true" />
        <p className="mt-3 font-display text-base font-semibold text-white">
          {COMPANY_INFO.location}
        </p>
        <p className="mt-1 text-xs text-slate-400">
          Interactive map is currently unavailable. Please call {COMPANY_INFO.mobileDisplay} for exact studio directions.
        </p>
      </div>
    );
  }

  return (
    <div className="relative h-[320px] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0B1325]">
      <GoogleMap
        mapId="DEMO_MAP_ID"
        internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
        defaultCenter={{ lat: 20.5937, lng: 78.9629 }}
        defaultZoom={4}
        gestureHandling="cooperative"
        disableDefaultUI={false}
        style={{ width: '100%', height: '100%' }}
      >
        <CoimbatorePlaceResolver onResolved={setResolvedPlace} />

        {resolvedPlace && (
          <AdvancedMarker
            ref={markerRef}
            position={resolvedPlace.location}
            title={`${COMPANY_INFO.name} — ${resolvedPlace.formattedAddress}`}
            onClick={() => setInfoOpen((prev) => !prev)}
          >
            <Pin background="#F97316" borderColor="#C2410C" glyphColor="#FFFFFF" />
          </AdvancedMarker>
        )}

        {resolvedPlace && infoOpen && marker && (
          <InfoWindow
            anchor={marker}
            maxWidth={260}
            onCloseClick={() => setInfoOpen(false)}
          >
            <div className="p-1 text-slate-900">
              <div className="font-bold text-sm">{COMPANY_INFO.name}</div>
              <div className="text-xs text-slate-600">{COMPANY_INFO.subBrand}</div>
              <div className="mt-1.5 text-xs text-slate-700">
                {resolvedPlace.formattedAddress}
              </div>
              <div className="mt-1 text-xs font-medium text-slate-800">
                Contact: {COMPANY_INFO.contactPerson} · {COMPANY_INFO.mobileDisplay}
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}

export function ContactSection({ preselectedService }: ContactSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [service, setService] = useState(preselectedService || 'LED Boards');
  const [description, setDescription] = useState('');

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<{
    enquiryId: string;
    message: string;
    service: string;
  } | null>(null);

  useEffect(() => {
    if (preselectedService) {
      setService(preselectedService);
    }
  }, [preselectedService]);

  const validateClient = () => {
    const errors: Record<string, string> = {};
    if (name.trim().length < 2) {
      errors.name = 'Please enter your full name (at least 2 characters).';
    }
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 7 || digits.length > 15 || !/^[+\d\s()-]{7,24}$/.test(phone.trim())) {
      errors.phone = 'Please enter a valid 7 to 15 digit phone number.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }
    if (!service.trim()) {
      errors.service = 'Please select a required service.';
    }
    if (description.trim().length < 10) {
      errors.description = 'Please describe your project requirements (at least 10 characters).';
    }
    return errors;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);

    const errors = validateClient();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          service,
          description: description.trim(),
        }),
      });

      const payload = (await response.json()) as {
        success?: boolean;
        enquiryId?: string;
        message?: string;
        error?: string;
        fieldErrors?: Record<string, string>;
      };

      if (!response.ok) {
        if (payload.fieldErrors) {
          setFieldErrors(payload.fieldErrors);
        }
        setSubmitError(
          payload.error ?? 'Unable to submit enquiry. Please check your details and try again.'
        );
        return;
      }

      setSubmitSuccess({
        enquiryId: payload.enquiryId ?? 'CONFIRMED',
        message:
          payload.message ??
          'Your enquiry has been received. Ruban or our Coimbatore team will get back to you shortly.',
        service,
      });
      setName('');
      setPhone('');
      setEmail('');
      setDescription('');
      setFieldErrors({});
    } catch {
      setSubmitError(
        `Network error while sending enquiry. You can call ${COMPANY_INFO.mobileDisplay} or message us directly on WhatsApp.`
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative border-t border-white/5 bg-[#080E1E] py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl"
        >
          <p className="text-sm font-medium text-sky-400">
            Contact Us
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl [text-wrap:balance]">
            Start Your Print or Signage Enquiry.
          </h2>
          <p className="mt-3 text-base leading-relaxed text-slate-400">
            Reach our Coimbatore desk directly via phone, WhatsApp, or email, or share your project brief using the enquiry form.
          </p>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
          {/* Left Column: Verified Contact Details & Google Map */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5 }}
            className="space-y-6 lg:col-span-5"
          >
            <div className="rounded-2xl border border-white/10 bg-[#0B1325] p-6 sm:p-7">
              <div className="border-b border-white/10 pb-5">
                <h3 className="font-display text-xl font-bold text-white">
                  {COMPANY_INFO.name}
                </h3>
                <p className="mt-0.5 text-sm text-sky-400">
                  {COMPANY_INFO.subBrand} · {COMPANY_INFO.tagline}
                </p>
              </div>

              <dl className="mt-5 space-y-4 text-sm">
                <div className="flex items-start gap-3.5">
                  <User className="mt-0.5 h-5 w-5 shrink-0 text-orange-400" aria-hidden="true" />
                  <div>
                    <dt className="text-xs font-medium text-slate-400">Contact Person</dt>
                    <dd className="mt-0.5 font-medium text-white">{COMPANY_INFO.contactPerson}</dd>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-orange-400" aria-hidden="true" />
                  <div>
                    <dt className="text-xs font-medium text-slate-400">Mobile (Click to Call)</dt>
                    <dd className="mt-0.5">
                      <a
                        href={COMPANY_INFO.mobileHref}
                        className="font-mono text-base font-semibold tabular-nums text-white transition-colors hover:text-orange-400"
                      >
                        {COMPANY_INFO.mobileDisplay}
                      </a>
                    </dd>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <Building2 className="mt-0.5 h-5 w-5 shrink-0 text-sky-400" aria-hidden="true" />
                  <div>
                    <dt className="text-xs font-medium text-slate-400">Office Telephone</dt>
                    <dd className="mt-0.5">
                      <a
                        href={COMPANY_INFO.officeHref}
                        className="font-mono text-base font-semibold tabular-nums text-slate-200 transition-colors hover:text-sky-400"
                      >
                        {COMPANY_INFO.officeDisplay}
                      </a>
                    </dd>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-sky-400" aria-hidden="true" />
                  <div>
                    <dt className="text-xs font-medium text-slate-400">Email</dt>
                    <dd className="mt-0.5">
                      <a
                        href={COMPANY_INFO.emailHref}
                        className="font-medium text-slate-200 transition-colors hover:text-sky-400 break-all"
                      >
                        {COMPANY_INFO.email}
                      </a>
                    </dd>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-orange-400" aria-hidden="true" />
                  <div>
                    <dt className="text-xs font-medium text-slate-400">Location</dt>
                    <dd className="mt-0.5 font-medium text-slate-200">
                      {COMPANY_INFO.location}
                    </dd>
                    <p className="mt-1 text-xs text-slate-400">
                      Call or message on WhatsApp to confirm exact studio street directions for artwork drop-off or inspection.
                    </p>
                  </div>
                </div>
              </dl>

              <div className="mt-6 grid grid-cols-1 gap-3 border-t border-white/10 pt-5 sm:grid-cols-2">
                <a
                  href={COMPANY_INFO.mobileHref}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                >
                  <Phone className="h-4 w-4 text-sky-400" aria-hidden="true" />
                  <span>Call Mobile</span>
                </a>
                <a
                  href={buildWhatsAppUrl(
                    'Hello Print Galaxy (Ruban), I would like to request a quote.'
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  <span>WhatsApp Chat</span>
                </a>
              </div>
            </div>

            {/* Google Maps Coimbatore View */}
            <div>
              <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
                <span className="font-medium text-slate-300">Service Area · {COMPANY_INFO.shortLocation}</span>
                <span>Interactive Google Map</span>
              </div>

              {MAPS_API_KEY ? (
                <APIProvider
                  apiKey={MAPS_API_KEY}
                  libraries={['places', 'marker']}
                  language="en"
                  region="IN"
                >
                  <CoimbatoreMapView />
                </APIProvider>
              ) : (
                <div className="flex h-[320px] flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#0B1325] p-6 text-center">
                  <MapPin className="h-8 w-8 text-orange-400" aria-hidden="true" />
                  <p className="mt-3 font-display text-base font-semibold text-white">
                    {COMPANY_INFO.location}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Serving Coimbatore and surrounding industrial &amp; commercial corridors.
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right Column: Validated Enquiry Form */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7"
          >
            <div className="rounded-2xl border border-white/10 bg-[#0B1325] p-6 sm:p-8 lg:p-10">
              <h3 className="font-display text-2xl font-bold text-white">
                Request a Quote
              </h3>
              <p className="mt-1.5 text-sm text-slate-400">
                Share your signage dimensions, preferred material, or campaign timeline below.
              </p>

              {submitSuccess && (
                <div
                  role="status"
                  className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-emerald-100"
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" aria-hidden="true" />
                    <div className="flex-1">
                      <p className="font-display text-base font-semibold text-white">
                        Enquiry Confirmed · Ref {submitSuccess.enquiryId}
                      </p>
                      <p className="mt-1 text-sm text-emerald-200/90">
                        {submitSuccess.message}
                      </p>
                      <div className="mt-3">
                        <a
                          href={buildWhatsAppUrl(
                            `Hello Print Galaxy (Ruban), I submitted enquiry ${submitSuccess.enquiryId} for ${submitSuccess.service}.`
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-300 underline underline-offset-4 hover:text-orange-200"
                        >
                          <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Share artwork or follow up on WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {submitError && (
                <div
                  role="alert"
                  className="mt-6 flex items-start gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200"
                >
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-400" aria-hidden="true" />
                  <span>{submitError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="mt-7 space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="enquiry-name" className="block text-sm font-medium text-slate-200">
                      Name <span className="text-orange-400">*</span>
                    </label>
                    <input
                      id="enquiry-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (fieldErrors.name) setFieldErrors((p) => ({ ...p, name: '' }));
                      }}
                      placeholder="Your full name"
                      aria-invalid={Boolean(fieldErrors.name)}
                      className="mt-1.5 block w-full rounded-xl border border-white/15 bg-[#060B18] px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                    {fieldErrors.name && (
                      <p className="mt-1.5 text-xs text-rose-400">{fieldErrors.name}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="enquiry-phone" className="block text-sm font-medium text-slate-200">
                      Phone Number <span className="text-orange-400">*</span>
                    </label>
                    <input
                      id="enquiry-phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (fieldErrors.phone) setFieldErrors((p) => ({ ...p, phone: '' }));
                      }}
                      placeholder="e.g. 98765 43210"
                      aria-invalid={Boolean(fieldErrors.phone)}
                      className="mt-1.5 block w-full rounded-xl border border-white/15 bg-[#060B18] px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                    {fieldErrors.phone && (
                      <p className="mt-1.5 text-xs text-rose-400">{fieldErrors.phone}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="enquiry-email" className="block text-sm font-medium text-slate-200">
                      Email <span className="text-orange-400">*</span>
                    </label>
                    <input
                      id="enquiry-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: '' }));
                      }}
                      placeholder="you@company.com"
                      aria-invalid={Boolean(fieldErrors.email)}
                      className="mt-1.5 block w-full rounded-xl border border-white/15 bg-[#060B18] px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                    {fieldErrors.email && (
                      <p className="mt-1.5 text-xs text-rose-400">{fieldErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="enquiry-service" className="block text-sm font-medium text-slate-200">
                      Required Service <span className="text-orange-400">*</span>
                    </label>
                    <select
                      id="enquiry-service"
                      name="service"
                      value={service}
                      onChange={(e) => {
                        setService(e.target.value);
                        if (fieldErrors.service) setFieldErrors((p) => ({ ...p, service: '' }));
                      }}
                      aria-invalid={Boolean(fieldErrors.service)}
                      className="mt-1.5 block w-full rounded-xl border border-white/15 bg-[#060B18] px-4 py-3 text-sm text-white focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    >
                      {SERVICES.map((item) => (
                        <option key={item.id} value={item.name} className="bg-[#0B1325] text-white">
                          {item.name}
                        </option>
                      ))}
                      <option value="General Enquiry" className="bg-[#0B1325] text-white">
                        General Enquiry / Multiple Services
                      </option>
                    </select>
                    {fieldErrors.service && (
                      <p className="mt-1.5 text-xs text-rose-400">{fieldErrors.service}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="enquiry-description" className="block text-sm font-medium text-slate-200">
                    Project Description <span className="text-orange-400">*</span>
                  </label>
                  <textarea
                    id="enquiry-description"
                    name="description"
                    rows={5}
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      if (fieldErrors.description) {
                        setFieldErrors((p) => ({ ...p, description: '' }));
                      }
                    }}
                    placeholder="Share approximate size/dimensions, quantity, installation location in Coimbatore, and target timeline..."
                    aria-invalid={Boolean(fieldErrors.description)}
                    className="mt-1.5 block w-full rounded-xl border border-white/15 bg-[#060B18] px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                  {fieldErrors.description && (
                    <p className="mt-1.5 text-xs text-rose-400">{fieldErrors.description}</p>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition-colors hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1325]"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                        <span>Submitting Enquiry...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" aria-hidden="true" />
                        <span>Submit Enquiry</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
