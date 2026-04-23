export type Lang = "en" | "mr";

export const CONTENT = {
  en: {
    headerBadge: "Maharashtra",
    toggleTo: "मराठी",
    comingSoon: "Coming Soon",
    heroTitle: ["Maharashtra's Property", "Services Platform"],
    heroDesc:
      "One platform for Stamp Duty, 7/12 records, and Property Tax — built for Maharashtra, available in English and Marathi.",
    servicesTitle: "Our Services",
    servicesSubtitle: "15 tools to simplify property ownership in Maharashtra.",
    footerBrand: "Mudrankseva",
    footerRights: "All rights reserved.",
    footerTagline: "Maharashtra · Stamp Duty · 7/12 Records · Property Tax",
  },
  mr: {
    headerBadge: "महाराष्ट्र",
    toggleTo: "English",
    comingSoon: "लवकरच येत आहे",
    heroTitle: ["महाराष्ट्राचे मालमत्ता", "सेवा व्यासपीठ"],
    heroDesc:
      "मुद्रांक शुल्क, ७/१२ उतारा आणि मालमत्ता कर — एकाच व्यासपीठावर, इंग्रजी व मराठीत उपलब्ध.",
    servicesTitle: "आमच्या सेवा",
    servicesSubtitle: "महाराष्ट्रातील मालमत्ता मालकी सुलभ करण्यासाठी १५ साधने.",
    footerBrand: "मुद्रांकसेवा",
    footerRights: "सर्व हक्क राखीव.",
    footerTagline: "महाराष्ट्र · मुद्रांक शुल्क · ७/१२ उतारा · मालमत्ता कर",
  },
} as const;

export const FEATURES = [
  {
    titleEn: "Stamp Duty Calculator",
    titleMr: "मुद्रांक शुल्क कॅल्क्युलेटर",
    descEn: "Instantly calculate registration fees and duty based on current Maharashtra rates.",
    descMr: "महाराष्ट्रातील चालू दरांनुसार नोंदणी शुल्क आणि मुद्रांक शुल्काची त्वरित गणना करा.",
  },
  {
    titleEn: "Market Value Finder",
    titleMr: "बाजार मूल्य शोधक",
    descEn: "Find the official Ready Reckoner rates for any property in Pune and Maharashtra.",
    descMr: "पुणे आणि महाराष्ट्रातील कोणत्याही मालमत्तेचे अधिकृत रेडी रेकनर दर शोधा.",
  },
  {
    titleEn: "7/12 Health Check",
    titleMr: "७/१२ आरोग्य तपासणी",
    descEn: "AI-powered title verification and litigation risk analysis.",
    descMr: "एआय-आधारित मालकी हक्क पडताळणी आणि कायदेशीर जोखीम विश्लेषण.",
  },
  {
    titleEn: "Gazette Name Change",
    titleMr: "राजपत्र नाव बदल",
    descEn: "Fully automated process for legal name changes in the Official Gazette.",
    descMr: "अधिकृत राजपत्रात कायदेशीर नाव बदलण्यासाठी पूर्णपणे स्वयंचलित प्रक्रिया.",
  },
  {
    titleEn: "Automated Deed Drafting",
    titleMr: "स्वयंचलित दस्तऐवज मसुदा",
    descEn: "Generate error-free Sale, Gift, and Release deeds in minutes.",
    descMr: "विक्री, बक्षीस आणि मुक्ती पत्रे काही मिनिटांत त्रुटीमुक्त तयार करा.",
  },
  {
    titleEn: "Digital Rent Agreement",
    titleMr: "डिजिटल भाडे करार",
    descEn: "Legally binding registered rent agreements without visiting the office.",
    descMr: "कार्यालयात न जाता कायदेशीररीत्या नोंदणीकृत भाडे करार तयार करा.",
  },
  {
    titleEn: "Vertical Property Card",
    titleMr: "उर्ध्व मालमत्ता पत्रक",
    descEn: "Management and tracking for urban apartment property cards.",
    descMr: "शहरी अपार्टमेंट मालमत्ता पत्रकांचे व्यवस्थापन आणि ट्रॅकिंग.",
  },
  {
    titleEn: "Mutation (Ferfar) Alerts",
    titleMr: "फेरफार सूचना",
    descEn: "Get real-time updates when any change occurs in your 7/12 extract.",
    descMr: "तुमच्या ७/१२ उतार्‍यात कोणताही बदल झाल्यास रिअल-टाइम अपडेट्स मिळवा.",
  },
  {
    titleEn: "Property Tax Transfer",
    titleMr: "मालमत्ता कर हस्तांतरण",
    descEn: "Automated assistant for transferring tax records to new owners.",
    descMr: "नवीन मालकांच्या नावे कर नोंदणी हस्तांतरित करण्यासाठी स्वयंचलित सहाय्यक.",
  },
  {
    titleEn: "Public Notice AI",
    titleMr: "सार्वजनिक नोटिस एआय",
    descEn: "Generate and schedule legal notices for newspapers instantly.",
    descMr: "वर्तमानपत्रांसाठी कायदेशीर नोटिसा त्वरित तयार करा आणि शेड्यूल करा.",
  },
  {
    titleEn: "Certified Valuation",
    titleMr: "प्रमाणित मूल्यांकन",
    descEn: "Get professional market valuation reports for bank and legal use.",
    descMr: "बँक आणि कायदेशीर वापरासाठी व्यावसायिक बाजार मूल्य अहवाल मिळवा.",
  },
  {
    titleEn: "Index-II Retrieval",
    titleMr: "इंडेक्स-II उपलब्धी",
    descEn: "Fast digital access to historical property registration records.",
    descMr: "ऐतिहासिक मालमत्ता नोंदणी कागदपत्रांमध्ये जलद डिजिटल प्रवेश.",
  },
  {
    titleEn: "Society NOC Portal",
    titleMr: "सोसायटी ना-हरकत पोर्टल",
    descEn: "Automated requests for society transfer and no-objection certificates.",
    descMr: "सोसायटी हस्तांतरण आणि ना-हरकत प्रमाणपत्रांसाठी स्वयंचलित विनंती पोर्टल.",
  },
  {
    titleEn: "Heirship Assistant",
    titleMr: "वारसा सहाय्यक",
    descEn: "Documentation support for legal heirship and succession certificates.",
    descMr: "कायदेशीर वारसा आणि उत्तराधिकार प्रमाणपत्रांसाठी कागदपत्रे सहाय्य.",
  },
  {
    titleEn: "Adjudication Tracker",
    titleMr: "निर्धारण ट्रॅकर",
    descEn: "Real-time status tracking for pending adjudication cases.",
    descMr: "प्रलंबित मुद्रांक शुल्क निर्धारण प्रकरणांचा रिअल-टाइम स्टेटस ट्रॅकर.",
  },
] as const;
