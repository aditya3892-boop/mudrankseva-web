export interface ServiceCityPage {
  slug: string
  service: string
  serviceSlug: string
  city: string
  citySlug: string
  lang: 'en'
  metaTitle: string
  metaDescription: string
  heroTitle: string
  heroSubtitle: string
  price?: string
  faqs: { q: string; a: string }[]
}

export const SERVICE_CITY_PAGES: ServiceCityPage[] = [
  // ── RENT AGREEMENT × CITIES ──────────────────────────────────────
  {
    slug: 'rent-agreement-pune',
    service: 'Rent Agreement',
    serviceSlug: 'rent-agreement',
    city: 'Pune',
    citySlug: 'pune',
    lang: 'en',
    metaTitle: 'Online Rent Agreement in Pune | Mudrankseva — ₹299',
    metaDescription: 'Get a legally valid rent agreement in Pune online in 2 minutes. AI-drafted, Maharashtra stamp duty compliant, doorstep registration available. Starting ₹299.',
    heroTitle: 'Rent Agreement in Pune',
    heroSubtitle: 'Get your Maharashtra Leave & License Agreement drafted and registered online — without visiting the SRO. Starting ₹299.',
    price: '₹299',
    faqs: [
      { q: 'Is online rent agreement valid in Pune?', a: 'Yes. Rent agreements registered through the Maharashtra IGR e-Registration portal are fully legally valid in Pune under the Maharashtra Rent Control Act 1999 and the Registration Act 1908.' },
      { q: 'Which SRO offices are in Pune?', a: 'Pune has multiple SRO offices including SRO Pune-1 (Camp), SRO Pune-2 (Shivajinagar), SRO Pune-3 (Kothrud), and more. With Mudrankseva you do not need to visit any SRO office.' },
      { q: 'How much stamp duty for rent agreement in Pune?', a: 'For an 11-month rent agreement in Pune, stamp duty is ₹100. For agreements of 12 months or more, stamp duty is calculated as a percentage of total rent. Mudrankseva calculates this automatically.' },
      { q: 'Can I get doorstep registration in Pune?', a: 'Yes. Mudrankseva offers doorstep biometric registration in Pune and Pimpri-Chinchwad. Our executive visits your home and completes the SRO registration process. Starting ₹999.' },
    ],
  },
  {
    slug: 'rent-agreement-mumbai',
    service: 'Rent Agreement',
    serviceSlug: 'rent-agreement',
    city: 'Mumbai',
    citySlug: 'mumbai',
    lang: 'en',
    metaTitle: 'Online Rent Agreement in Mumbai | Mudrankseva — ₹299',
    metaDescription: 'Get a legally valid rent agreement in Mumbai online. Maharashtra Leave & License Agreement, AI-drafted, stamp duty compliant. Starting ₹299.',
    heroTitle: 'Rent Agreement in Mumbai',
    heroSubtitle: 'Maharashtra Leave & License Agreement for Mumbai properties — drafted online, legally valid, no SRO visit needed. Starting ₹299.',
    price: '₹299',
    faqs: [
      { q: 'Is online rent agreement valid in Mumbai?', a: 'Yes. Maharashtra law requires all rent agreements to be registered regardless of duration. Agreements registered through the IGR Maharashtra portal are fully valid in Mumbai.' },
      { q: 'What is stamp duty for rent agreement in Mumbai?', a: 'For an 11-month rent agreement in Mumbai, stamp duty is ₹100. Mudrankseva calculates stamp duty automatically based on your rent amount and tenure.' },
      { q: 'How long does it take to get a rent agreement in Mumbai?', a: 'With Mudrankseva, your rent agreement is drafted within 2 hours of submitting your details. Online registration is completed within 24 hours.' },
      { q: 'Do both landlord and tenant need to be present?', a: 'For online e-registration, both parties need to complete Aadhaar-based biometric verification. This can be done from anywhere in India using a biometric device or through our doorstep service.' },
    ],
  },
  {
    slug: 'rent-agreement-thane',
    service: 'Rent Agreement',
    serviceSlug: 'rent-agreement',
    city: 'Thane',
    citySlug: 'thane',
    lang: 'en',
    metaTitle: 'Online Rent Agreement in Thane | Mudrankseva — ₹299',
    metaDescription: 'Get a legally valid rent agreement in Thane online. Doorstep registration across Thane, Kalyan, Dombivli. Starting ₹299.',
    heroTitle: 'Rent Agreement in Thane',
    heroSubtitle: 'Maharashtra Leave & License Agreement for Thane properties — drafted and registered online. Serving Thane, Kalyan, Dombivli and surrounding areas.',
    price: '₹299',
    faqs: [
      { q: 'Is online rent agreement valid in Thane?', a: 'Yes. Rent agreements registered through the Maharashtra IGR e-Registration portal are fully legally valid in Thane district including Kalyan, Dombivli, and Ulhasnagar.' },
      { q: 'Does Mudrankseva serve Kalyan and Dombivli?', a: 'Yes. Mudrankseva serves the entire Thane district including Kalyan, Dombivli, Ulhasnagar, Mira Road, and Bhiwandi.' },
      { q: 'How much does a rent agreement cost in Thane?', a: 'Mudrankseva charges ₹299 for a standard 11-month rent agreement in Thane. This includes document drafting, stamp duty calculation, and online registration.' },
      { q: 'Can I register a rent agreement without visiting SRO in Thane?', a: 'Yes. Through Mudrankseva\'s online platform, the entire process is completed without visiting the Thane SRO office.' },
    ],
  },
  {
    slug: 'rent-agreement-navi-mumbai',
    service: 'Rent Agreement',
    serviceSlug: 'rent-agreement',
    city: 'Navi Mumbai',
    citySlug: 'navi-mumbai',
    lang: 'en',
    metaTitle: 'Online Rent Agreement in Navi Mumbai | Mudrankseva — ₹299',
    metaDescription: 'Get a legally valid rent agreement in Navi Mumbai online. Serving Vashi, Nerul, Belapur, Kharghar, Panvel. Starting ₹299.',
    heroTitle: 'Rent Agreement in Navi Mumbai',
    heroSubtitle: 'Maharashtra Leave & License Agreement for Navi Mumbai properties — covering Vashi, Nerul, Belapur, Kharghar, Panvel and all nodes.',
    price: '₹299',
    faqs: [
      { q: 'Does Mudrankseva serve all Navi Mumbai nodes?', a: 'Yes. Mudrankseva serves all Navi Mumbai nodes including Vashi, Nerul, Belapur, Kharghar, Panvel, Airoli, Ghansoli, Kopar Khairane, and Sanpada.' },
      { q: 'Which SRO handles Navi Mumbai rent agreements?', a: 'Navi Mumbai has SRO offices in Vashi and CBD Belapur. With Mudrankseva, you do not need to visit any SRO office.' },
      { q: 'How much is stamp duty for rent agreement in Navi Mumbai?', a: 'For an 11-month rent agreement in Navi Mumbai, stamp duty is ₹100. Mudrankseva calculates this automatically.' },
      { q: 'Can I get a rent agreement for a commercial property in Navi Mumbai?', a: 'Yes. Mudrankseva drafts both residential and commercial Leave & License Agreements for properties in Navi Mumbai.' },
    ],
  },
  {
    slug: 'rent-agreement-pimpri-chinchwad',
    service: 'Rent Agreement',
    serviceSlug: 'rent-agreement',
    city: 'Pimpri-Chinchwad',
    citySlug: 'pimpri-chinchwad',
    lang: 'en',
    metaTitle: 'Online Rent Agreement in Pimpri-Chinchwad | Mudrankseva — ₹299',
    metaDescription: 'Get a legally valid rent agreement in Pimpri-Chinchwad online. PCMC area, doorstep registration available. Starting ₹299.',
    heroTitle: 'Rent Agreement in Pimpri-Chinchwad',
    heroSubtitle: 'Maharashtra Leave & License Agreement for PCMC area properties — Pimpri, Chinchwad, Akurdi, Nigdi, Bhosari and surrounding areas.',
    price: '₹299',
    faqs: [
      { q: 'Does Mudrankseva serve the PCMC area?', a: 'Yes. Mudrankseva serves the entire PCMC area including Pimpri, Chinchwad, Akurdi, Nigdi, Bhosari, Wakad, Dehu Road, and surrounding areas.' },
      { q: 'Is doorstep registration available in Pimpri-Chinchwad?', a: 'Yes. Mudrankseva offers doorstep biometric registration in Pimpri-Chinchwad. Our executive visits your home to complete the SRO registration. Starting ₹999.' },
      { q: 'Which SRO handles Pimpri-Chinchwad registrations?', a: 'Pimpri-Chinchwad has SRO offices in Pimpri and Chinchwad. With Mudrankseva doorstep service, you do not need to visit either office.' },
      { q: 'How much does a rent agreement cost in Pimpri-Chinchwad?', a: 'Mudrankseva charges ₹299 for a standard 11-month rent agreement in Pimpri-Chinchwad including drafting, stamp duty, and online registration.' },
    ],
  },

  // ── STAMP DUTY × CITIES ──────────────────────────────────────────
  {
    slug: 'stamp-duty-pune',
    service: 'Stamp Duty Calculator',
    serviceSlug: 'calculator',
    city: 'Pune',
    citySlug: 'pune',
    lang: 'en',
    metaTitle: 'Stamp Duty Calculator Pune 2026 | Maharashtra Property Registration',
    metaDescription: 'Calculate stamp duty and registration charges for property in Pune 2026. Ready reckoner rates, women concession, complete guide. Free calculator.',
    heroTitle: 'Stamp Duty in Pune 2026',
    heroSubtitle: 'Calculate exact stamp duty and registration charges for any property in Pune. Includes ready reckoner rates, women buyer concession, and registration fee.',
    faqs: [
      { q: 'What is stamp duty rate in Pune 2026?', a: 'Stamp duty in Pune is 6% for male buyers and 5% for female buyers. An additional 1% metro cess applies in Pune Municipal Corporation area, making the effective rate 7% for males and 6% for females.' },
      { q: 'What is the ready reckoner rate in Pune?', a: 'Ready reckoner rates in Pune vary by area. For example, Kothrud rates are different from Hadapsar or Hinjewadi. Stamp duty is calculated on the higher of agreement value or ready reckoner value.' },
      { q: 'Is there a stamp duty concession for women in Pune?', a: 'Yes. Female property buyers in Pune pay 1% less stamp duty than male buyers. If a property is registered in a woman\'s name, stamp duty is 5% instead of 6% (plus applicable cess).' },
      { q: 'What is registration fee for property in Pune?', a: 'Registration fee in Pune is 1% of the property value, subject to a maximum of ₹30,000. This is paid separately from stamp duty at the SRO.' },
    ],
  },
  {
    slug: 'stamp-duty-mumbai',
    service: 'Stamp Duty Calculator',
    serviceSlug: 'calculator',
    city: 'Mumbai',
    citySlug: 'mumbai',
    lang: 'en',
    metaTitle: 'Stamp Duty Calculator Mumbai 2026 | Maharashtra Property Registration',
    metaDescription: 'Calculate stamp duty for property in Mumbai 2026. BMC area rates, women concession, metro cess, registration fee. Free calculator.',
    heroTitle: 'Stamp Duty in Mumbai 2026',
    heroSubtitle: 'Calculate exact stamp duty and registration charges for Mumbai properties. Covers all Mumbai suburbs — Bandra, Andheri, Borivali, Powai and more.',
    faqs: [
      { q: 'What is stamp duty in Mumbai 2026?', a: 'Stamp duty in Mumbai is 6% for male buyers and 5% for female buyers. An additional 1% metro cess applies in BMC area. The effective total is 7% for males and 6% for females on property value.' },
      { q: 'What is stamp duty for resale flat in Mumbai?', a: 'For a resale flat in Mumbai, stamp duty is calculated on the higher of agreement value or ready reckoner value. The rate is 6% for males and 5% for females plus 1% metro cess.' },
      { q: 'Is there a stamp duty discount for women in Mumbai?', a: 'Yes. Female buyers pay 1% less stamp duty in Mumbai. On a ₹1 crore property, a female buyer saves ₹1 lakh in stamp duty compared to a male buyer.' },
      { q: 'How is stamp duty paid in Mumbai?', a: 'Stamp duty in Mumbai is paid online through the Maharashtra government\'s GRAS portal before registration. Mudrankseva handles this automatically as part of the registration process.' },
    ],
  },

  // ── PROPERTY REGISTRATION × CITIES ───────────────────────────────
  {
    slug: 'property-registration-pune',
    service: 'Property Registration',
    serviceSlug: 'sales-deed',
    city: 'Pune',
    citySlug: 'pune',
    lang: 'en',
    metaTitle: 'Property Registration in Pune 2026 | Sale Deed | Mudrankseva',
    metaDescription: 'Complete property registration service in Pune. Sale deed drafting, stamp duty payment, SRO registration. Documents required, process, timeline explained.',
    heroTitle: 'Property Registration in Pune',
    heroSubtitle: 'End-to-end property registration service in Pune — sale deed drafting, stamp duty calculation, and SRO registration handled for you.',
    faqs: [
      { q: 'What documents are needed for property registration in Pune?', a: 'You need: Aadhaar and PAN of buyer and seller, property card or 7/12 extract, society NOC, recent property tax receipt, and passport photos of both parties.' },
      { q: 'How long does property registration take in Pune?', a: 'With Mudrankseva, sale deed drafting takes 24 hours. SRO appointment is typically within 3-5 working days. Physical presence at the SRO is required for biometric verification.' },
      { q: 'What is the total cost of property registration in Pune?', a: 'Total cost includes stamp duty (6% for males, 5% for females plus metro cess), registration fee (1% capped at ₹30,000), and Mudrankseva service fee. Use our calculator for exact figures.' },
      { q: 'Which SRO handles property registration in Pune?', a: 'Pune has multiple SRO offices. The relevant SRO depends on the property location. Mudrankseva guides you to the correct SRO and prepares all documents in advance.' },
    ],
  },
  {
    slug: 'property-registration-mumbai',
    service: 'Property Registration',
    serviceSlug: 'sales-deed',
    city: 'Mumbai',
    citySlug: 'mumbai',
    lang: 'en',
    metaTitle: 'Property Registration in Mumbai 2026 | Sale Deed | Mudrankseva',
    metaDescription: 'Complete property registration service in Mumbai. Sale deed drafting, stamp duty, SRO registration across all Mumbai suburbs.',
    heroTitle: 'Property Registration in Mumbai',
    heroSubtitle: 'End-to-end property registration service across all Mumbai suburbs — Bandra, Andheri, Borivali, Powai, Chembur and more.',
    faqs: [
      { q: 'What documents are needed for property registration in Mumbai?', a: 'You need: Aadhaar and PAN of buyer and seller, index II of previous transaction, society NOC, occupation certificate, property tax receipt, and passport photos.' },
      { q: 'How long does property registration take in Mumbai?', a: 'Sale deed drafting takes 24 hours with Mudrankseva. SRO appointment in Mumbai is typically within 3-7 working days due to higher volume.' },
      { q: 'What is stamp duty for property registration in Mumbai?', a: 'Stamp duty in Mumbai is 6% for males and 5% for females, plus 1% metro cess. Registration fee is 1% capped at ₹30,000.' },
      { q: 'Can Mudrankseva handle property registration for NRIs in Mumbai?', a: 'Yes. For NRI sellers or buyers, a Power of Attorney is typically required. Mudrankseva can draft the POA and handle the registration process on behalf of the NRI.' },
    ],
  },

  // ── GIFT DEED × CITIES ────────────────────────────────────────────
  {
    slug: 'gift-deed-pune',
    service: 'Gift Deed',
    serviceSlug: 'gift-deed',
    city: 'Pune',
    citySlug: 'pune',
    lang: 'en',
    metaTitle: 'Gift Deed Registration in Pune | Mudrankseva',
    metaDescription: 'Register a gift deed in Pune online. Property transfer between family members, stamp duty calculation, SRO registration. Know the process and cost.',
    heroTitle: 'Gift Deed Registration in Pune',
    heroSubtitle: 'Transfer property to a family member in Pune through a registered gift deed. Lower stamp duty for blood relatives. Mudrankseva handles the complete process.',
    faqs: [
      { q: 'What is stamp duty on gift deed in Pune?', a: 'For gift to a blood relative in Pune, stamp duty is 3% of the property value. For gift to a non-relative, stamp duty is the same as sale deed — 6% for males, 5% for females plus metro cess.' },
      { q: 'Who qualifies as a blood relative for gift deed concession in Pune?', a: 'Blood relatives include: spouse, children, grandchildren, parents, siblings, and their spouses. A gift between these family members qualifies for the concessional 3% stamp duty rate.' },
      { q: 'Can a gift deed be cancelled in Pune?', a: 'A registered gift deed is generally irrevocable. Cancellation is only possible by mutual consent of both parties or through a court order in cases of fraud or coercion.' },
      { q: 'What documents are needed for gift deed in Pune?', a: 'You need: Aadhaar and PAN of donor and donee, property documents (7/12 or property card), relationship proof for concessional stamp duty, and passport photos of both parties.' },
    ],
  },

  // ── POA × CITIES ─────────────────────────────────────────────────
  {
    slug: 'power-of-attorney-pune',
    service: 'Power of Attorney',
    serviceSlug: 'poa',
    city: 'Pune',
    citySlug: 'pune',
    lang: 'en',
    metaTitle: 'Power of Attorney in Pune | Mudrankseva',
    metaDescription: 'Draft and register a Power of Attorney in Pune online. General POA, specific POA for property transactions. NRI POA available.',
    heroTitle: 'Power of Attorney in Pune',
    heroSubtitle: 'Draft and register a General or Specific Power of Attorney for property transactions in Pune. NRI POA, SRO registration, complete service.',
    faqs: [
      { q: 'What is stamp duty on Power of Attorney in Pune?', a: 'Stamp duty on a General POA for property in Pune is ₹500. For a Special POA for a specific property transaction, stamp duty is calculated based on the property value.' },
      { q: 'Does POA need to be registered in Pune?', a: 'A POA used for immovable property transactions must be registered at the SRO in Pune. A notarised POA is sufficient for most other purposes like banking and financial transactions.' },
      { q: 'Can an NRI give POA for Pune property?', a: 'Yes. An NRI can execute a POA abroad, get it notarised and apostilled, and then have it registered in Pune. Mudrankseva assists with the complete NRI POA process.' },
      { q: 'How long does POA registration take in Pune?', a: 'POA drafting takes 24 hours with Mudrankseva. SRO registration appointment is typically within 3-5 working days in Pune.' },
    ],
  },
]

export function getServiceCityPage(slug: string) {
  return SERVICE_CITY_PAGES.find(p => p.slug === slug)
}
