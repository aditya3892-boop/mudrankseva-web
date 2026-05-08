import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { SERVICE_CITY_PAGES, getServiceCityPage } from '@/lib/service-cities'
import { Header } from '@/components/Header'
import { Nav } from '@/components/Nav'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return SERVICE_CITY_PAGES.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const page = getServiceCityPage(slug)
  if (!page) return {}
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: {
      canonical: `https://mudrankseva.in/services/${page.slug}`,
    },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url: `https://mudrankseva.in/services/${page.slug}`,
      locale: 'en_IN',
    },
  }
}

export default async function ServiceCityPage({ params }: Props) {
  const { slug } = await params
  const page = getServiceCityPage(slug)
  if (!page) notFound()

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${page.service} in ${page.city}`,
    provider: {
      '@type': 'LegalService',
      name: 'Mudrankseva',
      url: 'https://mudrankseva.in',
      telephone: '+917755984622',
      areaServed: page.city,
    },
    areaServed: page.city,
    url: `https://mudrankseva.in/services/${page.slug}`,
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: page.faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Header />
      <Nav />
      <main>
        {/* Hero */}
        <section className="bg-amber-50 border-b border-amber-100 py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-2 text-sm text-amber-700 mb-3">
              <Link href={`/cities/${page.citySlug}`} className="hover:underline">{page.city}</Link>
              <span>›</span>
              <span>{page.service}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{page.heroTitle}</h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl">{page.heroSubtitle}</p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/${page.serviceSlug}`}
                className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-lg transition"
              >
                {page.price ? `Get Started — ${page.price}` : 'Get Started'}
              </Link>
              <Link
                href={`https://wa.me/917755984622?text=Hi, I need help with ${page.service} in ${page.city}`}
                className="border border-gray-300 hover:border-gray-400 text-gray-700 font-medium px-6 py-3 rounded-lg transition"
              >
                Ask on WhatsApp
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-14 px-4 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Frequently Asked Questions — {page.service} in {page.city}
          </h2>
          <div className="space-y-3">
            {page.faqs.map((faq, i) => (
              <details key={i} className="border border-gray-200 rounded-xl group">
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer font-medium text-gray-900 list-none">
                  {faq.q}
                  <span className="ml-4 text-gray-400 group-open:rotate-180 transition-transform">▾</span>
                </summary>
                <p className="px-5 pb-5 text-gray-600 text-sm leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Related cities */}
        <section className="py-10 px-4 max-w-3xl mx-auto border-t border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">{page.service} in other Maharashtra cities</h2>
          <div className="flex flex-wrap gap-2">
            {SERVICE_CITY_PAGES
              .filter(p => p.service === page.service && p.slug !== page.slug)
              .map(p => (
                <Link
                  key={p.slug}
                  href={`/services/${p.slug}`}
                  className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 hover:border-amber-400 hover:text-amber-700 transition"
                >
                  {p.service} in {p.city}
                </Link>
              ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#6B1B1B] py-14 px-4 text-center">
          <div className="max-w-xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-3">
              Ready to get your {page.service} in {page.city}?
            </h2>
            <p className="text-amber-200 mb-6">
              Legally valid, Maharashtra compliant, no SRO visit needed.
            </p>
            <Link
              href={`/${page.serviceSlug}`}
              className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-8 py-3 rounded-lg transition inline-block"
            >
              {page.price ? `Get Started — ${page.price}` : 'Get Started'}
            </Link>
          </div>
        </section>
      </main>
    </>
  )
}
