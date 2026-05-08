import { Metadata } from 'next'
import { Header } from '@/components/Header'
import { Nav } from '@/components/Nav'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'आमच्याबद्दल | मुद्रांकसेवा',
  description: 'मुद्रांकसेवा — महाराष्ट्रातील मालमत्ता दस्तऐवज, भाडे करार आणि स्टँप ड्युटीसाठी विश्वासार्ह ऑनलाइन सेवा.',
}

export default function AboutMarathiPage() {
  return (
    <>
      <Header />
      <Nav />
      <main className="max-w-3xl mx-auto px-4 py-14">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">मुद्रांकसेवाबद्दल</h1>
        <p className="text-gray-500 text-lg mb-10 leading-relaxed">
          महाराष्ट्रातील मालमत्ता दस्तऐवज, स्टँप ड्युटी आणि नोंदणीसाठी विश्वासार्ह व्यासपीठ — मराठी आणि इंग्रजीत.
        </p>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">आम्ही हे का बनवले</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            महाराष्ट्रात भाडे करार किंवा मालमत्ता नोंदणी करण्यासाठी नेहमीच SRO कार्यालयात रांगा, गोंधळाचे कागदपत्र आणि एजंटवर अवलंबून राहावे लागते. मुद्रांकसेवा हे बदलण्यासाठी बनवले आहे.
          </p>
          <p className="text-gray-600 leading-relaxed">
            मुद्रांकसेवाची स्थापना पुण्यात एका साध्या उद्दिष्टाने केली गेली — महाराष्ट्रातील प्रत्येक मालमत्ता दस्तऐवज ऑनलाइन, काही मिनिटांत, योग्य किंमतीत उपलब्ध करणे. नाशिकचा घरमालक असो, मुंबईचा भाडेकरू असो किंवा पिंपरी-चिंचवडचा खरेदीदार असो — घरबसल्या कायदेशीर दस्तऐवज मिळणे हा प्रत्येकाचा हक्क आहे.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">तज्ञांच्या मार्गदर्शनावर आधारित</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            मुद्रांकसेवा महाराष्ट्र सरकारच्या मालमत्ता नोंदणी आणि मुद्रांक विभागात दशकांचा अनुभव असलेल्या एका ज्येष्ठ सेवानिवृत्त अधिकाऱ्यांच्या मार्गदर्शनात बनवले गेले आहे. याचा अर्थ आमच्या प्लॅटफॉर्मवरील प्रत्येक दस्तऐवज टेम्पलेट, स्टँप ड्युटी गणना आणि नोंदणी प्रक्रिया — प्रत्यक्ष अनुभवावर आधारित आहे.
          </p>
          <p className="text-gray-600 leading-relaxed">
            कोणते दस्तऐवज SRO मध्ये नाकारले जातात आणि का — हे आम्हाला माहीत आहे. बहुतेकांना माहीत नसलेल्या स्टँप ड्युटी सवलती आम्हाला माहीत आहेत. कारण आम्ही हे व्यवस्थेच्या आतून अनुभवले आहे.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">महाराष्ट्र आधी. मराठी नेहमी.</h2>
          <p className="text-gray-600 leading-relaxed">
            राष्ट्रीय प्लॅटफॉर्म महाराष्ट्राला फक्त एक राज्य मानतात, परंतु मुद्रांकसेवा केवळ महाराष्ट्रासाठी बनवले आहे. प्रत्येक सेवा महाराष्ट्राच्या विशिष्ट कायद्यांवर आधारित आहे — महाराष्ट्र भाडे नियंत्रण अधिनियम १९९९, महाराष्ट्र मुद्रांक अधिनियम आणि IGR महाराष्ट्राची नोंदणी प्रक्रिया. आणि महाराष्ट्र मराठी आहे म्हणून आमचे संपूर्ण व्यासपीठ मराठीत उपलब्ध आहे.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">आमच्या सेवा</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { name: 'भाडे करार', href: '/rent-agreement', desc: '₹२९९ पासून तत्काळ AI-आधारित लीव्ह अँड लायसन्स करार' },
              { name: 'विक्री करार', href: '/sales-deed', desc: 'स्टँप ड्युटी गणनासह संपूर्ण SRO नोंदणी' },
              { name: 'बक्षीस पत्र', href: '/gift-deed', desc: 'कुटुंबातील सदस्यांमध्ये मालमत्ता हस्तांतरण' },
              { name: 'मुखत्यारपत्र', href: '/poa', desc: 'सामान्य आणि विशेष मुखत्यारपत्र' },
              { name: 'स्टँप ड्युटी कॅल्क्युलेटर', href: '/calculator', desc: 'महाराष्ट्रासाठी मोफत, अचूक स्टँप ड्युटी गणना' },
              { name: 'घरपोच नोंदणी', href: '/doorstep-registration', desc: 'प्रतिनिधी तुमच्या घरी येऊन बायोमेट्रिक नोंदणी करतो' },
            ].map(s => (
              <Link key={s.href} href={s.href} className="border border-gray-200 rounded-xl p-4 hover:border-amber-400 transition group">
                <p className="font-semibold text-gray-900 group-hover:text-amber-700 mb-1">{s.name}</p>
                <p className="text-sm text-gray-500">{s.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <p className="font-semibold text-gray-900 mb-2">प्रश्न आहे किंवा मदत हवी आहे?</p>
          <p className="text-sm text-gray-600 mb-4">आम्ही पुण्यात आहोत आणि आठवड्यातील ७ दिवस WhatsApp वर उपलब्ध आहोत.</p>
          <div className="flex flex-wrap gap-3">
            <Link href="https://wa.me/917755984622" className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
              WhatsApp वर बोला
            </Link>
            <Link href="/contact-mr" className="border border-gray-300 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition">
              संपर्क करा
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
