import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CITIES, getCityBySlug } from "@/lib/cities";
import { Nav } from "@/components/Nav";
import { Header } from "@/components/Header";

export function generateStaticParams() {
  return CITIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const city = getCityBySlug(slug);
  if (!city) return {};
  return {
    title: city.metaTitle,
    description: city.metaDescription,
    alternates: { canonical: `https://mudrankseva.in/cities/${city.canonicalSlug}` },
  };
}

const SERVICES = [
  {
    href: "/rent-agreement",
    title: "Rent Agreement",
    desc: "Maharashtra Leave & License Agreement — AI-drafted, print-ready.",
    price: "₹299",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="8" y1="13" x2="16" y2="13"/>
        <line x1="8" y1="17" x2="13" y2="17"/>
        <path d="M15 17l1.5 1.5L19 16"/>
      </svg>
    ),
  },
  {
    href: "/sales-deed",
    title: "Sale Deed",
    desc: "Property transfer deed under Registration Act 1908.",
    price: "₹499",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>
    ),
  },
  {
    href: "/gift-deed",
    title: "Gift Deed",
    desc: "Gift property to family — Transfer of Property Act 1882.",
    price: "₹499",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 12 20 22 4 22 4 12"/>
        <rect x="2" y="7" width="20" height="5"/>
        <line x1="12" y1="22" x2="12" y2="7"/>
        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
      </svg>
    ),
  },
  {
    href: "/poa",
    title: "Power of Attorney",
    desc: "General, Specific, or Property POA — AI-drafted.",
    price: "₹499",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
      </svg>
    ),
  },
  {
    href: "/calculator",
    title: "Stamp Duty Calculator",
    desc: "Instant Maharashtra 2026–27 stamp duty & registration estimates.",
    price: null,
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2"/>
        <line x1="8" y1="7" x2="16" y2="7"/>
        <circle cx="8.5" cy="12" r="0.75" fill="currentColor" stroke="none"/>
        <circle cx="12" cy="12" r="0.75" fill="currentColor" stroke="none"/>
        <circle cx="15.5" cy="12" r="0.75" fill="currentColor" stroke="none"/>
        <circle cx="8.5" cy="16" r="0.75" fill="currentColor" stroke="none"/>
        <circle cx="12" cy="16" r="0.75" fill="currentColor" stroke="none"/>
        <line x1="14" y1="16" x2="17" y2="16"/>
      </svg>
    ),
  },
];

const DEFAULT_FAQS = [
  {
    q: "Is Mudrankseva's rent agreement legally valid?",
    a: "Yes. Mudrankseva generates a Maharashtra Leave & License Agreement compliant with the Maharashtra Rent Control Act 1999. The agreement is print-ready and court-admissible.",
  },
  {
    q: "How quickly will I receive my document?",
    a: "Most documents are generated within 20–40 seconds of payment. You receive a downloadable PDF immediately.",
  },
  {
    q: "Do I need to visit any government office?",
    a: "No. For documents up to 11 months (notarised), no office visit is needed. For registered agreements, we guide you through the e-registration process.",
  },
];

