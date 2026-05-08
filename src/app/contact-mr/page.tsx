import { Metadata } from 'next'
import { Header } from '@/components/Header'
import { Nav } from '@/components/Nav'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'संपर्क करा | मुद्रांकसेवा',
  description: 'भाडे करार, मालमत्ता नोंदणी, स्टँप ड्युटीसाठी मुद्रांकसेवाशी संपर्क करा. आठवड्यातील ७ दिवस WhatsApp वर उपलब्ध.',
}

export default function ContactMarathiPage() {
  return (
    <>
      <Header />
      <Nav />
      <main className="max-w-2xl mx-auto px-4 py-14">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">संपर्क करा</h1>
        <p className="text-gray-500 mb-10">आम्ही पुण्यात आहोत आणि आठवड्यातील ७ दिवस उपलब्ध आहोत. WhatsApp वर सर्वात जलद प्रतिसाद मिळतो.</p>
        <div className="space-y-4 mb-10">
          {[
            { label: 'WhatsApp', value: '+91 77559 84622', href: 'https://wa.me/917755984622' },
            { label: 'ईमेल', value: 'hello@mudrankseva.in', href: 'mailto:hello@mudrankseva.in' },
            { label: 'ठिकाण', value: 'पुणे, महाराष्ट्र', href: null },
            { label: 'वेळ', value: 'सोमवार – रविवार, सकाळी ९ ते रात्री ८', href: null },
          ].map(item => (
            <div key={item.label} className="flex items-start gap-4 border border-gray-200 rounded-xl px-5 py-4">
              <span className="text-sm font-medium text-gray-500 w-24 shrink-0">{item.label}</span>
              {item.href ? (
                <Link href={item.href} className="text-amber-600 hover:underline font-medium">{item.value}</Link>
              ) : (
                <span className="text-gray-900 font-medium">{item.value}</span>
              )}
            </div>
          ))}
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <p className="font-semibold text-gray-900 mb-2">सर्वात जलद संपर्काचा मार्ग</p>
          <p className="text-sm text-gray-600 mb-4">WhatsApp वर संदेश पाठवा — कामाच्या वेळात २ तासांत उत्तर मिळेल.</p>
          <Link href="https://wa.me/917755984622?text=नमस्कार, मला मालमत्ता दस्तऐवजाबद्दल मदत हवी आहे" className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition inline-block">
            WhatsApp उघडा
          </Link>
        </div>
      </main>
    </>
  )
}
