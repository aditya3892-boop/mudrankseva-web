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
  {
    slug: 'mumbai',
    lang: 'en',
    name: 'Mumbai',
    nameNative: 'मुंबई',
    state: 'Maharashtra',
    district: 'Mumbai',
    tagline: 'Property registration & rent agreements in Mumbai — fast, online',
    description: 'Get legally valid rent agreements and property documents in Mumbai without visiting an SRO. Mudrankseva delivers doorstep registration across all Mumbai suburbs.',
    metaTitle: 'Rent Agreement & Property Registration in Mumbai | Mudrankseva',
    metaDescription: 'Online rent agreement in Mumbai from ₹299. Leave & licence, sale deed, gift deed & doorstep registration. Serving all Mumbai suburbs.',
    canonicalSlug: 'mumbai',
    sroOffices: [
      { name: 'SRO Bandra', address: 'Bandra West, Mumbai 400050' },
      { name: 'SRO Andheri', address: 'Andheri East, Mumbai 400069' },
    ],
    nearbyAreas: ['Bandra', 'Andheri', 'Borivali', 'Malad', 'Powai', 'Chembur', 'Dadar'],
    faqOverrides: [],
  },
  {
    slug: 'thane',
    lang: 'en',
    name: 'Thane',
    nameNative: 'ठाणे',
    state: 'Maharashtra',
    district: 'Thane',
    tagline: 'Rent agreement & property registration in Thane',
    description: 'Mudrankseva provides doorstep rent agreement and property registration services across Thane city and district. Biometric e-registration, same-day turnaround.',
    metaTitle: 'Rent Agreement & Property Registration in Thane | Mudrankseva',
    metaDescription: 'Online rent agreement in Thane from ₹299. Doorstep registration across Thane, Kalyan, Dombivli. Book in 2 minutes.',
    canonicalSlug: 'thane',
    sroOffices: [
      { name: 'SRO Thane-1', address: "Collector's Office Complex, Thane 400601" },
    ],
    nearbyAreas: ['Kalyan', 'Dombivli', 'Ulhasnagar', 'Mira Road', 'Bhiwandi'],
    faqOverrides: [],
  },
  {
    slug: 'nashik',
    lang: 'en',
    name: 'Nashik',
    nameNative: 'नाशिक',
    state: 'Maharashtra',
    district: 'Nashik',
    tagline: 'Property registration & rent agreements in Nashik',
    description: 'Get legally valid property documents and rent agreements in Nashik from the comfort of your home. Mudrankseva handles all stamp duty compliance automatically.',
    metaTitle: 'Rent Agreement & Property Registration in Nashik | Mudrankseva',
    metaDescription: 'Online rent agreement in Nashik from ₹299. Sale deed, gift deed & doorstep registration. Book in 2 minutes.',
    canonicalSlug: 'nashik',
    sroOffices: [{ name: 'SRO Nashik-1', address: 'Civil Lines, Nashik 422001' }],
    nearbyAreas: ['Deolali', 'Sinnar', 'Igatpuri', 'Trimbakeshwar'],
    faqOverrides: [],
  },
  {
    slug: 'aurangabad',
    lang: 'en',
    name: 'Aurangabad',
    nameNative: 'औरंगाबाद',
    state: 'Maharashtra',
    district: 'Chhatrapati Sambhajinagar',
    tagline: 'Rent agreement & property registration in Aurangabad',
    description: 'Mudrankseva delivers doorstep rent agreement and property registration services in Aurangabad. Biometric e-registration with full stamp-duty compliance.',
    metaTitle: 'Rent Agreement & Property Registration in Aurangabad | Mudrankseva',
    metaDescription: 'Online rent agreement in Aurangabad from ₹299. Doorstep property registration. Book in 2 minutes.',
    canonicalSlug: 'aurangabad',
    sroOffices: [{ name: 'SRO Aurangabad-1', address: 'Station Road, Aurangabad 431001' }],
    nearbyAreas: ['Waluj', 'Cidco', 'Garkheda', 'Paithan'],
    faqOverrides: [],
  },
  {
    slug: 'kolhapur',
    lang: 'en',
    name: 'Kolhapur',
    nameNative: 'कोल्हापूर',
    state: 'Maharashtra',
    district: 'Kolhapur',
    tagline: 'Rent agreement & property registration in Kolhapur',
    description: 'Get legally valid rent agreements and property documents in Kolhapur online. Mudrankseva covers all areas in Kolhapur district with doorstep service.',
    metaTitle: 'Rent Agreement & Property Registration in Kolhapur | Mudrankseva',
    metaDescription: 'Online rent agreement in Kolhapur from ₹299. Doorstep registration. Book in 2 minutes.',
    canonicalSlug: 'kolhapur',
    sroOffices: [{ name: 'SRO Kolhapur-1', address: 'Kolhapur 416001' }],
    nearbyAreas: ['Sangli', 'Miraj', 'Ichalkaranji', 'Kagal'],
    faqOverrides: [],
  },
  {
    slug: 'navi-mumbai',
    lang: 'en',
    name: 'Navi Mumbai',
    nameNative: 'नवी मुंबई',
    state: 'Maharashtra',
    district: 'Thane',
    tagline: 'Rent agreement & property registration in Navi Mumbai',
    description: 'Mudrankseva provides same-day rent agreement and property registration across Navi Mumbai — Vashi, Nerul, Belapur, Kharghar and more.',
    metaTitle: 'Rent Agreement & Property Registration in Navi Mumbai | Mudrankseva',
    metaDescription: 'Online rent agreement in Navi Mumbai from ₹299. Vashi, Nerul, Belapur, Kharghar doorstep service. Book in 2 minutes.',
    canonicalSlug: 'navi-mumbai',
    sroOffices: [
      { name: 'SRO Vashi', address: 'Sector 17, Vashi, Navi Mumbai 400703' },
      { name: 'SRO Belapur', address: 'CBD Belapur, Navi Mumbai 400614' },
    ],
    nearbyAreas: ['Vashi', 'Nerul', 'Belapur', 'Kharghar', 'Panvel', 'Airoli'],
    faqOverrides: [],
  },
  {
    slug: 'pimpri-chinchwad',
    lang: 'en',
    name: 'Pimpri-Chinchwad',
    nameNative: 'पिंपरी-चिंचवड',
    state: 'Maharashtra',
    district: 'Pune',
    tagline: 'Rent agreement & property registration in Pimpri-Chinchwad',
    description: 'Get legally valid rent agreements and property documents in Pimpri-Chinchwad. Mudrankseva covers Pimpri, Chinchwad, Akurdi, Nigdi and all PCMC areas.',
    metaTitle: 'Rent Agreement & Property Registration in Pimpri-Chinchwad | Mudrankseva',
    metaDescription: 'Online rent agreement in Pimpri-Chinchwad from ₹299. Doorstep registration across PCMC. Book in 2 minutes.',
    canonicalSlug: 'pimpri-chinchwad',
    sroOffices: [
      { name: 'SRO Pimpri', address: 'Old Mumbai–Pune Highway, Pimpri 411018' },
      { name: 'SRO Chinchwad', address: 'Station Road, Chinchwad 411033' },
    ],
    nearbyAreas: ['Pimpri', 'Chinchwad', 'Akurdi', 'Nigdi', 'Bhosari', 'Wakad'],
    faqOverrides: [],
  },
  {
    slug: 'pune-mr',
    lang: 'mr',
    name: 'पुणे',
    state: 'महाराष्ट्र',
    district: 'पुणे',
    tagline: 'पुण्यात भाडे करार, मालमत्ता नोंदणी व कायदेशीर दस्तऐवज',
    description: 'मुद्रांकसेवा पुण्यात त्याच दिवशी भाडे करार व मालमत्ता दस्तऐवज सेवा देते. घरबसल्या नोंदणी करा.',
    metaTitle: 'पुण्यात भाडे करार व मालमत्ता नोंदणी | मुद्रांकसेवा',
    metaDescription: 'पुण्यात ₹२९९ पासून तत्काळ ऑनलाइन भाडे करार. मालमत्ता नोंदणी, विक्री करार, मुखत्यारपत्र. २ मिनिटांत बुक करा.',
    canonicalSlug: 'pune',
    sroOffices: [
      { name: 'दुय्यम निबंधक कार्यालय, पुणे-१', address: 'कँप, पुणे ४११००१' },
      { name: 'दुय्यम निबंधक कार्यालय, पुणे-२', address: 'शिवाजीनगर, पुणे ४११००५' },
    ],
    nearbyAreas: ['कोथरूड', 'बाणेर', 'वाकड', 'हडपसर', 'विमाननगर', 'हिंजवडी'],
    faqOverrides: [],
  },
  {
    slug: 'mumbai-mr',
    lang: 'mr',
    name: 'मुंबई',
    state: 'महाराष्ट्र',
    district: 'मुंबई',
    tagline: 'मुंबईत मालमत्ता नोंदणी व भाडे करार — जलद, ऑनलाइन',
    description: 'मुद्रांकसेवा मुंबईत एसआरओला न जाता कायदेशीर भाडे करार व मालमत्ता दस्तऐवज देते.',
    metaTitle: 'मुंबईत भाडे करार व मालमत्ता नोंदणी | मुद्रांकसेवा',
    metaDescription: 'मुंबईत ₹२९९ पासून ऑनलाइन भाडे करार. घरबसल्या नोंदणी सेवा. सर्व मुंबई उपनगरांत उपलब्ध.',
    canonicalSlug: 'mumbai',
    sroOffices: [
      { name: 'दुय्यम निबंधक, वांद्रे', address: 'वांद्रे पश्चिम, मुंबई ४०००५०' },
      { name: 'दुय्यम निबंधक, अंधेरी', address: 'अंधेरी पूर्व, मुंबई ४०००६९' },
    ],
    nearbyAreas: ['वांद्रे', 'अंधेरी', 'बोरिवली', 'मालाड', 'पवई', 'चेंबूर'],
    faqOverrides: [],
  },
  {
    slug: 'thane-mr',
    lang: 'mr',
    name: 'ठाणे',
    state: 'महाराष्ट्र',
    district: 'ठाणे',
    tagline: 'ठाण्यात भाडे करार व मालमत्ता नोंदणी',
    description: 'मुद्रांकसेवा ठाणे शहरात घरबसल्या भाडे करार व मालमत्ता नोंदणी सेवा देते.',
    metaTitle: 'ठाण्यात भाडे करार व मालमत्ता नोंदणी | मुद्रांकसेवा',
    metaDescription: 'ठाण्यात ₹२९९ पासून ऑनलाइन भाडे करार. घरबसल्या नोंदणी. २ मिनिटांत बुक करा.',
    canonicalSlug: 'thane',
    sroOffices: [
      { name: 'दुय्यम निबंधक, ठाणे-१', address: 'जिल्हाधिकारी कार्यालय, ठाणे ४००६०१' },
    ],
    nearbyAreas: ['कल्याण', 'डोंबिवली', 'मिरा रोड', 'भिवंडी'],
    faqOverrides: [],
  },
  {
    slug: 'nashik-mr',
    lang: 'mr',
    name: 'नाशिक',
    state: 'महाराष्ट्र',
    district: 'नाशिक',
    tagline: 'नाशिकमध्ये मालमत्ता नोंदणी व भाडे करार',
    description: 'मुद्रांकसेवा नाशिकमध्ये घरबसल्या कायदेशीर दस्तऐवज सेवा देते.',
    metaTitle: 'नाशिकमध्ये भाडे करार व मालमत्ता नोंदणी | मुद्रांकसेवा',
    metaDescription: 'नाशिकमध्ये ₹२९९ पासून ऑनलाइन भाडे करार. घरबसल्या नोंदणी.',
    canonicalSlug: 'nashik',
    sroOffices: [
      { name: 'दुय्यम निबंधक, नाशिक-१', address: 'सिव्हिल लाइन्स, नाशिक ४२२००१' },
    ],
    nearbyAreas: ['देवळाली', 'सिन्नर', 'इगतपुरी', 'त्र्यंबकेश्वर'],
    faqOverrides: [],
  },
  {
    slug: 'aurangabad-mr',
    lang: 'mr',
    name: 'औरंगाबाद',
    state: 'महाराष्ट्र',
    district: 'छत्रपती संभाजीनगर',
    tagline: 'औरंगाबादमध्ये भाडे करार व मालमत्ता नोंदणी',
    description: 'मुद्रांकसेवा औरंगाबादमध्ये घरबसल्या भाडे करार व मालमत्ता नोंदणी सेवा देते.',
    metaTitle: 'औरंगाबादमध्ये भाडे करार व मालमत्ता नोंदणी | मुद्रांकसेवा',
    metaDescription: 'औरंगाबादमध्ये ₹२९९ पासून ऑनलाइन भाडे करार. घरबसल्या नोंदणी.',
    canonicalSlug: 'aurangabad',
    sroOffices: [
      { name: 'दुय्यम निबंधक, औरंगाबाद-१', address: 'स्टेशन रोड, औरंगाबाद ४३१००१' },
    ],
    nearbyAreas: ['वाळूज', 'सिडको', 'गारखेडा', 'पैठण'],
    faqOverrides: [],
  },
  {
    slug: 'kolhapur-mr',
    lang: 'mr',
    name: 'कोल्हापूर',
    state: 'महाराष्ट्र',
    district: 'कोल्हापूर',
    tagline: 'कोल्हापुरात भाडे करार व मालमत्ता नोंदणी',
    description: 'मुद्रांकसेवा कोल्हापुरात घरबसल्या कायदेशीर दस्तऐवज व नोंदणी सेवा देते.',
    metaTitle: 'कोल्हापुरात भाडे करार व मालमत्ता नोंदणी | मुद्रांकसेवा',
    metaDescription: 'कोल्हापुरात ₹२९९ पासून ऑनलाइन भाडे करार. घरबसल्या नोंदणी.',
    canonicalSlug: 'kolhapur',
    sroOffices: [
      { name: 'दुय्यम निबंधक, कोल्हापूर-१', address: 'कोल्हापूर ४१६००१' },
    ],
    nearbyAreas: ['सांगली', 'मिरज', 'इचलकरंजी', 'कागल'],
    faqOverrides: [],
  },
  {
    slug: 'navi-mumbai-mr',
    lang: 'mr',
    name: 'नवी मुंबई',
    state: 'महाराष्ट्र',
    district: 'ठाणे',
    tagline: 'नवी मुंबईत भाडे करार व मालमत्ता नोंदणी',
    description: 'मुद्रांकसेवा नवी मुंबईत वाशी, नेरुळ, बेलापूर, खारघरसह सर्व नोड्समध्ये घरबसल्या नोंदणी सेवा देते.',
    metaTitle: 'नवी मुंबईत भाडे करार व मालमत्ता नोंदणी | मुद्रांकसेवा',
    metaDescription: 'नवी मुंबईत ₹२९९ पासून ऑनलाइन भाडे करार. वाशी, नेरुळ, बेलापूर घरबसल्या सेवा.',
    canonicalSlug: 'navi-mumbai',
    sroOffices: [
      { name: 'दुय्यम निबंधक, वाशी', address: 'सेक्टर १७, वाशी, नवी मुंबई ४००७०३' },
    ],
    nearbyAreas: ['वाशी', 'नेरुळ', 'बेलापूर', 'खारघर', 'पनवेल', 'एरोली'],
    faqOverrides: [],
  },
  {
    slug: 'pimpri-chinchwad-mr',
    lang: 'mr',
    name: 'पिंपरी-चिंचवड',
    state: 'महाराष्ट्र',
    district: 'पुणे',
    tagline: 'पिंपरी-चिंचवडमध्ये भाडे करार व मालमत्ता नोंदणी',
    description: 'मुद्रांकसेवा पिंपरी-चिंचवड (PCMC) क्षेत्रात घरबसल्या भाडे करार व नोंदणी सेवा देते.',
    metaTitle: 'पिंपरी-चिंचवडमध्ये भाडे करार व मालमत्ता नोंदणी | मुद्रांकसेवा',
    metaDescription: 'पिंपरी-चिंचवडमध्ये ₹२९९ पासून ऑनलाइन भाडे करार. PCMC घरबसल्या नोंदणी.',
    canonicalSlug: 'pimpri-chinchwad',
    sroOffices: [
      { name: 'दुय्यम निबंधक, पिंपरी', address: 'जुना मुंबई-पुणे महामार्ग, पिंपरी ४११०१८' },
    ],
    nearbyAreas: ['पिंपरी', 'चिंचवड', 'आकुर्डी', 'निगडी', 'भोसरी', 'वाकड'],
    faqOverrides: [],
  },
]

export function getCityBySlug(slug: string): CityData | undefined {
  return CITIES.find(c => c.slug === slug)
}

export function getEnglishCities(): CityData[] {
  return CITIES.filter(c => c.lang === 'en')
}
