import { Metadata } from 'next'
import { Header } from '@/components/Header'
import { Nav } from '@/components/Nav'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'परतावा धोरण | मुद्रांकसेवा',
  description: 'मुद्रांकसेवाचे परतावा आणि रद्दीकरण धोरण.',
}

export default function RefundPolicyMarathiPage() {
  return (
    <>
      <Header />
      <Nav />
      <main className="max-w-3xl mx-auto px-4 py-14">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">परतावा आणि रद्दीकरण धोरण</h1>
        <p className="text-gray-400 text-sm mb-8">शेवटचे अद्यतन: जानेवारी २०२६</p>
        {[
          { heading: 'ऑनलाइन दस्तऐवज सेवा (₹२९९ आणि त्यावरील)', body: 'जर तुमचे दस्तऐवज अद्याप तयार झाले नसेल, तर पेमेंटच्या २४ तासांच्या आत WhatsApp वर संपर्क करून पूर्ण परतावा मागवता येतो. एकदा दस्तऐवज तयार आणि वितरित झाल्यावर परतावा उपलब्ध नाही कारण सेवा प्रदान केली गेली आहे.' },
          { heading: 'घरपोच नोंदणी सेवा (₹९९९–₹१२९९)', body: 'नियोजित भेटीच्या २४ तास आधी बुकिंग रद्द केल्यास पूर्ण परतावा मिळतो. भेटीच्या २४ तासांच्या आत रद्द केल्यास कार्यकारी वेळापत्रकाच्या खर्चासाठी ५०% रद्दीकरण शुल्क आकारले जाते. प्रतिनिधी तुमच्या ठिकाणी आल्यानंतर परतावा उपलब्ध नाही.' },
          { heading: 'सरकारी शुल्क', body: 'महाराष्ट्र सरकारला दिलेले स्टँप ड्युटी आणि नोंदणी शुल्क कोणत्याही परिस्थितीत परत मिळत नाही कारण हे आमच्या नियंत्रणाबाहेरील सरकारी शुल्क आहेत.' },
          { heading: 'परतावा कसा मागवावा', body: 'तुमच्या ऑर्डरच्या तपशीलांसह +91 77559 84622 वर WhatsApp वर किंवा hello@mudrankseva.in वर ईमेल करा. मंजूर परतावे ५-७ कामाच्या दिवसांत तुमच्या मूळ पेमेंट पद्धतीवर प्रक्रिया केले जातात.' },
        ].map(section => (
          <div key={section.heading} className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-2">{section.heading}</h2>
            <p className="text-gray-600 leading-relaxed">{section.body}</p>
          </div>
        ))}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mt-4">
          <p className="text-sm text-gray-600">परताव्याबद्दल प्रश्न आहे? <Link href="https://wa.me/917755984622" className="text-amber-600 font-medium hover:underline">WhatsApp वर संपर्क करा</Link> — आम्ही २ तासांत उत्तर देतो.</p>
        </div>
      </main>
    </>
  )
}
