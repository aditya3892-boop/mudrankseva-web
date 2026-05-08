import { Metadata } from 'next'
import { Header } from '@/components/Header'
import { Nav } from '@/components/Nav'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Us | Mudrankseva',
  description: 'Mudrankseva is a Maharashtra-focused property documentation platform built to make rent agreements, property registration, and stamp duty simple for every Marathi homeowner and tenant.',
}

export default function AboutPage() {
  return (
    <>
      <Header />
      <Nav />
      <main className="max-w-3xl mx-auto px-4 py-14">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">About Mudrankseva</h1>
        <p className="text-gray-500 text-lg mb-10 leading-relaxed">
          Maharashtra's trusted platform for property documents, stamp duty, and registration — in English and Marathi.
        </p>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Why we built this</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Getting a rent agreement or registering a property in Maharashtra has always meant long queues at SRO offices, confusing paperwork, and dependence on agents who charge whatever they like. We built Mudrankseva to change that.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Mudrankseva was founded in Pune with a simple goal — make every property document in Maharashtra accessible online, in minutes, at a fair price. Whether you are a landlord in Nashik, a tenant in Mumbai, or a property buyer in Pimpri-Chinchwad, you deserve fast, legally valid documents without leaving your home.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Built on insider knowledge</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Mudrankseva is built with the guidance of a former senior Maharashtra government official with decades of direct experience in the state's property registration and stamps department. This means everything on our platform — every document template, every stamp duty calculation, every registration step — reflects how the system actually works, not how it appears on paper.
          </p>
          <p className="text-gray-600 leading-relaxed">
            We know which documents get rejected at SRO and why. We know the stamp duty exemptions most people miss. We know the exact process because we have lived it from the inside.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Maharashtra first. Marathi always.</h2>
          <p className="text-gray-600 leading-relaxed">
            Unlike national platforms that treat Maharashtra as just another state, Mudrankseva is built exclusively for Maharashtra. Every service is designed around Maharashtra's specific laws — the Maharashtra Rent Control Act 1999, the Maharashtra Stamp Act, and IGR Maharashtra's registration process. And because Maharashtra is Marathi, our entire platform is available in Marathi — not as an afterthought but as a first-class experience.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">What we offer</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { name: 'Rent Agreement', href: '/rent-agreement', desc: 'Instant AI-drafted Leave & License Agreement from ₹299' },
              { name: 'Sale Deed', href: '/sales-deed', desc: 'Full SRO registration with stamp duty calculation' },
              { name: 'Gift Deed', href: '/gift-deed', desc: 'Property transfer between family members' },
              { name: 'Power of Attorney', href: '/poa', desc: 'General and specific POA drafting and registration' },
              { name: 'Stamp Duty Calculator', href: '/calculator', desc: 'Free, accurate Maharashtra stamp duty calculator' },
              { name: 'Doorstep Registration', href: '/doorstep-registration', desc: 'Executive visits your home for biometric SRO registration' },
            ].map(s => (
              <Link key={s.href} href={s.href} className="border border-gray-200 rounded-xl p-4 hover:border-amber-400 transition group">
                <p className="font-semibold text-gray-900 group-hover:text-amber-700 mb-1">{s.name}</p>
                <p className="text-sm text-gray-500">{s.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Our mission</h2>
          <p className="text-gray-600 leading-relaxed">
            Every Maharashtra resident deserves access to legally valid property documents without needing an agent, without standing in queues, and without paying inflated fees. Mudrankseva exists to make that possible — one document at a time.
          </p>
        </section>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <p className="font-semibold text-gray-900 mb-2">Have a question or need help?</p>
          <p className="text-sm text-gray-600 mb-4">We are based in Pune and available 7 days a week on WhatsApp.</p>
          <div className="flex flex-wrap gap-3">
            <Link href="https://wa.me/917755984622" className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
              Chat on WhatsApp
            </Link>
            <Link href="/contact" className="border border-gray-300 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition">
              Contact Us
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
