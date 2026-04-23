export type Lang = "en" | "mr";

export const CONTENT = {
  en: {
    headerBadge: "Maharashtra",
    toggleTo: "मराठी",
    comingSoon: "Coming Soon",
    heroTitle: ["Maharashtra's Property", "Services Platform"],
    heroDesc:
      "One platform for Stamp Duty, 7/12 records, and Property Tax — built for Maharashtra, available in English and Marathi.",
    features: [
      {
        title: "Stamp Duty Calculator",
        desc: "Calculate stamp duty and registration charges for any property transaction in Maharashtra — instantly.",
      },
      {
        title: "7/12 OCR Scanner",
        desc: "Upload your 7/12 land record and extract structured ownership, area, and survey data in seconds.",
      },
      {
        title: "Property Tax Transfer",
        desc: "Guided step-by-step assistance for transferring property tax records into the new owner's name.",
      },
    ],
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
    features: [
      {
        title: "मुद्रांक शुल्क कॅल्क्युलेटर",
        desc: "महाराष्ट्रातील कोणत्याही मालमत्ता व्यवहारावर मुद्रांक शुल्क व नोंदणी शुल्क त्वरित मोजा.",
      },
      {
        title: "७/१२ OCR स्कॅनर",
        desc: "७/१२ उतारा अपलोड करा आणि सेकंदात मालकी, क्षेत्रफळ, सर्वेक्षण डेटा काढा.",
      },
      {
        title: "मालमत्ता कर हस्तांतरण",
        desc: "मालमत्ता कर नोंद नव्या मालकाच्या नावावर हस्तांतरित करण्यासाठी मार्गदर्शित प्रक्रिया.",
      },
    ],
    footerBrand: "मुद्रांकसेवा",
    footerRights: "सर्व हक्क राखीव.",
    footerTagline: "महाराष्ट्र · मुद्रांक शुल्क · ७/१२ उतारा · मालमत्ता कर",
  },
} as const;
