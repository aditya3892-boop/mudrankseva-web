export type Language = 'en' | 'mr'

export interface SROOffice {
  name: string
  address: string
  phone?: string
}

export interface CityData {
  slug: string
  lang: Language
  name: string
  nameNative?: string
  state: string
  district: string
  tagline: string
  description: string
  metaTitle: string
  metaDescription: string
  canonicalSlug: string
  sroOffices: SROOffice[]
  nearbyAreas: string[]
  faqOverrides?: { q: string; a: string }[]
}

export const CITIES: CityData[] = [
  {
    slug: 'pune',
    lang: 'en',
    name: 'Pune',
    nameNative: 'पुणे',
    state: 'Maharashtra',
    district: 'Pune',
    tagline: 'Rent agreements, property registration & legal documents in Pune',
    description: 'Mudrankseva offers same-day rent agreement and property document services across Pune. Get your documents notarised or registered without leaving your home.',
    metaTitle: 'Rent Agreement & Property Registration in Pune | Mudrankseva',
    metaDescription: 'Instant online rent agreement in Pune starting ₹299. Property registration, sale deed, POA & more. Doorstep service available. Book in 2 minutes.',
    canonicalSlug: 'pune',
    sroOffices: [
      { name: 'SRO Pune-1 (Camp)', address: 'Survey No. 123, Camp, Pune 411001' },
      { name: 'SRO Pune-2 (Shivajinagar)', address: 'FC Road, Shivajinagar, Pune 411005' },
    ],
    nearbyAreas: ['Kothrud', 'Baner', 'Wakad', 'Hadapsar', 'Viman Nagar', 'Hinjewadi'],
    faqOverrides: [
      {
        q: 'What are the SRO office timings in Pune?',
        a: 'Pune SRO offices are open Monday–Saturday, 10 AM to 5 PM (closed on 2nd & 4th Saturdays and public holidays). Mudrankseva doorstep service is available 7 days a week.',
      },
    ],
  },
]

export function getCityBySlug(slug: string): CityData | undefined {
  return CITIES.find(c => c.slug === slug)
}

export function getEnglishCities(): CityData[] {
  return CITIES.filter(c => c.lang === 'en')
}