export default async function CityPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const city = getCityBySlug(slug);
  if (!city) notFound();

  const faqs = [...(city.faqOverrides ?? []), ...DEFAULT_FAQS];
  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen flex flex-col bg-cream text-ink">

      {/* ── Header ── */}
      <header className="bg-oxblood px-5 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="rounded-xl overflow-hidden border border-gold/30 bg-cream px-3 py-1.5 flex-shrink-0">
          <Image
            src="/logo.jpg"
            alt="Mudrankseva — मुद्रांकसेवा"
            width={200}
            height={48}
            priority
            className="h-11 w-auto object-contain"
          />
        </Link>
        <span className="text-xs text-gold/70 border border-gold/35 rounded-full px-3 py-1 tracking-widest uppercase font-sans">
          Maharashtra
        </span>
      </header>
      <Header />
      <Nav />

      {/* ── Hero ── */}
      <section className="bg-cream px-6 py-20 sm:py-28 text-center">
        <p className="text-[11px] text-gold/60 font-sans uppercase tracking-[0.2em] mb-6">
          Maharashtra Property Services
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold text-oxblood leading-[1.1] tracking-tight mb-4 font-sans">
          Property Services in {city.name}
          {city.nameNative && (
            <span className="block text-2xl sm:text-3xl font-devanagari text-oxblood/60 mt-2">
              {city.nameNative}
            </span>
          )}
        </h1>
        <p className="max-w-lg mx-auto text-ink/50 text-base leading-relaxed font-sans mt-4">
          {city.tagline}
        </p>
        <p className="max-w-md mx-auto text-ink/35 text-sm leading-relaxed font-sans mt-3">
          {city.description}
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/rent-agreement"
            className="inline-flex items-center gap-2 bg-oxblood text-gold border border-gold/25 px-6 py-3.5 rounded-xl text-sm font-semibold font-sans hover:bg-oxblood/90 transition-colors"
          >
            Get Rent Agreement — ₹299
            <span className="text-gold">→</span>
          </Link>
          <Link
            href="/calculator"
            className="inline-flex items-center gap-2 border border-gold/30 text-oxblood px-6 py-3.5 rounded-xl text-sm font-semibold font-sans hover:border-gold/60 transition-colors"
          >
            Stamp Duty Calculator
          </Link>
        </div>
      </section>

      {/* ── Services ── */}
      <section className="px-6 pb-20 bg-cream">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-gold/15" />
            <span className="text-[10px] font-sans uppercase tracking-[0.18em] text-ink/30">
              Our Services in {city.name}
            </span>
            <div className="h-px flex-1 bg-gold/15" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="group flex flex-col bg-white rounded-2xl border border-gold/20 hover:border-gold/50 hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="h-[2px] bg-gradient-to-r from-gold/60 via-gold to-gold/60 flex-shrink-0" />
                <div className="flex flex-col flex-1 p-6 gap-4">
                  <div className="flex items-start justify-between">
                    <span className="text-gold">{s.icon}</span>
                    {s.price && (
                      <span className="text-xs font-bold text-oxblood bg-gold/15 border border-gold/25 px-2.5 py-0.5 rounded-full font-sans">
                        {s.price}
                      </span>
                    )}
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-oxblood leading-snug font-sans">{s.title}</h2>
                    <p className="text-xs text-ink/45 leading-relaxed mt-1.5 font-sans">{s.desc}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-semibold text-oxblood mt-auto">
                    <span>Get started</span>
                    <span className="text-gold transition-transform duration-200 group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── SRO Offices ── */}
      {city.sroOffices.length > 0 && (
        <section className="px-6 py-16 border-t border-gold/10 bg-white/50">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-bold text-oxblood mb-1 font-sans">
              SRO Offices in {city.name}
            </h2>
            <p className="text-xs text-ink/35 font-sans mb-6">
              Sub-Registrar Offices for property registration and document attestation
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {city.sroOffices.map((office) => (
                <div
                  key={office.name}
                  className="bg-white rounded-xl border border-gold/15 p-5"
                >
                  <div className="h-[2px] bg-gradient-to-r from-gold/40 via-gold/60 to-gold/40 -mt-5 -mx-5 mb-4 rounded-t-xl" />
                  <h3 className="text-sm font-bold text-oxblood font-sans mb-1">{office.name}</h3>
                  <p className="text-xs text-ink/45 font-sans leading-relaxed">{office.address}</p>
                  {office.phone && (
                    <p className="text-xs text-ink/35 font-sans mt-1.5">{office.phone}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Nearby Areas ── */}
      {city.nearbyAreas.length > 0 && (
        <section className="px-6 py-14 border-t border-gold/10 bg-cream">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-bold text-oxblood mb-1 font-sans">
              Areas We Serve in {city.district} District
            </h2>
            <p className="text-xs text-ink/35 font-sans mb-6">
              Doorstep document services across all major localities
            </p>
            <div className="flex flex-wrap gap-2.5">
              {city.nearbyAreas.map((area) => (
                <span
                  key={area}
                  className="text-xs font-sans text-oxblood bg-gold/10 border border-gold/20 px-3.5 py-1.5 rounded-full"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FAQ ── */}
      <section className="px-6 py-16 border-t border-gold/10 bg-white/50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-oxblood mb-1 font-sans">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-ink/35 font-sans mb-8">
            About property services in {city.name}
          </p>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-gold/15 p-5">
                <div className="h-[2px] bg-gradient-to-r from-gold/40 via-gold/60 to-gold/40 -mt-5 -mx-5 mb-4 rounded-t-xl" />
                <h3 className="text-sm font-semibold text-oxblood font-sans mb-2">{faq.q}</h3>
                <p className="text-sm text-ink/55 font-sans leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 py-16 border-t border-gold/10 bg-cream">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-oxblood font-sans mb-3">
            Ready to get started in {city.name}?
          </h2>
          <p className="text-sm text-ink/45 font-sans mb-8 leading-relaxed">
            Same-day service. No office visits. Legally compliant documents delivered to your inbox.
          </p>
          <Link
            href="/rent-agreement"
            className="inline-flex items-center gap-2 bg-oxblood text-gold border border-gold/25 px-8 py-4 rounded-xl text-sm font-bold font-sans hover:bg-oxblood/90 transition-colors"
          >
            Start with Rent Agreement — ₹299
            <span>→</span>
          </Link>
          <p className="text-xs text-ink/25 font-sans mt-4">
            Secure payment via Razorpay · Maharashtra format · Print-ready PDF
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-oxblood px-6 py-10 text-center mt-auto">
        <p className="text-gold/60 text-sm font-sans">
          © {year} Mudrankseva. All rights reserved.
        </p>
        <p className="text-gold/30 text-xs mt-2 font-sans tracking-wide">
          {city.name} · Maharashtra Property Services · Digital. Accurate. Compliant.
        </p>
        <p className="text-gold/20 text-xs mt-1 font-devanagari">
          महाराष्ट्र मालमत्ता सेवा
        </p>
      </footer>

    </div>
  );
}
