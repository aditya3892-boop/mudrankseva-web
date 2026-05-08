import { Metadata } from 'next'
import { Header } from '@/components/Header'
import { Nav } from '@/components/Nav'

export const metadata: Metadata = {
  title: 'अस्वीकरण | मुद्रांकसेवा',
  description: 'मुद्रांकसेवा हे सरकारी संकेतस्थळ नाही. आमच्या सेवा आणि महाराष्ट्र सरकारी विभागांशी संबंधाबद्दल अस्वीकरण वाचा.',
}

export default function DisclaimerMarathiPage() {
  return (
    <>
      <Header />
      <Nav />
      <main className="max-w-3xl mx-auto px-4 py-14">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">अस्वीकरण</h1>
        <p className="text-gray-400 text-sm mb-8">शेवटचे अद्यतन: जानेवारी २०२६</p>
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-8">
          <p className="font-semibold text-red-800 mb-1">महत्त्वाची सूचना</p>
          <p className="text-red-700 text-sm">मुद्रांकसेवा (mudrankseva.in) हे एक खाजगी तंत्रज्ञान व्यासपीठ आहे आणि हे सरकारी संकेतस्थळ नाही. आम्ही महाराष्ट्र सरकार, IGR महाराष्ट्र, मुद्रांक आणि नोंदणी विभाग किंवा कोणत्याही इतर सरकारी संस्थेशी संलग्न नाही.</p>
        </div>
        {[
          { heading: 'कायदेशीर सल्ला नाही', body: 'मुद्रांकसेवा एक तंत्रज्ञान सेवा प्रदाता आहे, कायदेशीर सल्लागार नाही. आम्ही कायदेशीर सल्ला देत नाही. आमचे दस्तऐवज टेम्पलेट महाराष्ट्राच्या लागू कायद्यांच्या संदर्भात तयार केले आहेत परंतु तुमच्या विशिष्ट परिस्थितीसाठी कायदेशीर सल्ला म्हणून मानले जाऊ नयेत.' },
          { heading: 'सरकारी शुल्क संदर्भासाठी', body: 'आमच्या व्यासपीठावर प्रकाशित स्टँप ड्युटी दर, नोंदणी शुल्क आणि रेडी रेकनर दर संदर्भ उद्देशांसाठी आहेत. अंतिम रक्कम महाराष्ट्र सरकारद्वारे निर्धारित केली जाते आणि बदलू शकते. नेहमी अधिकृत IGR महाराष्ट्र पोर्टलवर सध्याचे दर तपासा.' },
          { heading: 'सरकारशी संबंध नाही', body: 'मुद्रांकसेवाचा कोणत्याही सरकारी विभागाशी कोणताही अधिकृत संबंध नाही. अधिकृत सरकारी सेवांसाठी igrmaharashtra.gov.in ला भेट द्या.' },
        ].map(section => (
          <div key={section.heading} className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-2">{section.heading}</h2>
            <p className="text-gray-600 leading-relaxed">{section.body}</p>
          </div>
        ))}
      </main>
    </>
  )
}
