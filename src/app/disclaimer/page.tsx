import { Metadata } from 'next'
import { Header } from '@/components/Header'
import { Nav } from '@/components/Nav'

export const metadata: Metadata = {
  title: 'Disclaimer | Mudrankseva',
  description: 'Mudrankseva is not a government website. Read our disclaimer about our services and relationship with Maharashtra government departments.',
}

export default function DisclaimerPage() {
  return (
    <>
      <Header />
      <Nav />
      <main className="max-w-3xl mx-auto px-4 py-14">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Disclaimer</h1>
        <p className="text-gray-400 text-sm mb-8">Last updated: January 2026</p>
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-8">
          <p className="font-semibold text-red-800 mb-1">Important Notice</p>
          <p className="text-red-700 text-sm">Mudrankseva (mudrankseva.in) is a private technology platform and is NOT a government website. We are not affiliated with the Maharashtra government, IGR Maharashtra, the Stamps and Registration Department, or any other government body.</p>
        </div>
        {[
          { heading: 'Not a law firm', body: 'Mudrankseva is a technology service provider, not a law firm. We do not provide legal advice. Our document templates are prepared with reference to applicable Maharashtra laws but should not be treated as legal advice for your specific situation. For complex legal matters, please consult a qualified lawyer.' },
          { heading: 'Document accuracy', body: 'While we take every effort to ensure our document templates are accurate and compliant with Maharashtra laws, laws and government procedures change. We recommend verifying critical details with the relevant government portal (igrmaharashtra.gov.in) or a qualified professional.' },
          { heading: 'Government fees', body: 'Stamp duty rates, registration fees, and ready reckoner rates published on our platform are for reference purposes. Final amounts are determined by the Maharashtra government and may change. Always verify current rates on the official IGR Maharashtra portal.' },
          { heading: 'No government affiliation', body: 'Any resemblance to government portals in our design or content is purely to help users understand government processes. Mudrankseva has no official relationship with any government department. For official government services, visit igrmaharashtra.gov.in.' },
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
