import { CityData } from '@/lib/cities'

export function CitySchema({ city, faqs }: { city: CityData; faqs: { q: string; a: string }[] }) {
  const localBusiness = {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    name: 'Mudrankseva',
    url: 'https://mudrankseva.in',
    logo: 'https://mudrankseva.in/logo.png',
    telephone: '+917755984622',
    areaServed: {
      '@type': 'City',
      name: city.name,
      containedInPlace: {
        '@type': 'State',
        name: 'Maharashtra',
      },
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: city.name,
      addressRegion: 'Maharashtra',
      addressCountry: 'IN',
    },
    priceRange: '₹299 - ₹1299',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Property Legal Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Rent Agreement',
            description: 'Maharashtra Leave & License Agreement — AI-drafted, registered',
          },
          price: '299',
          priceCurrency: 'INR',
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Doorstep Registration',
            description: 'Executive visits your home for biometric SRO registration',
          },
          price: '999',
          priceCurrency: 'INR',
        },
      ],
    },
  }

  const faqSchema = faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  } : null

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
    </>
  )
}
